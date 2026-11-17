# Execution Plan: Consolidation Visualizer

**Date:** October 6, 2026

## Deliverables

1. **Design and contracts**
   - Document purpose, assumptions, formulas, controls, data flow, and non-goals.
   - Deliverable: `DESIGN.md` and `docs/ARCHITECTURE.md`.

2. **Country baseline**
   - Add 193 UN Member States plus the Holy See and State of Palestine.
   - Validate exactly 195 unique names.
   - Deliverable: `web/countries.mjs`.

3. **Mathematical engine**
   - Implement deterministic event consolidation, logistic architecture diffusion, assignment, and outcome formatting as pure functions.
   - Deliverable: `web/model.mjs`.

4. **Interactive interface**
   - Implement adjustable controls, timeline, play/reset actions, outcome cards, SVG chart, country constellation, and bloc summaries.
   - Deliverables: `web/index.html`, `web/styles.css`, and `web/app.mjs`.

5. **Local operations**
   - Document launch and troubleshooting commands.
   - Deliverable: `docs/OPERATIONS.md` and updated `README.md`.

6. **Automated validation**
   - Test model invariants, known scenarios, data uniqueness, and required page elements.
   - Deliverables: `tests/test-model.mjs` and `tests/smoke_test.py`.

7. **Project records**
   - Record local-only infrastructure and initial feature.
   - Deliverables: `AWS_INVENTORY.md` and `CHANGELOG.md`.

## Acceptance criteria

- Opens locally through Python's standard HTTP server.
- Defaults to 225 institutional agents: 195 country-level entities and 30 technology corporations.
- Every requested variable updates the result immediately.
- Displays “never/no convergence” when fragmentation prevents unification.
- Separately visualizes AI architecture adoption and political consolidation.
- Every country and corporation is assigned exactly once at every timeline position.
- No external dependencies or browser network requests.
- Automated tests and syntax checks pass.

## Revision 2 tasks

1. Add a documented 30-company revenue-led technology baseline.
2. Combine 195 country-level and 30 corporate entities into a 225-agent default.
3. Add internal conflict to the event-transition equation and parameter limits.
4. Expose internal conflict as an adjustable control and URL parameter.
5. Distinguish country and corporate nodes visually and in the inspector.
6. Expand tests for company count, combined uniqueness, internal-fracture arithmetic, and 225-entity assignment.
7. Update architecture, operations, README, and changelog.

## Revision 3 tasks

1. Create a structured reference registry with source type, explanation, and links.
2. Add hover/focus citation cards to every adjustable variable.
3. Cite major assumptions and methods, including equal weighting and synthetic bloc assignment.
4. Render a persistent reference ledger in the webpage.
5. Add and document a prioritized robustness roadmap.
6. Test reference-key integrity, safe external-link attributes, and required tooltip coverage.
7. Update README, architecture, operations, and changelog.

## Revision 4 tasks

1. Define shared state variables for capability, adoption, institutional count, concentration, lock-in, output, and internal conflict.
2. Map the current model to technological singularity, intelligence explosion, singleton, economic singularity, global-brain, and multipolar-services models.
3. Add primary-source references and webpage comparison cards.
4. State explicitly that `S = 1` is not sufficient for a technological singularity or stable singleton.
5. Update project documentation, tests, and changelog.

## Revision 5 tasks

1. Add an adjustable institutional-standard adoption rate (`1–30%`, default `7%`).
2. Derive and document the IFRS jurisdictional-adoption proxy and its limitations.
3. Track each group entering the Apex Institution network as a separate adoption cohort.
4. Calculate effective Apex Institution influence from cohort implementation rather than structural membership alone.
5. Add an enforcement/adoption curve and threshold to the timeline visualization.
6. Add hover references and tests for logistic adoption, cohort accounting, and emergence timing.
7. Update the paper, math model, README, architecture, operations, and changelog.

## Revision 7 tasks

1. Add leading Institution strength, systemic cycle stress, and economic coupling controls.
2. Keep 50% defaults neutral and expose every effective parameter transformation.
3. Connect strength to consolidation capacity and stress to restructuring frequency and internal fracture.
4. Add Dalio primary references and independent WIPO, World Bank, IMF, WID, SIPRI, V-Dem, WGI, and UCDP calibration sources.
5. Add an economics panel showing Dalio determinants, stress channels, and effective values.
6. Test neutral invariance, high/low strength scenarios, clamps, reference coverage, and HTTP rendering.
7. Update the paper, mathematical model, architecture, operations, README, and changelog.

## Revision 8 tasks

1. Define named scenario archetypes spanning stability, ascent, crisis, fragmentation, and technical convergence.
2. Generate 64 seeded perturbations per archetype through the production model.
3. Export a documented scenario CSV with input, adjusted, and outcome variables.
4. Run standardized input PCA and correlate component scores with censored outcomes.
5. Produce JSON, Markdown, and browser-readable result artifacts.
6. Add a local webpage panel for component structure and scenario outcomes.
7. Validate determinism, row counts, PCA orthogonality/explained variance, and static delivery.
8. Update README, architecture, operations, changelog, paper, and mathematical model.

## Revision 9 tasks

1. Remove the adjustable Apex threshold and use a fixed terminal majority rule.
2. Reinterpret the displayed influence as the largest approximately equal institution's share.
3. Collapse projected two-center outcomes directly to one Apex Institution.
4. Build balanced institution assignments and largest-bloc adoption cohorts.
5. Require structural unification plus greater than 50% effective adoption for Apex dominance.
6. Remove the obsolete threshold from archetypes and PCA inputs.
7. Regenerate all 768 scenarios, PCA results, reports, and browser artifacts.
8. Update tests, paper, mathematical model, references, and operations.

## Revision 10: Empirical validation program

The detailed phased plan is maintained in [`docs/EMPIRICAL_VALIDATION_PLAN.md`](docs/EMPIRICAL_VALIDATION_PLAN.md). Execution order is gated:

1. preregister hypotheses and outcomes;
2. build a state-only data foundation;
3. test Big Cycle measurement constructs;
4. estimate competing-risk event models;
5. benchmark and backtest out of sample;
6. add empirical networks;
7. calibrate uncertainty;
8. build a separate corporate study;
9. integrate cross-type transitions; and
10. publish only claims that pass the final credibility gate.


## Revision 11: Phase 0 implementation status

- [x] Freeze version 1 research contract.
- [x] Register 7 falsifiable hypotheses and 9 outcomes.
- [x] Register 42 variables and 21 data sources.
- [x] Generate hypothesis, variable, causal, governance, and Gate A documents.
- [x] Create SHA-256 manifest and independent Gate A validation.
- [x] Scaffold Phase 1 data zones and ten-source ingestion catalog.
- [x] Generate 195 unresolved state identifier rows.
- [ ] Complete source license reviews and version selections.
- [ ] Resolve and independently review external identifiers.
- [ ] Ingest the first COW State System Membership snapshot.


## Revision 14: Validation Plan v2

- [x] Archive the original forecast-grade validation plan as v1.
- [x] Define L0 conceptual, L1 sourced-exploratory, L2 empirically anchored, and L3 predictive claim levels.
- [x] Mark L1 achieved and L2 in progress.
- [x] Accept literature/proxy justification for exploratory defaults.
- [x] Preserve sensitivity requirements for Tier C/D values.
- [x] Rebuild the generated phase-status dashboard.
- [ ] Complete L2 source alignment and historical spot checks.
- [ ] Keep L3 forecast claims disabled until predictive gates pass.

## Revision 15: L2 analysis tasks

- [x] Cache and checksum six official WGI workbook dimensions.
- [x] Build WGI state-year panel and unreviewed mapping candidates.
- [x] Build provisional COW–WDI–WGI state-year panel with zero MID years.
- [x] Quantify event support and missingness for L2 outcomes.
- [x] Run economic/governance empirical PCA and period-stability checks.
- [x] Enforce minimum-event gate before predictive modeling.
- [x] Update validation status, model card, operations, and tests.


## Revision 16: Apex observability assumption

- [x] Define mandatory data, application, infrastructure, lineage, recovery, and attestation visibility.
- [x] Distinguish non-tolerance from perfect detection.
- [x] Set remediation probability to 100% after detected material concealment.
- [x] Preserve privacy, encryption, least privilege, and registered compartments.
- [x] Add NIST references, hidden-constant rationale, webpage disclosure, and tests.
- [ ] Add stochastic concealment, detection, audit interval, remediation delay, and recurrence variables.


## Revision 17: Model insight analysis

- [x] Run one-at-a-time sensitivity across all active causal defaults.
- [x] Run 192-iteration Morris-style global screening.
- [x] Generate 81-cell consolidation/fragmentation phase map.
- [x] Generate 25-cell economics surface.
- [x] Test observability counterfactual and 50% feasibility boundary.
- [x] Reject serial pairwise and passenger-airline interpretations after scope clarification.
- [x] Build bounded aircraft/aerospace manufacturing wave observations from USITC and RAND.
- [x] Reinterpret and rename the parameter as per-Institution event probability.
- [x] Re-run PCA, scenarios, sensitivity, rationale, and browser artifacts.

## Revision 18: COW-primary sovereign-wave calibration

- [x] Ingest checksum-locked COW Intra-State War v5.1 war, participant, and state-year records.
- [x] Cluster COW State System Membership exits into reproducible five-year waves.
- [x] Set the production Institution-event probability to 15% from the 15.9% major-wave gross mean.
- [x] Treat civil-war linkage as supporting/negative evidence rather than an independent sovereign-loss calibration.
- [x] Demote aircraft/aerospace to a secondary high-intensity corporate comparison.
- [x] Encode permanent loss of independent top-level authority after decisive unconditional defeat.
- [ ] Complete causal historical review of individual COW exits before any L2 calibration claim.

## Revision 20: Scenario and model-challenge implementation

- [x] Approve wave-definition robustness and leave-one-wave-out analysis.
- [x] Approve simple historical model comparison.
- [ ] Generate the fixed ten-scenario matrix and browser artifact.
- [x] Generate 40 gross/durable clustering-robustness rows across 20 gap/threshold specifications.
- [x] Generate leave-one-major-wave-out calibration estimates.
- [x] Run chronological no-exit, production-prior, constant-hazard, trend, birth–death, wave-memory, and full-wave comparisons.
- [x] Add regression tests and extend the HTTP smoke test.
- [x] Update architecture, operations, robustness roadmap, README, changelog, and validation dashboard.
- [x] Re-run the complete validation suite.
- [ ] Later opportunity: manually review all 49 COW exits.
- [ ] Later: build an unconditional-surrender case registry.
- [ ] Later: add stochastic correlated waves and competing risks.
- [x] Implement first GDP/revenue display weighting.
- [ ] High priority later: test power-weighted outcomes, terminal rules, and separate state/corporate mechanisms.
- [ ] Later enhancement: model imperfect observability and concealment detection.

## Revision 21: Target-five exploration

- [x] Define `T_5` and lock boundary comparisons to 225 starting Institutions.
- [x] Add a pure threshold-year function to the production model.
- [x] Generate fastest, longest-bounded, historical-anchor, and one-at-a-time target-five results.
- [x] Add fastest/slowest-to-five browser presets and live metric.
- [x] Add generated browser analysis and explanatory panel.
- [x] Add model, generator, smoke, and regression tests.
- [x] Update paper, mathematical model, architecture, operations, README, and changelog.
- [x] Run the complete validation suite.

## Revision 22: Monte Carlo parameter uncertainty

- [x] Define parameter uncertainty separately from deferred process uncertainty.
- [x] Create a versioned distribution/profile registry with evidence labels.
- [x] Implement seeded Latin-hypercube and transformed bounded samplers.
- [x] Run 10,000 samples across four ensembles.
- [x] Report T5/T1/dominance censoring, quantiles, restricted means, field counts, and terminal bands.
- [x] Add convergence checkpoints and parameter sensitivity rankings.
- [x] Generate run-level CSV, summary JSON/Markdown, and browser module.
- [x] Add a browser Monte Carlo profile explorer.
- [x] Add deterministic regression, schema, and smoke tests.
- [x] Update model/paper, architecture, operations, README, changelog, model card, and status dashboard.
- [x] Run the complete validation suite.


## Revision 23: AI-mediated power calcification

- [x] Define organizational churn separately from independent top-level power formation.
- [x] Encode operational Apex control as an absorbing state in the pure model.
- [x] Add a prominent pre-control explanation of consolidation, AI-scale enforcement, and calcification.
- [x] Clarify that fragmentation controls operate only before Apex consolidation.
- [x] Add a cited, epistemically labeled power-calcification reference entry.
- [x] Add a dedicated mechanism and model-boundary document.
- [x] Update the paper, README, architecture, operations guide, model card, and changelog.
- [x] Extend model and HTTP smoke tests for post-Apex permanence and required disclosure.
- [x] Run targeted tests, syntax checks, and the complete project validation suite.


## Revision 24: Economic-power weighting and conflict dynamics

- [x] Generate a 225-entity GDP/revenue and growth dataset from local sources.
- [x] Preserve explicit nulls for countries without measured GDP.
- [x] Implement log-space growth, conflict shock, recovery, rebound, ranking, and shares.
- [x] Sort constellation institutions by modeled economic power.
- [x] Make Independent 1 effective influence economic-power weighted in the interface.
- [x] Add economic rank and power metadata to node inspection.
- [x] Add a visible ranking table and conflict-cycle status.
- [x] Add evidence entries and disclose GDP/revenue incomparability and double counting.
- [x] Add generator, model, schema, ranking, shock/recovery, and HTTP tests.
- [x] Update paper, math model, README, architecture, operations, model card, entity baseline, and changelog.
- [x] Run targeted checks and the complete project validation suite.


## Revision 25: Five-section article structure

- [x] Add five numbered semantic article parts with stable anchor IDs.
- [x] Add article navigation linking all five sections.
- [x] Build a casual-review lead with thesis, accelerator/brake findings, and model CTA.
- [x] Render representative timelines from target-five artifacts.
- [x] Render COW-centered uncertainty headlines from Monte Carlo artifacts.
- [x] Build deeper-analysis prose around power calcification, economic power, and model boundaries.
- [x] Move the complete interactive workspace into section three.
- [x] Group all simulation, sensitivity, empirical, PCA, and validation content into section four.
- [x] Group conceptual mapping, robustness, references, and assumptions into section five.
- [x] Add article-focused responsive styling and accessibility markers.
- [x] Extend HTTP tests for section count, order, anchors, CTA, dynamic containers, and retained content.
- [x] Update README, architecture, operations, paper, model card, and changelog.
- [x] Run targeted and complete validation suites.


## Revision 26: Calendar-year outcome standard

- [x] Define shared 2026 epoch and calendar conversion helpers.
- [x] Convert page metrics, chart axis, scrubber, interpretations, and article headlines to calendar years.
- [x] Keep conflict intervals, recovery periods, and annual rates as durations.
- [x] Add calendar-year fields to target-five artifacts and reports.
- [x] Add calendar-year fields to scenario-matrix and model-insight artifacts and reports.
- [x] Add calendar-year fields to Monte Carlo summaries, CSV, report, and browser module.
- [x] Convert PCA/scenario outcome presentation to calendar years.
- [x] Update static article text and table headings from elapsed outcomes to calendar dates.
- [x] Update paper, math model, README, architecture, operations, model card, and changelog.
- [x] Extend model, generator, artifact, and HTTP tests for epoch conversion and stale labels.
- [x] Regenerate all affected artifacts and checksum manifests.
- [x] Run targeted and complete validation suites.


## Revision 27: Single-variable AI consolidation acceleration

- [x] Add bounded `consolidationAcceleration` parameter with default 25%.
- [x] Implement adoption × consolidation-progress feedback and a fixed 5× ceiling.
- [x] Apply one multiplier to event tempo and effective loss pressure.
- [x] Preserve exact zero-acceleration ablation behavior.
- [x] Record event-level multiplier, accelerated probability, and maximum reached multiplier.
- [x] Add one UI control and live acceleration/effective-loss outputs.
- [x] Add evidence and explicitly document excluded Hawkes, coagulation, preferential-attachment, and multi-channel alternatives.
- [x] Add defaults rationale and hidden ceiling rationale; regenerate rationale artifacts.
- [x] Add acceleration to scenarios, PCA, target-five, global screening, and Monte Carlo profiles.
- [x] Regenerate all dependent JSON, CSV, Markdown, browser, status, and checksum artifacts.
- [x] Update article insights, paper, math model, README, architecture, operations, model card, and changelog.
- [x] Extend unit, schema, deterministic, analysis, Monte Carlo, and HTTP tests.
- [x] Run the complete validation suite.


## Revision 28: Complete annotated research bibliography

- [x] Merge the versioned source catalog and all reference-registry links.
- [x] Deduplicate sources by normalized HTTPS URL.
- [x] Group empirical, theory/method, and governance/context sources.
- [x] Annotate every entry with support, model use, status, and limitations.
- [x] Generate JSON, Markdown, browser module, and checksum manifest.
- [x] Render the complete linked bibliography at the bottom of Section 5.
- [x] Preserve the assumption-oriented reference ledger separately.
- [x] Add responsive bibliography styling and safe external-link behavior.
- [x] Add deterministic coverage, uniqueness, annotation, checksum, and HTTP tests.
- [x] Update README, architecture, operations, model card, and changelog.
- [x] Run targeted and complete validation suites.


## Revision 29: Existential-risk scope boundary

- [x] Add a direct Section 5 existential-risk scope block.
- [x] Identify political calcification and permanent disempowerment as the included extinction-equivalent pathway.
- [x] Exclude self-sufficient machine takeover under human-dependency assumptions.
- [x] Limit recursive improvement to analytical decision capability.
- [x] Set incremental AI mass-destruction hazard to zero by assumption.
- [x] List multipolar disempowerment, objective drift, infrastructure cascades, non-state bypass, and direct extinction as excluded.
- [x] Distinguish binding model assumptions from empirical findings.
- [x] Add linked evidence annotations and regenerate the bibliography.
- [x] Update paper, README, architecture, model card, operations, and changelog.
- [x] Add HTML, reference, placement, and browser tests.
- [x] Run targeted validation.


## Revision 30: Civilizational outcome taxonomy

- [x] Replace extinction-equivalent assumptions with separate outcome semantics.
- [x] Remove `extinctionEquivalentYear()` and add `civilizationalOutcome()`.
- [x] Calculate Apex coordination only; return unknown disempowerment and extinction years.
- [x] Rewrite Section 5 around six post-Apex governance outcomes.
- [x] Relabel COW deterministic and Monte Carlo metrics as Apex coordination results.
- [x] Add required future dimensions: decision rights, authority, consent, reversibility, appeal/exit, welfare, and survival.
- [x] Update references and regenerate the bibliography.
- [x] Correct paper, math model, README, model card, architecture, operations, design, and changelog.
- [x] Replace regression tests for extinction equivalence with taxonomy tests.
- [x] Run targeted validation.

## Revision 32: Review remediation

- [x] Relabel the featured output as an authored core scenario and explain within-model frequencies.
- [x] Replace p100/sample maximum with p95 in engine, reports, UI, and tests.
- [x] Make the no-current-wave scenario restore the 69.4-year historical-only interval.
- [x] Fix current-wave resolution at calendar year 2029 for every parameter setting.
- [x] Add seeded exponential later-wave interarrivals.
- [x] Add beta-binomial wave-loss overdispersion with disclosed concentration.
- [x] Make `event-limit` an explicit conserved outcome and exclude unknown post-limit states.
- [x] Record actual Monte Carlo simulation seeds.
- [x] Align the production-prior benchmark with the 15% core assumption and correct its interpretation.
- [x] Preserve economic context on Institution-node rerender.
- [x] Show all convergence-favoring structural assumptions in the featured panel.
- [x] Correct stochastic equations, acceleration labels, premise wording, and current-facing docs.
- [x] Regenerate the full artifact chain and bibliography.
- [x] Run model, analysis, research, and HTTP validation suites.
- [x] Perform a browser smoke and visual review.

## Revision 33: Historical reset versus AI persistence

- [x] Add a prominent Casual Review comparison before quantitative findings.
- [x] Cover succession, generational reinterpretation, economic reset, administrative forgetting, and visibility/enforcement gaps.
- [x] Explain that persistent memory can retain both useful learning and inherited bias or grievance.
- [x] Clarify that pressure and turnover continue but no longer reset the governing system automatically under the core premise.
- [x] Add a deeper-analysis limitation: no independent generational-memory/decay variable exists.
- [x] Update the power-calcification reference, paper, README, model card, and dedicated concept document.
- [x] Regenerate the annotated bibliography and release manifest.
- [x] Bump the browser cache version and update smoke assertions.
- [x] Run the complete validation suite and visually inspect the new section.

## Revision 34: Critical-response implementation

- [x] Remove the forced terminal collapse and add a 3→2 regression test.
- [x] Replace exponential arrivals with clustered 6/36/124-year normalized gap sampling.
- [x] Regenerate all fixed-scenario, sensitivity, PCA, and Monte Carlo outputs.
- [x] Replace displayed probability and P-notation with conditional run-share terminology.
- [x] Add explicit scope responses for count-only modeling, internal splits, composite controls, long horizon, winner identity, state/company differences, memory scale, and historical diagnostics.
- [x] Cite Dalio’s February 2026 Stage 6 statement in the current-wave rationale and bibliography.
- [x] Demote COW model comparison from validation evidence to descriptive diagnostic.
- [x] Add an explicit model-expansion register.
- [x] Correct stale 11%/14-exit/profile-rate/boundary text.
- [x] Advance the release manifest and current-specification labels to Revision 34.
- [x] Regenerate rationales, bibliography, status, and release provenance.
- [x] Run all tests and visually inspect the page.
