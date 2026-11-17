# Empirical Validation Plan

**Project:** Institutional Agents  
**Date:** October 6, 2026  
**Status:** In progress — Phase 0 complete; Phase 1 scaffolded  
**Current maturity:** Exploratory synthetic model; not empirically calibrated

## Objective

Build evidence for—or against—the institutional convergence framework through falsifiable hypotheses, versioned real-world data, out-of-sample prediction, model comparison, uncertainty analysis, and reproducible reporting.

The objective is not to prove that an Apex Institution must emerge. It is to determine:

1. whether the proposed variables can be measured;
2. whether they predict institutional transitions;
3. whether the model outperforms simpler alternatives;
4. whether conclusions survive uncertainty and alternate definitions; and
5. which assumptions should be rejected.

## Guiding rules

- Separate state, corporate, and cross-type mechanisms until evidence supports combining them.
- Never treat synthetic scenario frequencies as real-world probabilities.
- Preserve right-censoring; do not convert non-events into observed 5,000-year events.
- Fit models on one period and evaluate them on later, unseen periods.
- Benchmark every complex model against a simple null model.
- Version every dataset, transformation, and entity crosswalk.
- Publish negative and unstable results.
- Add complexity only after the preceding phase passes its decision gate.
- Existing research may justify variable inclusion and exploratory defaults through declared evidence tiers; original analysis is reserved for predictive, causal, and representativeness claims.

## Core falsifiable hypotheses

| ID | Hypothesis | Evidence against it |
|---|---|---|
| H1 | Debt, inequality, and internal disorder increase fragmentation or loss-of-control hazard. | Effects are absent, unstable, reverse sign, or add no out-of-sample value. |
| H2 | Relative productive and financial strength predicts which Institution gains influence during restructuring. | Relative strength performs no better than size, chance, or a constant baseline. |
| H3 | Formal consolidation precedes effective standard implementation by a measurable adoption lag. | Adoption is immediate, unrelated to transition type, or not distinguishable from reporting delay. |
| H4 | Final Institutions become comparatively balanced, and influence above 50% is short-lived before terminal consolidation or reversal. | Long-lived 51–99% arrangements are common and stable. |
| H5 | Technical standardization can advance without political or institutional consolidation. | Technical convergence consistently and rapidly produces common top-level authority. |
| H6 | Big Cycle variables improve transition prediction beyond simpler power-transition and debt-only models. | Simpler models equal or outperform the Big Cycle/full model out of sample. |
| H7 | Network dependency predicts consolidation better than direct size alone. | Alliance, trade, ownership, and infrastructure networks add no predictive value. |

---

# Phase 0 — Research contract and falsifiability

**Implementation status:** COMPLETE — Gate A passes (`docs/PHASE_0_REPORT.md`).  
**Estimated effort:** 3–5 working days  
**Purpose:** Prevent retrospective redefinition of success.

## Tasks

1. Freeze version 1 research questions and hypotheses.
2. Define the units of analysis:
   - state-year;
   - state-dyad-year;
   - corporation-year;
   - corporation-pair-year;
   - institutional-transition event.
3. Define outcomes before inspecting results:
   - remains independent;
   - consolidates another Institution;
   - joins as a peer;
   - loses top-level autonomy;
   - fragments;
   - fails or dissolves;
   - adopts a standard;
   - reverses adoption.
4. Define prediction horizons: 1, 5, 10, 25, and 50 years where data permits.
5. Draw causal diagrams separating proposed causes, mediators, outcomes, and confounders.
6. Define the terminal-majority claim precisely:
   - measurement of influence;
   - start and end of a majority episode;
   - permitted duration above 50%;
   - reversal criteria.
7. Establish data inclusion, exclusion, missingness, and revision rules.
8. Record which findings would cause each mechanism to be removed.

## Deliverables

- `docs/HYPOTHESIS_REGISTRY.md`
- `docs/VARIABLE_DICTIONARY.md`
- `docs/CAUSAL_DIAGRAMS.md`
- `docs/DATA_GOVERNANCE.md`
- Preregistered analysis specification or timestamped internal equivalent

## Acceptance gate A

Proceed only when every headline claim has:

- an observable outcome;
- a declared time horizon;
- a falsification condition;
- an evaluation metric; and
- a named data source or a documented evidence gap.

---

# Phase 1 — State-system data foundation

**Implementation status:** IN PROGRESS — COW membership, MID, and alliance sources plus a six-indicator WDI snapshot are ingested locally. Crosswalks remain unreviewed; UCDP, V-Dem, WGI, debt, inequality, and other sources remain pending.  
**Estimated effort:** 2–4 weeks  
**Purpose:** Create the first defensible empirical panel before adding corporations.

## Initial scope

Use the broadest common period supported by the selected variables. A likely high-coverage panel begins in the 1990s because WGI begins in 1996, although longer historical subsets can be built from COW, UCDP, GDP, population, and military data.

## Candidate sources

| Domain | Source |
|---|---|
| State entry and exit | Correlates of War State System Membership |
| Interstate and intrastate conflict | UCDP and COW Militarized Interstate Disputes |
| GDP, population, education, trade | World Bank World Development Indicators |
| Governance and stability | V-Dem and Worldwide Governance Indicators |
| Debt and credit | IMF Global Debt Database and BIS statistics |
| Inequality | World Inequality Database |
| Innovation | WIPO Global Innovation Index and patent data |
| Military capability | SIPRI and COW National Material Capabilities |
| Reserve currency | IMF COFER |
| Disasters and external shocks | EM-DAT or equivalent versioned disaster data |

## Tasks

1. Create a canonical Institution identifier and country-code crosswalk:
   - COW codes;
   - ISO codes;
   - World Bank codes;
   - UCDP/Gleditsch-Ward codes;
   - historical predecessor and successor relationships.
2. Preserve source-native values before normalization.
3. Store provenance for every field:
   - source;
   - version;
   - download date;
   - license;
   - transformation;
   - imputation status.
4. Build annual state-level measures.
5. Build dyadic relative-strength and dependency measures.
6. Code transition events independently of predictor variables.
7. Produce missingness maps and coverage tables.
8. Prohibit leakage from revised future data into historical prediction windows where possible.

## Deliverables

- `data/catalog.yml`
- `data/crosswalks/institution-identifiers.csv`
- `data/processed/state_year.parquet`
- `data/processed/state_dyad_year.parquet`
- `data/processed/state_transitions.parquet`
- `reports/DATA_QUALITY_REPORT.md`
- Automated schema, range, uniqueness, and temporal-integrity tests

## Acceptance gate B

Proceed when:

- identifiers are unique and historically valid;
- transition outcomes have independent review;
- missingness is quantified by country and year;
- no predictor uses information unavailable at prediction time;
- at least one useful training and held-out period exists; and
- all licenses permit the intended analysis.

---

# Phase 2 — Measurement and Big Cycle construct testing

**Implementation status:** PARTIAL — six-variable WDI PCA uses 1,847 complete cases across 135 countries/economies with high early/late loading similarity; selection bias and missing dimensions keep Gate C open.  
**Estimated effort:** 1–2 weeks  
**Purpose:** Determine whether Dalio-style variables form coherent and temporally ordered constructs.

## Analyses

1. Descriptive distributions and time trends.
2. Correlation and missingness structure.
3. Empirical PCA on observed variables.
4. Exploratory factor analysis.
5. Confirmatory factor analysis for proposed strength and stress factors.
6. Dynamic factor models for changing latent strength.
7. Measurement invariance across:
   - historical periods;
   - regions;
   - income levels;
   - democratic and authoritarian regimes.
8. Lead-lag and proposed-sequence tests:
   - cross-correlation;
   - distributed-lag models;
   - vector autoregression;
   - Granger-predictive tests;
   - change-point analysis.
9. Compare a single Big Cycle score against separate dimensions.

## Required comparisons

```text
one composite factor
versus
two factors: productive strength + systemic stress
versus
unaggregated observed dimensions
```

## Deliverables

- `reports/MEASUREMENT_MODEL.md`
- Factor loadings with uncertainty
- Cross-period invariance results
- Lead-lag matrix
- Revised or rejected composite definitions

## Acceptance gate C

- If one stable factor is supported, retain a composite.
- If multiple factors are supported, keep them separate.
- If loadings are unstable or invariance fails, do not use a universal Big Cycle score.
- If the predicted sequence is not observed, remove the sequence assumption while retaining any individually useful variables.

---

# Phase 3 — Event-history and competing-risk models

**Implementation status:** PARTIAL — Kaplan–Meier membership survival and crude hazard baseline implemented; transition-cause competing risks pending.  
**Estimated effort:** 2–3 weeks  
**Purpose:** Estimate transition hazards while preserving censoring and alternate outcomes.

## Event model

Each Institution can transition among states:

```text
independent
→ consolidated peer
→ subordinate member
→ dominant Institution
→ fragmented successors
→ dissolved or replaced
```

## Analyses

1. Kaplan–Meier and cumulative-incidence curves.
2. Cox proportional-hazard models.
3. Proportional-hazard diagnostics.
4. Weibull/log-normal accelerated failure-time models.
5. Fine–Gray competing-risk models.
6. Multi-state transition models.
7. Time-varying covariates and lagged predictors.
8. Hierarchical effects for region and historical period.
9. Explicit reversal and re-entry hazards.

## Evaluation

- Concordance index
- Time-dependent Brier score
- Integrated calibration index
- Calibration curves by horizon
- Log likelihood and information criteria
- Prediction-interval coverage

## Deliverables

- `models/state_transition_survival/`
- `reports/STATE_EVENT_HISTORY.md`
- Reproducible coefficient and diagnostic tables
- Baseline hazard and competing-risk estimates

## Acceptance gate D

Proceed only if effects are sufficiently stable across folds and periods and predictions are calibrated. Violations of proportional hazards must be modeled rather than ignored.

---

# Phase 4 — Baseline comparison and out-of-sample backtesting

**Implementation status:** PARTIAL — six rolling-origin constant-hazard tests implemented; the model loses to the no-exit null in every current window.  
**Estimated effort:** 2 weeks  
**Purpose:** Determine whether model complexity earns predictive value.

## Competing models

1. Constant-hazard null
2. Historical-frequency baseline
3. Size/GDP only
4. Relative material power only
5. Debt stress only
6. Governance/internal disorder only
7. Network centrality only
8. Power-transition model
9. Big Cycle composite
10. Full institutional model

## Backtesting design

Use rolling-origin evaluation:

```text
train through year t
predict t+1 through t+h
advance t
repeat
```

Never select variables or tune coefficients on the final test interval.

## Metrics

- Out-of-sample log score
- Brier score
- Area under precision-recall curve for rare events
- Calibration slope and intercept
- Concordance index
- Timing error
- State-count trajectory error

## Deliverables

- `reports/MODEL_COMPARISON.md`
- Rolling backtest dashboard
- Diebold–Mariano or bootstrap comparisons where appropriate
- Explicit list of mechanisms that failed to add value

## Acceptance gate E

The full model advances only if it improves out-of-sample calibration or prediction over simpler baselines by a preregistered margin. Otherwise retain the simpler model.

---

# Phase 5 — Networks, dependency, and concentration

**Implementation status:** PARTIAL — formal-alliance state/system network features and a 197-year alliance/MID diagnostic exist; trade, finance, infrastructure, and causal models are pending.  
**Estimated effort:** 2–4 weeks  
**Purpose:** Replace synthetic balanced grouping with observed institutional relationships.

## Network layers

- Alliances
- Bilateral trade
- Financial exposure
- Ownership and investment
- Treaties and international organizations
- Cloud and platform dependencies
- Semiconductor and supply-chain dependencies
- Shared technical standards
- Geographic adjacency

## Analyses

1. Degree, eigenvector, and betweenness centrality.
2. Core-periphery structure.
3. Community detection with stability checks.
4. Dependency asymmetry.
5. Multiplex centrality.
6. Percolation and cascade thresholds.
7. Coalition power and blocking sets.
8. Duration of observed 51–99% concentration episodes.
9. Direct test of the terminal-majority assumption.

## Deliverables

- Versioned network snapshots
- `reports/NETWORK_CONCENTRATION.md`
- Observed bloc assignments with uncertainty
- Majority-duration and reversal analysis

## Acceptance gate F

Retain terminal majority only if observed majority states are usually brief relative to the modeled time scale. Otherwise add a persistent hegemonic state between pluralism and terminal consolidation.

---

# Phase 6 — Bayesian calibration and global uncertainty

**Implementation status:** PARTIAL — deterministic 2,000-sample bootstrap interval implemented for the COW crude exit hazard; calibrated likelihood pending.  
**Estimated effort:** 2–3 weeks  
**Purpose:** Replace fixed coefficients with estimated distributions and expose identifiability limits.

## Analyses

1. Bayesian hierarchical calibration.
2. Posterior predictive checks.
3. Prior-sensitivity analysis.
4. Approximate Bayesian computation if likelihoods are impractical.
5. Sobol global sensitivity indices.
6. Morris screening before expensive analysis.
7. Partial rank correlations.
8. Parameter-identifiability and posterior-correlation analysis.
9. Structural uncertainty across alternate equations.
10. Convergence diagnostics and simulation-based calibration.

## Required outputs

- Probability of each transition by horizon
- Median and 5th–95th percentile timing
- Probability of no dominance
- Probability of reversal after dominance
- Sensitivity contribution by input and interaction
- Parameters that cannot be identified from available data

## Acceptance gate G

Do not publish a central date when uncertainty is unbounded, multimodal, or dominated by arbitrary priors. Report “not identifiable” where appropriate.

---

# Phase 7 — Corporate Institution study

**Estimated effort:** 3–5 weeks  
**Purpose:** Build a separate evidence base for corporations before combining them with states.

## Required population

Include historical entrants, failed firms, acquired firms, spin-offs, formerly dominant firms, and private firms where data permits. Today's top 30 alone would create severe survivor bias.

## Outcomes

- Merger
- Acquisition
- Spin-off
- Divestiture
- Bankruptcy/failure
- Platform dependency
- Standard adoption
- Regulatory breakup
- Nationalization or state control

## Predictors

- Revenue and market share
- Profitability and debt
- R&D and patents
- Compute and data control
- Ownership concentration
- Leadership succession
- Platform/network effects
- Regulatory exposure
- Geographic and supply-chain dependence

## Analyses

Repeat Phases 2–6 using corporate-appropriate outcomes and data. Do not reuse state coefficients.

## Deliverables

- `data/processed/corporation_year.parquet`
- `data/processed/corporate_transitions.parquet`
- `reports/CORPORATE_EVENT_HISTORY.md`
- State-versus-corporate coefficient comparison

## Acceptance gate H

Combine state and corporate agents only after demonstrating which transition mechanisms are shared and which require type-specific parameters.

---

# Phase 8 — Cross-type integration and historical simulation

**Estimated effort:** 3–5 weeks  
**Purpose:** Test state–corporate interactions and the full institutional framework.

## Cross-type transitions

```text
state regulates corporation
state nationalizes corporation
corporation captures regulatory policy
state delegates infrastructure
corporation becomes indispensable platform
corporate standard becomes public infrastructure
state breaks up or excludes corporation
mixed institution forms
```

## Analyses

1. Multi-layer state–corporate networks.
2. Type-specific transition matrices.
3. Agent-based simulation with empirically estimated hazards.
4. Historical replay from multiple starting years.
5. Case-study process tracing for surprising successes and failures.
6. Rolling out-of-sample forecasts.
7. Counterfactual stress tests.
8. Distribution-shift tests across historical eras.

## Deliverables

- Integrated calibrated simulator
- `reports/HISTORICAL_HINDCASTS.md`
- Case-study appendix
- Prediction and calibration dashboard
- Documented model failures

## Acceptance gate I

The integrated model must outperform separate state-only and corporate-only baselines on preregistered tasks. If it does not, retain separate models.

---

# Phase 9 — Publication, audit, and controlled claims

**Implementation status:** DRAFT — model card and generated status report exist; final gate fails and forecast claims are unauthorized.  
**Estimated effort:** 1–2 weeks  
**Purpose:** Make every public statement traceable to evidence and uncertainty.

## Tasks

1. Create a model card covering intended use, non-use, data, assumptions, and limitations.
2. Publish data provenance and transformation logs.
3. Add confidence intervals and reach probabilities to the webpage.
4. Replace synthetic PCA displays with separate synthetic and empirical tabs.
5. Mark every result:
   - observed;
   - estimated;
   - simulated;
   - author-defined;
   - not identifiable.
6. Conduct statistical, domain, and adversarial review.
7. Reproduce results from a clean environment.
8. Archive exact code, data versions, outputs, and random seeds.

## Deliverables

- `MODEL_CARD.md`
- Reproducibility bundle
- External-review response log
- Publication-ready paper and appendix
- Updated reference ledger

## Final credibility gate

A forecasting claim is allowed only when:

- its target and horizon were defined in advance;
- it was evaluated out of sample;
- it beats a declared simple baseline;
- calibration is acceptable;
- uncertainty is reported;
- data leakage and survivor bias were assessed;
- alternate definitions do not reverse the conclusion; and
- the result can be reproduced independently.

---

# Recommended immediate execution order

## Sprint 1

1. Complete Phase 0 hypothesis and variable registry.
2. Build the COW/UCDP/World Bank/V-Dem identifier crosswalk.
3. Define the state transition event taxonomy.
4. Create data quality and leakage tests.

## Sprint 2

1. Assemble the state-year panel.
2. Run empirical PCA/factor analysis.
3. Test whether strength and stress are stable constructs.
4. Decide whether to retain, split, or reject the Big Cycle composite.

## Sprint 3

1. Build competing-risk survival models.
2. Establish null and simple baselines.
3. Run rolling backtests.
4. Stop and simplify if the full model does not add predictive value.

## Sprint 4

1. Add empirical network layers.
2. Test the equal-final-Institution and terminal-majority assumptions.
3. Add Bayesian calibration and global sensitivity.
4. Report probability distributions rather than a single date.

Corporate and cross-type work should begin only after the state-only pipeline is stable and reproducible.
