# Default Value Rationale

**Version:** 1.9.0  
**Frozen:** 2026-10-09T10:35:00-04:00

> Existing research and observed proxies justify variable inclusion and default scale. Only Tier A values are direct observations. Tier D values are transparent scenario conventions, not empirical estimates.

## Evidence tiers

| Tier | Meaning |
|---|---|
| A | Observed anchor directly counted from a declared source |
| B | Value or timescale reported in existing literature |
| C | Proxy-derived calculation using an analogous observed process |
| D | Author-defined scenario convention with no empirical estimate claim |
| N | Neutral normalization point defined by the model scale |
| E | Display or analysis setting with no real-world truth claim |

## Active defaults

| Variable | Default | Range | Tier | Confidence | Sensitivity required |
|---|---:|---:|---|---|---:|
| `startAgents` | 225 | 2–225 | A+D | medium | Yes |
| `conflictInterval` | 25 | 1–100 | B+D | low | Yes |
| `qualifyingShare` | 47.6% | 0–1 | D | medium-low | Yes |
| `institutionEventProbability` | 15% | 1%–90% | D | low | Yes |
| `fragmentationPerEvent` | 0 | 0–10 | D | low | Yes |
| `internalConflict` | 5% | 0–50% | D | low | Yes |
| `institutionalAdoptionRate` | 7% | 1%–30% | C | medium-low | Yes |
| `leadingInstitutionStrength` | 50% | 0–1 | N | high-as-neutral-code | Yes |
| `systemicCycleStress` | 50% | 0–1 | N | high-as-neutral-code | Yes |
| `economicCoupling` | 50% | 0–1 | D | low | Yes |
| `spreadRate` | 15% | 1%–50% | B+D | low | Yes |
| `consolidationAcceleration` | 25% | 0–1 | D | low | Yes |
| `currentWaveInProgress` | 1 | 0–1 | D | low | Yes |
| `horizon` | 2000 | 50–5000 | E | not-applicable | No |
| `selectedYear` | 0 | 0–horizon | E | not-applicable | No |

## `startAgents` — default 225

- **Evidence tier:** A+D
- **Confidence:** medium
- **Rationale:** Uses 195 country-level Institutions plus 30 strategic technology corporations. They are not legally equivalent; peer-node treatment is an authored future-dependency abstraction.
- **Derivation:** 193 UN Member States + 2 Observer States + 30 revenue-selected technology companies = 225. The author expects sustained international conflict to push strategic firms toward nationalization, state direction, or equivalent dependency; the model does not estimate inevitability.
- **Sensitivity:** Required
- **Sources:** [Correlates of War State System Membership](https://correlatesofwar.org/data-sets/state-system-membership/); [Additional source](https://www.un.org/en/model-united-nations/un-glance); [Additional source](https://fortune.com/ranking/global500/)

## `conflictInterval` — default 25

- **Evidence tier:** B+D
- **Confidence:** low
- **Rationale:** Interpreted as the interval between order-restructuring opportunities, not all wars or disputes. Twenty-five years is one-third of Dalio's roughly 75-year order-cycle heuristic, corresponding to a rise/peak/decline phase interval.
- **Derivation:** 75 years / 3 broad phases = 25 years. COW MID data show ordinary war onsets are much more frequent, so this must not be labeled an empirical war interval.
- **Sensitivity:** Required
- **Sources:** [The Changing World Order manuscript](https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf); [Militarized Interstate Disputes](https://correlatesofwar.org/data-sets/MIDs/)

## `qualifyingShare` — default 47.6%

- **Evidence tier:** D
- **Confidence:** medium-low
- **Rationale:** Core authored recurrence assumption: later qualifying waves arrive around a 52.5-year mean. The assumed current wave is not empirical evidence for this rate.
- **Derivation:** Author selected 52.5 years; with a 25-year baseline interval this implies qualifying share 0.476. It is numerically equivalent to four waves over 1816–2026 only if the assumed current wave is counted. The historical-only reference uses three observed durable waves over 1816–2024: 69.4 years (share 0.36).
- **Sensitivity:** Required
- **Sources:** [Militarized Interstate Disputes](https://correlatesofwar.org/data-sets/MIDs/); [Additional source](https://correlatesofwar.org/data-sets/MIDs/)

## `institutionEventProbability` — default 15%

- **Evidence tier:** D
- **Confidence:** low
- **Rationale:** Core assumption: each Institution has a 15% probability of permanently losing top-level independence in each qualifying wave, including the wave in progress at the 2026 epoch. Losses are durable, matching the model's permanent-loss rule.
- **Derivation:** Author core assumption of about 15% durable loss. It sits between the durable COW three-wave mean (11.2%) and the 1866–71 durable wave (19.5%), and inside the 8.5%–29.2% envelope across 40 gross/durable specifications. The durable COW mean remains the evidence-based reference case.
- **Sensitivity:** Required
- **Sources:** [Correlates of War State System Membership](https://correlatesofwar.org/data-sets/state-system-membership/); [COW Intra-State War Data](https://correlatesofwar.org/data-sets/cow-war/); [Additional source](https://www.usitc.gov/publications/332/pub3143.pdf); [Additional source](https://www.rand.org/pubs/monograph_reports/MR1696.html)

## `fragmentationPerEvent` — default 0

- **Evidence tier:** D
- **Confidence:** low
- **Rationale:** Zero isolates consolidation effects in the central scenario. Fragmentation is tested explicitly in alternate scenarios rather than silently embedded.
- **Derivation:** Control-condition convention; not an estimate that real events create zero successor Institutions.
- **Sensitivity:** Required
- **Sources:** [Correlates of War State System Membership](https://correlatesofwar.org/data-sets/state-system-membership/)

## `internalConflict` — default 5%

- **Evidence tier:** D
- **Confidence:** low
- **Rationale:** Counts completed pre-Apex splits that create a fully independent top-level Institution. It does not predict internal disputes, factions, or partial autonomy inside a parent.
- **Derivation:** Author scenario convention of 5% completed independent splits per wave, pending lineage data. Numerical similarity to conflict proxies is not calibration.
- **Sensitivity:** Required
- **Sources:** [UCDP conflict datasets](https://ucdp.uu.se/downloads/); [V-Dem Country-Year Dataset](https://www.v-dem.net/data/the-v-dem-dataset/); [Worldwide Governance Indicators](https://www.worldbank.org/en/publication/worldwide-governance-indicators)

## `institutionalAdoptionRate` — default 7%

- **Evidence tier:** C
- **Confidence:** medium-low
- **Rationale:** IFRS jurisdictional adoption supplies an analogous standards-diffusion timescale.
- **Derivation:** [logit(140/170) - logit(120/170)] / 10 = 0.0665 per year; rounded to 7%.
- **Sensitivity:** Required
- **Sources:** [IFRS jurisdiction profiles](https://www.ifrs.org/use-around-the-world/use-of-ifrs-standards-by-jurisdiction/); [Additional source](https://www.ifrs.org/content/dam/ifrs/around-the-world/adoption/the-global-financial-reporting-language-may-2016.pdf)

## `leadingInstitutionStrength` — default 50%

- **Evidence tier:** N
- **Confidence:** high-as-neutral-code
- **Rationale:** Fifty percent is the defined neutral point of a normalized scenario scale, not a claim about current institutional strength.
- **Derivation:** Centered signal p = 2P - 1; P=0.5 produces p=0 and no strength adjustment.
- **Sensitivity:** Required
- **Sources:** [The Changing World Order manuscript](https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf); [World Development Indicators](https://databank.worldbank.org/source/world-development-indicators); [Global Innovation Index](https://www.wipo.int/global_innovation_index/en/); [SIPRI Military Expenditure Database](https://www.sipri.org/databases/milex)

## `systemicCycleStress` — default 50%

- **Evidence tier:** N
- **Confidence:** high-as-neutral-code
- **Rationale:** Fifty percent is the defined neutral point of the systemic-stress scale, not an estimate of present global stress.
- **Derivation:** Centered signal z = 2Z - 1; Z=0.5 produces z=0 and no stress adjustment.
- **Sensitivity:** Required
- **Sources:** [The Changing World Order manuscript](https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf); [Global Debt Database](https://www.imf.org/external/datamapper/datasets/GDD); [World Inequality Database](https://wid.world/data/); [V-Dem Country-Year Dataset](https://www.v-dem.net/data/the-v-dem-dataset/); [Worldwide Governance Indicators](https://www.worldbank.org/en/publication/worldwide-governance-indicators)

## `economicCoupling` — default 50%

- **Evidence tier:** D
- **Confidence:** low
- **Rationale:** The midpoint exposes economic interaction in sensitivity testing while neutral strength/stress leave the baseline unchanged.
- **Derivation:** Scenario midpoint. The value is not fitted; setting coupling to zero disables the economic layer.
- **Sensitivity:** Required
- **Sources:** [The Changing World Order manuscript](https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf); [Correlates of War State System Membership](https://correlatesofwar.org/data-sets/state-system-membership/)

## `spreadRate` — default 15%

- **Evidence tier:** B+D
- **Confidence:** low
- **Rationale:** A conservative generic logistic diffusion coefficient chosen below recent generative-AI adoption speeds, allowing multi-decade rather than near-immediate diffusion.
- **Derivation:** With one of 225 Institutions initially adopting, beta=0.15 reaches 90% in about 50.7 years. Stanford's observed recent AI diffusion is faster, so 15% is a scenario convention, not a fit.
- **Sensitivity:** Required
- **Sources:** [Stanford AI Index](https://hai.stanford.edu/ai-index/2026-ai-index-report); [Additional source](https://doi.org/10.1287/mnsc.15.5.215)

## `consolidationAcceleration` — default 25%

- **Evidence tier:** D
- **Confidence:** low
- **Rationale:** Represents one bounded feedback from AI adoption and accumulated consolidation into faster, more effective subsequent consolidation pressure.
- **Derivation:** Author-defined cautious quarter-strength setting. Zero reproduces the constant-rate model; one permits the fixed 5x ceiling when AI adoption and consolidation progress are both complete.
- **Sensitivity:** Required
- **Sources:** [Stanford AI Index](https://hai.stanford.edu/ai-index/2026-ai-index-report); [Correlates of War State System Membership](https://correlatesofwar.org/data-sets/state-system-membership/); [Additional source](https://doi.org/10.1093/biomet/58.1.83); [Additional source](https://doi.org/10.2307/2234208); [Additional source](https://doi.org/10.1126/science.286.5439.509)

## `currentWaveInProgress` — default 1

- **Evidence tier:** D
- **Confidence:** low
- **Rationale:** Core assumption: a qualifying reorganization wave is under way at the 2026 epoch. Ray Dalio described February 2026 as Stage 6 of his Big Cycle—great disorder and a clash of great powers. The model treats that as interpretive support; consolidating severity remains uncertain.
- **Derivation:** Author scenario assumption informed by Dalio’s February 23, 2026 current-cycle interpretation. The wave resolves exactly 3 years after the epoch, in 2029, by convention. Neither Dalio’s framework nor the five-year COW clustering rule estimates a 15% loss or the 2029 resolution date.
- **Sensitivity:** Required
- **Sources:** [Correlates of War State System Membership](https://correlatesofwar.org/data-sets/state-system-membership/); [Additional source](https://raydalio.substack.com/p/its-official-the-world-order-has)

## `horizon` — default 2000

- **Evidence tier:** E
- **Confidence:** not-applicable
- **Rationale:** Display and stress-test horizon only. Calendar years at long horizons expose model behavior and have no forecast or evidentiary status.
- **Derivation:** 2,000 years is an interactive display convention; generated analyses extend to 5,000 years to expose censoring and asymptotic behavior, not to predict history.
- **Sensitivity:** Not required; display setting
- **Sources:** None — display convention

## `selectedYear` — default 0

- **Evidence tier:** E
- **Confidence:** not-applicable
- **Rationale:** The visualization opens at the declared baseline year before any modeled transitions.
- **Derivation:** Display origin convention.
- **Sensitivity:** Not required; display setting
- **Sources:** None — display convention

## Hidden constants

### `initialInstitutionalAdoption` = 5%

- **Tier:** D
- **Confidence:** low
- **Rationale:** Represents a small pilot or initial enforceable scope for each entering adoption cohort.
- **Sensitivity required:** Yes

### `terminalMajority` = 50%

- **Tier:** D
- **Confidence:** medium-as-definition
- **Rationale:** A strict majority defines effective internal dominance after one top-level Institution remains; duration and reversal still require empirical testing.
- **Sensitivity required:** Yes

### `strengthToConsolidationCoefficient` = 50%

- **Tier:** D
- **Confidence:** low
- **Rationale:** Limits full-coupling strength adjustment to plus or minus 50% of the base consolidation rate.
- **Sensitivity required:** Yes

### `stressToConflictCoefficient` = 75%

- **Tier:** D
- **Confidence:** low
- **Rationale:** Makes systemic stress materially affect restructuring frequency while retaining explicit clamps.
- **Sensitivity required:** Yes

### `strengthToInternalConflictCoefficient` = 25%

- **Tier:** D
- **Confidence:** low
- **Rationale:** Allows strength to partially offset stress-driven internal fracture without eliminating it automatically.
- **Sensitivity required:** Yes

### `requiredObservabilityForEffectiveAlignment` = 1

- **Tier:** D
- **Confidence:** medium-as-policy-definition
- **Rationale:** A subordinate agent receives effective-alignment credit only when material data, core applications, infrastructure, lineage, and recovery paths are visible to authorized Apex governance.
- **Sensitivity required:** Yes

### `remediationProbabilityOnDetectedConcealment` = 1

- **Tier:** D
- **Confidence:** high-as-policy-definition
- **Rationale:** Detected material concealment always initiates corrective action under the non-tolerance assumption; detection probability remains separate and imperfect.
- **Sensitivity required:** Yes

### `permanentIndependenceLossOnUnconditionalDefeat` = 1

- **Tier:** D
- **Confidence:** high-as-model-definition
- **Rationale:** A decisive unconditional defeat permanently ends the losing Institution’s independent top-level authority through subjugation and integration; subordinate organizational continuity is allowed.
- **Sensitivity required:** Yes

### `maximumConsolidationAccelerationMultiplier` = 5

- **Tier:** D
- **Confidence:** low
- **Rationale:** Caps the bundled acceleration feedback at 5x to prevent runaway event rates and preserve positive event intervals. Hawkes, coagulation, preferential-attachment, and separate channel ceilings remain excluded.
- **Sensitivity required:** Yes

### `currentWaveResolutionYears` = 3

- **Tier:** D
- **Confidence:** low
- **Rationale:** Author-selected resolution at 2029 for the current-wave scenario. The five-year historical clustering rule does not empirically determine this date.
- **Sensitivity required:** Yes

### `clusteredWaveArrivals` = 1

- **Tier:** D
- **Confidence:** low
- **Rationale:** Later interarrivals bootstrap normalized 6-, 36-, and 124-year gaps between the 1860, 1866, 1990, and assumed 2026 waves. This preserves short/medium/long clustering around the selected mean without claiming a fitted point process.
- **Sensitivity required:** Yes

### `waveSeverityBetaConcentration` = 14

- **Tier:** C
- **Confidence:** low
- **Rationale:** A beta draw around the mean loss assumption precedes each binomial loss draw. Concentration 14 approximates dispersion across the three observed durable COW wave shares and induces correlated within-wave losses.
- **Sensitivity required:** Yes

### `maximumEventsPerRun` = 10000

- **Tier:** E
- **Confidence:** high-as-computational-guard
- **Rationale:** Runs that reach 10,000 events before the horizon are computationally censored, reported as event-limit, and excluded from summaries requiring unknown post-limit states.
- **Sensitivity required:** No

### `clusteredWaveGapYears` = 6–36–124

- **Tier:** D
- **Confidence:** low
- **Rationale:** Sparse observed/assumed gap set used by the clustered bootstrap. The 36-year gap depends on the authored current-wave assumption; all three gaps receive equal sampling weight.
- **Sensitivity required:** Yes

## Interpretation rule

A citation justifies considering a variable; it does not automatically validate the model's equation or default. Proxy and conventional defaults remain subject to scenario and sensitivity analysis.
