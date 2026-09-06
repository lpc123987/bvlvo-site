# BVLVO Issuance Specification V1

Date: 2026-09-06

Status: website design baseline V1. Not a deployed contract, funding commitment, sale announcement or authorization to issue. Parameters describe the selected design; implementation and verification remain outstanding.

## 1. Purpose and launch boundary

BVLVO is designed as a transferable community token associated with public project development. The website records rules, decisions, contract information and progress. The operating hypothesis is that people will return for shared identity and meaningful, limited participation; this demand has not been demonstrated.

The existing planned issuance date is 23 September 2026. No exact launch time is selected. Required issuance permissions, responsible operation, cash funding, security review and release controls remain prerequisites. Missing prerequisites mean postponement and a public status update, not an automatic mainnet launch. The date is not a trading-start commitment.

Version 1 separates three events: testnet rehearsal, production issuance, and any subsequent market activation. Completing one does not authorize the next.

## 2. Recommended technical baseline

| Parameter | V1 recommendation |
|---|---|
| Token name / symbol | BVLVO / BVLVO |
| Production chain | Base Mainnet, chain ID 8453 |
| Rehearsal chain | Base Sepolia, chain ID 84532 |
| Standard / decimals | ERC-20 / 18 |
| Total genesis supply | 1,000,000,000 BVLVO |
| Supply model | One-time creation; no post-deployment mint function |
| Upgradeability | No proxy or upgrade administrator for the token |
| Transfer tax / rebase | None / none |
| Token-level freeze, blacklist or confiscation | None |
| Contract-enforced yield or repurchases | None |
| Additional burn extension | None |
| Initial cross-chain bridge | None |

Base is recommended because a standard EVM implementation can use established ERC-20 tooling and a corresponding test network. This is a design choice, not a claim that Base is uniquely suitable, risk-free or the cheapest. Network costs and dependencies still require review. The token does not itself grant equity, dividends, treasury ownership or guaranteed redemption.

## 3. Genesis allocation and initial circulation

The six existing allocation proportions are retained.

| Pool | Share | Tokens | Planned public release at genesis |
|---|---:|---:|---:|
| Verified contributions | 35% | 350,000,000 | 0 |
| Public research | 15% | 150,000,000 | 0 |
| Operating treasury | 20% | 200,000,000 | 0 |
| Core contributors | 15% | 150,000,000 | 0 |
| Liquidity reserve | 10% | 100,000,000 | 0 |
| External integrations | 5% | 50,000,000 | 0 |
| Total | 100% | 1,000,000,000 | 0 |

Recommended genesis public circulation is zero: no public distribution, presale or liquidity pool is included in the genesis event. This deliberately separates the existence of tokens from their availability for trading. A billion issued tokens must never be presented as a billion circulating tokens.

Publish separate figures for issued supply, contractual locks, releasable reserves, released balances and estimated public circulation. Project-controlled funds are not automatically contractually locked. Public circulation is a disclosed accounting methodology, not a claim about how external data providers will classify supply.

At genesis, all supply must be reconciled to six disclosed pool arrangements. The deployment process must not leave an unexplained balance with the deployer. Non-team pools require release controllers with a minimum 72-hour delay and published recipients, purpose and amounts. A plain multisignature wallet alone does not enforce this delay. No reserve may be labelled locked until its actual constraints are verified.

Future releases from contribution, research and integration pools require budgeted, accepted work; unused balances remain reserved. The treasury pool requires an approved expense purpose. Liquidity deployment requires a separate market decision. No pool must be exhausted merely because ten years have elapsed.

## 4. Team vesting

Team allocation: 150,000,000 tokens. No release during the first 12 complete calendar months following actual issuance. Recommend defining the first installment at the 13-month anniversary, with 48 monthly installments through the 60-month anniversary. Each installment is 3,125,000 tokens. This resolves the ambiguity in the earlier phrase "beginning in month 13"; the final schedule must use exact timestamps.

If issuance occurs on 23 September 2026, that convention produces a first installment on 23 October 2027 and a last installment on 23 September 2031, at the issuance UTC time. If issuance moves, the schedule moves with the actual issuance event. These are conditional examples, not an existing vesting contract.

Freeze the complete timestamp schedule before deployment. No team acceleration or cancellation recovery is included. Beneficiary changes must not reset or accelerate vesting. Disclose any ability to transfer beneficiary control; token locks do not necessarily prevent an economic transfer of unvested rights.

OpenZeppelin's default VestingWallet does not by itself establish this exact discrete calendar schedule. The implementation needs a reviewed schedule and boundary tests, including late deposits. Reusing a library is not an audit of BVLVO.

## 5. Authority and custody

| Action | Recommended authority |
|---|---|
| Mint additional supply or change token code | Nobody; capability absent from token design |
| Freeze or confiscate holder balances | Nobody; capability absent from token design |
| Propose ordinary reserve spending | Disclosed operating team |
| Authorize reserve spending | 2-of-3 multisignature, followed by enforced release delay |
| Change reserve signers or control policy | Disclosed authorization and review of all bypass paths |
| Accelerate team releases | Nobody; capability absent from vesting design |
| Publish website information | Identified website maintainers; no implied token authority |
| Decide public trading readiness | Separate documented decision after funding and permissions are resolved |

Three signatures controlled by one person do not provide independent oversight. Signers have not been selected. Do not create placeholders and call this control implemented. Keep keys off the website and out of chat. Audit owner changes, modules, recovery arrangements and emergency paths: any path that bypasses the intended delay must be removed or expressly disclosed.

An immutable token has a tradeoff: a defect cannot simply be patched by an administrator, and mistaken user transfers cannot be reversed by the team. Reserve controls and the website remain managed systems; this is not a claim of full decentralization.

## 6. Participation and website integration

Initial public activity: one focused discussion each week and a monthly delivery report. Public reading and ordinary discussion remain free. Test points and earlier internal rehearsals create no token allocation, conversion or airdrop entitlement.

Potential holder participation is limited to funded community priorities. It is not active at genesis. Before activation, specify snapshot eligibility, related-address exclusions, concentration risks, quorum, appeal rules and who executes results. Do not describe a wallet balance display as governance.

The English website should later provide a verified chain-and-contract registry, supply reconciliation, pool controllers, vesting schedule, release history, security-review scope and operating updates. Until these exist, show their preparation status. No invented holders, trading volumes, prices or reserve balances.

## 7. Separate market activation specification

No market venue, opening price, initial pool size or exchange listing is selected by this document. Token allocations do not fund the paired asset required by a market. Before market activation, publish the actual cash contribution, source, maximum token tranche, position owner, withdrawal rights, fees and trade-size liquidity analysis.

Do not choose a nominal price merely to advertise a large fully diluted valuation. A small pool's implied valuation does not demonstrate realizable project value. No guaranteed price support, fake volume or undisclosed team trading belongs in the operating plan.

## 8. Acceptance evidence and execution order

1. Freeze the proposed chain, accounting definitions, release schedules and permission matrix as a versioned design.
2. Confirm responsible operation, applicable issuance permissions, named signers and a funded first-year operating budget. These are real inputs, not details a document can invent.
3. Prepare the testnet implementation and distribution rehearsal. Use only test assets.
4. Verify supply conservation, standard transfers and approvals, absence of additional minting, vesting boundaries, reserve delays, signer loss, cancellation behavior and all administrative bypass paths.
5. Obtain an appropriate independent review of the actual contracts and deployment configuration. Publish findings, fixes and residual limitations.
6. Reconcile all destination addresses and perform a launch readiness review. Publish postponement if prerequisites are unmet.
7. Only after readiness is established, arrange user-controlled mainnet signing and verify the resulting deployment. Market activation remains separate.

The next concrete deliverable is a testnet implementation brief and acceptance checklist based on this specification. No contract or market has been deployed by preparing this document.

## Technical references

Reviewed on 2026-09-06. These sources support component behavior, not BVLVO's viability, authorization or token value.

- [Base network identifiers](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_chainId)
- [OpenZeppelin ERC-20](https://docs.openzeppelin.com/contracts/5.x/erc20)
- [OpenZeppelin vesting behavior and limitations](https://docs.openzeppelin.com/contracts/5.x/api/finance)
- [Safe owners, thresholds and transaction authority](https://docs.safe.global/advanced/smart-account-concepts)
