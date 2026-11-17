# PCA and Scenario Analysis

**Generated:** October 6, 2026  
**Synthetic observations:** 768  
**Scenario archetypes:** 12  
**Status:** Model-behavior analysis, not empirical inference

## Scope warning

This PCA decomposes correlated assumptions generated around authored scenario archetypes. It does not discover components in observed world data. Component signs are arbitrary, components depend on the scenario design, and correlations with outcomes are descriptive rather than causal.

## Explained variance

| Component | Variance | Cumulative | Correlation with log capped Apex time |
|---:|---:|---:|---:|
| PC1 | 43.4% | 43.4% | +0.280 |
| PC2 | 24.4% | 67.8% | -0.525 |
| PC3 | 10.8% | 78.6% | +0.297 |
| PC4 | 9.0% | 87.6% | +0.107 |
| PC5 | 7.2% | 94.8% | -0.003 |
| PC6 | 1.6% | 96.4% | -0.142 |
| PC7 | 1.3% | 97.8% | +0.162 |
| PC8 | 0.7% | 98.5% | -0.064 |

The first **4 components** explain at least 80% of input variance.

## Leading component loadings

### PC1 — 43.4%

Internal conflict `+0.396`; Institution strength `-0.377`; Systemic stress `+0.353`; Qualifying conflict share `+0.333`; Institutional adoption `-0.326`

### PC2 — 24.4%

Institution event probability `+0.540`; Conflict interval `-0.409`; Systemic stress `+0.358`; Economic coupling `+0.348`; Institution strength `+0.256`

### PC3 — 10.8%

AI architecture spread `+0.552`; External fragments `+0.472`; Institutional adoption `+0.460`; Internal conflict `+0.362`; AI consolidation acceleration `-0.247`

### PC4 — 9.0%

AI consolidation acceleration `+0.968`; AI architecture spread `+0.146`; External fragments `+0.136`; Institutional adoption `+0.112`; Internal conflict `+0.088`

## Scenario outcomes

| Archetype | Apex reach | Median Apex calendar year among reached | Base Apex calendar year | Full consolidation reach |
|---|---:|---:|---:|---:|
| Rapid restructuring | 28.1% | 2123 | — | 28.1% |
| High-stress hegemon | 67.2% | 2150 | 2159 | 67.2% |
| Productive ascent | 100.0% | 2498 | 2441 | 100.0% |
| Corporate platform dominance | 68.8% | 2720 | 2840 | 68.8% |
| Neutral baseline | 73.4% | 3680 | 4330 | 73.4% |
| Slow federation | 64.1% | 4801 | 4664 | 64.1% |
| Stable pluralism | 0.0% | — | — | 0.0% |
| Debt and disorder transition | 0.0% | — | — | 0.0% |
| Fragmentation spiral | 0.0% | — | — | 0.0% |
| Technical standardization | 0.0% | — | — | 0.0% |
| Multipolar equilibrium | 0.0% | — | — | 0.0% |
| Weak incumbent transition | 0.0% | — | — | 0.0% |

## Rank sensitivity to Apex timing

Positive Spearman values mean higher input values are associated with later or censored Apex dominance in this authored scenario set; negative values mean earlier dominance.

| Variable | Spearman correlation | Apex-reach correlation |
|---|---:|---:|
| External fragments | +0.769 | -0.654 |
| Internal conflict | +0.555 | -0.550 |
| Institution strength | -0.519 | +0.469 |
| Institution event probability | -0.487 | +0.443 |
| Institutional adoption | -0.345 | +0.175 |
| AI architecture spread | -0.220 | +0.116 |
| Systemic stress | +0.053 | -0.141 |
| Qualifying conflict share | +0.030 | -0.076 |
| AI consolidation acceleration | +0.020 | -0.022 |
| Conflict interval | +0.006 | -0.022 |
| Economic coupling | -0.002 | -0.057 |

## Interpretation guardrails

- PCA identifies variance directions, not causes.
- The archetypes intentionally correlate assumptions, so component structure partly reflects author choices.
- Right-censored scenarios are assigned the calendar-year 7026 horizon only for descriptive correlations.
- Binary reach probabilities are frequencies across synthetic perturbations, not real-world probabilities.
- A future empirical PCA must use observed, versioned country/company data and missing-data procedures.
- Survival analysis or competing-risk models should replace capped-time correlations for publication.

## Reproduce

```bash
node analysis/generate_scenarios.mjs
python3 analysis/pca_analysis.py
python3 tests/test_analysis.py
```
