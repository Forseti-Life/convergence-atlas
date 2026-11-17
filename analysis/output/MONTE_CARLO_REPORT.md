# Monte Carlo Parameter-Uncertainty Analysis

**Sampling:** 10,000 independent Latin-hypercube samples per profile  
**Total runs:** 40,000  
**Seed:** 20261008  
**Status:** L1 model-behavior uncertainty propagation; not a forecast or posterior

## Profile outcomes

| Profile | Run share at T5 by 7026 | Conditional median T5 year | Restricted-mean event year | Structural-Apex run share | Effective-Apex run share | Median Institutions in 7026 |
|---|---:|---:|---:|---:|---:|---:|
| COW-centered uncertainty | 76.4% | 3018 | 4240 | 70.8% | 70.8% | 1.0 |
| COW-definition sensitivity ensemble | 70.7% | 3143 | 4544 | 65.2% | 65.1% | 1.0 |
| Broad structural stress test | 59.6% | 2178 | 4354 | 41.6% | 41.6% | 6.0 |
| Secondary corporate uncertainty | 99.2% | 2227 | 2376 | 93.0% | 93.0% | 1.0 |

## COW-centered uncertainty

Transformed bell curves around current COW-primary defaults and declared exploratory ranges.

- Seeded runs reaching five: 7,637 / 10,000
- Run share with no reach by 7026: 23.6%
- Conditional T5 median calendar year: 3018
- T5 5th–95th percentile calendar years among reached: 2252–5753
- Restricted-mean T5 calendar year: 4240
- Top capped-time sensitivity: internalConflict (0.423)

### Convergence checkpoints

| Runs | T5 reach | Conditional median year | Restricted-mean year |
|---:|---:|---:|---:|
| 1,000 | 77.8% | 2991 | 4193 |
| 5,000 | 76.8% | 3050 | 4240 |
| 10,000 | 76.4% | 3018 | 4240 |

## COW-definition sensitivity ensemble

Uses gross mean probabilities from alternative COW clustering definitions with light within-definition jitter; not a posterior distribution.

- Seeded runs reaching five: 7,066 / 10,000
- Run share with no reach by 7026: 29.3%
- Conditional T5 median calendar year: 3143
- T5 5th–95th percentile calendar years among reached: 2248–6048
- Restricted-mean T5 calendar year: 4544
- Top capped-time sensitivity: institutionEventProbability (-0.490)

### Convergence checkpoints

| Runs | T5 reach | Conditional median year | Restricted-mean year |
|---:|---:|---:|---:|
| 1,000 | 71.5% | 3236 | 4571 |
| 5,000 | 71.1% | 3160 | 4536 |
| 10,000 | 70.7% | 3143 | 4544 |

## Broad structural stress test

Broad ranges map possible model regimes and are not empirically weighted.

- Seeded runs reaching five: 5,958 / 10,000
- Run share with no reach by 7026: 40.4%
- Conditional T5 median calendar year: 2178
- T5 5th–95th percentile calendar years among reached: 2038–4524
- Restricted-mean T5 calendar year: 4354
- Top capped-time sensitivity: institutionEventProbability (-0.623)

### Convergence checkpoints

| Runs | T5 reach | Conditional median year | Restricted-mean year |
|---:|---:|---:|---:|
| 1,000 | 57.5% | 2196 | 4490 |
| 5,000 | 58.8% | 2182 | 4395 |
| 10,000 | 59.6% | 2178 | 4354 |

## Secondary corporate uncertainty

Uses the aircraft/aerospace range only as a secondary high-intensity comparison.

- Seeded runs reaching five: 9,921 / 10,000
- Run share with no reach by 7026: 0.8%
- Conditional T5 median calendar year: 2227
- T5 5th–95th percentile calendar years among reached: 2066–2961
- Restricted-mean T5 calendar year: 2376
- Top capped-time sensitivity: conflictInterval (0.564)

### Convergence checkpoints

| Runs | T5 reach | Conditional median year | Restricted-mean year |
|---:|---:|---:|---:|
| 1,000 | 99.0% | 2221 | 2361 |
| 5,000 | 99.4% | 2227 | 2367 |
| 10,000 | 99.2% | 2227 | 2376 |

## Interpretation limits

- Bell-shaped inputs do not imply bell-shaped outputs; stalls and thresholds create censored and multimodal outcomes.
- Conditional timing summaries exclude non-reaching runs. Restricted means retain them at the calendar-year 7026 censoring boundary.
- Independent parameter sampling omits plausible correlations.
- The COW-definition ensemble is a sensitivity ensemble, not a posterior distribution.
- Later wave arrivals bootstrap normalized 6/36/124-year clustered gaps and wave losses are beta-binomial; output frequencies remain conditional on authored assumptions.
- Event-limit runs are reported as computationally censored and excluded where their post-limit state is unknown.
