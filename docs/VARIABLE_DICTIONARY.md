# Variable Dictionary

**Dictionary version:** 1.1.0  
**Variables:** 43

| Variable | Label | Role | Level | Unit | Status |
|---|---|---|---|---|---|
| `institution_id` | Canonical Institution identifier | identifier | all | string | required |
| `year` | Observation year | time | all | calendar year | required |
| `transition_type` | Institutional transition type | outcome | event | categorical | required |
| `event_time` | Time to transition or censoring | outcome | institution-period | years | required |
| `event_observed` | Transition observed indicator | outcome | institution-period | binary | required |
| `conflict_interval` | Interval since prior qualifying conflict | predictor | state-year | years | current-model |
| `qualifying_conflict_share` | Share of conflicts meeting declared severity rule | predictor | period or Institution | proportion 0-1 | current-model |
| `consolidation_fraction` | Observed Institution loss share during consolidation wave | outcome-and-calibration-target | event | proportion 0-1 | proxy-calibration-target |
| `external_fragments` | New autonomous Institutions created | outcome-and-calibration-target | event | count | current-model |
| `internal_conflict` | Internal conflict pressure | predictor | state-year | latent or normalized index | current-model |
| `productive_strength` | Productive and financial Institution strength | latent-predictor | state-year | standardized factor or vector | current-composite-under-test |
| `systemic_cycle_stress` | Systemic cycle stress | latent-predictor | state-year | standardized factor or vector | current-composite-under-test |
| `economic_coupling` | Economics-to-transition coupling | model-parameter | simulation | proportion 0-1 | author-defined |
| `consolidation_acceleration` | AI consolidation acceleration | model-parameter | simulation | proportion 0-1 | author-defined-bounded-feedback |
| `formal_adoption_date` | Formal standard adoption date | predictor-and-event-origin | Institution-standard | date | empirical-target |
| `implementation_coverage` | Internal implementation coverage | outcome | Institution-standard-year | proportion 0-1 | empirical-target |
| `institutional_adoption_rate` | Institutional standard adoption coefficient | model-parameter | Institution-standard | logistic rate per year | current-model |
| `technical_standard_adoption` | Technical standard adoption | predictor | state-or-Institution-year | proportion 0-1 | empirical-target |
| `architecture_adoption` | AI architecture adoption | predictor | Institution-year | proportion 0-1 | current-model |
| `education` | Education and human-capital capacity | predictor-component | state-year | source-native and standardized | planned |
| `relative_innovation` | Relative innovation capacity | predictor-component | state-year or dyad-year | index difference or ratio | planned |
| `relative_gdp` | Relative economic output | predictor-component | state-dyad-year | log GDP difference and ratio | planned |
| `relative_trade_share` | Relative trade position | predictor-component | state-dyad-year | world share and dyadic dependence | planned |
| `relative_material_capability` | Relative material and military capability | predictor-component | state-dyad-year | ratio or standardized index | planned |
| `reserve_currency_share` | Reserve-currency position | predictor-component | currency-year mapped to issuing Institution | share of allocated reserves | planned |
| `debt_stress` | Debt and debt-service stress | predictor-component | state-year | multiple source-native ratios | planned |
| `inequality` | Income and wealth inequality | predictor-component | state-year | top shares and inequality indices | planned |
| `internal_disorder` | Political and institutional disorder | predictor-component | state-year | indicator vector or latent score | planned |
| `external_transition_pressure` | External power-transition pressure | predictor-component | state-dyad-year | relative level and growth convergence | planned |
| `alliance_dependency` | Alliance dependency | network-predictor | state-dyad-year | edge type and asymmetry | planned |
| `trade_dependency` | Trade dependency | network-predictor | state-dyad-year | bilateral trade share | planned |
| `financial_dependency` | Cross-border financial dependency | network-predictor | state-dyad-year | exposure share | planned |
| `infrastructure_dependency` | Critical technical and infrastructure dependency | network-predictor | Institution-dyad-year | dependency share or categorical edge | evidence-gap |
| `network_centrality` | Multiplex network centrality | derived-predictor | state-year | layer-specific centrality | planned |
| `largest_influence_share` | Largest Institution influence share | predictor-and-state | system-year | proportion 0-1 | terminal-majority-test |
| `second_largest_influence_share` | Second-largest Institution influence share | predictor-and-state | system-year | proportion 0-1 | terminal-majority-test |
| `remaining_institutions` | Independent top-level Institutions remaining | predictor-and-state | system-year | count | current-model |
| `coalition_blocking_power` | Coalition blocking power against the leader | network-predictor | system-year | weighted voting or capability share | planned |
| `mandate_strength` | Legal or contractual mandate strength | adoption-predictor | Institution-standard | ordinal preregistered code | planned |
| `switching_cost` | Standard switching cost | adoption-predictor | Institution-standard | normalized composite | evidence-gap |
| `administrative_capacity` | Administrative implementation capacity | adoption-predictor | state-year | indicator vector | planned |
| `model_horizon` | Simulation horizon | display-only | simulation | years | non-empirical |
| `selected_year` | Displayed simulation year | display-only | simulation | years | non-empirical |

## Detailed definitions

### `institution_id` — Canonical Institution identifier

- **Role / level:** identifier / all
- **Unit:** string
- **Availability:** historical and current
- **Sources:** Correlates of War State System Membership
- **Missingness:** never impute; unresolved records are quarantined
- **Leakage risk:** low
- **Current model mapping:** entity identity
- **Status:** required

### `year` — Observation year

- **Role / level:** time / all
- **Unit:** calendar year
- **Availability:** source dependent
- **Sources:** Correlates of War State System Membership
- **Missingness:** not applicable
- **Leakage risk:** low
- **Current model mapping:** t
- **Status:** required

### `transition_type` — Institutional transition type

- **Role / level:** outcome / event
- **Unit:** categorical
- **Availability:** to be coded
- **Sources:** Correlates of War State System Membership, UCDP conflict datasets
- **Missingness:** independent adjudication required
- **Leakage risk:** high if coded using predictors
- **Current model mapping:** competing event
- **Status:** required

### `event_time` — Time to transition or censoring

- **Role / level:** outcome / institution-period
- **Unit:** years
- **Availability:** derived
- **Sources:** Correlates of War State System Membership
- **Missingness:** retain right-censoring indicator
- **Leakage risk:** high if future exit is exposed
- **Current model mapping:** transition time
- **Status:** required

### `event_observed` — Transition observed indicator

- **Role / level:** outcome / institution-period
- **Unit:** binary
- **Availability:** derived
- **Sources:** Correlates of War State System Membership
- **Missingness:** never infer from missing rows
- **Leakage risk:** high
- **Current model mapping:** apexReached/event indicator
- **Status:** required

### `conflict_interval` — Interval since prior qualifying conflict

- **Role / level:** predictor / state-year
- **Unit:** years
- **Availability:** 1946 onward preferred
- **Sources:** UCDP conflict datasets, Militarized Interstate Disputes
- **Missingness:** distinguish no event from unavailable coverage
- **Leakage risk:** medium
- **Current model mapping:** conflictInterval
- **Status:** current-model

### `qualifying_conflict_share` — Share of conflicts meeting declared severity rule

- **Role / level:** predictor / period or Institution
- **Unit:** proportion 0-1
- **Availability:** derived by window
- **Sources:** UCDP conflict datasets, Militarized Interstate Disputes
- **Missingness:** no imputation without event coverage
- **Leakage risk:** high if future window included
- **Current model mapping:** qualifyingShare
- **Status:** current-model

### `consolidation_fraction` — Observed Institution loss share during consolidation wave

- **Role / level:** outcome-and-calibration-target / event
- **Unit:** proportion 0-1
- **Availability:** requires event coding
- **Sources:** Correlates of War State System Membership
- **Missingness:** report unknown rather than zero
- **Leakage risk:** high
- **Current model mapping:** institutionEventProbability
- **Status:** proxy-calibration-target

### `external_fragments` — New autonomous Institutions created

- **Role / level:** outcome-and-calibration-target / event
- **Unit:** count
- **Availability:** derived from successor crosswalk
- **Sources:** Correlates of War State System Membership
- **Missingness:** unresolved successors quarantined
- **Leakage risk:** high
- **Current model mapping:** fragmentationPerEvent
- **Status:** current-model

### `internal_conflict` — Internal conflict pressure

- **Role / level:** predictor / state-year
- **Unit:** latent or normalized index
- **Availability:** source dependent
- **Sources:** UCDP conflict datasets, V-Dem Country-Year Dataset, Worldwide Governance Indicators
- **Missingness:** model source-specific missingness; do not equate missing with peace
- **Leakage risk:** medium
- **Current model mapping:** internalConflict
- **Status:** current-model

### `productive_strength` — Productive and financial Institution strength

- **Role / level:** latent-predictor / state-year
- **Unit:** standardized factor or vector
- **Availability:** mixed
- **Sources:** World Development Indicators, Global Innovation Index, SIPRI Military Expenditure Database, National Material Capabilities, Currency Composition of Official Foreign Exchange Reserves
- **Missingness:** retain components until measurement model is validated
- **Leakage risk:** medium
- **Current model mapping:** leadingInstitutionStrength
- **Status:** current-composite-under-test

### `systemic_cycle_stress` — Systemic cycle stress

- **Role / level:** latent-predictor / state-year
- **Unit:** standardized factor or vector
- **Availability:** mixed
- **Sources:** Global Debt Database, World Inequality Database, V-Dem Country-Year Dataset, Worldwide Governance Indicators, UCDP conflict datasets
- **Missingness:** retain components until measurement model is validated
- **Leakage risk:** medium
- **Current model mapping:** systemicCycleStress
- **Status:** current-composite-under-test

### `economic_coupling` — Economics-to-transition coupling

- **Role / level:** model-parameter / simulation
- **Unit:** proportion 0-1
- **Availability:** must be estimated
- **Sources:** The Changing World Order manuscript, Correlates of War State System Membership
- **Missingness:** use distribution, not silent default, after calibration
- **Leakage risk:** high if tuned on test set
- **Current model mapping:** economicCoupling
- **Status:** author-defined

### `consolidation_acceleration` — AI consolidation acceleration

- **Role / level:** model-parameter / simulation
- **Unit:** proportion 0-1
- **Availability:** must be estimated
- **Sources:** Stanford AI Index, Correlates of War State System Membership
- **Missingness:** retain zero-acceleration ablation and use a disclosed distribution
- **Leakage risk:** high if tuned on outcome dates
- **Current model mapping:** consolidationAcceleration
- **Status:** author-defined-bounded-feedback

### `formal_adoption_date` — Formal standard adoption date

- **Role / level:** predictor-and-event-origin / Institution-standard
- **Unit:** date
- **Availability:** standard dependent
- **Sources:** IFRS jurisdiction profiles, ISO Survey of certifications, Google IPv6 adoption statistics
- **Missingness:** distinguish not adopted from unknown
- **Leakage risk:** low
- **Current model mapping:** cohort entry t_c
- **Status:** empirical-target

### `implementation_coverage` — Internal implementation coverage

- **Role / level:** outcome / Institution-standard-year
- **Unit:** proportion 0-1
- **Availability:** limited
- **Sources:** IFRS jurisdiction profiles, ISO Survey of certifications, Google IPv6 adoption statistics
- **Missingness:** do not substitute formal requirement
- **Leakage risk:** medium
- **Current model mapping:** a_c(t)
- **Status:** empirical-target

### `institutional_adoption_rate` — Institutional standard adoption coefficient

- **Role / level:** model-parameter / Institution-standard
- **Unit:** logistic rate per year
- **Availability:** estimated from adoption trajectories
- **Sources:** IFRS jurisdiction profiles, ISO Survey of certifications, Google IPv6 adoption statistics
- **Missingness:** hierarchical partial pooling by standard type
- **Leakage risk:** high if entire trajectory used at prediction origin
- **Current model mapping:** institutionalAdoptionRate
- **Status:** current-model

### `technical_standard_adoption` — Technical standard adoption

- **Role / level:** predictor / state-or-Institution-year
- **Unit:** proportion 0-1
- **Availability:** standard dependent
- **Sources:** Google IPv6 adoption statistics, ISO Survey of certifications, Stanford AI Index
- **Missingness:** source-specific
- **Leakage risk:** medium
- **Current model mapping:** architecture adoption
- **Status:** empirical-target

### `architecture_adoption` — AI architecture adoption

- **Role / level:** predictor / Institution-year
- **Unit:** proportion 0-1
- **Availability:** recent only
- **Sources:** Stanford AI Index
- **Missingness:** do not extrapolate historical AI adoption without labels
- **Leakage risk:** medium
- **Current model mapping:** spreadRate/logistic adoption
- **Status:** current-model

### `education` — Education and human-capital capacity

- **Role / level:** predictor-component / state-year
- **Unit:** source-native and standardized
- **Availability:** mixed historical coverage
- **Sources:** World Development Indicators
- **Missingness:** multiple indicators retained; imputation sensitivity required
- **Leakage risk:** low
- **Current model mapping:** productive strength component
- **Status:** planned

### `relative_innovation` — Relative innovation capacity

- **Role / level:** predictor-component / state-year or dyad-year
- **Unit:** index difference or ratio
- **Availability:** annual recent period
- **Sources:** Global Innovation Index
- **Missingness:** no backward fill beyond source coverage
- **Leakage risk:** low
- **Current model mapping:** productive strength component
- **Status:** planned

### `relative_gdp` — Relative economic output

- **Role / level:** predictor-component / state-dyad-year
- **Unit:** log GDP difference and ratio
- **Availability:** 1960 onward with gaps
- **Sources:** World Development Indicators
- **Missingness:** retain source flags and alternate PPP/current-dollar definitions
- **Leakage risk:** low
- **Current model mapping:** productive strength component
- **Status:** planned

### `relative_trade_share` — Relative trade position

- **Role / level:** predictor-component / state-dyad-year
- **Unit:** world share and dyadic dependence
- **Availability:** source dependent
- **Sources:** World Development Indicators, Bilateral Trade
- **Missingness:** do not interpret missing dyads as zero trade without coverage proof
- **Leakage risk:** medium
- **Current model mapping:** productive strength and network component
- **Status:** planned

### `relative_material_capability` — Relative material and military capability

- **Role / level:** predictor-component / state-dyad-year
- **Unit:** ratio or standardized index
- **Availability:** historical
- **Sources:** National Material Capabilities, SIPRI Military Expenditure Database
- **Missingness:** compare alternate capability definitions
- **Leakage risk:** low
- **Current model mapping:** productive strength component
- **Status:** planned

### `reserve_currency_share` — Reserve-currency position

- **Role / level:** predictor-component / currency-year mapped to issuing Institution
- **Unit:** share of allocated reserves
- **Availability:** recent quarterly/annual
- **Sources:** Currency Composition of Official Foreign Exchange Reserves
- **Missingness:** not applicable to non-issuers; encode separately from zero influence
- **Leakage risk:** low
- **Current model mapping:** productive strength component
- **Status:** planned

### `debt_stress` — Debt and debt-service stress

- **Role / level:** predictor-component / state-year
- **Unit:** multiple source-native ratios
- **Availability:** mixed
- **Sources:** Global Debt Database, BIS statistics
- **Missingness:** separate public/private and level/change measures
- **Leakage risk:** medium
- **Current model mapping:** systemic stress component
- **Status:** planned

### `inequality` — Income and wealth inequality

- **Role / level:** predictor-component / state-year
- **Unit:** top shares and inequality indices
- **Availability:** uneven
- **Sources:** World Inequality Database
- **Missingness:** retain measurement uncertainty and source revisions
- **Leakage risk:** medium
- **Current model mapping:** systemic stress component
- **Status:** planned

### `internal_disorder` — Political and institutional disorder

- **Role / level:** predictor-component / state-year
- **Unit:** indicator vector or latent score
- **Availability:** 1996 onward for common panel
- **Sources:** V-Dem Country-Year Dataset, Worldwide Governance Indicators, UCDP conflict datasets
- **Missingness:** do not combine indicators before invariance testing
- **Leakage risk:** medium
- **Current model mapping:** systemic stress/internal conflict
- **Status:** planned

### `external_transition_pressure` — External power-transition pressure

- **Role / level:** predictor-component / state-dyad-year
- **Unit:** relative level and growth convergence
- **Availability:** historical
- **Sources:** National Material Capabilities, World Development Indicators, SIPRI Military Expenditure Database
- **Missingness:** define challenger set before outcome window
- **Leakage risk:** high if challenger selected retrospectively
- **Current model mapping:** systemic stress component
- **Status:** planned

### `alliance_dependency` — Alliance dependency

- **Role / level:** network-predictor / state-dyad-year
- **Unit:** edge type and asymmetry
- **Availability:** historical
- **Sources:** Formal Alliances
- **Missingness:** absence is zero only within verified coverage
- **Leakage risk:** low
- **Current model mapping:** future network layer
- **Status:** planned

### `trade_dependency` — Trade dependency

- **Role / level:** network-predictor / state-dyad-year
- **Unit:** bilateral trade share
- **Availability:** historical with gaps
- **Sources:** Bilateral Trade, World Development Indicators
- **Missingness:** coverage-aware zero handling
- **Leakage risk:** medium
- **Current model mapping:** future network layer
- **Status:** planned

### `financial_dependency` — Cross-border financial dependency

- **Role / level:** network-predictor / state-dyad-year
- **Unit:** exposure share
- **Availability:** limited reporter coverage
- **Sources:** BIS statistics
- **Missingness:** reporter/non-reporter distinction required
- **Leakage risk:** medium
- **Current model mapping:** future network layer
- **Status:** planned

### `infrastructure_dependency` — Critical technical and infrastructure dependency

- **Role / level:** network-predictor / Institution-dyad-year
- **Unit:** dependency share or categorical edge
- **Availability:** evidence gap
- **Sources:** Stanford AI Index
- **Missingness:** document unavailable layers rather than proxy silently
- **Leakage risk:** medium
- **Current model mapping:** future network layer
- **Status:** evidence-gap

### `network_centrality` — Multiplex network centrality

- **Role / level:** derived-predictor / state-year
- **Unit:** layer-specific centrality
- **Availability:** derived
- **Sources:** Formal Alliances, Bilateral Trade, BIS statistics
- **Missingness:** calculate only from coverage-consistent snapshots
- **Leakage risk:** high if future edges included
- **Current model mapping:** future Apex influence weight
- **Status:** planned

### `largest_influence_share` — Largest Institution influence share

- **Role / level:** predictor-and-state / system-year
- **Unit:** proportion 0-1
- **Availability:** definition dependent
- **Sources:** National Material Capabilities, World Development Indicators
- **Missingness:** report across multiple weighting definitions
- **Leakage risk:** low
- **Current model mapping:** leading structural influence
- **Status:** terminal-majority-test

### `second_largest_influence_share` — Second-largest Institution influence share

- **Role / level:** predictor-and-state / system-year
- **Unit:** proportion 0-1
- **Availability:** definition dependent
- **Sources:** National Material Capabilities, World Development Indicators
- **Missingness:** report across multiple weighting definitions
- **Leakage risk:** low
- **Current model mapping:** equal-final comparison
- **Status:** terminal-majority-test

### `remaining_institutions` — Independent top-level Institutions remaining

- **Role / level:** predictor-and-state / system-year
- **Unit:** count
- **Availability:** 1816 onward under COW definition
- **Sources:** Correlates of War State System Membership
- **Missingness:** respect changing system-membership definitions
- **Leakage risk:** low
- **Current model mapping:** S(t)
- **Status:** current-model

### `coalition_blocking_power` — Coalition blocking power against the leader

- **Role / level:** network-predictor / system-year
- **Unit:** weighted voting or capability share
- **Availability:** derived
- **Sources:** Formal Alliances, National Material Capabilities
- **Missingness:** multiple coalition definitions required
- **Leakage risk:** high if coalition selected after outcome
- **Current model mapping:** future terminal-majority condition
- **Status:** planned

### `mandate_strength` — Legal or contractual mandate strength

- **Role / level:** adoption-predictor / Institution-standard
- **Unit:** ordinal preregistered code
- **Availability:** manual coding
- **Sources:** IFRS jurisdiction profiles, ISO Survey of certifications
- **Missingness:** dual-coded with adjudication
- **Leakage risk:** medium
- **Current model mapping:** future adoption-rate modifier
- **Status:** planned

### `switching_cost` — Standard switching cost

- **Role / level:** adoption-predictor / Institution-standard
- **Unit:** normalized composite
- **Availability:** evidence gap/manual coding
- **Sources:** IFRS jurisdiction profiles, ISO Survey of certifications
- **Missingness:** retain separate technical, financial, and legal costs
- **Leakage risk:** medium
- **Current model mapping:** future adoption-rate modifier
- **Status:** evidence-gap

### `administrative_capacity` — Administrative implementation capacity

- **Role / level:** adoption-predictor / state-year
- **Unit:** indicator vector
- **Availability:** 1996 onward common panel
- **Sources:** Worldwide Governance Indicators, V-Dem Country-Year Dataset
- **Missingness:** measurement model required
- **Leakage risk:** low
- **Current model mapping:** future adoption-rate modifier
- **Status:** planned

### `model_horizon` — Simulation horizon

- **Role / level:** display-only / simulation
- **Unit:** years
- **Availability:** analyst selected
- **Sources:** None — non-empirical/display only
- **Missingness:** not applicable
- **Leakage risk:** exclude from empirical predictors
- **Current model mapping:** horizon
- **Status:** non-empirical

### `selected_year` — Displayed simulation year

- **Role / level:** display-only / simulation
- **Unit:** years
- **Availability:** user selected
- **Sources:** None — non-empirical/display only
- **Missingness:** not applicable
- **Leakage risk:** exclude from all inference
- **Current model mapping:** selectedYear
- **Status:** non-empirical
