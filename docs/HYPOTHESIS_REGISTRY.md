# Hypothesis Registry

**Contract version:** 1.0.0  
**Frozen:** 2026-10-06T12:46:41-04:00  
**Status:** phase-0-preregistered-internal

> These hypotheses are intended to be rejected when evidence fails their declared tests. They are not conclusions.

## Summary

| ID | Hypothesis | Primary outcomes | Horizons |
|---|---|---|---|
| H1 | Debt stress, inequality, and internal disorder increase fragmentation or loss-of-control hazard. | fragmentation, loss_top_level_autonomy | 1, 5, 10, 25 years |
| H2 | Relative productive, financial, and material strength predicts which Institution gains influence during restructuring. | consolidation_gain, loss_top_level_autonomy | 1, 5, 10, 25 years |
| H3 | Formal institutional consolidation or standard adoption precedes effective implementation by a measurable lag. | standard_adoption, adoption_lag | 1, 5, 10, 25 years |
| H4 | As the field contracts below approximately 20 Institutions, effective power becomes comparatively balanced and influence above 50 percent is short-lived before terminal consolidation or reversal. | majority_episode_duration, apex_dominance | 1, 5, 10, 25, 50 years |
| H5 | Technical standardization can increase without producing top-level political or institutional consolidation. | standard_adoption, transition_any, apex_dominance | 1, 5, 10, 25 years |
| H6 | Big Cycle variables improve transition prediction beyond simpler power-transition and debt-only models. | transition_any, consolidation_gain, fragmentation, loss_top_level_autonomy | 5, 10, 25 years |
| H7 | Multiplex network dependency predicts consolidation and subordination beyond direct economic or material size. | consolidation_gain, loss_top_level_autonomy | 1, 5, 10, 25 years |

## H1 — Debt stress, inequality, and internal disorder increase fragmentation or loss-of-control hazard.

- **Units:** state-year
- **Predictors:** debt_stress, inequality, internal_disorder
- **Outcomes:** fragmentation, loss_top_level_autonomy
- **Horizons:** 1, 5, 10, 25 years
- **Null model:** Age/time baseline hazard with region and period strata but no stress variables.
- **Metrics:** time-dependent Brier score, concordance index, calibration slope, out-of-sample log score
- **Falsification:** Reject or revise if effects are absent, reverse sign across most held-out windows, are not calibrated, or fail to improve preregistered out-of-sample metrics.
- **Sources:** Global Debt Database; World Inequality Database; Worldwide Governance Indicators; V-Dem Country-Year Dataset; UCDP conflict datasets

## H2 — Relative productive, financial, and material strength predicts which Institution gains influence during restructuring.

- **Units:** state-dyad-year, institutional-transition-event
- **Predictors:** relative_gdp, relative_trade_share, relative_innovation, relative_material_capability, reserve_currency_share
- **Outcomes:** consolidation_gain, loss_top_level_autonomy
- **Horizons:** 1, 5, 10, 25 years
- **Null model:** Larger-population-only and prior-event-frequency baselines.
- **Metrics:** pairwise accuracy, area under precision-recall curve, Brier score, out-of-sample log score
- **Falsification:** Reject or simplify if the strength vector does not outperform size-only and historical-frequency baselines across held-out periods.
- **Sources:** World Development Indicators; Global Innovation Index; SIPRI Military Expenditure Database; National Material Capabilities; Currency Composition of Official Foreign Exchange Reserves

## H3 — Formal institutional consolidation or standard adoption precedes effective implementation by a measurable lag.

- **Units:** institutional-transition-event
- **Predictors:** formal_adoption_date, mandate_strength, switching_cost, administrative_capacity
- **Outcomes:** standard_adoption, adoption_lag
- **Horizons:** 1, 5, 10, 25 years
- **Null model:** Immediate implementation at the formal adoption date.
- **Metrics:** median absolute lag error, survival calibration, prediction interval coverage
- **Falsification:** Reject the lag mechanism if implementation is indistinguishable from immediate adoption after accounting for reporting delay, or if estimated lags do not generalize across standards.
- **Sources:** IFRS jurisdiction profiles; ISO Survey of certifications; Google IPv6 adoption statistics

## H4 — As the field contracts below approximately 20 Institutions, effective power becomes comparatively balanced and influence above 50 percent is short-lived before terminal consolidation or reversal.

- **Units:** majority-influence-episode, institutional-transition-event
- **Predictors:** remaining_institutions, largest_influence_share, second_largest_influence_share, coalition_blocking_power
- **Outcomes:** majority_episode_duration, apex_dominance
- **Horizons:** 1, 5, 10, 25, 50 years
- **Null model:** Majority episodes have the same duration distribution as non-majority concentration episodes.
- **Metrics:** median majority duration, reversal probability, terminal transition probability, survival curve difference
- **Falsification:** Reject the terminal-majority rule if stable 51–99 percent influence episodes are common and long-lived relative to comparable concentration episodes.
- **Sources:** Correlates of War State System Membership; National Material Capabilities; Formal Alliances; World Development Indicators

## H5 — Technical standardization can increase without producing top-level political or institutional consolidation.

- **Units:** state-year, institutional-transition-event
- **Predictors:** technical_standard_adoption, architecture_adoption
- **Outcomes:** standard_adoption, transition_any, apex_dominance
- **Horizons:** 1, 5, 10, 25 years
- **Null model:** Technical adoption and institutional consolidation share one common transition process.
- **Metrics:** incremental hazard ratio, mutual information, out-of-sample Brier score, calibration
- **Falsification:** Reject independence if technical convergence consistently predicts rapid common top-level authority across held-out standards and periods.
- **Sources:** IFRS jurisdiction profiles; ISO Survey of certifications; Google IPv6 adoption statistics; Stanford AI Index

## H6 — Big Cycle variables improve transition prediction beyond simpler power-transition and debt-only models.

- **Units:** state-year, state-dyad-year
- **Predictors:** productive_strength, systemic_cycle_stress, external_transition_pressure
- **Outcomes:** transition_any, consolidation_gain, fragmentation, loss_top_level_autonomy
- **Horizons:** 5, 10, 25 years
- **Null model:** Constant hazard, debt-only, material-power-only, and power-transition-only models.
- **Metrics:** out-of-sample log score, Brier score, concordance index, calibration error
- **Falsification:** Reject the composite if it does not exceed the best simple baseline by the preregistered practical margin in rolling held-out tests.
- **Sources:** The Changing World Order manuscript; World Development Indicators; Global Debt Database; World Inequality Database; Global Innovation Index; SIPRI Military Expenditure Database; V-Dem Country-Year Dataset

## H7 — Multiplex network dependency predicts consolidation and subordination beyond direct economic or material size.

- **Units:** state-dyad-year
- **Predictors:** alliance_dependency, trade_dependency, financial_dependency, infrastructure_dependency, network_centrality
- **Outcomes:** consolidation_gain, loss_top_level_autonomy
- **Horizons:** 1, 5, 10, 25 years
- **Null model:** Direct relative-size and geographic-distance model without network measures.
- **Metrics:** out-of-sample log score, area under precision-recall curve, Brier score, calibration slope
- **Falsification:** Reject the network mechanism if network variables add no stable held-out predictive value after direct size, distance, and period controls.
- **Sources:** Formal Alliances; Bilateral Trade; World Development Indicators; BIS statistics

## Evaluation policy

- **Temporal splits:** Rolling-origin temporal evaluation with the final interval held untouched until model selection is complete.
- **Model selection:** A complex model advances only if it improves calibration or predictive score over the best simpler baseline by a preregistered practical margin in a majority of held-out windows.
- **Right-censoring:** Retain censoring indicators and event times. Never replace a non-event with the horizon as if it were observed, except clearly labeled exploratory diagnostics.
- **Rare events:** Prefer precision-recall, calibrated probabilities, and proper scoring rules over accuracy.
- **Negative results:** Record null, unstable, and sign-reversing results in the same report as supportive results.
