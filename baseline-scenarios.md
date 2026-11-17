# Baseline Numerical Scenarios

**Date:** October 6, 2026  
**Calculator:** [`baseline_simulation.py`](baseline_simulation.py)  
**Status:** Illustrative thought-experiment values, not empirical estimates

## 1. Shared baseline

The first run uses a fictional polity and institution:

| Variable | Value | Meaning |
|---|---:|---|
| `N_0` | 10,000,000 | Reference population |
| `F_0` | 1,000 | Family recognized when the institution becomes self-aware |
| `C_0` | 25 | Members of the effective controlling core |
| `T_g` | 27 years | Average generation length |
| Horizon | 100 years initially | First cross-regime comparison period |

Initial recognized-family share:

```text
q_R(0) = 1,000 / 10,000,000 = 0.01%
```

Initial controlling-core share of the family:

```text
C_0 / F_0 = 25 / 1,000 = 2.5%
```

The scenarios hold the reference population constant unless otherwise stated. They are intentionally simple so the consequences of each membership definition remain visible.

## 2. Genealogical definition

Assume the number of recognized descendants multiplies by `1.8` per generation:

```text
R_g = min(N, 1,000 × 1.8^g)
```

| Generation | Approx. year | Recognized family | Population share |
|---:|---:|---:|---:|
| 0 | 0 | 1,000 | 0.010% |
| 3 | 81 | 5,832 | 0.058% |
| 5 | 135 | 18,896 | 0.189% |
| 10 | 270 | 357,047 | 3.570% |
| 12 | 324 | 1,156,831 | 11.568% |
| 15 | 405 | 6,746,641 | 67.466% |
| 16 | 432 | 10,000,000 cap | 100.000% |

Thresholds in this simplified, no-overlap branching model:

| Threshold | First generation | Approx. time |
|---:|---:|---:|
| 10% | 12 | 324 years |
| 50% | 15 | 405 years |
| 90% | 16 | 432 years |

This should not be interpreted as a demographic forecast. Pedigree overlap, migration, unequal fertility, population growth, and incomplete recognition become decisive long before 100%.

### Marriage-inclusive variant

If permanent recognition of spouses and descendants raises the net multiplier from `1.8` to `2.3`:

| Threshold | Approx. time |
|---:|---:|
| 10% | 243 years |
| 50% | 297 years |
| 90% | 297 years |

The compressed final thresholds occur because the exponential approximation overshoots the finite population. A later agent-based model must replace this with an explicit kinship graph.

## 3. Founder-specific genetic detectability

Expected autosomal contribution from one particular ancestor is approximated by:

```text
k_g = 2^(-g)
```

| Generation | Approx. years | Expected contribution |
|---:|---:|---:|
| 1 | 27 | 50.000% |
| 3 | 81 | 12.500% |
| 5 | 135 | 3.125% |
| 7 | 189 | 0.781% |
| 10 | 270 | 0.098% |
| 12 | 324 | 0.024% |

This demonstrates the ancestry paradox: the number of genealogical descendants increases while expected inheritance from each particular founder declines. Actual inheritance is stochastic, and test-based attribution is more complicated than this expectation.

If the rule demands at least 1% expected contribution from a particular founder, the average lineage crosses below the threshold around generation 7, roughly 189 years. A 0.1% threshold is crossed around generation 10, roughly 270 years.

## 4. Self-assigned definition

Use the membership-flow equation:

```text
dq/dt = α(1-q) - ξq
```

### Automatic acceptance

Assume:

```text
α = 12% annual admission
ξ = 0.5% annual exit
q* = α/(α+ξ) = 96%
```

| Year | Recognized members | Population share |
|---:|---:|---:|
| 1 | 1,128,912 | 11.289% |
| 5 | 4,462,026 | 44.620% |
| 10 | 6,849,840 | 68.498% |
| 25 | 9,178,249 | 91.782% |
| 50 | 9,581,470 | 95.815% |
| 100 | 9,599,964 | 96.000% |

The class reaches 50% in 5.9 years, 90% in 22.2 years, and 95% in 36.5 years.

This aggressive scenario assumes membership is valuable, nearly costless to claim, and automatically accepted. It shows why self-assignment can universalize rapidly.

### Gatekeeping variant

Assume:

```text
α = 1% annual admission
ξ = 3% annual exit
q* = 25%
```

| Year | Population share |
|---:|---:|
| 10 | 8.249% |
| 25 | 15.807% |
| 50 | 21.618% |
| 100 | 24.542% |

Gatekeeping prevents universality, but the definition is no longer purely self-assigned because an institution decides which claims succeed.

## 5. Residential definition

Suppose the family is redefined as all residents of a territory containing 1,000,000 of the reference population. Recognition jumps immediately from 1,000 to 1,000,000. Assume the territory's qualifying population then grows at a net `1.5%` annually:

```text
R(t) = min(N, 1,000,000 × exp(0.015t))
```

| Year | Qualifying residents | Population share | Controllers as share of members |
|---:|---:|---:|---:|
| 0 | 1,000,000 | 10.000% | 0.0025% |
| 10 | 1,161,834 | 11.618% | 0.0022% |
| 25 | 1,454,991 | 14.550% | 0.0017% |
| 50 | 2,117,000 | 21.170% | 0.0012% |
| 100 | 4,481,689 | 44.817% | 0.0006% |

The major dilution is definitional and immediate, not generational. Every existing resident qualifies at the moment the family adopts residence as its boundary.

This does not transfer control. Twenty-five people can remain the controlling core while the institution protects millions of residents.

## 6. Capacity-limited institutional definition

Suppose family membership means active membership in a specific organization. Begin with 1,000 members, allow 5% net annual growth, and cap membership at 100,000:

```text
R(t) = min(100,000, 1,000 × 1.05^t)
```

| Year | Members | Population share |
|---:|---:|---:|
| 0 | 1,000 | 0.010% |
| 25 | 3,386 | 0.034% |
| 50 | 11,467 | 0.115% |
| 75 | 38,833 | 0.388% |
| 100 | 100,000 cap | 1.000% |

The cap is reached after approximately 94.4 years. This definition does not inevitably universalize. Capacity and revocable membership can preserve a narrow boundary indefinitely, although the organization's mission and internal culture can still change.

## 7. War baseline

Assume war begins according to a Poisson process:

```text
λ_W = 0.04 per year
```

This corresponds to one war every 25 years on average.

For a 100-year horizon:

| Measure | Result |
|---|---:|
| Expected wars | 4.00 |
| Probability of at least one war | 98.168% |
| Severe-war share | 15% |
| Expected severe wars | 0.60 |
| Probability of at least one severe war | 45.119% |

These values do not yet include conflict clustering. A later Hawkes-process run should test whether one war increases the probability of another.

## 8. Unsuppressed idea baseline

Begin with 1% adoption and use logistic spread with an effective rate of 15% annually:

```text
x(t) = 1 / [1 + 99 exp(-0.15t)]
```

| Year | Adoption |
|---:|---:|
| 0 | 1.000% |
| 10 | 4.331% |
| 20 | 16.866% |
| 30 | 47.624% |
| 40 | 80.296% |
| 50 | 94.809% |

Threshold times:

| Adoption | Time |
|---:|---:|
| 10% | 16.0 years |
| 50% | 30.6 years |
| 90% | 45.3 years |

Under these assumptions, an unsuppressed idea crosses most of the population faster than genetic or genealogical membership expands, but slower than a highly valuable self-assigned identity.

## 9. First comparison

| Definition or process | Approximate broadening timescale | Primary limiting mechanism |
|---|---|---|
| Self-assigned, automatic | Decades | Exit and willingness to claim membership |
| Residential | Immediate jump, then decades | Territory, migration, and boundary control |
| Unsuppressed idea | Decades | Contact and effective transmission rate |
| Capacity-limited institution | Bounded at 1% | Organizational capacity |
| Genealogical descent | Centuries | Generational reproduction and recognition |
| Founder-specific DNA signal | Declines over generations | Recombination and test threshold |

The first numerical result is therefore not a universal dilution date. It is that the **membership definition changes the relevant clock**.

## 10. Control remains a separate variable

In every scenario above, the controlling core remains fixed at 25. Membership expansion therefore does not imply democratization.

For example:

- initial family: controllers are 2.5% of recognized members;
- residential definition at year 0: controllers are 0.0025%;
- residential definition at year 100: controllers are approximately 0.0006%;
- self-assigned definition at year 25: controllers are approximately 0.00027%.

The controllers become vanishingly rare as a share of the protected class while potentially retaining all effective decision rights. This supports the distinction between universal service and universal control.

## 11. Parameters to vary next

The first sensitivity analysis should vary:

1. genealogical multiplier: `1.2`, `1.5`, `1.8`, `2.3`;
2. generation length: `20`, `27`, `35` years;
3. self-assignment admission: `1%` to `20%` annually;
4. residential growth: `-1%` to `3%` annually;
5. institutional capacity: `0.1%`, `1%`, `10%` of population;
6. war arrival rate: one per `10`, `25`, `50`, or `100` years;
7. unsuppressed idea rate: `5%`, `15%`, or `30%` annually;
8. control transfer `κ_Z`: `0`, `0.01`, `0.10`, and `1.0`.

The most important next comparison is `κ_Z = 0` versus `κ_Z > 0`: does a broader family merely receive protection, or does it acquire the ability to redefine the institution?
