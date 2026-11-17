# COW Alliance Network and Conflict Diagnostic

**Status:** Descriptive; no causal claim  
**Coverage:** 1816–2012 (197 overlapping annual observations)

> Alliance coverage ends in 2012 and MID coverage ends in 2014. Correlation can reflect system growth, coding changes, omitted variables, or reverse causation.

## Correlations

| Alliance feature | Conflict outcome | Spearman level | Spearman first difference | Pearson next year |
|---|---|---:|---:|---:|
| network_density | dispute_onsets | -0.559 | +0.047 | -0.531 |
| network_density | war_onsets | +0.006 | -0.111 | -0.046 |
| largest_component_share | dispute_onsets | +0.323 | +0.042 | +0.419 |
| largest_component_share | war_onsets | -0.175 | +0.007 | -0.176 |
| degree_hhi | dispute_onsets | -0.787 | -0.087 | -0.745 |
| degree_hhi | war_onsets | -0.053 | -0.072 | -0.108 |
| max_degree | dispute_onsets | +0.665 | +0.050 | +0.845 |
| max_degree | war_onsets | +0.002 | +0.041 | -0.042 |

## Guardrails

- Level correlations are especially vulnerable to common time trends.
- First differences reduce but do not eliminate confounding or simultaneity.
- Alliance structure may respond to conflict expectations, creating reverse causation.
- This diagnostic does not test trade, finance, ownership, infrastructure, or corporate networks.
- Phase 5 remains partial and Gate F remains unevaluated.
