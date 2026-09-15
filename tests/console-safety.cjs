// Offline regression tests. No wallet signatures, RPC calls or broadcasts.
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=readFileSync(require('node:path').join(__dirname,'../lab/base-sepolia-deploy/index.html'),'utf8');
const source=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
function setup(){
  const elements=new Map(), storage=new Map();
  const el=id=>{if(!elements.has(id))elements.set(id,{id,disabled:false,value:'',textContent:'',addEventListener(){},replaceChildren(...children){this.children=children;}});return elements.get(id);};
  const store={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
  const ethers={ZeroAddress:'0x'+'0'.repeat(40),getAddress:x=>x};
  const context={window:{ethers,addEventListener(){},dispatchEvent(){}},document:{getElementById:el,createElement:()=>({}),querySelectorAll:()=>[...elements.values()]},sessionStorage:store,localStorage:store,Event:class{},console};
  vm.createContext(context);
  vm.runInContext(source.replace('  })();','window.test={state,run,checks,invalidate,walletChanged,requireSession,prepare,deploy,recover,saveRecord,savedRecord};\n  })();'),context);
  return {t:context.window.test,el,context};
}
(async()=>{
  let count=0;
  const check=(name,fn)=>Promise.resolve().then(fn).then(()=>{count++;console.log('PASS '+name);});
  await check('external error text is rendered as text, not HTML',()=>{const {t,el}=setup();t.checks('safeChecks',[[false,'<img src=x onerror=alert(1)>']]);assert.equal(el('safeChecks').children[0].textContent,'✕ <img src=x onerror=alert(1)>');});
  await check('duplicate clicks run only one operation',async()=>{const {t}=setup();let release,calls=0;const pending=new Promise(r=>release=r);const run=t.run(async()=>{calls++;await pending;});const first=run();await run();assert.equal(calls,1);release();await first;});
  await check('failed verification invalidates prepared deployment',async()=>{const {t,el}=setup();t.state.safeOk=true;t.state.plan={};await t.run(async()=>{throw Error('invalid Safe');})();assert.equal(t.state.safeOk,false);assert.equal(t.state.plan,null);assert.equal(el('deploy').disabled,true);});
  await check('wallet change discards account and plan',()=>{const {t}=setup();t.state.account='0x123';t.state.signer={};t.state.plan={};t.state.safeOk=true;t.walletChanged();assert.equal(t.state.account,null);assert.equal(t.state.plan,null);assert.equal(t.state.safeOk,false);});
  await check('saved attempt blocks deployment before provider access',async()=>{const {t}=setup();t.saveRecord({status:'AWAITING_WALLET'});await assert.rejects(t.deploy(),/saved deployment attempt/);});
  await check('unknown saved attempt remains available after error',async()=>{const {t}=setup();t.saveRecord({status:'AWAITING_WALLET'});await t.run(async()=>{throw Error('timeout');})();assert.equal(t.savedRecord().status,'AWAITING_WALLET');});
  await check('wrong network is rejected',async()=>{const {t,context}=setup();context.window.ethereum={request:async()=> '0x1'};await assert.rejects(t.requireSession(),/Wrong network/);});
  await check('account mismatch invalidates signer',async()=>{const {t,context}=setup();const provider={request:async({method})=>method==='eth_chainId'?'0x14a34':['0x222']};context.window.ethereum=provider;t.state.walletProvider=provider;t.state.account='0x111';t.state.signer={};await assert.rejects(t.requireSession(),/account changed/);assert.equal(t.state.signer,null);});
  await check('every prepare includes a fresh Safe check',()=>{assert.match(source,/await requireSession\(\);await checkSafe\(\)/);assert.doesNotMatch(source,/if\(!state.safeOk\)await checkSafe/);});
  console.log(`${count} offline regression checks passed. Not browser QA or an independent audit.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
