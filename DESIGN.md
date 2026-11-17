# Design: Institutional Agent Consolidation Visualizer

**Date:** October 6, 2026  
**Status:** Approved for initial local implementation  
**Risk:** Low — local static educational visualization, no external services or stored user data

> **Current specification: Revision 34.** Earlier numbered sections preserve design history and are superseded where they conflict with Revision 34.

## Purpose

Create a dependency-free local webpage that begins with 195 present-day country-level agents and 30 revenue-driven technology corporations and visualizes hypothetical consolidation into fewer governing blocs and potentially one governing AI. Users can adjust assumptions and observe how the timeline changes.

The visualization implements a thought experiment. It does not assert that every current government is factually an oligarchy or predict that worldwide AI government is inevitable.

## Users

- Author developing the *State as Agent* paper
- Readers exploring the model's assumptions
- Reviewers comparing technological diffusion with political consolidation

## Architecture

```text
Browser
  ├── index.html       semantic structure and controls
  ├── styles.css       responsive visual design
  ├── countries.mjs    195-country baseline dataset
  ├── tech-companies.mjs  30-company revenue-led dataset
  ├── model.mjs        pure mathematical model
  └── app.mjs          rendering, controls, animation, URL state

Local server
  └── python3 -m http.server (files only; no application backend)
```

## Architecture decisions

1. **Static and dependency-free.** HTML, CSS, SVG, and JavaScript modules only. No package installation, CDN, telemetry, or outbound browser request.
2. **Pure model layer.** All equations live in `model.mjs`, making calculations independently testable.
3. **Expected-value visualization.** Version 1 uses deterministic expected intervals rather than random Monte Carlo events. This makes parameter effects understandable and reproducible.
4. **Entity constellation, not geographic map.** Country and corporate nodes are grouped by governing bloc without implying geographic conquest paths or requiring external map data.
5. **Two distinct processes.** Political consolidation and common AI architecture adoption are shown separately to prevent technology adoption from being mistaken for surrendered sovereignty.
6. **Current baseline.** The default dataset contains 193 UN Member States, the Holy See, the State of Palestine, and 30 revenue-driven technology corporations. The starting-agent slider can use a subset for experimentation.
7. **No claim of inevitability.** If consolidation fails to exceed fragmentation, the result is displayed as “No convergence within horizon” rather than fabricating a date.

## Mathematical contracts

### Qualifying consolidation interval

```text
qualifyingInterval = conflictInterval / qualifyingConflictShare
```

If the qualifying share is zero, no consolidation event occurs.

### Event transition

```text
S_(j+1) = min(S_0, max(1, ceil[S_j(1-r)] + n_j))
```

- `S_j`: governing agents before event `j`
- `r`: fraction consolidated per qualifying event
- `n_j`: new agents produced through fragmentation per event
- `S_0`: selected starting-agent count

### AI architecture adoption

```text
x(t) = 1 / [1 + ((1-x_0)/x_0) exp(-βt)]
```

- `x_0 = 1/S_0`
- `β`: annual architecture diffusion rate

### Assignment contract

At any displayed year, every country in the selected baseline belongs to exactly one displayed bloc. Assignment is deterministic and balanced for legibility; it does not represent an empirical alliance forecast.

## Adjustable variables

- Starting institutional agents: `2–225`
- Baseline conflict interval: `1–100 years`
- Qualifying/severe conflict share: `0–100%`
- Consolidation per qualifying event: `1–90%`
- New agents from fragmentation per event: `0–10`
- Internal conflict per cycle: `0–50%`
- AI architecture spread rate: `1–50% annually`
- Timeline horizon: `50–5,000 years`
- Displayed elapsed year: `0–horizon`

## Data flow

```text
User changes control
  → parse and clamp parameter
  → simulate deterministic event timeline
  → calculate architecture adoption
  → calculate institution-to-bloc assignments
  → render metrics, SVG chart, constellation, and assumptions
  → encode parameters in URL hash
```

## UI components

1. Header with model status and baseline citation
2. Control panel with sliders, values, reset, play/pause
3. Outcome cards for active agents, projected unification, qualifying interval, and architecture adoption
4. SVG timeline showing political agents and architecture adoption
5. Country/corporate constellation colored by current governing bloc
6. Bloc summary cards with expandable member lists
7. Formula and interpretation panel
8. Persistent disclaimer that output is conditional, not predictive

## Accessibility

- Native form controls and buttons
- Visible labels and keyboard operation
- High-contrast palette and focus indicators
- Textual summaries for every visual result
- SVG title/description and non-color bloc identifiers
- Reduced-motion support
- Responsive layout for laptop and mobile widths

## Dependencies

- Modern browser with JavaScript module support
- Python 3 only for convenient local file serving
- No runtime libraries, cloud services, credentials, or AWS resources

## Security and privacy

The app processes only user-selected model parameters in memory. It performs no network requests, accepts no uploaded files, executes no dynamic code, and stores no personal data. URL hashes contain only numeric simulation settings.

## Validation

- Node-based unit tests for model equations and invariants
- JavaScript syntax checks
- Dataset count and uniqueness checks
- Local HTTP smoke test
- Browser-oriented smoke assertions for required HTML elements

## Future extensions

- Seeded Monte Carlo mode with confidence intervals
- Explicit federation, conquest, and voluntary-merger event types
- Country-weighted resources and asymmetric power
- Geographic visualization using a locally stored map dataset
- Exportable PNG/SVG and scenario JSON
- Membership-regime effects after global consolidation

## Revision 2: Corporate agents and internal conflict

**Date:** October 6, 2026

### Expanded baseline

The default becomes 225 institutional agents:

```text
195 country-level agents
+ 30 revenue-driven global technology corporations
= 225 starting agents
```

The corporate set uses the 2025 Fortune Global 500-style revenue list as the primary basis. That published table contains 25 technology companies above approximately US$50 billion annual revenue; HP Inc., Intel, Broadcom, Salesforce, and SAP extend the interactive baseline to 30 using recent reported annual-revenue scale. Revenue values are approximate and time-sensitive. Revenue selects the corporate entities but does not weight their governing power in version 2.

Companies are modeled as transnational institutional agents in addition to the sovereign agents under whose jurisdictions they operate. This is an intentional relaxation of the strict sovereign hierarchy for the thought experiment.

### Entity data contract

`tech-companies.mjs` exports records with:

```text
name, type, revenueRank, approximateRevenueUsdB, origin, sector
```

The app creates a combined immutable entity set. Country nodes remain circular; corporate nodes are square and include revenue information in their inspection view.

### Internal-conflict variable

Add:

```text
i ∈ [0, 0.50]
```

`i` is the share of pre-event institutions expected to generate an additional autonomous faction during each qualifying consolidation cycle. It represents succession disputes, secession, spin-offs, breakups, management conflict, ideological fracture, and similar internal processes.

The event transition becomes:

```text
internalFragments_j = round(i × S_j)

S_(j+1) = min(
    S_0,
    max(1,
        ceil[S_j(1-r)]
        + externalFragments_j
        + internalFragments_j
    )
)
```

Internal conflict is separate from the fixed external-fragment count because it scales with the number of active institutions. At high enough `i`, consolidation stalls. This is an expected-value mechanism, not a claim that factions divide smoothly or uniformly.

### Revised controls

- Starting institutional agents: `2–225`, default `225`
- Internal conflict per cycle: `0–50%`, default `5%`
- All version 1 controls remain available

### Revised assignment contract

Every one of the 225 named entities is assigned exactly once to a displayed bloc. The assignment remains deterministic and balanced and does not forecast corporate-state alliances, acquisitions, or political loyalty.

## Revision 3: Evidence and robustness layer

**Date:** October 6, 2026

### Goal

Every adjustable variable and major displayed assumption must disclose its epistemic status and provide real-world references without implying that the current numeric default was estimated from those references.

### Reference taxonomy

Each reference record has one of three kinds:

1. **Empirical anchor** — a real dataset or observed baseline directly informs the concept or default.
2. **Published method** — a recognized mathematical or social-science method informs the equation.
3. **Author-defined assumption** — the transition rule or numeric default is speculative; real-world sources provide comparison data but do not validate the chosen value.

### Interaction contract

- Every control label receives a visible reference trigger.
- Hovering the trigger or focusing it with a keyboard opens a citation card.
- Citation cards include definition, epistemic status, and one or more links.
- Links open only when selected; the app makes no automatic external requests.
- A full reference ledger duplicates the hover content in persistent, readable form.
- Core assumptions—oligarchy abstraction, equal node weights, deterministic expected events, logistic diffusion, and synthetic bloc assignment—receive the same treatment.

### New component

`web/references.mjs` is the source of truth for reference metadata. `app.mjs` hydrates inline triggers and renders the ledger. This avoids duplicating citations in HTML.

### Robustness roadmap

The webpage and `docs/ROBUSTNESS_ROADMAP.md` will identify six priority improvements:

1. heterogeneous power weights;
2. separate country and corporate transition rates;
3. alliance/dependency network topology;
4. seeded stochastic Monte Carlo simulation;
5. historical backtesting and calibration; and
6. sensitivity and uncertainty reporting.

These are roadmap items, not silently implemented assumptions.

## Revision 4: Singularity model map

**Date:** October 6, 2026

The consolidation model will be explicitly mapped to six neighboring model families: technological singularity, intelligence explosion, singleton, economic growth-mode transition, network/global-brain emergence, and comprehensive AI services or multipolar AI.

The comparison must preserve separate state variables:

```text
C(t) = AI capability
A(t) = architecture adoption and interoperability
S(t) = independent top-level institutional agents
H(t) = concentration of effective power
L(t) = durability or lock-in
Y(t) = economic output
I(t) = internal conflict and fragmentation pressure
```

The webpage must not call `S = 1` a technological singularity. It is only a singleton candidate until authority is comprehensive and `L` is high enough to prevent renewed fragmentation. Each comparison card receives a primary or authoritative reference from the shared citation registry.

## Revision 4 clarification: Institutional singularity

The intended singularity is not primarily a capability explosion. It is a hierarchy transition in which one dominant coordinating institution becomes the Apex Institution while other institutions continue as subordinate, affiliated, or locally autonomous institutions.

The principal threshold changes from elimination (`S = 1`) to Apex Institution influence:

```text
Q(t) = [E_0 - S(t) + 1] / E_0
T_D = min{t : Q(t) ≥ θ_D}
```

**Superseded by Revision 9:** the model now uses balanced final Institutions, no adjustable influence threshold, and a terminal two-to-one transition.

## Revision 5: Institutional standard adoption

**Date:** October 6, 2026

Joining the Apex Institution network and implementing its operating standard are separate events. Every absorbed institution enters an adoption cohort at its consolidation time. Internal implementation begins at a fixed 5% seed and follows a logistic curve:

```text
d(a)/dt = ρ_A a(1-a)

a(τ) = 1 / [1 + ((1-a_0)/a_0)e^(-ρ_A τ)]
```

- `a_0 = 5%` is an author-defined pilot/initial implementation level.
- `ρ_A` is an adjustable institutional-standard adoption rate from `1–30%` per year.
- Default `ρ_A = 7%` is an approximate proxy derived from IFRS jurisdictional adoption.

The proxy compares nearly 120 jurisdictions requiring IFRS for public companies in 2016 with more than 140 today, against 170 current jurisdiction profiles:

```text
ρ_proxy ≈ [logit(140/170) - logit(120/170)] / 10
        ≈ 6.65% per year
```

The default rounds this to 7%. This is not an estimate of AI-governance adoption and does not prove uniform enforcement inside IFRS jurisdictions.

Apex Institution dominance changes from structural coverage to effective adopted coverage:

```text
D_effective(t) = (1/E_0) Σ_cohorts n_c a(t-t_c)

T_D = min{t : D_effective(t) ≥ θ_D}
```

The interface will show effective coverage as the headline and disclose structural membership and average implementation depth separately.

## Revision 7: Big Cycle economics dimension

**Date:** October 6, 2026

Dalio's Big Cycle is incorporated as a hypothesis layer over the institutional model, not as a periodic sine wave or established universal law.

Three normalized controls are introduced:

```text
P ∈ [0,1]  leading Institution productive/financial strength
Z ∈ [0,1]  system-wide economic and political stress
κ ∈ [0,1]  strength of Big Cycle coupling to transition dynamics
```

All default to `0.5`, which is neutral. Define centered signals:

```text
p = 2P - 1
z = 2Z - 1
```

The author-defined first coupling is:

```text
r_eff = clamp[r_base(1 + 0.50κp), 0.01, 0.95]
q_eff = clamp[q_base(1 + 0.75κz), 0, 1]
i_eff = clamp[i_base(1 + 0.75κz - 0.25κp), 0, 0.75]
```

- `r_eff` is consolidation per qualifying restructuring event.
- `q_eff` is the share of conflicts qualifying as systemic restructuring events.
- `i_eff` is internal institutional fracture pressure.

The coefficients are scenario assumptions, not estimates from Dalio's work. The interface must display base and effective values and link each control to Dalio's framework plus independent economic datasets.

`P` summarizes education, innovation/technology, competitiveness, output, trade, military capability, financial-center strength, and reserve-currency position. `Z` summarizes debt stress, money/credit pressure, inequality, internal disorder, external power transition, and external shocks.

A later model must replace global manual scores with institution-specific, time-varying data and estimated coefficients.

## Revision 8: PCA and scenario testing

**Date:** October 6, 2026

The analysis pipeline will generate a reproducible synthetic scenario dataset from the model. It is explicitly **model-behavior PCA**, not empirical PCA.

### Experiment design

- Fix the named entity baseline at 225 and analysis horizon at 5,000 years.
- Define 12 interpretable scenario archetypes.
- Generate 64 deterministic seeded perturbations per archetype (`768` rows).
- Preserve the unperturbed archetype as variant 0.
- Record causal inputs, economics-adjusted transition parameters, Apex dominance outcomes, full-consolidation outcomes, and architecture-adoption timing.

### PCA scope

Standardize and decompose these assumption variables:

```text
conflict interval
qualifying conflict share
consolidation fraction
external fragments
internal conflict
institutional adoption rate
leading Institution strength
systemic cycle stress
economic coupling
AI architecture spread
```

PCA is performed on inputs only. Component scores are then correlated with model outcomes. This avoids treating outputs as independent assumptions while still showing how assumption bundles relate to Apex timing.

### Censoring

Scenarios that do not reach a threshold within 5,000 years are retained. Reports include reach probability and use a capped time only for descriptive correlation, clearly labeled as right-censored rather than a true event time.

### Outputs

```text
analysis/output/scenario-results.csv
analysis/output/pca-results.json
analysis/output/PCA_REPORT.md
web/analysis-results.mjs
```

The webpage receives a static generated summary and performs no runtime analytics or external requests.

### Dependency

NumPy is pinned at the already-installed local version `2.0.2`. No package installation is performed.

## Revision 9: Equal final institutions and terminal majority

**Date:** October 6, 2026

The prior model incorrectly allowed one institution to retain more than 50% influence while many independent institutions remained. The revised assumption is:

- Initial institutions may differ substantially in power.
- As consolidation reduces the field below roughly 20 institutions, surviving institutions are treated as approximately equal in effective power until the final contest.
- With `S` equal institutions, leading structural influence is approximately `1/S`.
- At two institutions, influence is approximately `50/50`.
- A move beyond 50% is terminal: the leading Institution becomes the sole top-level Apex Institution rather than remaining at a stable 51–99% state.

Version 9 uses balanced assignments throughout because empirical power weights are not yet available. The model will later interpolate from observed unequal weights toward the equal-final assumption.

The adjustable `50–99%` Apex threshold is removed. Apex dominance requires:

```text
S(t) = 1
and
effective internal adoption > 50%
```

The transition function collapses a projected two-center state directly to one, representing the unstable nature of a bare majority. Institutional adoption cohorts are recalculated from growth in the largest approximately equal bloc:

```text
largest bloc size at t = ceil(E_0 / S(t))
```

PCA and scenario generation must remove the obsolete threshold input and be regenerated.

## Revision 12: Empirical evidence and phase-status dashboard

**Date:** October 6, 2026

The local webpage will separate synthetic model behavior from empirical validation. It will import two generated static modules:

```text
web/validation-results.mjs  # COW membership survival/backtest aggregates
web/program-status.mjs      # phase evidence, gates, blockers, claim policy
```

The empirical section will display source/version, spell and exit counts, crude hazard with bootstrap interval, Kaplan–Meier estimates, and rolling backtest performance. It must state that COW membership exits are not yet transition-cause labels.

The status section will display all ten phases with COMPLETE, IN PROGRESS, PARTIAL, BLOCKED, or DRAFT states. Blocked phases are not errors; they are enforced evidence gates. The interface must display that forecast claims remain unauthorized.

## Revision 13: Literature and proxy calibration policy

**Date:** October 6, 2026

Default values may use observed anchors, published literature, analogous proxies, neutral normalization, or explicit scenario conventions. The model does not require re-performing source research merely to justify an exploratory default.

`research/defaults-rationale.v1.json` is the source of truth for all active defaults and hidden constants. It generates `docs/DEFAULT_VALUES.md` and `web/default-rationales.mjs`. Hover cards display default value, tier, confidence, rationale, and derivation. Validation requires exact agreement with `web/model.mjs`; proxy and conventional defaults must be sensitivity-tested.

## Revision 15: L2 governance and common-panel analysis

**Date:** October 6, 2026

L2 work will add six Worldwide Governance Indicators through the World Bank API, then build a provisional state-year panel joining COW membership/MID data to WDI/WGI through unreviewed candidate mappings.

The panel must carry `mapping_status=provisional_unreviewed` on every row. It may be used for coverage, measurement, and feasibility diagnostics but not confirmatory prediction or causal claims.

The L2 analysis will:

1. quantify common years, Institutions, missingness, membership exits, and MID onsets;
2. run an economic/governance empirical PCA on complete cases;
3. compare early and late loading stability;
4. determine whether transition-event counts meet a preregistered minimum for multivariable prediction; and
5. block predictive modeling when event support is insufficient.

WGI indicators: voice/accountability, political stability, government effectiveness, regulatory quality, rule of law, and control of corruption.

## Revision 16: Mandatory observability and anti-concealment

**Date:** October 7, 2026

Effective subordinate alignment requires Apex-authorized inventory, audit, lineage, attestation, and recovery access to material data and core systems. Detected material concealment triggers remediation with probability 1. This is a governance invariant, not an assumption of perfect detection.

The current implementation treats counted institutional adoption as observable, making effective-authority estimates optimistic. A future model will add observability coverage, detection probability, audit interval, remediation delay, and concealment recurrence. Privacy and security segmentation remain valid when an authorized oversight path exists.

## Revision 17: Model insight sweep and event granularity

**Date:** October 7, 2026

The analysis adds one-at-a-time sensitivity, Morris-style screening, consolidation/fragmentation and economics surfaces, observability counterfactuals, and comparison of batch versus pairwise event models. Airline consolidation is used only as a fast regulated-corporate event-rate reference.

Generated artifacts:

```text
analysis/output/model-insights.json
analysis/output/MODEL_INSIGHTS.md
web/model-insights.mjs
```

Event-model comparisons are structural alternatives, not confidence intervals around one forecast.

## Revision 18: Per-Institution consolidation-wave probability

**Date:** October 7, 2026
**Status:** Superseded by Revision 19; retained as architecture history.


Major events create field-wide consolidation waves. Each exposed Institution receives a probability of losing top-level independence during the wave. Multiple Institutions can consolidate in parallel.

The existing `consolidationFraction` equation is reinterpreted and renamed `institutionEventProbability`:

```text
E[S_(e+1)] = S_e(1-p_event) + fragments
```

The 50% default is justified as a rounded midpoint of bounded aircraft/aerospace wave observations: 33.3% loss in the 1997 global large-civil-aircraft prime transition and 71.4% loss among U.S. combat-aircraft primes during the 1990s consolidation wave. The proxy applies to severe corporate waves, not sovereign Institutions.

All PCA, scenarios, sensitivity outputs, labels, rationales, and tests must be regenerated after the rename even though the central numeric default remains unchanged.

## Revision 19: COW-primary sovereign wave calibration

**Date:** October 7, 2026

Cluster COW membership exits when consecutive exits occur within five years. Major waves with at least five unique exits have gross loss shares of roughly 11.1%, 22.0%, 27.3%, and 3.1%; their mean is about 15.9%. The rounded sovereign-wave default becomes 15%. Aircraft manufacturing remains a secondary corporate-wave proxy.

Historical re-entry remains historical fact. Future translation uses:

```text
P(permanent loss of top-level independence
  | decisive unconditional defeat) = 1
```

A qualifying wave with positive event probability guarantees at least one institutional loss before adding fragments, avoiding a false no-event result caused by integer rounding. All defaults, scenarios, PCA, sensitivity, and browser artifacts must be regenerated.

## Revision 20: Scenario matrix and COW model-challenge analyses

**Date:** October 7, 2026

### Purpose

Challenge the 15% COW-primary default rather than treating it as settled. Implement: (1) a fixed scenario comparison, (2) wave-definition and leave-one-wave-out robustness, and (3) rolling-origin comparison against simpler historical exit models.

### Architecture and data flow

```text
web/model.mjs + fixed scenario registry
  → analysis/output/scenario-matrix.{csv,json,md}
  → web/scenario-matrix.mjs

COW v2024 membership spells
  → gap/threshold/gross-durable clustering grid
  → leave-one-major-wave-out estimates
  → analysis/output/cow-wave-robustness.{csv,json,md}

COW v2024 annual exposure and exits
  → rolling-origin predictions
  → no-exit, production-prior, constant-hazard, trend, wave-memory models
  → Brier score and log loss
  → analysis/output/cow-model-comparison.{csv,json,md}
```

### Contracts

- Scenario results are deterministic equation behavior, not probabilities or forecasts.
- Robustness varies cluster gaps `1, 3, 5, 7, 10` years and major-wave thresholds `2, 3, 5, 10`, reporting gross and durable definitions separately.
- Leave-one-out analysis uses the declared five-year/five-exit gross-wave specification.
- Model comparison uses only information available before each test year. Test blocks are chronological and predictions are clipped only for finite log loss.
- The production-prior model maps current assumptions to an annual Institution-exit probability: `q × p_event / conflictInterval`.
- Simpler models must remain in the report even if they outperform the wave model.

### Dependencies

Python and Node standard libraries only. No package installation, AWS resource, external API, or telemetry is introduced.

### Deferred work

Historical review of all 49 exits, an unconditional-surrender registry, stochastic correlated waves, and competing risks are documented as later opportunities. Power/terminal-rule robustness and separate state/corporate mechanisms are high priority. Observability/concealment simulation remains a later enhancement.

## Revision 21: Target-five exploration

**Date:** October 7, 2026

### Purpose

Make the first year with at most five independent top-level Institutions directly observable and manipulable. Hold `startAgents = 225` for boundary comparisons so the objective cannot be satisfied by changing the starting field.

### Objective

```text
T_5 = inf { t ≥ 0 : S(t) ≤ 5 }
```

Return `null` when the threshold is not reached within the selected horizon.

### Boundary scenarios

- Fastest permitted case: conflict interval 1 year, qualifying share 100%, base event probability 90%, zero fragmentation/internal conflict, full strength/stress/coupling. Effective event probability clamps at 95%; the first wave leaves at least 12 Institutions, so one-wave attainment is impossible. The second annual wave reaches the target at year 2.
- Longest bounded attainment: with a 5,000-year horizon, interval 100 years, qualifying share 12%, event probability 48%, and zero internal/external fragmentation, the sixth wave reaches exactly five Institutions at year 5,000. There is no finite unconstrained “longest” time because qualifying share can approach zero or the model can fail to reach five.

### Data flow

```text
web/model.mjs threshold function + fixed boundary registry + OAT structural sweep
  → analysis/output/target-five-analysis.{csv,json,md}
  → web/target-five-analysis.mjs
  → live target metric and fastest/slowest presets
```

Institutional adoption and architecture spread are excluded from structural `T_5`; they affect effective authority or technical diffusion after structural transitions. No dependency or infrastructure change is required.

## Revision 22: Parameter-uncertainty Monte Carlo laboratory

**Date:** October 8, 2026

### Purpose

Propagate uncertainty in the ten active causal parameters through the deterministic Institution model. This phase samples parameters; it does not yet randomize Institution-level outcomes inside a wave.

### Sampling contract

- Four explicitly labeled ensembles: COW-centered, COW-definition sensitivity, broad structural stress test, and secondary corporate.
- `10,000` Latin-hypercube samples per ensemble with deterministic seed `20261008`.
- `startAgents = 225`, `horizon = 5000`, and `selectedYear = 0` remain fixed.
- Probabilities use logistic-normal transforms; conflict interval uses lognormal or declared log-uniform transforms; fragments use a zero-inflated Poisson count model.
- COW-definition sampling treats alternative authored definitions as sensitivity cases, not independent evidence or a posterior.
- Parameters are independent in this first implementation. Correlated copula sampling remains deferred.

### Outputs

```text
sampled parameters
  → deterministic simulation
  → T5, T1, effective dominance, field counts at 500/1000/2000/5000
  → reach probabilities, conditional quantiles, restricted mean, censoring
  → terminal count bands, histograms, convergence checkpoints, Spearman sensitivity
  → JSON/CSV/Markdown/static browser module
```

Non-reaching times remain right-censored at 5,000 years. Conditional means never silently include censored runs. `E[min(T,5000)]` is reported separately as restricted mean time.

### Dependencies and non-goals

Node standard library only; no package, API, telemetry, or AWS change. Results are L1 model-behavior uncertainty propagation, not empirical confidence intervals, posterior forecasts, or process-level probabilities.

## Revision 23: AI-mediated power calcification

**Date:** October 8, 2026

### Purpose

Reframe the visualizer explicitly as a **consolidation-of-power model**. Historical churn created and dissolved institutions because dominant powers lacked comprehensive, persistent visibility and control. The model's central speculative premise is that LLM-enabled analysis, machine-speed coordination, institutional memory, and mandatory observability can change that reversibility.

### Architecture decision: absorbing top-level authority

The model distinguishes organizational churn from independent power formation:

- Constituent organizations, departments, brands, jurisdictions, and specialized agents may still be created, merged, renamed, or retired.
- Those changes occur inside the Apex hierarchy and do not create a new independent top-level power center.
- Once one operational Apex Institution controls the field, the independent-center count is an absorbing state.
- A new institution may exist only as a machine-curated subordinate unless it escapes Apex authority.
- Escape caused by system shutdown, catastrophic loss of observability, infrastructure collapse, or successful external displacement is outside the current model boundary.

For operational continuity `O(t) = 1`:

```text
S(t) = 1  =>  S(t + Δt) = 1
P(uncurated top-level institutional birth | S = 1, O = 1) = 0
power-decay rate | S = 1, O = 1 = 0
```

The fragmentation controls apply only before structural Apex consolidation. Afterward, churn is subordinate curation rather than renewed sovereignty.

### Mechanism claim

The proposed mechanism is not merely that AI is more capable. LLM-based systems can analyze heterogeneous records, policies, communications, dependencies, and behavior at a scale and cadence unavailable to historical ruling institutions. Combined with durable machine memory, infrastructure control, and mandatory observability, this may let an Apex Institution detect, classify, constrain, absorb, or curate emerging organizations before they become independent rivals.

### Epistemic status

This is an **author-defined core premise and falsifiable hypothesis**, not an observed historical regularity or an authorized forecast. Sources on AI scaling, governance, and singleton theory motivate the mechanism but do not establish permanence. The page and paper must use conditional language: power consolidation is permanent **inside the model while the coordinating systems remain operational**.

### User-interface contract

The page must make the premise visible before the controls:

1. This models consolidation of power, not disappearance of organizational identities.
2. AI raises the stakes by increasing analysis, memory, coordination, and enforcement capacity.
3. Apex control is modeled as calcified: post-Apex institutions are curated subordinates, not independent rebirths.
4. The permanence rule is disclosed as a testable assumption, with failure conditions outside the current model.

### Validation

- Export explicit power-calcification assumptions from `web/model.mjs`.
- Make `nextAgentCount(1, parameters)` return `1` regardless of fragmentation inputs.
- Assert zero post-Apex independent births and zero modeled authority decay while operational.
- Require the page, reference ledger, paper, model card, architecture, and operations guide to disclose the same semantics.

## Revision 24: Economic-power weighting and conflict dynamics

**Date:** October 8, 2026

### Purpose

Replace equal visual influence with a transparent economic-power heuristic:

- countries use latest available World Bank GDP in current USD;
- technology companies use approximate annual revenue in current USD;
- institutions are ranked and displayed from greatest to least modeled economic power;
- country growth uses a trailing approximately ten-year nominal-USD GDP CAGR;
- company growth uses the average GDP growth of its listed origin economy or economies because company revenue histories are not present in the local dataset;
- each baseline conflict imposes an immediate power loss followed by recovery to a positive level premium.

### Data contract

A deterministic generator reads the checksum-locked WDI panel and the existing company baseline. Each record contains:

```text
name, type, basePowerUsd, baseYear,
averageGrowthRate, growthStartYear, growthEndYear,
growthMethod, sourceStatus
```

The World Bank panel provides GDP for 192 of the 195 displayed countries after explicit aliases. Holy See, Nauru, and North Korea remain `null` and sort after measured institutions. No value will be fabricated.

### Comparability limitation

GDP is value added; corporate revenue is gross sales. Combining them can double-count company activity already contained in national GDP and does not create an accounting-consistent world total. The requested joint ordering is therefore labeled an **economic-power heuristic**, not wealth, welfare, political legitimacy, military capability, market capitalization, or a valid aggregate balance sheet.

### Growth contract

For measured country `i`, use the geometric annual growth rate between the latest GDP observation and the closest positive observation approximately ten years earlier:

```text
g_i = (GDP_latest / GDP_start)^(1 / years) - 1
```

Growth is clipped to `[-5%, +15%]` for forward numerical stability. Company growth is an origin-country GDP proxy, not observed company revenue growth. If no origin GDP series is available, use the measured-country median and disclose the fallback.

### Conflict shock and rebound

Every baseline conflict at interval `Δc` applies this shared level multiplier by event age `a`:

```text
m(a) = 0.90 + (0.13 × a / 10),  0 ≤ a < 10 years
m(a) = 1.03,                    a ≥ 10 years
```

Thus each event creates an immediate 10% negative shock, recovers linearly for ten years, and ends with a 3% positive level premium. The total power path compounds baseline growth and all event multipliers in log space. These values are author-defined defaults; historical conflicts do not universally produce net-positive economic effects.

### Influence and assignment contract

- The constellation is sorted by modeled economic power at the selected year.
- At 225 centers, the strongest measured institution is labeled `Independent 1`.
- Economic rank determines deterministic hierarchy ordering, while every entity remains assigned exactly once.
- The headline Independent 1 influence metric uses its bloc's share of current modeled economic power, multiplied by the existing implementation depth.
- Structural center-count timing remains unchanged in this revision; GDP/revenue does not yet estimate conflict victory or absorption hazards.

### User interface

Add an economic-power ranking beneath the Big Cycle panel with current rank, institution, GDP/revenue basis, base value/year, growth proxy, current power share, and conflict-cycle phase. Node inspection must show the same economic metadata.

### Validation

- Deterministic generation and complete 225-record schema.
- Exactly 195 countries and 30 companies; all companies measured.
- Missing country GDP remains explicit and sorts last.
- Rankings descend by modeled power.
- Shock starts below one and recovery ends above one.
- Economic shares sum to one across measured institutions.
- Existing consolidation, Monte Carlo, and empirical outputs remain reproducible.

## Revision 25: Five-section article experience

**Date:** October 8, 2026

### Purpose

Transform Convergence Atlas from a model-first dashboard into an article-first research experience. Readers should understand the thesis, strongest model insights, and representative timelines before encountering controls or technical diagnostics.

### Information architecture

The page is divided into exactly five numbered article parts:

1. **Casual review** — plain-language thesis, major findings, representative timelines, and a direct link to the model interface.
2. **Deeper analysis** — power-calcification mechanism, why AI changes the historical control boundary, important distinctions, and limitations.
3. **Interactive model** — all controls, outcome metrics, economic ranking, trajectories, constellation, and current-result interpretation.
4. **Simulations and statistical analysis** — sensitivity diagnostics, target-five analysis, fixed scenarios, COW robustness/model comparison, Monte Carlo, empirical baseline, validation status, PCA, and scenario analysis.
5. **References and assumptions** — conceptual map, robustness roadmap, complete evidence ledger, and model boundary.

A compact article navigation bar links to every part. Section numbering and anchors are visible and keyboard accessible.

### Headline-insight contract

The casual review must put these tested findings near the top:

- Higher Institution loss probability per qualifying wave is the strongest direct accelerator.
- Internal conflict and external fragmentation are the strongest brakes and can produce non-convergence.
- Shorter conflict intervals and larger qualifying shares create more opportunities, but frequency alone cannot overcome replacement by fracture.
- Institution strength can accelerate consolidation through the Big Cycle layer; weak institutions under stress may fragment instead.
- Institutional-standard adoption affects effective authority after absorption, not structural `T₅`.
- AI architecture diffusion is separate and does not alter structural consolidation in the current equations.

Representative `T₅` results must be populated from generated artifacts rather than duplicated constants:

```text
fastest permitted                         2 years
secondary aircraft midpoint          ~1,167 years
wartime gross-exit anchor            ~2,833 years
German-consolidation anchor          ~4,000 years
COW central without internal conflict 4,500 years
longest attained inside horizon       5,000 years
COW central                          no reach; 15 centers remain
```

The COW-centered Monte Carlo headline must also be generated from the current profile: 18.3% reach, 2,597-year conditional median, and 81.7% right-censoring in the current artifact.

### Editorial rules

- Lead with conclusions, then methods.
- Use “model result,” “scenario,” or “conditional” rather than forecast language.
- Keep the casual section readable without equations.
- Preserve all existing technical content; reorganize rather than discard it.
- Link casual readers directly to `#model-interface`.
- Keep generated analytical values connected to their existing JavaScript artifacts.

### Implementation

`web/index.html` owns the five semantic wrappers and anchor navigation. `web/app.mjs` renders headline timeline and Monte Carlo cards from `TARGET_FIVE_ANALYSIS` and `MONTE_CARLO_RESULTS`. CSS distinguishes editorial prose, insight cards, article navigation, and technical sections.

### Validation

- Exactly five numbered article parts and five matching navigation anchors.
- Casual review appears before the model interface.
- CTA points to `#model-interface`.
- Dynamic summary uses generated target-five and Monte Carlo artifacts.
- Every existing control, analysis container, and evidence ledger remains present.
- Keyboard navigation, reduced-motion behavior, model tests, and HTTP smoke tests remain valid.

## Revision 26: Calendar-year outcome standard

**Date:** October 8, 2026

### Purpose

Replace user-facing elapsed outcome labels such as “2 years,” “year 5,000,” or “2,597 years” with actual calendar years based on the model epoch.

### Epoch contract

```text
BASE_YEAR = 2026
calendarYear(t) = 2026 + round(t)
```

Examples:

```text
elapsed 2       → 2028
elapsed 1,166.7 → 3193
elapsed 2,833.3 → 4859
elapsed 4,000   → 6026
elapsed 4,500   → 6526
elapsed 5,000   → 7026
```

### Semantic distinction

Calendar conversion applies to **points in modeled time**:

- target-five event year;
- structural consolidation year;
- effective Apex dominance year;
- adoption threshold year;
- selected timeline year;
- analysis horizon/censoring year;
- percentile, median, and restricted-mean event years;
- chart x-axis labels.

True **durations and rates** remain durations:

- conflict interval;
- qualifying-wave interval;
- recovery period;
- event age;
- average years between events;
- annual adoption and growth rates.

### Machine-readable compatibility

Existing elapsed numeric fields remain available for equations, statistical censoring, regression tests, and backward compatibility. Generated JSON/CSV records add explicit calendar fields:

```text
baseYear
targetCalendarYear
structuralCalendarYear
dominanceCalendarYear
conditionalMedianCalendarYear
p05CalendarYear
p95CalendarYear
censoringCalendarYear
```

Null event times remain null and display as “No reach by 7026” rather than receiving a fabricated date.

### Presentation rules

- Display a bare or prefixed calendar year (`2028` or `Year 2028`), never “2 years,” for an outcome.
- Display horizons as “through 7026” or “by 7026.”
- The scrubber displays only the calendar year.
- Chart x-axis labels use 2026–projection-end dates, not `+elapsed` labels.
- Statistical tables say “event year,” “median calendar year,” or “censored by 7026.”
- Tooltips may include elapsed duration only when needed for technical interpretation.

### Validation

- Verify epoch conversion at 0, 2, and 5,000.
- Require added calendar fields to equal `2026 + round(elapsed)`.
- Ensure null elapsed events retain null calendar dates.
- Audit page and generated reports for stale outcome phrases using elapsed years.
- Preserve interval and recovery duration wording.
- Regenerate all affected browser, CSV, JSON, Markdown, and checksum artifacts.

## Revision 27: Single-variable AI consolidation acceleration

**Date:** October 8, 2026

### Purpose

Add one adjustable variable representing the theory that consolidation becomes faster as AI deployment and prior consolidation reinforce one another. The implementation deliberately uses one bounded control rather than separate models for event clustering, merger kernels, preferential attachment, tempo, severity, and suppression.

### Variable

```text
κ_A ∈ [0,1]
default κ_A = 0.25
```

- `0`: disables endogenous acceleration and reproduces the prior constant-rate transition engine.
- `1`: enables the maximum permitted feedback strength.
- `0.25`: cautious author-defined default; not an empirical estimate.

### Feedback state

```text
A(t) = logistic AI architecture adoption
C(t) = (S_0 - S(t)) / (S_0 - 1)
F(t) = A(t) × C(t)
M(t) = min[M_max, 1 + κ_A(M_max - 1)F(t)]
M_max = 5
```

Acceleration begins at `1×` because no consolidation has yet accumulated. It rises only when both AI adoption and consolidation progress are present. The fixed ceiling prevents runaway or zero-interval behavior.

### Transition effects

The single multiplier affects two parts of the same consolidation hazard:

```text
Δt_effective(t) = Δt_base / M(t)
p_loss_effective(t) = min[0.95, 1 - (1 - p_loss_base)^M(t)]
```

This treats acceleration as repeated equivalent consolidation pressure: qualifying transitions arrive faster and each transition has more opportunity to remove independent authority. Internal conflict and external fragmentation remain explicit counterforces.

### Architecture boundary

`simulateConsolidation` recalculates `M(t)` before every event from current elapsed time and active-center count. It records the multiplier and accelerated probability on each event point and exposes the maximum multiplier reached.

The model keeps one control and one fixed ceiling. It does **not** separately implement:

- Hawkes self-exciting event arrivals;
- Smoluchowski/coagulation size-dependent merger kernels;
- preferential attachment or network-centrality capture;
- separate AI effects on tempo, severity, and fragmentation suppression;
- unbounded recursive intelligence or capability growth;
- stochastic correlated institution-level outcomes.

These remain documented alternatives. The cutoff prevents false precision and avoids adding several unidentifiable parameters to an already exploratory model.

### Analysis contract

Acceleration becomes a structural input in deterministic scenarios, PCA, one-at-a-time analysis, global screening, target-five sweeps, and all Monte Carlo profiles. Every prior artifact must be regenerated. A zero-acceleration ablation remains available through the control and analysis levels.

### UI contract

Add one slider labeled **AI consolidation acceleration** with an accessible evidence card. Display the current multiplier and accelerated Institution-loss probability. Explain that the control bundles multiple plausible feedback mechanisms and that the 5× ceiling is a modeling boundary.

### Validation

- `κ_A=0` exactly reproduces prior event interval/probability behavior.
- Initial multiplier equals `1` at zero consolidation progress.
- Multiplier is monotonic in adoption, progress, and `κ_A`.
- Multiplier never exceeds `5` and loss probability never exceeds `0.95`.
- Event times remain strictly increasing.
- Defaults rationale, Monte Carlo registry, PCA/scenario columns, references, reports, and browser controls remain synchronized.

## Revision 28: Complete annotated research bibliography

**Date:** October 8, 2026

### Purpose

Make every research reference discoverable and clearly annotated at the bottom of the article, with direct links to papers, datasets, standards, reports, or authoritative sites wherever available.

### Source contract

A deterministic generator combines:

1. all records in `research/source-catalog.v1.json`;
2. curated research links discovered in project evidence/license files through `research/bibliography-supplement.v1.json`; and
3. every source link in `web/references.mjs`.

Entries are deduplicated by normalized HTTPS URL. Source-catalog metadata takes precedence for version, coverage, verification, license, and access status; interface-reference uses are merged into the same entry.

### Annotation contract

Every bibliography entry contains:

```text
title
url
owner or publisher, when known
source group
version and coverage, when known
what it supports / planned use
where it is used in this model
verification or evidence status
limitations, access notes, or license warning
```

No entry may appear without a clickable external link and a substantive annotation. Links open only when selected and use safe `noopener noreferrer` behavior.

### Presentation

The bibliography is the final substantive block in Section 5, after the model boundary. It is grouped into:

- empirical datasets and indicators;
- theory, methods, and comparison models;
- governance, standards, rights, and institutional context.

The existing assumption-oriented reference ledger remains because it answers “which evidence supports this assumption?” The complete bibliography answers “what are all sources, papers, and sites used anywhere in the project?”

### Generated artifacts

- `analysis/generate_annotated_bibliography.mjs`
- `web/annotated-bibliography.mjs`
- `analysis/output/annotated-bibliography.json`
- `analysis/output/ANNOTATED_BIBLIOGRAPHY.md`
- `research/annotated-bibliography-manifest.json`

### Validation

- Every source-catalog ID appears in the generated bibliography.
- Every reference-registry URL appears after normalization.
- URLs are HTTPS and unique.
- Every entry has support and limitation annotations.
- Browser rendering includes title, direct link, status, use, and caveat.
- Generation is byte-identical and checksum-verified.
- The bibliography is positioned after the model-boundary section.

## Revision 29: Existential-risk scope boundary

**Date:** October 8, 2026

### Purpose

Add a direct scope section explaining which AI existential-risk pathways the model includes, excludes, or sets to zero. The section distinguishes authored boundary assumptions from findings generated by the consolidation equations.

### Included pathway

The model analyzes one long-run pathway:

```text
AI coordination
→ faster institutional consolidation
→ one Apex authority
→ permanent political calcification and human disempowerment
→ extinction-equivalent event
```

It does not model a biological death count. It classifies permanent, irreversible human disempowerment as an extinction-equivalent event. Biological survival does not change the existential classification once humans permanently lose control over their future.

### Boundary assumptions

1. **Human-dependent infrastructure:** AI compute, energy, fabrication, maintenance, deployment, physical security, logistics, and robotics remain dependent on human institutions. While those dependencies persist, the model prohibits a self-sufficient machine takeover and total loss of material control.
2. **Analytical recursive improvement only:** capability improvement affects analysis, planning, prediction, and decision support. It does not grant autonomous fabrication, repair, energy production, transport, or resource movement.
3. **No incremental mass-destruction hazard:** the model assigns AI-enabled biological, cyber, nuclear, and military destruction no greater hazard than existing human-enabled systems. Automated monitoring and decision discipline may reduce risk, but no reduction is quantified.
4. **Other pathways set to zero:** multipolar machine disempowerment, objective drift, infrastructure cascade, non-state bypass, and direct extinction mechanisms receive no probability mass in this model. The author treats them as secondary to the institutional-consolidation thesis.

### Interpretation rule

These are explicit scope assumptions, not outputs of the COW, Monte Carlo, PCA, or historical analyses. Inside the model they are binding. Outside the model they remain untested. The page must state both facts directly.

### Presentation

Add an `Existential-risk boundary` block in Section 5 before the bibliography. Show each pathway, its model treatment, the governing assumption, and the resulting scope consequence. Link the block to existing AI governance, infrastructure, and singleton references.

### Validation

- The page states that biological extinction is not modeled and permanent disempowerment is extinction-equivalent.
- Human infrastructure dependence and analytical-only recursive improvement are explicit.
- Incremental AI mass-destruction hazard is set to zero by assumption.
- Excluded pathways are listed by name.
- The section appears in model scope before the annotated bibliography.
- Model card, paper, README, architecture, and changelog use identical semantics.

## Revision 30: Separate Apex coordination, disempowerment, and extinction

**Date:** October 8, 2026

### Decision

Reverse the prior one-to-one extinction-equivalent classification. Permanent human disempowerment is an existential catastrophe or civilizational-succession outcome, not biological extinction. Apex coordination does not determine either outcome by itself.

### Outcome taxonomy

```text
T_Apex          = one coordinating hierarchy gains effective final authority
T_Disempowerment = humans irreversibly lose meaningful collective decision rights
T_Extinction     = the human population ceases to exist

T_Apex ≠ T_Disempowerment ≠ T_Extinction
```

The production equations calculate only `T_Apex`. They do not calculate `T_Disempowerment` or `T_Extinction`.

### Post-Apex outcome classes

When Apex coordination occurs, the result remains unclassified among:

- AI constitutional coordination with protected human authority;
- displacement of a narrow human elite with broader human agency;
- a new human–AI coordinating institution;
- civilizational succession with protected but subordinate humans;
- permanent irreversible human disempowerment;
- biological extinction.

### Required future dimensions

Classification requires human decision-right share, constitutional authority, consent and legitimacy, corrigibility/reversibility, appeal and exit rights, welfare, and biological survival. None is currently parameterized.

### Compatibility

Remove `extinctionEquivalentYear()` and the assumption that permanent disempowerment equals extinction. Replace them with `civilizationalOutcome()`, which reports the calculated Apex year and null/unknown disempowerment and extinction years.

### Presentation

Section 5 must report COW Apex coordination results as Apex results—not extinction probabilities. It must state that the model does not determine the post-Apex governance class. The previously listed scope exclusions remain visible as assumptions, but they cannot convert Apex dominance into extinction.

## Revision 31: Durable calibration, stochastic transitions, and event probabilities

**Date:** October 8, 2026

### Calibration

- Institution loss probability per qualifying wave: **11%** (durable COW major-wave mean 11.2%, five-year gap, five-exit threshold).
- Qualifying share: **0.36**, so `25 / 0.36 = 69.4` years between qualifying waves, matching three durable major waves across 1816–2024 (`208 / 3 ≈ 69.3`).
- The production-prior benchmark reads these defaults instead of hard-coding `0.15 × 0.15 / 25`.

### Stochastic transitions

Each qualifying wave draws:

```text
losses    ~ Binomial(S, p_effective)
fragments ~ Binomial(S, i_effective) + external fragments
```

A seeded PRNG makes every path reproducible. Rounding-based minimum-loss and fracture thresholds are removed. The deterministic stall stop is removed; runs continue to the horizon. The two-to-one terminal rule and absorbing Apex state remain.

### Acceleration

Acceleration multiplies tempo only: `Δt′ = Δt / M(t)`. Loss probability is no longer compounded.

### Economic layer

- Conflict exposure `e_i ∈ [0,1]` = country MID onset rate (1946–2014) / 90th-percentile rate; unmapped countries use the median; companies use origin-country mean exposure.
- Event multiplier becomes `1 + e_i(m(a) − 1)`, so shocks and rebounds change relative shares.
- Growth converges: `g_i(t) = g∞ + (g_i − g∞)e^(−t/τ)`, `g∞ = 4%` nominal, `τ = 25` years.

### Event probabilities

`replicateOutcomes(parameters, n)` runs common-random-number replicates and reports median and percentile years plus reach probabilities for five centers and Apex coordination by 2126 and the horizon. Representative results, scenarios, and target-five anchors use 1,000 replicates; sweeps use 25. Monte Carlo now combines parameter and process uncertainty in each run.

### Browser

The chart shows one seeded path. Event probabilities come from 200 cached replicates, recomputed only when non-time parameters change.

## Revision 32: Review remediation and stochastic wave process

**Date:** October 8, 2026  
**Status:** Approved by the author for implementation

### Purpose

Correct the interpretation, calibration, and runtime defects identified in the post-52.5-year review. The core remains an authored current-wave scenario—not an empirical forecast.

### Decisions

1. **Scenario labeling:** Rename “Expected model” to “Core scenario · authored assumptions.” Completion shares are explicitly within-model frequencies. Replace the finite-sample maximum (“100% probability”) with the 95th percentile of all runs.
2. **Coherent ablation:** The core keeps `currentWaveInProgress=1` and `qualifyingShare=0.476` (52.5-year authored recurrence). The no-current-wave scenario sets `currentWaveInProgress=0` and `qualifyingShare=0.36` (69.4-year historical-only reference).
3. **Current-wave contract:** An active wave resolves exactly three elapsed years after the 2026 epoch (2029), independent of later-wave tempo.
4. **Wave arrivals:** After the current wave, every interarrival is a seeded exponential draw with the selected mean interval, divided by the tempo-only acceleration multiplier. This is a Poisson-renewal scenario convention, not an empirical fit.
5. **Correlated severity:** Every wave draws one latent loss probability from a beta distribution centered on the effective loss assumption, then draws institution losses binomially. Beta concentration `14` approximates dispersion across the three observed durable COW wave shares and induces within-wave correlation. Internal fragmentation remains a separate binomial draw.
6. **Computational censoring:** `event-limit` is a first-class outcome. Unknown post-limit center counts are null and excluded from terminal summaries; outcome totals must conserve the run count. Each Monte Carlo CSV row records its actual simulation seed.
7. **Benchmark alignment:** The production prior uses the active 15% core loss assumption. It remains an annual reduced-form diagnostic against all COW exits, not validation of permanent Apex coordination.
8. **Interaction correctness:** Institution-node rerenders retain the economic context.
9. **Structural transparency:** The featured assumptions disclose zero external fragmentation, forced 2→1 termination, permanent Apex authority, and zero post-Apex independent births.

### Runtime contracts

```text
current wave:       Δt₁ = 3 years when enabled
later wave arrival: Δtⱼ ~ Exponential(mean = base interval / acceleration)
wave severity:      qⱼ ~ Beta(pκ, (1-p)κ), κ = 14
losses:             Lⱼ ~ Binomial(Sⱼ, qⱼ)
fragments:          Fⱼ ~ Binomial(Sⱼ, i)
next centers:       Sⱼ₊₁ = clamp(Sⱼ − Lⱼ + Fⱼ + external)
```

The two-to-one terminal rule and absorbing Apex state remain explicit assumptions.

### Validation additions

- Fixed-2029 timing across fast and slow settings.
- Mean interarrival and beta-binomial mean/overdispersion tests.
- Probability-year monotonicity for p25/p50/p75/p95.
- Coherent no-wave scenario restores 0.36 qualifying share.
- Monte Carlo outcome conservation and event-limit terminal-null policy.
- Actual per-run seed replayability.
- Browser institution-node click smoke coverage where the test harness permits DOM interaction.

## Revision 33: Historical reset versus AI persistence

**Date:** October 9, 2026  
**Status:** Approved for implementation

### Purpose

Make the central distinction explicit: historical consolidation repeatedly lost coherence through human succession, generational reinterpretation, institutional forgetting, economic crisis and reform, and enforcement gaps. The core scenario assumes AI-mediated institutions can retain objectives, records, threat models, biases, and grievances across those transitions.

### Presentation

1. Add a prominent full-width comparison immediately after the Casual Review lead and before quantitative findings.
2. Contrast five historical reset channels with their AI-persistence counterparts: succession, generational memory, economic pressure, administrative decay, and rival organization outside the center’s visibility.
3. State the symmetrical consequence: durable memory preserves useful lessons and institutional competence, but can also preserve inherited bias, targeting logic, and grievance.
4. Clarify that economic pressure and human turnover continue; the premise is that they stop automatically resetting institutional objectives and control systems.
5. Add a deeper-analysis note that generational forgetting is not separately parameterized. The production model represents its removal through zero post-Apex authority decay, persistent machine memory, and the absorbing Apex state.
6. Reuse the existing `powerCalcification` evidence topic; update its summary and supporting prose rather than adding an unsupported empirical variable.

### Epistemic boundary

Use direct language for the model contract and assumption language for future claims. Do not say AI has already eliminated institutional forgetting or that every grievance necessarily persists. State that nothing fades merely because the original human decision-makers leave; deliberate revision, constitutional controls, or system failure would be required.

## Revision 34: Scope responses, clustered arrivals, and run-share semantics

**Date:** October 9, 2026  
**Status:** Approved for implementation

### Decisions

1. Remove the forced terminal shortcut. A transition from three centers to two remains two; one center occurs only when the stochastic transition actually produces one.
2. Retain the count-only architecture. The model does not predict winners, internal institutional politics, or lineage. Internal conflict matters only when it produces a fully independent top-level center. Persistent entities and directed inheritance remain an expansion path.
3. Replace exponential interarrivals with a sparse clustered historical-gap bootstrap. Later-wave gaps sample normalized versions of the 6-, 36-, and 124-year intervals between the 1860, 1866, 1990, and assumed 2026 waves, preserving the selected mean. This represents short/medium/long clustering without adding a second acceleration variable or implementing Hawkes self-excitation.
4. Replace public probability/P-notation with conditional run-share language. Internal schema keys remain backward compatible, but human-facing labels identify fractions or percentiles of seeded runs under authored assumptions.
5. Retain composite variables instead of separate tipping-point submodels. The page must state that this is a deliberate tractability and defensibility tradeoff, not parameter identification.
6. Retain calendar years and the 5,000-year horizon as model stress-test coordinates. State directly that they have no forecast or evidentiary status.
7. Retain country and technology-company nodes while stating their legal and coercive differences. The author expects international conflict to push strategic technology firms toward nationalization, state direction, or equivalent dependency; this is a scenario premise, not an established inevitability.
8. Retain the current-wave assumption. Cite Ray Dalio’s February 2026 statement that the world is in Stage 6 of his Big Cycle—great disorder and a clash of great powers—as interpretive authority. Consolidating severity remains uncertain.
9. Demote historical exit-model comparison from validation to descriptive diagnostic. It tests a narrow COW-exit analogue and does not validate the future model.
10. Record expansion priorities: explicit memory/decay/unlearning, succession and objective inheritance, observability/concealment, economic adaptation, de-calcification, persistent identities, and type-specific state/company transitions.

### Clustered-gap contract

```text
historical/assumed gaps = [6, 36, 124] years
reference mean          = 55.333 years
sampled gap             = selected mean × sampled gap / reference mean
accelerated gap         = sampled gap / tempo multiplier
```

The three-gap bootstrap is sparse and assumption-dependent. It is a simple clustered scenario mechanism, not a fitted point process.
