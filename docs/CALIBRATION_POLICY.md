# Calibration Policy

**Date:** October 6, 2026  
**Policy version:** 1.0

## Principle

The project does not need to reproduce original research merely to justify including a variable or selecting a transparent starting value. Existing literature, public data, and analogous adoption processes can provide defensible defaults when their role and limitations are explicit.

## Evidence tiers

| Tier | Appropriate use |
|---|---|
| A — Observed anchor | Direct count or value from a declared source and version |
| B — Literature-derived | Published value, range, or timescale reused with attribution |
| C — Proxy-derived | Calculation from an analogous observed process |
| D — Scenario convention | Transparent modeling choice with no empirical estimate claim |
| N — Neutral normalization | Midpoint defined to produce no adjustment |
| E — Display setting | Horizon, starting view, or other non-world parameter |

## Sufficiency standard

A default is acceptable for exploratory use when it has:

1. a plain-language rationale;
2. a derivation or explanation of why that number was chosen;
3. at least one relevant source for tiers A–C;
4. a confidence label;
5. mandatory sensitivity testing for tiers C and D; and
6. hover/focus disclosure in the interface.

## What still requires original analysis

Original empirical work remains necessary when the project claims:

- that a coefficient predicts real institutional outcomes;
- that a default is representative of current countries or companies;
- causal effects;
- real-world transition probabilities;
- forecast dates;
- cross-source historical comparisons; or
- superiority over a simpler baseline.

## Current examples

- `startAgents = 225`: observed UN count plus a declared company-selection convention.
- `conflictInterval = 25`: Dalio-derived phase-timescale heuristic, not an empirical war interval.
- `qualifyingShare = 15%`: proxy from COW fatal-dispute prevalence of 17.73%, rounded conservatively.
- `institutionEventProbability = 15%`: rounded from the 15.9% mean gross-loss share across four major clustered COW state-system exit waves. Aircraft/aerospace remains a secondary 33.3%–71.4% corporate comparison.
- `institutionalAdoptionRate = 7%`: proxy calculation from IFRS adoption.
- Strength and stress at 50%: neutral normalization, not current-world measurements.
- `spreadRate = 15%`: conservative literature-informed diffusion scenario, not a fit.
- `horizon = 2,000`: display setting chosen to contain the neutral scenario.

## Source of truth

- Machine registry: `research/defaults-rationale.v1.json`
- Generated documentation: `docs/DEFAULT_VALUES.md`
- Browser artifact: `web/default-rationales.mjs`
- Validation: `tests/test-default-rationales.mjs`

Any default change must update the machine registry and model together. Validation fails if they diverge.
