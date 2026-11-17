# Institutional Agents

A creative and analytical writing project exploring institutions as composite agents, the coalitions that control them, and how power, knowledge, identity, and AI coordination change across conflict and generations.

## Working title

**The State as Agent: Families, Institutions, and the Inheritance of Power**

The project includes a dependency-free local webpage, **Convergence Atlas**, that visualizes conditional consolidation from 195 country-level agents plus 30 revenue-driven technology corporations toward one dominant Apex Institution network while all named institutions persist, separately charting common AI architecture adoption.

Its central premise is **institutional power calcification**: once AI-mediated Apex authority combines LLM-scale analysis, durable memory, infrastructure control, and mandatory observability, the model treats one independent power center as an absorbing state. New organizations can still form, but only as curated subordinates while the coordinating systems remain operational. This is a testable assumption, not an established historical fact.

The historical contrast is loss of institutional continuity. Succession, generational reinterpretation, economic crisis and reform, administrative forgetting, and visibility gaps repeatedly disrupted concentrated control. The core scenario assumes machine-maintained objectives and memory survive those transitions. Useful lessons persist—but inherited bias, exclusion, and grievance also stop fading automatically. The model has no separate generational-memory or deliberate-unlearning variable.

> This is a thought experiment, not a forecast. “Oligarchy” is a stipulated model role, not a factual classification of every current government.

**Scope limitation and improvement opportunity:** ethnic, cultural, linguistic,
and religious boundaries are not modeled, including “Western” or “Eastern”
cultural groupings. The aim is to explore consolidation dynamics, not predict
which countries or groups win. Map colors do not predict real alliances or
territorial outcomes. Evidence-based modeling of overlapping, evolving identities
and within-country diversity is future work; see `MODEL_CARD.md`.

## Run the visualization

From this directory:

```bash
python3 -m http.server 8080 --directory web
```

Open [http://localhost:8080](http://localhost:8080). On macOS:

```bash
open http://localhost:8080
```

No installation, package manager, cloud account, or external runtime dependency is required.

## Forseti Drupal module

The Drupal route renders the complete article and interactive model directly
in Forseti's page layout. It uses the existing `web/*.mjs` model and datasets;
no iframe or separate simulation page is needed. The standalone `web/index.html`
remains a reference for local research.

- `convergence_atlas.info.yml`
- `convergence_atlas.routing.yml`
- `convergence_atlas.links.menu.yml`
- `convergence_atlas.module`
- `convergence_atlas.libraries.yml`
- `src/Controller/ConvergenceAtlasController.php`
- `templates/convergence-atlas-page.html.twig` (full article and model markup)
- `css/convergence-atlas.css` (component-scoped visualization styles;
  Forseti theme supplies site navigation, typography and standard UI classes)

To align with existing Forseti module workflows, symlink the repo into the
site's `web/modules/custom` directory:

```bash
cd /var/www/html/forseti/web/modules/custom
ln -s /home/ubuntu/forseti.life/convergence-atlas convergence_atlas
```

Enable the module on the Forseti site:

```bash
cd /var/www/html/forseti
./vendor/bin/drush en convergence_atlas -y
./vendor/bin/drush cr
```

Route:

- `/convergence-atlas` (native article and interactive model)

The world map uses locally served, public-domain Natural Earth country
boundaries, filled by the same modeled blocs as the institutional topology.
Its year slider stays synchronized with the timeline, play/pause controls,
scenario horizon, and shared URL parameters. Microstates retain small markers.
See `data/licenses/natural_earth.md` for provenance and regeneration.

## Validation status

- **L0 — Conceptual coherence:** achieved.
- **L1 — Sourced exploratory model:** achieved.
- **L2 — Empirically anchored model:** in progress; WGI and a provisional 187-Institution common panel are implemented, but transition prediction is blocked by only one common-period exit event.
- **L3 — Predictive model:** not authorized.

Validation Plan v2 allows existing literature and analogous proxies to justify exploratory variables and defaults. Original analysis is reserved for predictive, causal, and representativeness claims. The archived v1 plan remains available for forecast-grade work.

Current empirical anchors include COW membership/MID/alliance data, a six-indicator WDI snapshot, and the official six-dimension WGI 2026 workbook. The frozen contract contains 7 hypotheses, 9 outcomes, 42 variables, 21 source records, 3 causal diagrams, and SHA-256 manifests.

## Adjustable variables

- Starting institutional agents (`2–225`, default `225`)
- Average conflict interval (`1–100 years`)
- Share of conflicts severe enough to consolidate (`0–100%`)
- Current wave in progress (on by default; resolves 2029)
- Institution loss probability per consolidation wave (`1–90%`, default `15%` core assumption, bounded by the 11.2% durable COW mean and the 19.5% 1866–71 durable wave; authored qualifying-share default `47.6%` for a 52.5-year mean clustered gap; the current wave is stipulated and its severity remains uncertain)
- New autonomous fragments created per pre-Apex event (`0–10`)
- Pre-Apex internal conflict producing independent factions per cycle (`0–50%`)
- Post-Apex independent births fixed at `0` while the coordinating system operates
- Leading Institution economic strength (`0–100%`, neutral `50%`)
- Systemic Big Cycle stress (`0–100%`, neutral `50%`)
- Economics-to-institution coupling (`0–100%`, default `50%`)
- Institutional standard adoption (`1–30% annually`, default `7%`)
- AI architecture diffusion rate (`1–50% annually`)
- AI consolidation acceleration (`0–100%`, default `25%`, bounded at `5×`)
- Model horizon (`50–5,000 years`)
- Displayed year with play, pause, step, and scrub controls

Every variable has an accessible hover/focus citation card. References identify whether a value is an empirical anchor, published method, or author-defined assumption; the complete ledger is also visible below the simulation. The page also displays generated PCA components, rank sensitivities, and outcomes for 12 scenario archetypes.

## Deliberate scope responses

The model counts independent top-level Institutions; it does not identify winners or model disputes inside an Institution unless a faction becomes a fully independent center. Composite controls are retained instead of adding unidentifiable tipping-point submodels. States and technology corporations are not legally equivalent; their shared-node treatment reflects the author’s expectation that strategic firms become nationalized, state-directed, or equivalently dependent under sustained international conflict. Historical comparisons are descriptive analogue diagnostics, not validation of a novel AI regime. Calendar years through 7026 are simulation stress-test coordinates, not forecasts. See Section 5’s expansion register for deferred memory, succession, observability, lineage, economic, state–firm, and de-calcification mechanisms.

## Architecture

```text
225-entity baseline ──┐
                      ├─> pure model.mjs ─> event timeline ─┐
interactive controls ─┘                    AI diffusion ─────┼─> metrics
                                                            ├─> SVG chart
                                                            └─> apex/independent constellation
```

Structural coordination, internal standard adoption, and technical architecture adoption remain distinct state variables. The single acceleration control explicitly couples architecture adoption and accumulated consolidation to later transition tempo only; sharing an architecture alone still does not imply Apex authority. Once structural and operational Apex control is achieved, top-level authority is non-decaying in the current model. The political curve counts independent power centers—not surviving institutions; all 225 named institutions remain represented.

## Project structure

```text
institutional-agents/
├── web/
│   ├── index.html              # Local interactive webpage
│   ├── styles.css              # Responsive visualization styles
│   ├── app.mjs                 # UI, chart, controls, animation
│   ├── model.mjs               # Pure mathematical engine
│   ├── references.mjs          # Citation registry and assumption taxonomy
│   ├── analysis-results.mjs    # Generated PCA/scenario browser artifact
│   ├── scenario-matrix.mjs     # Generated scenario challenge matrix
│   ├── cow-wave-robustness.mjs # Generated clustering sensitivity
│   ├── cow-model-comparison.mjs # Generated rolling model scores
│   ├── target-five-analysis.mjs # Generated boundaries and structural sweeps
│   ├── monte-carlo-results.mjs # Generated four-profile uncertainty summaries
│   ├── monte-carlo-summary.csv # Downloadable profile summary
│   ├── countries.mjs           # 193 UN members + 2 observer states
│   └── tech-companies.mjs      # 30 revenue-driven technology corporations
├── research/
│   ├── analysis-contract.v1.json # Frozen hypotheses, outcomes, and evaluation policy
│   ├── variables.v1.json       # Machine-readable variable dictionary
│   ├── source-catalog.v1.json  # Version, license, and verification status
│   ├── causal-graphs.v1.json   # Machine-readable causal diagrams
│   ├── defaults-rationale.v1.json # Default evidence tiers and derivations
│   ├── sovereign-consolidation-proxy.v1.json # COW-primary wave calibration
│   ├── aerospace-consolidation-proxy.v1.json # Secondary corporate observations
│   ├── monte-carlo-assumptions.v1.json # Versioned distributions and profiles
│   ├── monte-carlo-manifest.json # Generated artifact checksums
│   ├── defaults-rationale-manifest.json # Rationale checksums
│   ├── phase0-manifest.json    # SHA-256 checksums and Gate A result
│   ├── generate_phase0_docs.py # Deterministic documentation generator
│   ├── generate_default_rationale.py # Default rationale generator
│   ├── generate_crosswalk_seed.mjs # State crosswalk seed generator
│   ├── ingest_cow_states.py     # Checksum-locked COW v2024 parser
│   ├── ingest_cow_mids.py       # MID v5 dispute/conflict features
│   ├── ingest_cow_alliances.py  # Alliance v4.1 network features
│   ├── ingest_cow_intra_state_wars.py # Intra-State War v5.1 outcomes
│   ├── ingest_world_bank_wdi.py # Cached six-indicator WDI snapshot
│   ├── ingest_world_bank_wgi.py # Official six-sheet WGI workbook
│   └── run_validation_program.py # Ten-phase status controller
├── data/
│   ├── README.md               # Data-zone and ingestion contract
│   ├── catalog.yml             # Prioritized Phase 1 sources and gates
│   ├── crosswalks/             # Seed and unreviewed COW candidates
│   ├── licenses/               # Source-specific use decisions
│   └── manifests/              # Retrieval checksums and limitations
├── analysis/
│   ├── generate_scenarios.mjs  # 12 archetypes × 64 seeded variants
│   ├── pca_analysis.py         # Standardized PCA and scenario summaries
│   ├── cow_empirical_baseline.py # Survival, bootstrap, rolling backtest
│   ├── cow_network_conflict.py  # Alliance/MID descriptive diagnostic
│   ├── wdi_measurement_pca.py   # Partial empirical measurement PCA
│   ├── l2_common_panel.py       # Provisional WDI/WGI/COW panel and gate
│   ├── l2_conflict_prediction.py # Next-year MID benchmark
│   ├── cow_sovereign_wave_proxy.py # COW exit-wave and civil-war linkage
│   ├── generate_scenario_matrix.mjs # Fixed scenario challenge matrix
│   ├── cow_wave_robustness.py # Clustering grid and leave-one-out
│   ├── cow_model_comparison.py # Rolling-origin simple-model scores
│   ├── target_five_analysis.mjs # Boundary proof and structural sweeps
│   ├── monte_carlo_sampling.mjs # Seeded LHS and bounded transforms
│   ├── monte_carlo_statistics.mjs # Censoring, quantiles, and sensitivity
│   ├── monte_carlo_simulation.mjs # Four-profile uncertainty runner
│   ├── model_insight_sweep.mjs # OAT, Morris, phase maps, proxies
│   ├── classify_cow_exits.py    # Observable non-causal exit taxonomy
│   ├── requirements.txt        # Pinned NumPy 2.0.2
│   └── output/                 # CSV, JSON, and generated Markdown report
├── tests/
│   ├── test-model.mjs          # Model and dataset unit tests
│   ├── test-default-rationales.mjs # Default/model consistency
│   ├── test_analysis.py        # Analysis artifact and PCA validation
│   ├── test_research_contract.py # Phase 0 Gate A validation
│   ├── test_data_scaffold.py   # Phase 1 seed/catalog validation
│   ├── test_cow_ingestion.py   # COW checksum/schema/panel validation
│   ├── test_mid_ingestion.py   # MID conflict feature validation
│   ├── test_alliance_ingestion.py # Alliance network validation
│   ├── test_intra_state_ingestion.py # Civil-war archive and outcomes
│   ├── test_sovereign_proxy.py # COW wave calibration and permanence
│   ├── test_scenario_matrix.py # Ten fixed challenge scenarios
│   ├── test_cow_wave_robustness.py # Definition and leave-one-out tests
│   ├── test_cow_model_comparison.py # Rolling simple-model comparison
│   ├── test_target_five_analysis.py # Target-five bounds and sweeps
│   ├── test-monte-carlo.mjs # Sampling, censoring, outputs, reproducibility
│   ├── test_network_analysis.py # Trend-aware network diagnostic
│   ├── test_wdi_ingestion.py   # Cached API panel and manifest validation
│   ├── test_wdi_measurement.py # Empirical PCA and bias warnings
│   ├── test_wgi_ingestion.py   # Official workbook and uncertainty fields
│   ├── test_l2_common_panel.py # Provisional panel and event gate
│   ├── test_l2_conflict_prediction.py # Conflict pathway benchmark
│   ├── test_model_insights.py  # Sensitivity and COW wave calibration
│   ├── test_aircraft_proxy.py  # Wave calculations and market scope
│   ├── test_cow_exit_taxonomy.py # Observable exit categories
│   ├── test_empirical_baseline.py # Survival and backtest validation
│   ├── test_program_status.py  # Ten-phase gate/claim validation
│   ├── test_validation_plan_v2.py # Claim levels and practical phases
│   └── smoke_test.py           # Self-contained local HTTP smoke test
├── docs/
│   ├── ARCHITECTURE.md         # Detailed application architecture
│   ├── BIG_CYCLE_ECONOMICS.md  # Dalio mapping, equations, sources, and caveats
│   ├── CALIBRATION_POLICY.md   # Literature/proxy evidence sufficiency
│   ├── DEFAULT_VALUES.md       # Generated rationale for every default
│   ├── EMPIRICAL_VALIDATION_PLAN.md # Active practical Validation Plan v2
│   ├── archive/EMPIRICAL_VALIDATION_PLAN_V1.md # Forecast-grade original plan
│   ├── HYPOTHESIS_REGISTRY.md  # Generated falsifiable hypothesis details
│   ├── VARIABLE_DICTIONARY.md  # Generated variable definitions and risks
│   ├── CAUSAL_DIAGRAMS.md      # Generated Mermaid DAGs and warnings
│   ├── DATA_GOVERNANCE.md      # Generated provenance, license, and leakage policy
│   ├── PHASE_0_REPORT.md       # Generated Gate A decision
│   ├── VALIDATION_STATUS.md    # Generated evidence, gates, and blockers
│   ├── ENTITY_BASELINE.md      # Entity selection, revenue basis, and sources
│   ├── INSTITUTIONAL_ADOPTION_PROXY.md # IFRS proxy derivation and caveats
│   ├── APEX_OBSERVABILITY.md   # Mandatory visibility and anti-concealment rule
│   ├── COW_SOVEREIGN_WAVE_PROXY.md # Primary state-system wave calibration
│   ├── AIRCRAFT_MANUFACTURING_CONSOLIDATION_PROXY.md # Secondary corporate reference
│   ├── ROBUSTNESS_ROADMAP.md   # Calibration and uncertainty roadmap
│   ├── INSTITUTIONAL_SINGULARITY.md # Central concept and neighboring models
│   └── OPERATIONS.md           # Run, test, and troubleshooting guide
├── brainstorm.md               # Definitions, assumptions, questions
├── math-model.md               # Variables and equations
├── baseline-scenarios.md       # First numerical scenarios
├── global-ai-consolidation.md  # Conditional worldwide timelines
├── baseline_simulation.py      # Reproducible baseline calculator
├── paper.md                    # Working paper draft
├── DESIGN.md                   # Visualization design decisions
├── EXECUTION_PLAN.md           # Ordered implementation deliverables
├── MODEL_CARD.md               # Draft intended-use and claim controls
├── AWS_INVENTORY.md            # Confirms no AWS resources
└── CHANGELOG.md                # Project history
```

## Validate

```bash
node --check web/model.mjs
node --check web/app.mjs
node tests/test-model.mjs
node analysis/generate_scenarios.mjs
python3 analysis/pca_analysis.py
python3 tests/test_analysis.py
python3 research/generate_phase0_docs.py
python3 tests/test_research_contract.py
python3 research/generate_default_rationale.py
node tests/test-default-rationales.mjs
node research/generate_crosswalk_seed.mjs
python3 tests/test_data_scaffold.py
python3 research/ingest_cow_states.py
python3 tests/test_cow_ingestion.py
python3 research/ingest_cow_mids.py
python3 tests/test_mid_ingestion.py
python3 research/ingest_cow_alliances.py
python3 tests/test_alliance_ingestion.py
python3 analysis/cow_network_conflict.py
python3 tests/test_network_analysis.py
python3 research/ingest_world_bank_wdi.py
python3 tests/test_wdi_ingestion.py
python3 analysis/wdi_measurement_pca.py
python3 tests/test_wdi_measurement.py
python3 research/ingest_world_bank_wgi.py
python3 tests/test_wgi_ingestion.py
python3 analysis/l2_common_panel.py
python3 tests/test_l2_common_panel.py
python3 tests/test_intra_state_ingestion.py
python3 tests/test_sovereign_proxy.py
node analysis/generate_scenario_matrix.mjs
python3 tests/test_scenario_matrix.py
python3 analysis/cow_wave_robustness.py
python3 tests/test_cow_wave_robustness.py
python3 analysis/cow_model_comparison.py
python3 tests/test_cow_model_comparison.py
node analysis/target_five_analysis.mjs
python3 tests/test_target_five_analysis.py
node analysis/monte_carlo_simulation.mjs
node tests/test-monte-carlo.mjs
python3 analysis/classify_cow_exits.py
python3 tests/test_cow_exit_taxonomy.py
python3 analysis/l2_conflict_prediction.py
python3 tests/test_l2_conflict_prediction.py
node analysis/model_insight_sweep.mjs
python3 tests/test_model_insights.py
python3 tests/test_aircraft_proxy.py
python3 analysis/cow_empirical_baseline.py
python3 tests/test_empirical_baseline.py
python3 research/run_validation_program.py
python3 tests/test_program_status.py
python3 tests/test_validation_plan_v2.py
python3 -m py_compile baseline_simulation.py tests/smoke_test.py
python3 tests/smoke_test.py
```

The validation suite checks all active defaults and hidden constants, seeded stochastic reproducibility, fixed-2029 current-wave timing, clustered-gap interarrival and beta-severity means, p25/p50/p75/p95 completion years, coherent historical-only ablation, event-limit conservation, replayable Monte Carlo seeds, the 225-Institution baseline, economic-power invariants, generated artifact checksums, bibliography coverage, empirical data contracts, and local HTTP delivery.

## Baseline source

The default combines the United Nations' current presentation of 195 flags—193 Member States plus the Holy See and State of Palestine—with 30 large revenue-driven technology corporations. The corporate selection is based primarily on the 2025 Fortune Global 500-derived technology revenue table and is documented in `docs/ENTITY_BASELINE.md`. Generated blocs do not predict alliances, acquisitions, or political loyalty.

## Working method

1. Record new premises in `brainstorm.md`.
2. Mark premises as definitions, assumptions, mechanisms, or empirical claims.
3. Implement equations in `math-model.md` and test them in the pure model module.
4. Move mature arguments into `paper.md`.
5. Verify and cite empirical claims before treating the draft as nonfiction.
6. Keep `web/references.mjs` and `docs/ROBUSTNESS_ROADMAP.md` synchronized with model changes.
7. Treat `docs/BIG_CYCLE_ECONOMICS.md` as an experimental hypothesis layer until its coefficients are historically calibrated.
8. Treat `analysis/output/PCA_REPORT.md` as model-behavior analysis, not empirical inference.
9. State the claim level—L0, L1, L2, or L3—for every paper or presentation.
10. Version frozen research contracts rather than editing them silently.
11. Do not ingest or redistribute external data until its license decision is recorded.
12. Existing literature and proxies may justify exploratory defaults; predictive and causal claims still require empirical validation.

## Infrastructure and ownership

| Item | Value |
|---|---|
| Owner and author | Keith Aumiller |
| Runtime | Local browser + optional Python HTTP server |
| AWS resources | None |
| External runtime APIs | None |
| Telemetry or stored user data | None |


## Economic power and influence

The interface now orders all 225 institutions with a requested cross-type economic-power heuristic:

- Countries: latest positive World Bank GDP in current USD, with a trailing approximately ten-year nominal-USD CAGR.
- Technology companies: approximate 2025 annual revenue, with listed-origin GDP CAGR used as a forward growth proxy because company revenue histories are not locally available.
- Missing GDP: Holy See, Nauru, and North Korea remain explicitly unavailable and sort after measured institutions.
- Conflict path: each baseline conflict applies an immediate 10% loss, linear recovery over ten years, and a 3% positive level premium.

Independent 1’s interface influence is its current share of modeled economic power multiplied by internal implementation depth. The structural consolidation timeline still counts top-level institutions and does not yet use GDP/revenue to estimate conflict outcomes.

GDP and corporate revenue are not accounting-equivalent. GDP measures value added; revenue measures gross sales and is partly contained in national GDP. The combined ranking therefore double-counts activity and must not be interpreted as a world total, welfare measure, or complete measure of political or military power.

Regenerate and validate:

```bash
node analysis/generate_economic_power.mjs
node tests/test-economic-power.mjs
```

Generated artifacts are `web/economic-power-data.mjs`, `analysis/output/economic-power-baseline.csv`, and `research/economic-power-manifest.json`.

## Article structure

Convergence Atlas is organized as a five-part article rather than a dashboard-first page:

1. **Casual review** — thesis, primary accelerators and brakes, representative target-five timelines, COW-centered uncertainty, and a direct model link.
2. **Deeper analysis** — AI-mediated power calcification, economic influence, structural versus effective authority, and limitations.
3. **Interactive model** — complete controls, metrics, economic ranking, trajectories, institutional topology, and live interpretation.
4. **Simulations and statistical analysis** — sensitivity, boundaries, fixed scenarios, robustness, historical model comparisons, Monte Carlo, empirical baselines, validation gates, PCA, and scenario runs.
5. **References and assumptions** — conceptual comparisons, robustness roadmap, full evidence ledger, and model boundaries.

Headline timeline and uncertainty cards are rendered from `TARGET_FIVE_ANALYSIS` and `MONTE_CARLO_RESULTS`; they are not separately maintained copies of generated values.

## Calendar-year standard

All user-facing outcome dates use the model epoch **2026**. The interface and generated reports show calendar years: elapsed 2 becomes 2028, the 5,000-year censoring horizon becomes 7026, and the COW-centered conditional median five-center year among reached runs becomes 3018.

Machine-readable artifacts retain elapsed fields such as `targetYear` and `dominanceYear` for equations, censoring, and backward compatibility. They also expose explicit fields such as `targetCalendarYear`, `dominanceCalendarYear`, and `censoringCalendarYear`. Genuine durations—including conflict intervals, recovery periods, event ages, and annual rates—remain expressed in years.

## AI consolidation acceleration

One `0–100%` control models bounded self-reinforcement. The default is 25%. Its multiplier combines AI architecture adoption with consolidation progress, starts at `1×`, and is capped at `5×`. It shortens subsequent clustered gaps only; it does not change mean Institution loss.

Setting acceleration to zero exactly restores the constant-rate model. Under the core assumptions (an authored wave resolving in 2029, 15% mean loss, clustered gaps averaging 52.5 years), 25/50/75/95% of 1,000 seeded runs reach Apex by 3094/3306/3565/3998. Without acceleration the 50% threshold is 4210; at the 11.2% durable mean it is 4113. These are run shares under authored assumptions, not real-world odds. Acceleration shortens wave intervals only.

The implementation deliberately stops at one variable. Hawkes event clustering, coagulation merger kernels, preferential attachment, independent tempo/severity/suppression controls, unbounded recursive growth, and stochastic correlated outcomes are documented alternatives rather than additional sliders.

## Tolerance/intolerance model gap

The deeper analysis highlights pluralism tolerance as an important unmodeled dimension. The proposed stringent rule treats a theologically or ideologically driven Institution as intolerant when tolerance and acceptance of nonmembers, dissenters, and peaceful parallel institutions are not core governing commitments. No current entity is classified. A production variable requires a codebook, evidence standards, independent review, and separate treatment of doctrine, formal law, and observed behavior.

## Complete annotated bibliography

The bottom of Section 5 contains a generated bibliography covering all 74 unique external research links currently found in the versioned source catalog, interface evidence registry, proxy records, authored research documents, and data-license notes. Localhost operational links are excluded.

Every entry links directly to the paper, dataset, standard, report, or authoritative site where possible and identifies what it supports, how the model uses it, verification/version status, and limitations or access restrictions. The assumption-oriented reference ledger remains separate.

Regenerate and validate with:

```bash
node analysis/generate_annotated_bibliography.mjs
node tests/test-annotated-bibliography.mjs
```

Outputs include JSON, Markdown, a browser module, a browser-served Markdown copy, and a SHA-256 manifest.

### Bibliography navigation

The bibliography is rendered entirely on the article page. A variable/default reference map appears first; every adjustable control’s information card links directly to its matching topic card. Full annotations are then organized into expandable empirical, theory/method, and governance/context categories. The generated Markdown remains a reproducibility artifact but is not the article’s navigation mechanism.

## Civilizational outcome boundary

The model separates three outcomes:

```text
T_Apex           = one hierarchy gains effective final authority
T_Disempowerment = humans irreversibly lose meaningful collective decision rights
T_Extinction      = the human population ceases to exist
```

The production equations calculate only `T_Apex`. The core scenario's 50% run-share threshold is 3306 across 1,000 runs, and the COW-centered authored profile has a 70.8% Apex run share by 7026. These values are not disempowerment or extinction probabilities.

Post-Apex governance remains unclassified among AI constitutional coordination, displacement of a narrow human elite, a shared human–AI institution, civilizational succession, permanent human disempowerment, and biological extinction. Permanent disempowerment is an existential catastrophe, not biological extinction.

The model still excludes self-sufficient material takeover, physical recursive self-expansion, incremental AI mass-destruction hazard, multipolar machine control, objective drift, infrastructure cascades, and non-state bypass. Classifying the post-Apex outcome requires human decision rights, constitutional authority, consent, reversibility, appeal and exit, welfare, and biological survival.
