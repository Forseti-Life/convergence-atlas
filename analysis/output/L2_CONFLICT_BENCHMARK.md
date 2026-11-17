# L2 Next-Year MID Onset Benchmark

**Status:** Provisional, unreviewed mappings, current revised histories  
**Target:** Any MID dispute onset in year t+1  
**Not an institutional-transition model**

> This benchmark tests the conflict pathway only. It cannot validate consolidation, fragmentation, or Apex Institution dominance.

| Model | Test rows | Events | Brier | Δ Brier vs null | Log loss | Δ log loss | AUC |
|---|---:|---:|---:|---:|---:|---:|---:|
| null | 365 | 113 | 0.2196 | +0.0000 | 0.6341 | +0.0000 | 0.500 |
| size_only | 365 | 113 | 0.2059 | +0.0137 | 0.6275 | +0.0066 | 0.654 |
| economic | 365 | 113 | 0.1937 | +0.0259 | 0.5997 | +0.0344 | 0.718 |
| governance | 365 | 113 | 0.2023 | +0.0173 | 0.6186 | +0.0155 | 0.659 |
| full | 365 | 113 | 0.1787 | +0.0409 | 0.5748 | +0.0593 | 0.735 |

## Guardrails

- Mappings are provisional and unreviewed.
- Current revised WDI/WGI values can leak later revisions into historical tests.
- Complete-case selection is substantial.
- MID onset is a conflict outcome, not institutional transition.
- Model comparisons are exploratory and use one temporal split.
