# Big Cycle Economics Integration

**Date:** October 6, 2026  
**Status:** Experimental economics dimension; not calibrated

## Purpose

Ray Dalio's *Changing World Order* framework describes recurring patterns in the rise and decline of major powers. It is useful here as a structured hypothesis about institutional strength, debt, internal disorder, and power transitions. It should not be treated as a mechanical law, fixed periodic cycle, or independently validated forecast.

The model uses Dalio to identify candidate variables, then points to independent datasets for measurement and calibration.

## Dalio's rise sequence

The framework commonly emphasizes a reinforcing sequence:

```text
education
→ innovation and technology
→ competitiveness
→ economic output
→ share of world trade
→ military strength
→ financial-center strength
→ reserve-currency status
```

These factors do not peak simultaneously. Education, innovation, production, trade, finance, military capacity, and currency influence have different lags.

## Dalio's decline pressures

The decline side emphasizes combinations of:

- excessive debt and constrained monetary policy;
- money creation and financial instability;
- declining cost competitiveness;
- large wealth and income gaps;
- political polarization and internal disorder;
- a rising external challenger;
- military or economic conflict; and
- external shocks or acts of nature.

The framework's most useful contribution to this project is not a fixed cycle length. It is the hypothesis that these forces interact and can make institutional transitions more likely.

## Initial economic state variables

Version 7 uses three global scenario controls:

```text
P(t) = productive and financial strength of the leading Institution
Z(t) = system-wide cycle stress
κ_E  = coupling strength between economics and institutional transitions
```

All are normalized to `[0,1]` and default to `0.5`. The defaults are neutral so adding this layer does not alter the established scenario unless the user changes a control.

### Leading Institution strength `P`

`P` is a temporary composite covering:

```text
education
innovation and technology
cost competitiveness
economic output
trade position
military capacity
financial-center strength
reserve-currency position
```

A robust version must retain these as separate dimensions rather than one score.

### Systemic cycle stress `Z`

`Z` is a temporary composite covering:

```text
debt and debt-service pressure
monetary and credit stress
wealth and income inequality
internal political disorder
external power-transition pressure
war risk
external economic or natural shocks
```

### Economic coupling `κ_E`

`κ_E` controls how strongly manually selected economic conditions affect institutional transitions. It is entirely author-defined. `κ_E = 0` disables the economics layer; `κ_E = 1` applies the full provisional adjustment.

## First coupling equations

Center strength and stress around zero:

```text
p = 2P - 1
z = 2Z - 1
```

Then calculate:

```text
r_eff = clamp[r_base(1 + 0.50κ_E p), 0.01, 0.95]

q_eff = clamp[q_base(1 + 0.75κ_E z), 0, 1]

i_eff = clamp[i_base(1 + 0.75κ_E z - 0.25κ_E p), 0, 0.75]
```

Interpretation:

- A stronger leading Institution is more capable of consolidating influence when a restructuring event occurs.
- Higher systemic stress increases the frequency of qualifying restructuring events.
- Higher stress increases internal fracture.
- Greater leading-Institution strength partially counters internal fracture.

The coefficients `0.50`, `0.75`, and `0.25` are transparent scenario assumptions. They are not fitted estimates and are not claims made by Dalio.

## Example adjustments

Starting from the current baseline:

```text
r_base = 50%
q_base = 15%
i_base = 5%
```

### Neutral economics

```text
P = 50%, Z = 50%, κ_E = 50%
r_eff = 50%, q_eff = 15%, i_eff = 5%
```

### Strong leading Institution, high systemic stress, full coupling

```text
P = 100%, Z = 100%, κ_E = 100%
r_eff = 75%, q_eff = 26.25%, i_eff = 7.5%
```

The system restructures more often and the leading Institution consolidates more successfully, but stress also increases internal fracture.

### Weak leading Institution, high stress, full coupling

```text
P = 0%, Z = 100%, κ_E = 100%
r_eff = 25%, q_eff = 26.25%, i_eff = 10%
```

Restructuring accelerates while consolidation weakens and fragmentation rises—a decline pattern.

## How this affects the Institutional framework

The economics layer modifies three existing mechanisms:

1. **Transition frequency:** systemic stress changes how frequently conflicts become order-restructuring events.
2. **Institutional success:** productive and financial strength changes consolidation effectiveness.
3. **Internal survival:** stress and institutional weakness change faction creation and fragmentation.

It does not directly change AI capability or architecture diffusion. Those remain separate unless later evidence supports economic coupling.

## Independent calibration sources

| Dimension | Candidate source |
|---|---|
| Education | World Bank Education Statistics / UNESCO Institute for Statistics |
| Innovation | WIPO Global Innovation Index |
| Competitiveness/productivity | World Bank World Development Indicators; Penn World Table |
| Economic output | World Bank GDP and national accounts |
| Trade | World Bank/WTO trade data |
| Military capability | SIPRI Military Expenditure; COW National Material Capabilities |
| Financial-center strength | BIS banking statistics; Global Financial Centres Index |
| Reserve currency | IMF COFER |
| Debt | IMF Global Debt Database; BIS credit statistics |
| Inequality | World Inequality Database |
| Governance/internal disorder | V-Dem; World Bank Worldwide Governance Indicators |
| Armed conflict | UCDP; Correlates of War |
| External shocks | EM-DAT disasters; commodity and financial-volatility datasets |

## Required next improvements

1. Replace `P` and `Z` with separate observed dimensions.
2. Use entity-specific values rather than one global score.
3. Estimate lags between education, innovation, output, trade, finance, and military power.
4. Fit transition coefficients on historical state-system data.
5. Distinguish causal variables from correlated indicators.
6. Add uncertainty and measurement error.
7. Backtest on periods excluded from model fitting.
8. Test whether the Big Cycle variables outperform simpler power-transition and debt-stress models.

## Sources

- Ray Dalio, *The Changing World Order* manuscript — https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf
- World Bank World Development Indicators — https://databank.worldbank.org/source/world-development-indicators
- WIPO Global Innovation Index — https://www.wipo.int/global_innovation_index/en/
- IMF Global Debt Database — https://www.imf.org/external/datamapper/datasets/GDD
- IMF Currency Composition of Official Foreign Exchange Reserves — https://data.imf.org/COFER
- World Inequality Database — https://wid.world/data/
- SIPRI Military Expenditure Database — https://www.sipri.org/databases/milex
- Correlates of War National Material Capabilities — https://correlatesofwar.org/data-sets/national-material-capabilities/
- V-Dem Dataset — https://www.v-dem.net/data/the-v-dem-dataset/
- World Bank Worldwide Governance Indicators — https://www.worldbank.org/en/publication/worldwide-governance-indicators
- UCDP datasets — https://ucdp.uu.se/downloads/

## Initial timeline sensitivity

Using the corrected equal-final-Institution model, majority internal-adoption rule, 7% institutional adoption rate, and a 2,000-year interactive horizon:

| Scenario | 2,000-year modeled result |
|---|---:|
| Neutral economics | 72 independent top-level Institutions; no dominance |
| Strong leading Institution + high systemic stress + full coupling | 11 independent top-level Institutions; no dominance |
| Weak leading Institution + high systemic stress + full coupling | Stalled at 225 |
| Strong leading Institution + low systemic stress + full coupling | 136 independent top-level Institutions; no dominance |

At the COW-primary default, none of these neutral-strength variants reaches an Apex Institution by calendar year 4026. Stress and strength still change the remaining field substantially.

These outcomes are deterministic consequences of provisional equations, not historical estimates.
