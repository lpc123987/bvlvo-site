# BVLVO Testnet Engineering Status — V0.3

**Status date:** 14 September 2026  
**Scope:** Base Sepolia and local development only  
**Status:** Pre-launch, not issued, not audited

## What has been completed

- The V0.3 local prototype uses a constructor-only atomic deployment factory for the token, five reserve vaults, one team vesting contract and all six allocations.
- Team vesting derives 48 calendar-month release timestamps from the actual token issuance timestamp, covering months 13 through 60 with month-end clamping and Gregorian leap-year rules.
- The local rehearsal passed 58 check groups and 96 one-second vesting-boundary assertions. This is developer testing, not an independent security audit.
- The retained Base Sepolia controller Safe was migrated by a successful two-of-three transaction to the approved SafeL2 1.4.1 singleton and CompatibilityFallbackHandler.
- Post-migration checks confirmed three recorded owners, threshold two, no enabled modules and no guard at the observed block.
- A V0.3 unsigned factory transaction has been encoded and gas-estimated after live Safe-policy checks. It has not been signed or broadcast.

## Base Sepolia evidence

- Safe proxy: `0x4672fabA2F969ca35C2a35475034A7D802d28F64`
- Safe migration transaction: `0xccdb6cc7f794df21d0073abaace5f0b285fba33610e96af59568dbf6275bc121`
- SafeL2 1.4.1 singleton: `0x29fcB43b46531BcA003ddC8FCB67FFE91900C762`
- CompatibilityFallbackHandler 1.4.1: `0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99`

The migration transaction is testnet control-account evidence only. The earlier V0.2 factory and token contracts remain superseded test artifacts and are not official BVLVO contracts.

## Current gate

The next engineering action is a user-reviewed V0.3 factory rehearsal on Base Sepolia using test assets. Immediately before signing, the live Safe singleton, handler, owner set, threshold, modules, guard, constructor inputs, bytecode and estimated gas must be checked again.

The V0.3 factory constructor creates testnet token contracts. The connected user must personally review and approve the wallet confirmation. No password, seed phrase, private key or verification code is required by the project website or development process.

## Known governance tradeoffs

- The Safe configuration is mutable through authorized Safe transactions. Two-of-three is the recorded current policy, not a permanent property.
- No recovery module is enabled. Losing the signing threshold could permanently strand tokens controlled by fixed-address reserve vaults.
- Adding a recovery module would create another authorization path and requires a separate review.
- The reserve-vault delay is fixed at 72 hours and cannot be shortened.
- Tokens transferred to the team vesting contract above its fixed 150,000,000 BVLVO entitlement cannot be recovered.

## What this does not mean

No V0.3 contract has been deployed to Base Sepolia. No official token contract exists. No Base Mainnet issuance, sale, public distribution, liquidity pool, trading market, bridge or exchange integration has been created. No independent audit, legal approval, signer-independence proof, operating-funding proof or production-readiness approval is represented.

The planned 23 September 2026 issuance date remains conditional. It is not proof that issuance will occur on that date, and it must be postponed if required permissions, responsible operation, funding, custody and security-review gates are not met.
