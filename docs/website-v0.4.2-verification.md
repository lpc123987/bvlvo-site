# Website V0.4.2 — change and verification record

Date: 15 September 2026.

## Scope

Website usability and Base Sepolia console safeguards only. No contract source or factory artifact changes; no wallet signatures, broadcasts, mainnet deployment, sale or trading-market actions.

## Changes

- Homepage explains the current project and offers no-wallet feedback, documentation and technical contribution routes. Existing logo and mascot remain unchanged.
- Public GitHub issue forms capture focused feedback and collaborator introductions, with privacy and role-boundary notices. Open issues do not imply acceptance; no response-time commitment is invented.
- A readable testnet-status page links to the existing dated evidence record. Content update dates are distinguished from the 14 September chain-evidence cutoff.
- Console serializes operations within a page, invalidates state on wallet events, checks the connected account and network, and rechecks Safe policy on every preparation.
- Failed operations invalidate prepared plans. External error text is inserted with textContent, not HTML.
- A browser-local attempt record blocks another deployment through this console and supports read-only receipt lookup. Unknown outcomes require manual reconciliation. There is intentionally no one-click clear-and-redeploy action.
- Disclosures describe wallet/RPC access, browser storage, mutable Safe policy, immutable vault delay and unrecoverable excess vesting deposits.

## Verification

Run `node tests/console-safety.cjs` from the repository root.

Nine offline checks passed: text-only error rendering, duplicate-click serialization, failure invalidation, wallet-change invalidation, saved-attempt blocking, unknown-attempt retention, wrong-chain rejection, account-mismatch rejection and the fresh Safe-check code path. The last check is a source assertion; the others exercise the console in a mocked environment.

These tests do not reproduce wallet UI, sign transactions, query live Safe state or establish independent security assurance. Browser interaction verification timed out in this environment; desktop/mobile visual QA and real MetaMask end-to-end testing remain unverified.

## Remaining limits

- Browser storage can be cleared and is not shared across devices. It is not an on-chain idempotency guarantee or an atomic cross-tab lock. Use one console tab and reconcile wallet history before any new attempt.
- A wallet confirmation already open cannot be recalled by this page. Account/network changes invalidate local state, but the user must still inspect and reject a stale wallet request.
- Safe reads are observations and are not pinned to a single block. Factory checks remain the on-chain enforcement boundary; later Safe changes require monitoring.
- Receipt success is not full deployment reconciliation. A replaced, dropped or unindexed transaction may need manual explorer and wallet review.
- Funding, independent signers, audit and applicable issuance readiness are not represented as completed.
