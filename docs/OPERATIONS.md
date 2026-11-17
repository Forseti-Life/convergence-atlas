# Operations: Institutional Agent Consolidation Visualizer

## Run locally

From the project directory:

```bash
python3 -m http.server 8080 --directory web
```

Open:

```text
http://localhost:8080
```

On macOS, optionally run:

```bash
open http://localhost:8080
```

Stop the server with `Ctrl+C`.

## Interpretation boundary

The page models consolidation and calcification of **top-level power**, not elimination of all organizations. Fragmentation controls apply before Apex formation. After one operational Apex center forms, the engine fixes independent-center births and authority decay at zero; later organizations are modeled as curated constituents. This permanence rule is a disclosed assumption and must not be presented as an observed fact or forecast. Failure of the coordinating system is outside the current model.

## Why a local server is required

The app uses native JavaScript modules. Browsers commonly restrict module imports from `file://` URLs, so opening `index.html` directly may fail. Python's standard HTTP server avoids that issue without adding a dependency.

## Validate

Run model tests:

```bash
node tests/test-model.mjs
```

Run the HTTP smoke test while the server is active:

```bash
python3 tests/smoke_test.py
```

Run Python syntax validation:

```bash
python3 -m py_compile baseline_simulation.py tests/smoke_test.py
```

## Validate claim levels, defaults, and research contracts

```bash
python3 research/generate_phase0_docs.py
python3 tests/test_research_contract.py
python3 tests/test_validation_plan_v2.py
python3 research/generate_default_rationale.py
node tests/test-default-rationales.mjs
node research/generate_crosswalk_seed.mjs
python3 tests/test_data_scaffold.py
```

Do not edit generated Phase 0 or default-rationale Markdown directly. Change a versioned JSON contract, create a new contract version when frozen content changes, regenerate, and review the checksum manifest. The current crosswalk is intentionally unresolved and must not be described as a verified ISO/COW/World Bank/UCDP mapping.

## Ingest and analyze COW State System Membership

The raw v2024 archive is local and excluded from version control. The parser rejects checksum or native-schema drift.

```bash
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
python3 analysis/classify_cow_exits.py
python3 tests/test_cow_exit_taxonomy.py
python3 analysis/l2_conflict_prediction.py
python3 tests/test_l2_conflict_prediction.py
node analysis/model_insight_sweep.mjs
python3 tests/test_model_insights.py
python3 analysis/cow_empirical_baseline.py
python3 tests/test_empirical_baseline.py
python3 research/run_validation_program.py
python3 tests/test_program_status.py
```

Crosswalk output remains candidate-only. Do not promote rows to verified without independent review.

## Regenerate PCA and scenarios

NumPy 2.0.2 is pinned in `analysis/requirements.txt` and was already available during implementation. Regenerate all artifacts with:

```bash
node analysis/generate_scenarios.mjs
python3 analysis/pca_analysis.py
python3 tests/test_analysis.py
```

Outputs are written to `analysis/output/`, and `web/analysis-results.mjs` is refreshed for the local webpage. Re-running the generator with unchanged code must produce identical scenario data.

## Troubleshooting

### Port 8080 is already in use

Use another port:

```bash
python3 -m http.server 8090 --directory web
```

Then open `http://localhost:8090`.

### Blank page or missing modules

- Confirm the page is opened through `http://localhost:...`, not `file://`.
- Open browser developer tools and check the Console.
- Confirm `countries.mjs`, `tech-companies.mjs`, `references.mjs`, `model.mjs`, and `app.mjs` return HTTP 200.

### Reference card does not appear

- Hover the `i` marker or focus it with the keyboard.
- Confirm `references.mjs` returns HTTP 200.
- Check the browser console for an unknown reference key.
- The persistent reference ledger remains available below the visualization.

### PCA results are not empirical findings

The analysis uses synthetic perturbations around authored archetypes. Reach rates are frequencies in that experiment, not probabilities for the real world. Cases at the 5,000-year horizon are right-censored.

### Economic controls change effective transition assumptions

The economics panel shows base and effective consolidation, qualifying-event share, and internal-conflict values. Set Economic coupling to 0% to disable the economics layer. Strength and stress at 50% are neutral regardless of coupling.

### Institutional adoption changes the Apex Institution date

This is expected. Structural consolidation reaches one top-level Institution before its internal standard necessarily reaches majority implementation. The headline date uses the later adoption-adjusted majority date.

### Apex influence threshold is never reached

This occurs when internal or external fragmentation stalls consolidation, qualifying events are absent, or the horizon is too short. There is no adjustable influence threshold. Dominance requires one top-level Institution and greater than 50% effective internal adoption.

### Timeline says no convergence

This is expected when:

- qualifying conflict share is zero;
- consolidation per event is too small to change the rounded agent count;
- external fragmentation or internal conflict restores as many agents as consolidation removes; or
- the calculated unification date exceeds the selected horizon.

### Entity count is not 225

Run `node tests/test-model.mjs`. The test checks 195 country-level entities, 30 corporations, combined uniqueness, and complete assignment. Do not change the baseline without updating `docs/ENTITY_BASELINE.md`.

## Deployment

There is no production deployment. The application is local-only and contains no AWS resources, secrets, analytics, or automatic external dependencies. Citation links open external sources only when selected by the user.

## Regenerate scenario and model-challenge analyses

```bash
node analysis/generate_scenario_matrix.mjs
python3 analysis/cow_wave_robustness.py
python3 analysis/cow_model_comparison.py
python3 research/run_validation_program.py
```

Validate:

```bash
python3 tests/test_scenario_matrix.py
python3 tests/test_cow_wave_robustness.py
python3 tests/test_cow_model_comparison.py
python3 tests/test_program_status.py
python3 tests/smoke_test.py
```

These commands use only local checksum-locked COW derivatives and standard Python/Node runtimes. A favorable score is not a forecast authorization; inspect `COW_MODEL_COMPARISON.md` for calibration and sparse-event warnings.

## Regenerate target-five exploration

```bash
node analysis/target_five_analysis.mjs
python3 tests/test_target_five_analysis.py
node tests/test-model.mjs
python3 research/run_validation_program.py
python3 tests/smoke_test.py
```

Use the fast high-intensity and slow presets as stress tests, not mathematical boundaries. For meaningful comparisons, keep the starting field at 225; lowering `startAgents` can trivially satisfy the objective in the 2026 baseline year.

## Regenerate Monte Carlo parameter uncertainty

```bash
node analysis/monte_carlo_simulation.mjs
node tests/test-monte-carlo.mjs
python3 research/run_validation_program.py
python3 tests/test_program_status.py
python3 tests/smoke_test.py
```

Expected seeded configuration:

```text
seed:             20261008
profiles:         4
runs per profile: 10,000
total runs:       40,000
fixed start:      225 Institutions
fixed horizon:    5,000 years
```

The run-level CSV can be large and is intended for local analysis. Do not interpret profile frequencies as empirical probabilities or forecasts. Change `research/monte-carlo-assumptions.v1.json`, regenerate, and review `research/monte-carlo-manifest.json`; do not hand-edit generated summaries. After the complete generator chain, run `node analysis/generate_release_manifest.mjs`; `tests/test_research_contract.py` verifies executable and artifact hashes.

## Regenerate economic-power data

The ranking is generated entirely from local, checksum-tracked inputs:

```bash
node analysis/generate_economic_power.mjs
node tests/test-economic-power.mjs
python3 tests/smoke_test.py
```

Review these outputs:

- `web/economic-power-data.mjs`
- `analysis/output/economic-power-baseline.csv`
- `research/economic-power-manifest.json`

Do not fill missing GDP manually or describe provisional name aliases as independently verified crosswalks. Holy See, Nauru, and North Korea are intentionally displayed as unavailable. Company growth is an origin-GDP proxy, not measured revenue growth.

The conflict economic path is a scenario convention: immediate `−10%`, ten-year linear recovery, then a `+3%` level premium. It is applied at every baseline conflict interval and is not a claim that real conflicts universally produce positive net effects.

When reviewing the page, confirm that the economic table and constellation reorder when the displayed year changes, shares sum across measured entities, and Independent 1's influence caption identifies economic power and implementation depth separately.

## Validate the article experience

After changing page structure or generated analytical artifacts:

```bash
node --check web/app.mjs
python3 tests/smoke_test.py
```

Review the page in this order:

1. `#casual-review`
2. `#deeper-analysis`
3. `#model-interface`
4. `#simulation-analysis`
5. `#references-assumptions`

Confirm that all five article-navigation links work with keyboard activation, the casual-review CTA moves to the model interface, and the sticky navigation does not obscure section headings. On narrow screens, confirm the navigation and headline grids collapse without horizontal page overflow.

Headline dates and percentages must come from generated browser modules through `renderArticleSummary()`. Do not hand-edit the displayed target-five or COW-centered Monte Carlo values in HTML. Regenerate the owning artifacts, run their regression tests, and then run the HTTP smoke test.

## Validate calendar-year outputs

The model epoch is 2026. After changing time logic or analysis generators, regenerate affected artifacts and verify both elapsed and calendar fields:

```bash
node analysis/target_five_analysis.mjs
node analysis/generate_scenario_matrix.mjs
node analysis/model_insight_sweep.mjs
node analysis/monte_carlo_simulation.mjs
node analysis/generate_scenarios.mjs
python3 analysis/pca_analysis.py
```

Expected checks include an active-wave first event at elapsed year 3 (`2029`) for every parameter setting, monotonic p25/p50/p75/p95 completion years, coherent no-wave spacing at 69.4 years, and explicit event-limit accounting. Do not convert durations into calendar dates.

## Validate acceleration

Use the slider to compare `0%`, `25%`, and `100%`. At zero, the tempo multiplier must remain exactly 1 and loss probability must remain unchanged. Compare generated medians rather than pinned historical dates. At 100%, the multiplier must remain below or equal to `5×` and event times must remain strictly increasing.

After changing acceleration equations, defaults, distributions, or the ceiling, regenerate defaults, scenarios, PCA, target-five, scenario matrix, model insights, Monte Carlo, Phase 0 docs, and program status before running the complete suite.

## Regenerate the annotated bibliography

```bash
node analysis/generate_annotated_bibliography.mjs
node tests/test-annotated-bibliography.mjs
python3 tests/smoke_test.py
```

Review `research/annotated-bibliography-manifest.json` and confirm `web/ANNOTATED_BIBLIOGRAPHY.md` loads from the local server. Add newly discovered external research links to the formal source catalog, interface reference registry, or curated bibliography supplement with a substantive support and limitation annotation. Do not add undocumented links directly to generated files.

Confirm that the article has no Markdown bibliography button, each adjustable default exposes “See annotated variable sources,” variable-topic links scroll to visible topic cards, source links open the containing category, and category summaries expand and collapse with keyboard input.

## Validate existential-risk scope

Confirm Section 5 reports fixed-scenario and Monte Carlo values as Apex coordination results. Verify `civilizationalOutcome()` leaves disempowerment and extinction dates null, permanent disempowerment remains an existential catastrophe rather than biological extinction, autonomous material takeover remains disabled, and incremental AI mass-destruction hazard remains zero. Changes to this taxonomy require model-card and reference updates.

## Validate historical-reset presentation

After changing the power-calcification narrative, confirm `#historical-reset` appears after the Casual Review lead and before quantitative headline cards. Verify both columns remain visible on desktop and stack on narrow screens. Required claims: historical succession and generational turnover can reset objectives; economic pressure continues rather than disappears; machine memory can preserve both useful lessons and inherited bias/grievance; deliberate unlearning is not modeled. Regenerate the bibliography whenever the shared `powerCalcification` reference changes.

## Revision 34 presentation checks

Confirm human-facing outputs say “run share” or “percent of seeded runs,” never `P(Apex)`, `P(five)`, or a real-world “probability year.” Confirm the Core scenario preset is not called a COW baseline; the historical model comparison is labeled a descriptive diagnostic; the current-wave card cites Dalio’s February 2026 Stage 6 interpretation while retaining authored severity; and Section 5 contains the scope-response cards and expansion register. Clustered timing must expose only normalized 6/36/124-year gaps around the selected mean.
