# Model Robustness Roadmap

**Date:** October 6, 2026  
**Current maturity:** Transparent exploratory model; not calibrated or predictive

## Executive assessment

The current model is useful for exposing assumptions and comparing timescales. It is not yet suitable for forecasting because entities are equally weighted, events occur at expected intervals, transition rates are shared, blocs are synthetic, and defaults are mostly illustrative.

The following improvements are ordered by their expected effect on validity.

## 1. Replace equal nodes with multidimensional capability

A state and a corporation should not each contribute exactly one interchangeable unit of power. Give entity `i` a time-varying capability vector:

```text
W_i(t) = (
  economic resources,
  population or users,
  compute,
  data access,
  coercive capacity,
  jurisdiction,
  legitimacy,
  network centrality
)
```

Do not collapse this vector into one score until the modeled interaction specifies which capabilities matter. Military conflict, technical standardization, corporate acquisition, and electoral legitimacy require different dimensions.

**Candidate anchors:** World Bank GDP/population, COW National Material Capabilities, Fortune revenues, Stanford AI Index compute and investment data.

## 2. Separate entity types and transition mechanisms

Use different hazards for countries, corporations, federations, international institutions, and hybrid blocs:

```text
country + country      → federation, annexation, alliance, or stalemate
company + company      → acquisition, merger, divestiture, or failure
country + company      → regulation, nationalization, capture, or delegation
bloc → fragments       → secession, spin-off, schism, or succession split
```

A single Institution event probability cannot represent all of these.

**Candidate anchors:** COW state membership, UCDP conflict data, DOJ/FTC merger frameworks, corporate transaction datasets.

## 3. Replace synthetic blocs with a multiplex network

Create network layers for:

- formal alliances;
- trade dependence;
- ownership and investment;
- cloud and semiconductor dependencies;
- shared language and ideology;
- geography;
- treaties and international institutions; and
- data and platform interoperability.

Consolidation likelihood should depend on network proximity, dependency, and asymmetric leverage. The visualizer's current balanced color groups are explicitly non-empirical.

**Candidate anchors:** COW Formal Alliances and Trade datasets, UN treaty data, supply-chain datasets, corporate ownership filings.

## 4. Introduce seeded stochastic simulation

Replace mean-spaced events with distributions:

```text
conflict arrivals       ~ Poisson or Hawkes process
severity                ~ fitted heavy-tailed distribution
consolidation outcome   ~ categorical transition probabilities
internal fracture       ~ entity-specific hazard
AI adoption             ~ heterogeneous diffusion process
```

Run thousands of seeded simulations and report median, 5th–95th percentile interval, probability of convergence, and probability of renewed fragmentation. Preserve a deterministic seed for reproducibility.

## 5. Make conflict and consolidation endogenous

Current conflict frequency is independent of the state of the system. Instead, estimate hazards from:

- power transitions;
- resource shocks;
- alliance rigidity;
- governance instability;
- economic interdependence;
- deterrence;
- concentration of compute and supply chains; and
- prior conflict, which can create self-excitation.

This allows consolidation to change future conflict risk rather than replaying the same interval forever.

## 6. Split internal conflict by type

Replace the single global slider with:

```text
i_G(t) = country internal-fracture hazard
i_T(t) = corporate breakup/spin-off hazard
i_B(t) = mixed-bloc succession hazard
```

Country proxies can draw from UCDP, V-Dem, and World Bank political-stability indicators. Corporate proxies should include ownership concentration, leadership succession, antitrust action, divestitures, and spin-offs.

## 7. Calibrate through historical backtesting

Choose historical start dates and ask whether the model reproduces observed state-system counts and major reorganizations without seeing the future data.

Suggested process:

1. Fit parameters on an early interval from COW State System Membership.
2. Predict a held-out later interval.
3. Compare predicted state count, transition timing, and fragmentation frequency.
4. Repeat with rolling windows.
5. Reject or revise mechanisms that fail out-of-sample.

Corporate transitions require a parallel merger, failure, and spin-off history.

## 8. Report sensitivity and identifiability

For each conclusion, show which assumptions dominate it. Use global sensitivity analysis rather than changing one slider at a time. Identify parameter combinations that produce indistinguishable outputs.

Required output:

- tornado or Sobol sensitivity chart;
- convergence probability surface;
- parameter correlation and identifiability warnings;
- explicit uncertainty ranges; and
- comparison of optimistic, central, and fragmentation-dominant scenarios.

## 9. Model objectives and membership separately

An institution's membership definition, beneficiary class, controlling coalition, and objective function are not interchangeable. Preserve separate state variables:

```text
recognized members
beneficiaries
controllers
objective weights
territorial jurisdiction
technical dependencies
```

This prevents “serves everyone” from being incorrectly interpreted as “controlled by everyone.”

## 10. Add directive evolution and institutional learning

Model whether directives are immutable, interpreted by controllers, amended through governance, or modified by the institutional AI. Track objective drift separately from membership dilution.

Potential outcomes include literal continuity, dynastic expansion, instrumental universalism, semantic universalism, and institutional self-preservation.

## 11. Define falsifiable outputs

Before calibration, state what evidence would count against the model. Examples:

- consolidation repeatedly fails to reduce institutional diversity;
- shared AI architecture increases rather than reduces sovereignty claims;
- internal conflict declines as institutions scale;
- controlling coalitions broaden at the same rate as beneficiary classes; or
- historical transition hazards do not depend on the proposed variables.

A model that can explain every outcome after the fact is not robust.

## Recommended implementation sequence

### Phase A — Evidence and transparency

- Complete hover/focus references for all controls and assumptions.
- Label every parameter empirical, methodological, or author-defined.
- Add source dates and version identifiers.

### Phase B — Uncertainty

- Add seeded Monte Carlo events.
- Show confidence intervals and convergence probability.
- Add sensitivity analysis.

### Phase C — Heterogeneous agents

- Add country and corporate capability vectors.
- Split internal-conflict and transition parameters by entity type.
- Preserve dimensions instead of relying on one power score.

### Phase D — Network and calibration

- Import alliance, trade, governance, conflict, and transaction histories.
- Build empirical network layers.
- Fit on historical data and backtest out-of-sample.

## Minimum standard before making forecasts

Do not present a year for one governing AI as a forecast until the model has:

1. calibrated transition rates;
2. entity heterogeneity;
3. stochastic uncertainty intervals;
4. fragmentation and re-entry;
5. out-of-sample historical validation; and
6. sensitivity analysis showing the conclusion is not driven by one arbitrary default.

## October 7, 2026 analysis disposition

### Implement now

1. Wave-definition robustness across cluster gaps and major-wave thresholds.
2. Leave-one-major-wave-out calibration.
3. Chronological comparison with no-exit, production-prior, constant-hazard, trend, birth–death, wave-memory, and full-wave alternatives.
4. Fixed scenario challenge matrix.

### Later opportunities

- **Historical exit review:** Manual causal classification of all 49 COW exits is not required for the current L1 analysis but remains an opportunity to move toward L2.
- **Unconditional-surrender registry:** Build later because COW provides side-winner outcomes but no dedicated unconditional-surrender field.
- **Stochastic correlated waves:** Partially implemented with clustered-gap interarrivals and beta-binomial wave severity; entity/network correlation remains future work.
- **Competing risks:** Later separation of consolidation, fragmentation, interruption, and re-entry hazards.
- **Power and terminal rules — high priority:** Test equal versus capability-weighted Institutions, bipolar persistence, natural final-rival loss, and alternative structural-dominance thresholds.
- **State/corporate mechanisms — high priority with power testing:** Separate sovereign and corporate event processes rather than using one shared probability.
- **Observability and concealment:** Later enhancement adding imperfect detection, delay, compartments, and correlated oversight failures while retaining certain remediation after detection.

Deferred work must remain incomplete in validation status. None of these entries authorizes predictive L3 claims.

## Monte Carlo parameter uncertainty — implemented October 8, 2026

Version 1.4 runs four independent Latin-hypercube profiles with 10,000 samples each and seeded process uncertainty. It reports censored `T₅`, structural/effective Apex timing, p25/p50/p75/p95 completion years, terminal bands, event-limit censoring, convergence checkpoints, and Spearman sensitivity. The COW-centered profile reaches five in 76.4% of eligible runs and effective Apex coordination in 70.8%. These are authored run shares, not real-world probabilities.

Still deferred:

- empirically estimated distribution widths;
- correlated Gaussian-copula parameter sampling;
- entity- and network-specific loss dependence beyond the implemented beta-binomial wave severity;
- posterior calibration and posterior predictive checking;
- non-Poisson arrival models and correlated fragmentation processes.

These are future enhancements and remain blockers for predictive interpretation.

## Economic-weighting status — October 8, 2026

Economic ranking is now partially implemented: country GDP and technology-company revenue determine browser ordering and the displayed Independent 1 influence share. This does not complete heterogeneous power modeling. GDP/revenue remains a non-comparable, double-counting heuristic; conflict outcomes remain count-based; and military, compute, data, network, jurisdictional, and legitimacy dimensions remain future work.

## Revision 34 expansion register

Retained simple-model boundaries: count independent centers rather than winners; count internal conflict only when a complete split creates a new top-level Institution; retain composite controls rather than unidentifiable tipping-point submodels; treat 5,000-year dates as stress-test coordinates; and treat historical prediction as a descriptive analogue diagnostic. Future expansion priorities are explicit memory/decay/unlearning, objective inheritance, observability and concealment, split lineage, economic adaptation, persistent winner/loser identities, nested state–technology-firm relations including nationalization, and reversible de-calcification.
