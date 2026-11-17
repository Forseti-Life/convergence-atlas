# L2 Common Panel Feasibility

**Status:** Provisional and unreviewed  
**Sources:** COW membership/MID + World Bank WDI/WGI  
**Years:** 1996–2014

> This panel uses unreviewed candidate mappings. It is suitable for coverage and feasibility diagnostics, not confirmatory prediction or causal claims.

## Coverage

- Institutions: 187
- State-year rows: 3,512
- Complete 12-variable cases: 970
- Membership exits: 1
- Rows with MID onset: 842

## Predictive event gate

- Screening requirement: 120 events for 12 candidate predictors
- Observed membership exits: 1
- Result: **FAIL**

A multivariable membership-exit model is not supported by this common period. Reduce predictors, expand historical coverage, change the outcome, or use strong regularization with explicit uncertainty; do not fit the planned full model to this event count.

## Empirical PCA

| Component | Explained variance | Leading loadings |
|---:|---:|---|
| PC1 | 61.4% | Rule of law +0.356; Government effectiveness +0.356; Control of corruption +0.350; Regulatory quality +0.345 |
| PC2 | 18.2% | Population (log) +0.610; GDP (log) +0.584; Trade % GDP -0.446; R&D % GDP +0.215 |
| PC3 | 5.7% | Secondary enrollment +0.724; Trade % GDP +0.388; Voice/accountability -0.280; Real GDP per capita (log) +0.273 |
| PC4 | 4.6% | Trade % GDP +0.783; Secondary enrollment -0.405; Population (log) +0.342; GDP (log) +0.216 |

## Decision

- L2 source anchoring advances.
- Confirmatory transition prediction remains blocked by unreviewed mappings and insufficient membership-exit events.
- MID onset may support a separate conflict model, but it is not a substitute for institutional transition outcomes.
