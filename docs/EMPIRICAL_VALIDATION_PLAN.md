# Validation Plan v2 — Practical Evidence and Claim Levels

**Project:** Institutional Agents  
**Version:** 2.0  
**Date:** October 6, 2026  
**Status:** Active  
**Prior plan:** [`archive/EMPIRICAL_VALIDATION_PLAN_V1.md`](archive/EMPIRICAL_VALIDATION_PLAN_V1.md)

## Purpose

Give the model enough credibility for its intended claim level without unnecessarily reproducing existing research. The project does not need to reproduce original research merely to justify a variable or exploratory default. Published research, public datasets, and analogous real-world processes may justify variable selection and exploratory defaults. New original analysis is required only when the project makes predictive, causal, or representativeness claims.

The goal is not to prove that one Apex Institution must emerge. It is to make every assumption traceable, test model behavior, compare outputs with observed history where practical, and state exactly what the evidence supports.

## Claim levels

| Level | Permitted claims | Required evidence | Current status |
|---|---|---|---|
| **L0 — Conceptual** | “This is a coherent thought experiment.” | Definitions, equations, internal consistency | Achieved |
| **L1 — Sourced exploratory** | “These variables and ranges have reasonable real-world analogues.” | References, default rationales, evidence tiers, scenarios, sensitivity, limitations | Achieved |
| **L2 — Empirically anchored** | “Parts of the model reproduce or align with observed institutional patterns.” | Versioned source snapshots, reviewed mappings, empirical spot checks, historical plausibility | In progress |
| **L3 — Predictive** | “The model estimates probabilities or timing for unseen events.” | Out-of-sample calibration, competing risks, uncertainty, model comparison, external review | Not authorized |

The paper can proceed at L1 if it consistently identifies the work as a framework or scenario model. It does not need L3 unless it publishes real-world forecast dates or probabilities.

## Evidence tiers for defaults

| Tier | Meaning | Acceptable for L1? |
|---|---|---:|
| A | Direct observed anchor | Yes |
| B | Existing literature value or timescale | Yes |
| C | Calculation from an analogous proxy | Yes, with limitations and sensitivity |
| D | Transparent scenario convention | Yes, if labeled and sensitivity-tested |
| N | Neutral normalization point | Yes |
| E | Display or analysis setting | Yes |

A citation justifies considering a variable. It does not automatically validate the equation connecting it to an outcome.

## Practical validation rules

1. Pull and cite existing information rather than reproducing source research.
2. Preserve source versions, URLs, dates, and checksums when data is downloaded.
3. Label direct observations, literature values, proxies, and conventions differently.
4. Require sensitivity analysis for proxy and conventional defaults.
5. Use empirical analysis selectively to test the model’s distinctive claims.
6. Keep synthetic scenario frequencies separate from observed probabilities.
7. Do not claim causality from correlation or PCA.
8. Preserve negative results.
9. Keep forecasting claims disabled unless L3 requirements are met.
10. Prefer a simple justified model over an elaborate underidentified one.

---

# Phase 0 — Claim contract and terminology

**Status:** COMPLETE  
**Target level:** L0

## Purpose

Define exactly what the model says and does not say.

## Completed

- Institution and Apex Institution terminology
- Persistent constituent Institutions
- Approximately equal final Institutions
- No forced terminal transition; bipolar persistence remains possible
- Structural authority versus internal implementation
- Technical adoption versus political authority
- Right-censoring and non-convergence semantics
- Seven falsifiable hypotheses and nine outcomes

## Deliverables

- `research/analysis-contract.v1.json`
- `docs/HYPOTHESIS_REGISTRY.md`
- `docs/INSTITUTIONAL_SINGULARITY.md`
- `docs/CAUSAL_DIAGRAMS.md`

## Gate 0 — PASS

Every headline concept has a definition, non-goal, outcome, and falsification condition.

---

# Phase 1 — Variable and default justification

**Status:** COMPLETE  
**Target level:** L1

## Purpose

Explain why each variable exists and why each initial value was selected without claiming every value was newly estimated.

## Completed

- All 14 active defaults registered
- Nine hidden constants disclosed, including mandatory observability, detected-concealment remediation, permanent independence loss after unconditional defeat, and the 5× acceleration ceiling
- Evidence tier, confidence, rationale, derivation, and source for each
- Model/default consistency test
- Hover/focus evidence in the webpage

## Current examples

- 225 Institutions: UN count plus declared corporate scope
- 25-year interval: Dalio phase-timescale heuristic, not empirical war frequency
- 15% qualifying share: COW fatal-dispute prevalence proxy
- 15% Institution event probability: rounded COW major-wave center, with a 9.2%–29.2% definition-sensitivity envelope
- 7% adoption: IFRS diffusion proxy
- 50% economic strength/stress: neutral normalization
- 15% architecture spread: conservative diffusion scenario

## Deliverables

- `research/defaults-rationale.v1.json`
- `docs/DEFAULT_VALUES.md`
- `docs/CALIBRATION_POLICY.md`
- `web/default-rationales.mjs`

## Gate 1 — PASS

All current defaults have traceable rationales. Tier C and D values require sensitivity testing, not new source studies.

---

# Phase 2 — Source anchoring

**Status:** IN PROGRESS  
**Target level:** L2

## Purpose

Pull existing authoritative data needed to anchor the model’s major dimensions. This phase is ingestion and provenance work, not original research.

## Completed sources

- COW State System Membership v2024
- COW MID v5.0
- COW Formal Alliances v4.1
- World Bank WDI six-indicator snapshot
- World Bank WGI 2026 official workbook with six governance dimensions
- Provisional 187-Institution COW–WDI–WGI–MID common panel

## Current outputs

- 244 state membership spells
- 17,512 COW state-year rows
- 2,436 disputes and 5,883 participants
- 9,349 alliance state-year rows
- 14,322 WDI country-year rows
- Checksums, source manifests, license decisions, and missingness

## Remaining priority pulls

1. UCDP conflict data for recent and internal conflict
2. V-Dem governance and polarization indicators
3. WGI government effectiveness and political stability
4. Debt data from IMF/BIS
5. Inequality data from WID
6. WIPO innovation indicators
7. SIPRI/NMC material power where needed
8. Alternative standards-adoption histories

## Gate 2

Pass for L2 when the source panel covers at least one productive-strength dimension, one stress dimension, conflict, governance, and transition outcomes over a common usable period. Full source coverage is not required.

---

# Phase 3 — Identifier and measurement alignment

**Status:** PARTIAL  
**Target level:** L2

## Purpose

Make unlike sources comparable without pretending names and codes automatically refer to the same historical Institution.

## Completed

- Canonical 195-row state seed
- 193 COW candidates and two unresolved observer states
- 188 WDI candidates and seven unresolved names
- No automatic verified mappings
- Crosswalk schema and review states
- WDI complete-case PCA on 1,847 rows across 135 countries/economies

## Required next work

- Review 187 common-panel source-code mappings
- Add historical predecessor/successor identities
- Resolve state interruptions and name changes
- Choose common analysis period
- Quantify source overlap and missingness
- Decide whether productive strength is one factor or multiple dimensions

## Gate 3

A working L2 panel requires reviewed mappings for included Institutions and explicit exclusions for unresolved identities. The current provisional panel has 3,512 rows and 970 complete cases, but only one membership exit during 1996–2014; confirmatory transition prediction remains blocked. Universal coverage is unnecessary if the analyzed sample is disclosed.

---

# Phase 4 — Historical plausibility checks

**Status:** PARTIAL  
**Target level:** L2

## Purpose

Check whether model assumptions have recognizable historical analogues and whether simple baselines expose obvious failures.

## Completed

- Kaplan–Meier survival for COW membership spells
- Observable timing taxonomy for all 49 COW exits; causal labels remain unreviewed
- Provisional next-year MID benchmark comparing null, size, economic, governance, and full models
- Crude annual exit hazard and bootstrap interval
- Six rolling 10-year constant-hazard tests
- Alliance/MID level, first-difference, and next-year diagnostics
- Explicit zero-conflict years

## Current findings

- COW crude annual membership-exit hazard: approximately 0.282%
- Bootstrap 95% interval: approximately 0.208%–0.368%
- Constant-hazard model loses to the no-exit null in all six windows
- Alliance/conflict first-difference associations are weak
- Full economic+governance MID-onset model improves over null on one split (AUC 0.735), but underpredicts test prevalence and does not test institutional transitions

These negative findings increase credibility because they prevent weak baselines from being presented as successful theories.

## Remaining distinctive checks

- Duration of historical influence above 50%
- Frequency of consolidation versus fragmentation events
- Lag from formal standard adoption to implementation
- Whether technical convergence occurs without common authority
- Whether high stress predicts transition after controlling for basic size and period

## Gate 4

Pass when each distinctive model mechanism has at least one literature reference or observed historical spot check and contradictions are documented.

---

# Phase 5 — Scenario, uncertainty, and sensitivity

**Status:** PARTIAL  
**Target level:** L1 now; L2 after empirical anchoring

## Completed

- 12 scenario archetypes
- 768 deterministic variants
- Synthetic PCA
- Rank sensitivity
- One-at-a-time default analysis
- Morris-style global screening
- 81-cell consolidation/fragmentation map
- 25-cell economics surface
- Observability counterfactual
- Ten fixed model-challenge scenarios
- 40 gross/durable COW wave-definition specifications
- Four leave-one-major-wave-out calibrations
- Seven-model rolling-origin COW exit comparison
- Target-five boundary, one-at-a-time, and interaction-grid analysis
- Four-profile, 40,000-run independent Latin-hypercube parameter-uncertainty analysis
- Right-censored timing summaries, restricted means, terminal bands, convergence, and Spearman sensitivity
- Non-convergence cases
- Economics rise/decline scenarios
- Exact default/model consistency

## Required next work

- Sobol indices for dominant interactions
- Empirical calibration of distribution widths around Tier C and D defaults
- Correlated parameter ensembles with visible, justified correlation assumptions
- Stochastic Institution-level wave outcomes and event arrivals
- Scenario comparisons with and without the Big Cycle layer
- Structural alternatives to the terminal-majority rule

## Gate 5

For L1, pass when conclusions are shown across plausible ranges and arbitrary defaults do not remain hidden. For L3, global uncertainty must use calibrated distributions.

---

# Phase 6 — Network and institutional structure

**Status:** PARTIAL  
**Target level:** L2

## Completed

- COW alliance network ingestion
- Density, component, degree, and concentration measures
- Descriptive alliance/MID diagnostic
- Balanced synthetic Institution assignments

## Required next work

- Trade and financial dependency layers
- Current alliance or treaty coverage after 2012
- Corporate ownership/platform dependencies
- Network centrality mapped to institutional influence
- Coalition blocking-power calculation
- Direct test of equal-final-Institution assumption

## Gate 6

Pass when at least two independent network layers produce stable and interpretable influence measures. A complete global multiplex network is not required for conceptual publication.

---

# Phase 7 — Adoption and implementation

**Status:** PARTIAL  
**Target level:** L1/L2

## Completed

- IFRS-derived 7% proxy
- Formal versus effective adoption distinction
- Cohort implementation model
- Implementation-delay effect on Apex dominance

## Remaining comparisons

- ISO 9001 or ISO 27001
- ISO 20022
- IPv6
- HTTPS
- ERP or regulatory implementation timelines

## Gate 7

For L1, one well-documented proxy plus sensitivity is sufficient and currently passes. For L2, compare at least three materially different standards and fit a rate range rather than one value.

---

# Phase 8 — Comparative Institution cases

**Status:** BLOCKED FOR L2; OPTIONAL FOR L1  
**Target level:** L2/L3

## Purpose

Test whether state and corporate Institutions share mechanisms or require separate models.

## Practical scope

Use a small number of documented cases before building a comprehensive corporate history:

- State federation or dissolution
- Corporate acquisition and spin-off
- Platform standardization
- Financial/payment network adoption
- Institution surviving while losing top-level autonomy

A current top-30 list can illustrate scope but cannot estimate transition rates because it excludes failures and acquired firms.

## Gate 8

For conceptual publication, clearly labeled case comparisons are sufficient. Predictive integration requires a historical corporate population with entrants, failures, acquisitions, and spin-offs.

---

# Phase 9 — Reproducibility, review, and publication

**Status:** DRAFT  
**Target level:** Selected claim level

## Completed

- Draft model card
- Generated validation status
- Versioned contracts and checksums
- Automated ingestion and analysis tests
- Explicit forecast prohibition
- Evidence-linked webpage

## Required for L1 publication

- Update paper terminology and equations
- Include the default-rationale table
- Include synthetic scenario limitations
- Include empirical spot checks and negative findings
- Obtain at least one domain review and one statistical review
- Archive a reproducibility snapshot

## Additional requirements for L2

- Reviewed source mappings
- Common-period empirical panel
- Distinctive mechanism spot checks
- Measurement and selection-bias disclosures

## Additional requirements for L3

- Frozen test period
- Out-of-sample model comparison
- Calibration and proper scoring rules
- Competing-risk survival model
- Prediction intervals and no-event probability
- External replication

## Final gate

The publication must state its claim level. Passing L1 does not authorize L2 or L3 language.

---

# Current decision

## Achieved

The project currently qualifies as an **L1 sourced exploratory model**. Its variables and defaults are traceable, its equations are testable, arbitrary values are disclosed, and sensitivity/scenario behavior is visible.

## In progress

L2 empirical anchoring is underway through COW and WDI data, but reviewed cross-source mappings and several stress/governance dimensions remain incomplete.

## Not authorized

Real-world probabilities, dates, causal claims, and predictive assertions remain L3 and are not authorized.

## Immediate next sequence

1. Investigate why the reduced-form production prior has the best held-out log loss while substantially underpredicting exit counts.
2. Treat the 9.2%–29.2% wave-definition envelope as evidence against a precise fixed probability.
3. Extend implemented GDP/revenue display weighting into tested outcome hazards and terminal-resolution rules.
4. Separate sovereign and corporate mechanisms and replace the cross-type heuristic with type-specific power models.
5. Keep manual review of 49 exits and an unconditional-surrender registry as later L2 opportunities.
6. Compare two additional standards-adoption proxies with IFRS.
