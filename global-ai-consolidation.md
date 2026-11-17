# Global AI Consolidation Scenarios

> **Framing update — October 6, 2026:** This document now represents the full-singleton boundary case. The project's primary event is the earlier **institutional singularity**, where one hierarchy becomes dominant while other institutions persist. See [`docs/INSTITUTIONAL_SINGULARITY.md`](docs/INSTITUTIONAL_SINGULARITY.md).

**Date:** October 6, 2026  
**Status:** Conditional thought experiment, not a forecast  
**Calculator:** [`baseline_simulation.py`](baseline_simulation.py)

## Short answer

The current model does not predict that one governing AI must emerge. Its default answer is:

```text
T_one = ∞ when fragmentation equals or exceeds consolidation.
```

Under an extreme added assumption that severe conflicts repeatedly halve the number of sovereign agents, the existing numerical baseline produces an expected timescale of approximately **1,333 years**. Under the even stronger assumption that every 25-year conflict produces a global halving, it produces **200 years**.

These are consequences of assumptions, not predictions.

## 1. Three different outcomes

The phrase *one governing AI* can mean at least three things:

1. **Common architecture:** many governments use the same AI design or protocol but retain sovereignty.
2. **Federated coordinator:** governments retain some autonomy while delegating selected decisions to a shared AI.
3. **Sovereign monopoly:** one AI possesses final governing authority over the entire world.

Technical diffusion can produce the first outcome without producing the second or third. The basic idea-spread equation is therefore useful for architecture adoption but insufficient for political unification.

## 2. Starting population of sovereign agents

Use a modeled starting count:

```text
S_0 = 195 sovereign agents
```

This is a convenient approximation rather than a claim that recognition and sovereignty have one universally accepted count.

## 3. Binary winner-take-all consolidation

If each global consolidation round halves the surviving agents:

```text
S_n = ceil(S_0 / 2^n)
```

The number of rounds required is:

```text
n* = ceil(log2(195)) = 8 rounds
```

### Every baseline conflict causes a global halving

The initial war baseline is:

```text
λ_W = 0.04 per year
mean interval = 25 years
```

Then:

```text
E[T_one] = 8 / 0.04 = 200 years
```

This is extraordinarily aggressive. It assumes every conflict is global, eliminates or merges half the remaining sovereign agents, produces no fragmentation, and transfers their authority to one surviving system.

### Only severe conflicts cause a global halving

The severe-conflict share is initially 15%:

```text
λ_severe = 0.04 × 0.15 = 0.006 per year
mean severe interval ≈ 166.7 years
```

Then:

```text
E[T_one] = 8 / 0.006 ≈ 1,333 years
```

This remains unrealistically favorable to consolidation because every severe event still halves the entire global field.

## 4. Sequential elimination

If one qualifying event removes only one sovereign agent:

```text
required events = 195 - 1 = 194
```

At one event every 25 years:

```text
E[T_one] = 194 / 0.04 = 4,850 years
```

If only the modeled severe events qualify, the expected time would exceed 32,000 years. Fragmentation or the creation of replacement states could prevent completion altogether.

## 5. Continuous net-consolidation model

Let:

- `c(t)` = fractional political consolidation rate;
- `f(t)` = fractional fragmentation or sovereignty-creation rate;
- `k_eff(t) = c(t) - f(t)` = net consolidation rate.

Approximate sovereign-agent decline as:

```text
dS/dt = -k_eff S

S(t) = S_0 exp(-k_eff t)
```

Solving for `S(T) = 1` gives:

```text
T_one = ln(S_0) / k_eff,  when k_eff > 0
```

For `S_0 = 195`:

| Net consolidation `k_eff` | Conditional time to one agent |
|---:|---:|
| 1% per year | 527.3 years |
| 2% per year | 263.6 years |
| 5% per year | 105.5 years |
| 10% per year | 52.7 years |
| 0% or negative | Never |

Even 1% sustained net political consolidation is a strong assumption over five centuries. This model also treats sovereignty as smoothly divisible when real consolidation would occur in irregular jumps.

## 6. Common AI architecture diffusion

Suppose one of 195 sovereign agents initially adopts an AI architecture:

```text
x_0 = 1/195 ≈ 0.513%
```

Use the existing unsuppressed logistic spread rate:

```text
β = 15% per year
```

The conditional adoption times are:

| Adoption level | Time |
|---:|---:|
| 50% | 35.1 years |
| 90% | 49.8 years |
| 99% | 65.8 years |

The logistic model approaches 100% asymptotically and never reaches literal unanimity in finite time.

This is the most plausible fast path in the model, but it produces a common technological standard—not one government. Multiple sovereign institutions can run related systems with incompatible directives.

## 7. Additional conditions for sovereign AI unification

One governing AI requires all of the following, or functional substitutes:

```text
technical adoption
× interoperability
× delegation of authority
× enforcement capacity
× durable legitimacy or coercion
× prevention of rival re-formation
× succession and continuity
```

A simple probability-oriented expression is:

```text
P(one governing AI by t)
= P(common architecture by t)
  × P(sovereignty delegated | adoption)
  × P(monopoly survives | delegation)
```

These terms are not independent in reality, but separating them prevents technical adoption from being mistaken for political surrender.

## 8. Revised sovereign-agent dynamics

A more useful event model is:

```text
S_(j+1) = ceil[S_j(1 - r_j)] + n_j
```

where:

- `r_j` = fraction of sovereign agents absorbed or subordinated during event `j`;
- `n_j` = new sovereign agents produced by fragmentation, secession, institutional failure, or replacement.

One world government becomes reachable only if the cumulative effect satisfies:

```text
Σ consolidation effects > Σ fragmentation effects
```

and the final agent prevents new autonomous agents from emerging.

## 9. Relationship to membership definitions

A worldwide residential or citizenship definition could cause the governing AI's protected class to become universal immediately once its jurisdiction became global. That does not explain how its jurisdiction becomes global.

Membership dilution answers:

> Whom does the institution protect once it governs them?

Sovereign consolidation answers:

> How does the institution acquire authority over them?

The second is the limiting process.

## 10. Current working conclusion

Under the basic model:

- **Same AI architecture across most governments:** roughly 50–66 years under the aggressive unsuppressed diffusion assumption.
- **One governing AI under extreme global-halving conflict:** approximately 200–1,333 years, depending on whether every conflict or only severe conflict consolidates the field.
- **One governing AI under sequential elimination:** thousands of years.
- **One governing AI when fragmentation offsets consolidation:** never.

The paper should therefore avoid presenting a single date. Its defensible conclusion is that technological convergence can occur within decades, while sovereign unification requires a separate and much stronger consolidation mechanism that may have no finite endpoint.
