# Empirical Validation Status

**Generated:** 2026-10-09  
**Overall:** L1 ACHIEVED; L2 IN PROGRESS  
**Forecast claims authorized:** NO

> A blocked phase is a successful gate outcome when required evidence is absent. It prevents unsupported claims.

## Phase summary

| Phase | Name | Status | Gate |
|---:|---|---|---|
| 0 | Claim contract and terminology | COMPLETE | GATE 0: PASS |
| 1 | Variable and default justification | COMPLETE | GATE 1: PASS |
| 2 | Source anchoring | IN PROGRESS | GATE 2: OPEN |
| 3 | Identifier and measurement alignment | PARTIAL | GATE 3: OPEN |
| 4 | Historical plausibility checks | PARTIAL | GATE 4: OPEN |
| 5 | Scenario, uncertainty, and sensitivity | PARTIAL | GATE 5: L1 PASS / L2 OPEN |
| 6 | Network and institutional structure | PARTIAL | GATE 6: OPEN |
| 7 | Adoption and implementation | PARTIAL | GATE 7: L1 PASS / L2 OPEN |
| 8 | Comparative Institution cases | BLOCKED | GATE 8: OPTIONAL FOR L1 / BLOCKED FOR L2 |
| 9 | Reproducibility, review, and publication | DRAFT | L1 INTERNAL PASS / EXTERNAL REVIEW PENDING |

## Phase 0 — Claim contract and terminology

**Status:** COMPLETE  
**Gate:** GATE 0: PASS

### Evidence

- 7 falsifiable hypotheses, 9 outcomes, and 3 causal diagrams
- Institution/Apex Institution terminology and non-goals frozen

### Blockers

- None

## Phase 1 — Variable and default justification

**Status:** COMPLETE  
**Gate:** GATE 1: PASS

### Evidence

- 14 active defaults and 9 hidden constants have evidence tiers, rationales, derivations, and sources
- Model/default drift test passing

### Blockers

- None

## Phase 2 — Source anchoring

**Status:** IN PROGRESS  
**Gate:** GATE 2: OPEN

### Evidence

- COW membership: 17,512 state-year rows
- MID: 2,436 disputes through 2014
- Alliances: 9,349 state-year rows through 2012
- WDI: 14,322 rows across 6 indicators
- WGI 2026: 5,696 rows across six governance dimensions
- Intra-State War: 408 wars and 1,191 state-year exposures through 2014

### Blockers

- UCDP, V-Dem, debt, inequality, and additional innovation/adoption sources pending
- Row-level redistribution terms remain source-specific

## Phase 3 — Identifier and measurement alignment

**Status:** PARTIAL  
**Gate:** GATE 3: OPEN

### Evidence

- COW candidates: 193 provisional and 2 unresolved
- WDI complete-case PCA: 1,847 rows across 135 countries/economies
- Provisional COW–WDI–WGI panel: 3,512 rows, 970 complete cases, 187 Institutions

### Blockers

- No external identifier mapping independently verified
- Historical predecessors/successors unresolved
- Complete-case PCA is selection-biased

## Phase 4 — Historical plausibility checks

**Status:** PARTIAL  
**Gate:** GATE 4: OPEN

### Evidence

- Kaplan–Meier baseline for 244 COW membership spells
- Six rolling constant-hazard tests; all lose to no-exit null
- All 49 COW exits have observable timing categories; causal labels remain unreviewed
- Alliance/MID associations are weak
- Seven-model descriptive diagnostic over 15,525 chronological Institution-years; it tests COW exits, not the novel AI mechanism
- The richer full-wave exit analogue loses to constant hazard; historical prediction is not treated as validation of the future model
- Conflict-path full model AUC 0.735 on one held-out split

### Blockers

- Only 1 membership exit exists in the 1996–2014 common panel versus 120 screening events required
- 49 full-history COW exit causes still require historical review
- Conflict benchmark predicts MID onset, not institutional transition
- Bipolar persistence, natural terminal-transition duration, and additional adoption proxies remain untested

## Phase 5 — Scenario, uncertainty, and sensitivity

**Status:** PARTIAL  
**Gate:** GATE 5: L1 PASS / L2 OPEN

### Evidence

- 12 archetypes and 768 seeded variants
- 11 fixed model-challenge scenarios
- Target-five stress presets with 225 starting Institutions: high-intensity median 2029 and slow-preset median 6065
- 40,000 seeded Latin-hypercube runs across 4 profiles
- COW-centered ensemble reaches five in 76.4% of runs; 23.6% right-censored
- 40 gross/durable wave specifications; gross mean range 9.2%–29.2%
- Four leave-one-major-wave-out calibrations range from 12.0% to 20.1%
- Synthetic PCA, rank sensitivity, and non-convergence cases
- One-at-a-time, Morris-style, 81-cell phase-map, 25-cell economics, and conditional observability diagnostics
- Four major COW exit waves average 15.9% gross loss; rounded sovereign default is 15%
- Secondary aircraft midpoint produces 187-year conditional dominance
- 2,000-sample bootstrap for crude exit hazard

### Blockers

- Sobol interaction indices and empirical distributions remain pending
- COW wave taxonomy remains gross and historically unreviewed; L2 causal calibration is incomplete
- Clustered-gap arrivals and beta-binomial wave severity are implemented; entity/network dependence and competing-risk models remain deferred
- Monte Carlo v1.4 samples parameters independently; copula parameter correlations and entity-specific process effects remain deferred
- GDP/revenue display weighting is implemented; outcome hazards, terminal-rule robustness, and separate state/corporate mechanisms remain high-priority work

## Phase 6 — Network and institutional structure

**Status:** PARTIAL  
**Gate:** GATE 6: OPEN

### Evidence

- 148,258 directed alliance-year records
- 197 annual network snapshots
- Trend-aware alliance/MID diagnostic

### Blockers

- Trade, finance, ownership, platform, and infrastructure layers pending
- Alliance coverage ends in 2012

## Phase 7 — Adoption and implementation

**Status:** PARTIAL  
**Gate:** GATE 7: L1 PASS / L2 OPEN

### Evidence

- IFRS-derived 7% proxy
- Cohort implementation and formal/effective distinction
- Sensitivity range exposed

### Blockers

- Two additional standards-adoption proxies required for L2

## Phase 8 — Comparative Institution cases

**Status:** BLOCKED  
**Gate:** GATE 8: OPTIONAL FOR L1 / BLOCKED FOR L2

### Evidence

- Current 30-company illustration exists

### Blockers

- No reviewed comparative cases
- No historical corporate population; survivor bias remains severe

## Phase 9 — Reproducibility, review, and publication

**Status:** DRAFT  
**Gate:** L1 INTERNAL PASS / EXTERNAL REVIEW PENDING

### Evidence

- Draft model card
- Versioned contracts, checksums, automated tests, and evidence-linked webpage
- Forecast claims disabled

### Blockers

- Domain and statistical review pending
- Reproducibility snapshot not archived
- L2/L3 language not authorized

## Next actions

1. Investigate why the production prior has best held-out log loss while underpredicting observed exits
2. Extend GDP/revenue display weighting into tested outcome hazards and alternative terminal-resolution rules
3. Separate sovereign and corporate event mechanisms and replace the GDP/revenue heuristic with type-specific power models
4. Retain manual review of 49 COW exits and an unconditional-surrender registry as later L2 opportunities
5. Compare two additional standards-adoption proxies with IFRS

## Claim policy

Until the final gate passes, dates and probabilities produced by the model remain scenario outputs—not forecasts.
