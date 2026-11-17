# COW Empirical Baseline

**Source:** Correlates of War State System Membership v2024  
**Generated:** October 6, 2026  
**Scope:** Membership-spell survival and simple temporal baseline; no Big Cycle predictors yet

## Scope warning

A COW system-membership exit is not automatically a collapse, merger, conquest, or fragmentation. Transition causes remain uncoded. This report establishes a baseline hazard and validates event-history plumbing; it does not validate the full institutional model.

## Membership spells

- Spells: 244
- Observed exits: 49
- Right-censored spells: 195
- Total exposure: 17374.1 state-years
- Crude annual membership-exit hazard: 0.28%
- Bootstrap 95% interval: 0.21%–0.37%

## Kaplan–Meier membership survival

| Years since entry | Estimated survival | Estimated exit risk |
|---:|---:|---:|
| 1 | 99.59% | 0.41% |
| 5 | 99.18% | 0.82% |
| 10 | 98.77% | 1.23% |
| 25 | 92.52% | 7.48% |
| 50 | 87.18% | 12.82% |
| 100 | 78.08% | 21.92% |

## Rolling 10-year constant-hazard backtest

| Origin | Risk set | Training exits | Predicted risk | Observed exits | Brier | No-exit Brier | Improvement |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1900 | 42 | 16 | 5.36% | 1 | 0.0241 | 0.0238 | -0.0003 |
| 1925 | 62 | 22 | 5.24% | 0 | 0.0027 | 0.0000 | -0.0027 |
| 1950 | 75 | 40 | 6.82% | 1 | 0.0162 | 0.0133 | -0.0028 |
| 1975 | 143 | 42 | 4.90% | 1 | 0.0087 | 0.0070 | -0.0017 |
| 2000 | 190 | 48 | 3.76% | 1 | 0.0063 | 0.0053 | -0.0010 |
| 2010 | 194 | 49 | 3.33% | 0 | 0.0011 | 0.0000 | -0.0011 |

## Interpretation

- The constant-hazard model is a benchmark, not a substantive theory.
- Negative Brier improvement means predicting no exits performed better in that window.
- Later models must beat this baseline out of sample and remain calibrated.
- Entry/exit cause coding is required before competing-risk analysis.
- Historical recognition and COW membership criteria create selection effects.

## Phase coverage

- Phase 1: partial empirical ingestion complete for COW membership only.
- Phase 2: blocked pending economic/governance predictors.
- Phase 3: baseline survival plumbing implemented; competing risks blocked pending event causes.
- Phase 4: constant-hazard rolling backtest implemented; richer model comparison pending predictors.
- Phase 6: bootstrap uncertainty implemented for the crude exit hazard.
