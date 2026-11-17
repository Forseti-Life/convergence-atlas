# Model Insight Analysis

**Generated:** October 8, 2026  
**Status:** Production-model diagnostics and counterfactuals; not forecasts

## Baseline

- Structural consolidation: 3249
- Adoption-adjusted dominance: 3263

## One-at-a-time sensitivity ranking

| Parameter | Earliest calendar year | Latest calendar year | No-reach cases | Finite spread (years) |
|---|---:|---:|---:|---:|
| fragmentationPerEvent | 3263 | 3263 | 2 | 0.0 |
| qualifyingShare | 3984 | 5924 | 1 | 1940.1 |
| internalConflict | 2844 | 3263 | 1 | 419.1 |
| conflictInterval | 2526 | 4493 | 0 | 1966.1 |
| consolidationAcceleration | 2587 | 4091 | 0 | 1504.3 |
| leadingInstitutionStrength | 3032 | 3548 | 0 | 515.4 |
| institutionEventProbability | 2150 | 2571 | 0 | 421.3 |
| startAgents | 3027 | 3263 | 0 | 235.7 |
| systemicCycleStress | 3103 | 3318 | 0 | 215.3 |
| spreadRate | 3261 | 3277 | 0 | 16.7 |
| institutionalAdoptionRate | 3260 | 3263 | 0 | 2.7 |
| economicCoupling | 3263 | 3263 | 0 | 0.0 |

## Morris-style global screening

| Parameter | Mean absolute effect | Effect SD | Reach-change rate |
|---|---:|---:|---:|
| fragmentationPerEvent | 2.125 | 6.702 | 7.3% |
| institutionEventProbability | 0.789 | 2.195 | 2.1% |
| qualifyingShare | 0.433 | 1.330 | 1.0% |
| leadingInstitutionStrength | 0.331 | 1.212 | 1.0% |
| conflictInterval | 0.322 | 0.783 | 0.0% |
| internalConflict | 0.270 | 1.060 | 1.0% |
| consolidationAcceleration | 0.263 | 0.869 | 1.0% |
| economicCoupling | 0.219 | 0.922 | 1.0% |
| systemicCycleStress | 0.118 | 0.700 | 0.5% |
| spreadRate | 0.046 | 0.287 | 0.0% |
| institutionalAdoptionRate | 0.021 | 0.097 | 0.0% |

## Consolidation/fragmentation phase map

- Reached cells: 65 / 81
- The boundary is discontinuous because agent counts and fragments are integers.

## Observability counterfactual

Conditioned on: Upper observed COW major-wave case (1936–1945 gross exits).

| Verified observability | Dominance calendar year |
|---:|---:|
| 100% | 2769 |
| 95% | 2771 |
| 80% | 2778 |
| 60% | 2795 |
| 50% | No reach by 7026 |
| 40% | No reach by 7026 |

## COW sovereign-wave calibration

- 3.1% post-Cold-War wave: No reach by 7026
- 11.1% Italian-consolidation wave: 4298
- 11% durable production default: 4302
- 22.0% German-consolidation wave: 2662
- 27.3% wartime gross-exit wave: 2515
- 52.4% secondary aircraft midpoint: 2213

> Durable COW exit waves calibrate the sovereign default; gross waves are sensitivity cases. Aircraft/aerospace remains a secondary corporate comparison.

## Interpretation limits

- Screening uses authored parameter ranges and a censored log-time outcome.
- One-at-a-time results omit interactions.
- Observability is a counterfactual because production currently assumes full required observability.
- Wave-loss probabilities are expected field effects; future stochastic outcomes should be correlated by shared event severity.
- Aircraft manufacturing is a corporate reference regime, not direct evidence about states.
