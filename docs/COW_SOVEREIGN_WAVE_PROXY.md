# COW Sovereign Consolidation-Wave Proxy

**Date:** October 7, 2026  
**Primary proxy:** COW State System Membership v2024  
**Secondary proxy:** Aircraft/aerospace manufacturing

## Future rule

Historical COW exits may later reverse. Future AI-Institution conflicts use a different permanence rule:

```text
P(permanent subjugation and integration
  | decisive unconditional defeat) = 100%
```

The losing Institution may remain as a subordinate organization, but it never regains independent top-level status.

## Wave definition

Sort COW membership exits by date. Place exits in the same wave when consecutive exits occur no more than five years apart. For each wave:

```text
p_wave = unique exiting Institutions / active Institutions at wave start
```

This is gross loss exposure. It includes historical interruptions because the future model converts decisive defeat into permanent integration.

## Major observed waves

| Period | Unique exits | Active at start | Gross loss share |
|---|---:|---:|---:|
| 1860–1861 Italian consolidation | 5 | 45 | 11.1% |
| 1866–1871 German/other consolidation | 9 | 41 | 22.0% |
| 1936–1945 war and occupation | 18 | 66 | 27.3% |
| 1990–1992 post-Cold-War restructuring | 5 | 162 | 3.1% |

Mean gross loss share:

```text
(11.1% + 22.0% + 27.3% + 3.1%) / 4 ≈ 15.9%
```

Rounded model default:

```text
Institution event probability = 15%
```

## Interpretation

This does not claim that 15% of states historically disappeared permanently in every wave. It uses observed gross top-level exits as the event-exposure analogue, then applies the model's future permanence rule.

The historical and future statements remain separate:

```text
Historical: some Institutions exit and later re-enter.
Future model: decisive unconditional defeat permanently removes independence.
```

## Civil-war evidence

COW Intra-State War v5.1 contains 408 wars from 1818–2014. Preliminary linkage shows civil war alone is not a strong sovereign-exit proxy:

- Five-year exit risk after any civil-war exposure is about 1.28%.
- Comparable unexposed risk is about 2.08%.
- Challenger-victory exposure risk is about 2.30%.

Civil war therefore helps identify internal stress but should not independently set the consolidation-wave probability.

## Secondary corporate bound

Aircraft/aerospace waves imply 33.3%–71.4% Institution loss, with a 52.4% midpoint. This remains a high-intensity corporate scenario, not the primary default.

## Limitations

- COW begins in 1816 and does not cover Rome or ancient polities.
- Five-year clustering is an author-defined wave rule.
- Gross exits mix interruption, occupation, union, dissolution, and recognition changes.
- Historical loss shares are not causal estimates.
- COW v5.1 codes which side won but does not provide a dedicated unconditional-surrender field, so historical surrender cases are not mechanically counted.
- Future permanence is a model assumption, not historical evidence.

## Sources

- COW State System Membership: https://correlatesofwar.org/data-sets/state-system-membership/
- COW Intra-State War v5.1: https://correlatesofwar.org/data-sets/cow-war/
- Secondary aircraft proxy: `AIRCRAFT_MANUFACTURING_CONSOLIDATION_PROXY.md`

## Definition robustness

The declared 15.9% mean is sensitive to authored event definitions:

- Five cluster gaps × four major-wave thresholds × gross/durable modes produce 40 result rows.
- Gross mean wave-loss estimates span 9.2%–29.2%.
- Durable mean estimates span 8.5%–28.9% where a qualifying wave exists.
- Leaving out one declared major wave at a time produces retained means from 12.0% to 20.1%.

These ranges are sensitivity envelopes, not confidence intervals. The rounded 15% value remains a transparent scenario center. A later stochastic model should represent wave severity with a distribution.
