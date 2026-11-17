# COW Exit Model Comparison

**Status:** Rolling-origin descriptive benchmark; not an Apex Institution forecast

| Model | Predicted exits | Observed exits | Brier | Log loss | Annual count MAE |
|---|---:|---:|---:|---:|---:|
| production_prior | 44.34 | 35 | 0.002250 | 0.016061 | 0.465 |
| wave_memory | 83.70 | 35 | 0.002277 | 0.016747 | 0.650 |
| constant_hazard | 80.13 | 35 | 0.002258 | 0.016930 | 0.648 |
| birth_death | 123.03 | 35 | 0.002290 | 0.017590 | 0.813 |
| trend | 143.49 | 35 | 0.002526 | 0.020460 | 1.029 |
| full_wave | 185.93 | 35 | 0.002622 | 0.021787 | 1.225 |
| no_exit | 0.00 | 35 | 0.002254 | 0.046719 | 0.233 |

## Findings

- `production_prior` has the lowest held-out log loss (0.016061).
- The production prior predicts 44.3 exits versus 35 observed, so its favorable proper score does not mean its event count is calibrated.
- The richer full-wave model has worse log loss (0.021787) than the constant-hazard model (0.016930).
- The no-exit model has the lowest annual count MAE (0.233) because exits are rare, but its asserted zero risk is severely penalized by log loss when exits occur.

Lower scores are better. Ranking by log loss does not establish causality; it tests whether added structure improves chronological prediction of the narrow COW exit target.

## Limitations

- The comparison predicts COW membership exit, not permanent subjugation.
- No-exit probabilities are clipped to 1e-9 only when calculating finite log loss.
- Wave-memory test features use only observed prior years, including prior years within each test block.
- The production prior is a reduced-form annual mapping, not the full structural simulation.
- Sparse exits make all estimates unstable.
