# Review Task 001: Calendar vesting edge cases

Published: 2026-09-09. Status: open technical review invitation.

BVLVO is an unissued token project. This task uses prototype source and test assets only. It grants no mainnet signing role, token allocation or airdrop entitlement. Compensation is not agreed; this is not a funded bounty. Agree any paid work before starting.

## A small first contribution

Choose one calendar case, calculate the expected UTC release date independently, and compare it with the source below. Submit a reproducible mismatch or a clearly scoped review note. A useful first response can cover just one case; a full audit is not requested.

## Intended rules

- Anchor every installment to actual token issuance, not a planned launch date.
- Produce 48 installments at month anniversaries 13 through 60.
- Each installment is 3,125,000 tokens (18 decimals), totaling 150,000,000.
- Preserve UTC time of day and the original issuance day.
- Clamp to the last day of a shorter target month. Calculate the next installment from the original anchor so a February clamp does not permanently shift later dates.
- No installment is vested one second before its timestamp. It becomes vested at the timestamp.
- Changing the actual issuance timestamp shifts the whole schedule.

## Suggested cases

| UTC anchor | Months after issuance | Expected UTC timestamp |
|---|---:|---|
| 2026-01-31T12:34:56Z | 13 | 2027-02-28T12:34:56Z |
| 2027-01-31T00:00:00Z | 13 | 2028-02-29T00:00:00Z |
| 2027-01-31T00:00:00Z | 14 | 2028-03-31T00:00:00Z |
| 2028-02-29T23:59:59Z | 13 | 2029-03-29T23:59:59Z |
| 2099-01-31T00:00:00Z | 13 | 2100-02-28T00:00:00Z |

Also consider all 48 dates, midnight UTC, delayed issuance, monotonicity, century rules, accepted input bounds, narrowing casts and gas growth. Distinguish realistically reachable issuance inputs from hypothetical extreme inputs.

## Evidence and limits

The retained V0.2 local rehearsal report is dated 2026-09-07 and records 54 named check groups and 96 before/at vesting boundary assertions on temporary local EVM chain 1337. These counts are historical internal evidence, not an independent audit, a fresh run today or a Base Sepolia deployment claim.

Both source files below were read from the existing V0.2 package and their SHA-256 hashes matched its recorded source manifest on 2026-09-09. They are an exact scoped snapshot, not the complete buildable prototype. Compiler: Solidity 0.8.30. TeamVesting imports OpenZeppelin Contracts 5.4.0. Review of token issuance, factory wiring, reserve custody and deployment configuration remains separate.

GregorianCalendar is self-contained; expose monthAnniversary through a small external pure harness for execution tests. TeamVesting additionally needs the declared OpenZeppelin imports and a test token exposing issuedAt() equal to the constructor anchor. Do not substitute a production token or use real funds.

## Submission format

Open a public issue at https://github.com/lpc123987/bvlvo-site/issues with:
1. The source file/hash and case reviewed.
2. Anchor, month offset and expected UTC timestamp.
3. Actual result or revert, plus a minimal script/test and compiler/tool versions where executed.
4. Explanation, reachable conditions and suggested correction if applicable.

If only reading source, label the result as a source review rather than an executed test. A no-finding response should state exactly what was checked; it is not a safety certification. Do not post private keys, seed phrases, identity documents or sensitive personal details.

## Source snapshot

### contracts/GregorianCalendar.sol

SHA-256: `fd3b78201dc4e862dd4806c10b4e3eb70d3d94163d29a52ecd527955e86a4c36`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/// @notice Minimal UTC Gregorian calendar arithmetic for issuance anniversaries.
/// @dev Month anniversaries preserve the issuance day when possible and clamp to
///      the target month's final day otherwise. The original issuance day is
///      used for every anniversary, so 31 January maps to 28/29 February and
///      then back to 31 March.
library GregorianCalendar {
    uint256 internal constant SECONDS_PER_DAY = 1 days;

    function monthAnniversary(uint64 anchor, uint256 monthsAfter) internal pure returns (uint64) {
        (uint16 year, uint8 month, uint8 day, uint32 secondsIntoDay) = dateParts(anchor);
        uint256 monthIndex = uint256(year) * 12 + uint256(month - 1) + monthsAfter;
        uint16 targetYear = uint16(monthIndex / 12);
        uint8 targetMonth = uint8((monthIndex % 12) + 1);
        uint8 finalDay = daysInMonth(targetYear, targetMonth);
        uint8 targetDay = day > finalDay ? finalDay : day;
        uint256 timestamp =
            (_daysBeforeYear(targetYear) + _daysBeforeMonth(targetYear, targetMonth) + targetDay - 1) *
            SECONDS_PER_DAY + secondsIntoDay;
        require(timestamp <= type(uint64).max, "Calendar overflow");
        return uint64(timestamp);
    }

    function dateParts(uint64 timestamp)
        internal
        pure
        returns (uint16 year, uint8 month, uint8 day, uint32 secondsIntoDay)
    {
        uint256 remainingDays = uint256(timestamp) / SECONDS_PER_DAY;
        secondsIntoDay = uint32(uint256(timestamp) % SECONDS_PER_DAY);
        year = 1970;
        while (true) {
            uint256 yearDays = isLeapYear(year) ? 366 : 365;
            if (remainingDays < yearDays) break;
            remainingDays -= yearDays;
            unchecked {
                ++year;
            }
        }
        month = 1;
        while (true) {
            uint256 monthDays = daysInMonth(year, month);
            if (remainingDays < monthDays) break;
            remainingDays -= monthDays;
            unchecked {
                ++month;
            }
        }
        day = uint8(remainingDays + 1);
    }

    function isLeapYear(uint16 year) internal pure returns (bool) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }

    function daysInMonth(uint16 year, uint8 month) internal pure returns (uint8) {
        require(month >= 1 && month <= 12, "Invalid month");
        if (month == 2) return isLeapYear(year) ? 29 : 28;
        if (month == 4 || month == 6 || month == 9 || month == 11) return 30;
        return 31;
    }

    function _daysBeforeYear(uint16 year) private pure returns (uint256) {
        require(year >= 1970, "Pre-epoch year");
        uint256 priorYear = uint256(year) - 1;
        uint256 priorEpochYear = 1969;
        uint256 leapDays =
            (priorYear / 4 - priorYear / 100 + priorYear / 400) -
            (priorEpochYear / 4 - priorEpochYear / 100 + priorEpochYear / 400);
        return (uint256(year) - 1970) * 365 + leapDays;
    }

    function _daysBeforeMonth(uint16 year, uint8 month) private pure returns (uint256 days_) {
        if (month > 1) days_ += 31;
        if (month > 2) days_ += isLeapYear(year) ? 29 : 28;
        if (month > 3) days_ += 31;
        if (month > 4) days_ += 30;
        if (month > 5) days_ += 31;
        if (month > 6) days_ += 30;
        if (month > 7) days_ += 31;
        if (month > 8) days_ += 31;
        if (month > 9) days_ += 30;
        if (month > 10) days_ += 31;
        if (month > 11) days_ += 30;
    }
}
```

### contracts/TeamVesting.sol

SHA-256: `603b95c12b708046a8ddc54daa33e5ef452a1244a3f78bedc91a815bfa83db65`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {GregorianCalendar} from "./GregorianCalendar.sol";

interface IIssuedToken {
    function issuedAt() external view returns (uint64);
}

/// @notice Fixed beneficiary and 48 calendar-derived monthly installments.
contract TeamVesting {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    address public immutable beneficiary;
    uint64 public immutable scheduleAnchor;
    uint64[48] public releaseTimes;
    uint256 public constant INSTALLMENT = 3_125_000 ether;
    uint256 public released;

    event Released(address indexed beneficiary, uint256 amount);

    constructor(address token_, address beneficiary_, uint64 anchor_) {
        require(token_ != address(0) && beneficiary_ != address(0), "Zero address");
        require(token_.code.length > 0, "Token not deployed");
        require(IIssuedToken(token_).issuedAt() == anchor_, "Issuance mismatch");
        token = IERC20(token_);
        beneficiary = beneficiary_;
        scheduleAnchor = anchor_;
        for (uint256 i; i < 48; ++i) {
            releaseTimes[i] = GregorianCalendar.monthAnniversary(anchor_, i + 13);
        }
    }

    function vestedAt(uint256 timestamp) public view returns (uint256) {
        uint256 count;
        for (uint256 i; i < 48; ++i) {
            if (timestamp < releaseTimes[i]) break;
            ++count;
        }
        return count * INSTALLMENT;
    }

    function release() external {
        uint256 amount = vestedAt(block.timestamp) - released;
        require(amount > 0, "Nothing due");
        released += amount;
        token.safeTransfer(beneficiary, amount);
        emit Released(beneficiary, amount);
    }
}
```
