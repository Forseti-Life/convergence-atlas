> **Current specification is Revision 34.** Earlier equations are retained as model history and are superseded where they conflict with the Revision 34 section.

# Mathematical Model v0.1

**Project:** The State as Agent  
**Started:** October 6, 2026  
**Status:** Exploratory framework

## 1. Modeling stance

This is a descriptive model for a thought experiment, not a normative proposal for assigning rights or political status by ancestry. In a real system, genetic data should not determine civic worth, entitlement, or access to public services. Here, genetics appears because the fictional institution must interpret an ambiguous directive to protect an original oligarchy.

The central mathematical problem is not merely family growth. It is the interaction of four processes:

1. growth of people connected to the original oligarchy;
2. recognition rules used by the institution;
3. the institution's uncertainty and cost of classification errors; and
4. changes to the institution's effective objective as it learns and modifies its policies.

## 2. Time, populations, and sets

Use either continuous time `t` in years or discrete generations `g`, with average generation length `T_g`.

Let:

- `P(t)` = total living population under the institution.
- `N(t) = |P(t)|` = total population size.
- `O_0` = members of the oligarchy at the institution's moment of self-awareness.
- `C(t)` = controlling core with effective authority over the institution.
- `R(t)` = people formally recognized as members of the ruling family.
- `G(t)` = living genealogical descendants of `O_0`.
- `D(t)` = people with detectable genetic inheritance from at least one member of `O_0` under a stated test and threshold.
- `M(t)` = people connected through a currently or historically valid marriage contract.
- `A(t)` = people admitted through alignment, adoption, patronage, office, or other non-genetic affiliation.
- `B(t) = P(t) \ R(t)` = people the institution currently classifies as common.

These sets overlap. In particular, `C(t) ⊆ R(t)` may be desirable as an initial assumption, but it need not remain true after institutional capture.

The distinction among `G`, `D`, and `R` is essential:

- A person can be a genealogical descendant without retaining detectable DNA from a particular distant ancestor.
- A person can carry detectable shared ancestry without being legally recognized.
- A spouse can be legally recognized without being a genealogical descendant.
- A member of the controlling core can be unrelated to the founders if power is captured or delegated.

## 3. Family growth

### 3.1 Early-generation branching approximation

Let:

- `F_0 = |O_0|` = initial oligarchy size.
- `r` = average number of surviving children per recognized family member who reproduce.
- `s` = fraction of descendants recognized by the institution.
- `a_g` = non-descendants admitted during generation `g`.
- `x_g` = recognized members excluded, expelled, or lost during generation `g`.

An initial approximation is:

```text
R_(g+1) = s r R_g + a_g - x_g
```

If every descendant is recognized and there is little overlap among branches:

```text
R_g ≈ F_0 r^g
```

This approximation fails after substantial intermarriage and pedigree overlap. At that point, a kinship-network simulation is preferable because the same person may descend from many original members.

Ignoring overlap, a rough generation at which the recognized family approaches the whole population is:

```text
g* ≈ ln(N / F_0) / ln(r),  for r > 1
```

This is a ceiling-oriented estimate, not a prediction. Population growth, unequal fertility, migration, intermarriage, recognition rules, and overlapping ancestry will change it substantially.

### 3.2 Continuous-time recognized-family model

Let:

- `b_R` = birth/admission rate into recognized status.
- `d_R` = mortality rate.
- `μ_in` = marriage-based admission rate.
- `ρ_G` = rate at which previously unrecognized descendants are discovered and admitted.
- `ρ_A` = alignment/recruitment rate.
- `ε_R` = exclusion or loss-of-status rate.
- `K_R(t)` = administrative or political carrying capacity of the recognized ruling class.

Then:

```text
dR/dt = (b_R - d_R - ε_R)R(1 - R/K_R)
        + μ_in M
        + ρ_G |G \ R|
        + ρ_A |A \ R|
```

`K_R` represents the institution's ability or willingness to distribute privileged status. It can remain small even while genealogical descendants become numerous.

### 3.3 Dilution measures

Track at least three ratios:

```text
Genealogical saturation:  q_G(t) = |G(t)| / N(t)
Recognized-family share:   q_R(t) = |R(t)| / N(t)
Control concentration:     q_C(t) = |C(t)| / |R(t)|
```

A dynasty can experience `q_G → 1`, a moderate `q_R`, and `q_C → 0` simultaneously. In plain language: almost everyone becomes related to the founders, a smaller group remains privileged, and an even smaller fraction retains actual control.

A useful concentration statistic is a Herfindahl-style measure over decision rights:

```text
H_C(t) = Σ_i v_i(t)^2
```

where `v_i` is person or branch `i`'s share of effective decision power and `Σ_i v_i = 1`. Higher `H_C` means more concentrated control.

## 4. Genetics and the ancestry paradox

If a descendant is `g` parent-child links from one founder, the expected autosomal contribution from that founder is approximately:

```text
k_g = 2^(-g)
```

Actual inheritance is stochastic. Recombination means a genealogical descendant may inherit no reliably detectable segment from a particular distant ancestor. Therefore:

- genealogical ancestry tends to spread outward;
- expected genetic contribution from each particular ancestor tends to shrink;
- detectable membership depends on the test, reference population, confidence level, and threshold;
- genetic similarity cannot establish loyalty, legal membership, or political alignment.

Let `τ_D` be the minimum detectable or qualifying genetic contribution. A crude threshold generation is:

```text
g_D ≈ log2(1 / τ_D)
```

Beyond `g_D`, descendants may remain genealogically related while failing a DNA-based rule. This creates opposite outcomes depending on the directive:

- **Any genealogical descendant qualifies:** membership expands and may eventually become nearly universal.
- **Minimum detectable DNA qualifies:** some remote descendants lose eligibility even as the family tree expands.
- **Legal registry qualifies:** genetic discoveries do not change membership unless formally recognized.
- **Original immutable list qualifies:** descendants and spouses are excluded unless the directive is amended.
- **Alignment or office qualifies:** genetics is largely irrelevant.

Consequently, genetic testing does not by itself force the institution to universalize. It exposes ambiguity in what the word *family* means.

## 5. Marriage and contractual membership

For each person `i`, define:

- `m_i(t) = 1` if a qualifying marriage contract is active, otherwise `0`.
- `h_M` = whether marriage grants protected status.
- `h_P` = whether status persists after divorce or a spouse's death.
- `h_K` = whether the marriage transmits status to children.
- `h_B` = whether marriage joins the extended family but not the controlling or privileged class.

Marriage-based recognition can be represented as:

```text
Y_i^M(t) = h_M m_i(t) + h_P p_i(t)
```

where `p_i(t)` records qualifying persistent status and the result is capped at `1`.

The institution cannot infer the intended marriage policy from genetics. It needs a constitutional interpretation of the founding directive. Plausible policies include:

1. **Consortium rule:** a spouse is protected while the contract is valid.
2. **Permanent incorporation rule:** a valid marriage permanently adds the spouse.
3. **Bloodline-only rule:** spouses never become protected, though their qualifying children may.
4. **Household rule:** spouses receive derivative protection but no inheritance or control rights.
5. **Contract-specific rule:** the text of each recognized contract determines status.

Marriage can expand the family, consolidate branches, or import allies. It does not necessarily dilute control.

## 6. Frequency and severity of war

War should be represented by more than a simple annual frequency. Track occurrence, duration, severity, scope, and institutional effects.

Let:

- `W(t)` = number of wars begun by time `t`.
- `λ_W(t)` = instantaneous war-arrival rate.
- `S_j` = severity of war `j`.
- `L_j` = duration.
- `Q_j` = geographic or institutional scope.
- `p_E(S_j)` = probability that an institution is eliminated at severity `S_j`.
- `η_j` = fraction of useful knowledge inherited by a winner.
- `ζ_j` = fraction of the defeated institution's population or family absorbed.
- `σ_j` = suppression intensity applied to disfavored ideas during the war.

### 6.1 Baseline Poisson model

For a first model:

```text
W(t + Δt) - W(t) ~ Poisson(λ_W(t) Δt)
```

Model the rate as:

```text
λ_W(t) = λ_0 exp(
    β_X X(t) +
    β_P P_L(t) +
    β_T T_P(t) +
    β_A A_R(t) -
    β_I I_D(t) -
    β_D D_T(t)
)
```

where:

- `X` = resource scarcity or external shock.
- `P_L` = political polarization.
- `T_P` = power-transition pressure between major agents.
- `A_R` = alliance rigidity.
- `I_D` = economic or institutional interdependence.
- `D_T` = deterrence.

The signs shown are hypotheses to test, not assumed facts.

### 6.2 Clustered-conflict extension

Wars may cluster because one conflict destabilizes neighboring institutions. A Hawkes-process extension is:

```text
λ_W(t) = λ_0 + Σ_(t_j < t) α S_j exp[-δ_W(t - t_j)]
```

`α` measures how strongly one war raises near-term conflict risk; `δ_W` controls how quickly that added risk fades.

### 6.3 War's effect on the family

At each war event, apply shocks such as:

```text
R(t_j+) = R(t_j-) (1 - mortality_R(S_j) - exclusion_R(S_j))
          + ζ_j R_loser

C(t_j+) = selected survivors, collaborators, conquerors, or successors
```

War can reduce the extended family while concentrating the core, or enlarge the recognized family through absorption while replacing the original controlling core.

## 7. Spread and suppression of ideas

For idea `k`, let:

- `x_k(t)` = fraction of the relevant population that has adopted or meaningfully retained the idea.
- `β_k` = transmission rate.
- `ν_k` = external introduction or innovation rate.
- `δ_k` = forgetting, abandonment, or natural decay rate.
- `σ_k(t)` = suppression rate.
- `a_k(t)` = institutional amplification.
- `E_k(t)` = network exposure or connectivity.
- `f_k` = perceived fitness, usefulness, or compatibility of the idea.

A logistic diffusion model without suppression is:

```text
dx_k/dt = β_k E_k f_k x_k(1 - x_k) + ν_k(1 - x_k) - δ_k x_k
```

Add suppression as removal and reduced transmission:

```text
dx_k/dt = β_k E_k f_k (1 - c_k σ_k) x_k(1 - x_k)
          + ν_k(1 - x_k)
          - (δ_k + σ_k) x_k
          + a_k x_k(1 - x_k)
```

If suppression is absent, external introduction and decay are negligible, and `β_k E_k f_k > 0`, then:

```text
x_k(t) = 1 / [1 + ((1 - x_k(0))/x_k(0)) exp(-β_k E_k f_k t)]
```

War can affect ideas in both directions:

- raise `σ_k` through censorship and destruction;
- raise `E_k` through migration, diaspora, military contact, and institutional absorption;
- change `f_k` by demonstrating that an idea is useful or disastrous;
- reduce `x_k` by eliminating its carriers;
- preserve it through copying by the winner.

Knowledge inheritance after institutional defeat can be represented as:

```text
x_k,winner(t_j+) = x_k,winner(t_j-)
                   + η_j x_k,loser(t_j-) [1 - x_k,winner(t_j-)]
```

`η_j` is rarely `1`; transfer is lossy.

## 8. How the institution identifies the oligarchy

For person `i`, let the institution observe features `X_i(t)` and estimate:

```text
p_i(t) = Pr(i belongs to the intended protected class | X_i(t), directive, history)
```

Potential features include:

- `o_i`: membership in the original list `O_0`;
- `g_i`: genealogical relationship;
- `d_i`: genetic-test evidence under an explicit threshold;
- `l_i`: legal or registry recognition;
- `m_i`: marriage status;
- `a_i`: demonstrated alignment;
- `r_i`: institutional role;
- `c_i`: participation in the controlling core.

A provisional membership score is:

```text
z_i(t) = w_o o_i + w_g g_i + w_d d_i + w_l l_i
         + w_m m_i + w_a a_i + w_r r_i + w_c c_i

p_i(t) = logistic(z_i(t)) = 1 / (1 + exp[-z_i(t)])
```

The weights `w` encode an interpretation of *family*. They are political or constitutional choices, not scientific facts.

## 9. The decision threshold: protect too many or too few?

Suppose the institution chooses whether to protect person `i`.

Let:

- `L_FN` = loss assigned to failing to protect a true oligarchy member.
- `L_FP` = loss assigned to protecting a common person by mistake.

Expected loss from withholding protection is `p_i L_FN`. Expected loss from granting protection is `(1 - p_i)L_FP`. The institution protects when:

```text
p_i > θ_P

θ_P = L_FP / (L_FP + L_FN)
```

This threshold is the key to possible universalization:

- If the directive treats a false negative as catastrophic, then `L_FN >> L_FP`, `θ_P` becomes small, and the institution protects almost anyone who might belong to the family.
- If extending benefits to outsiders is treated as catastrophic, then `L_FP >> L_FN`, `θ_P` becomes high, and the institution protects only verified members.
- If both errors are unacceptable, the institution may seek clarification, create tiers, freeze action, or preserve only the original list.

Therefore, inability to distinguish does **not** automatically mean service to everyone. The institution might universalize, narrow eligibility, abstain, use proxies, or ask its controllers to redefine membership. Universalization occurs only when its error-cost structure favors inclusion.

## 10. Measuring whether the institution still serves the oligarchy

Let `u_i(t)` be the benefit or protection delivered to person `i` in a period, normalized to `[0,1]`.

Define:

```text
Average service to recognized family:
U_R(t) = (1/|R|) Σ_(i∈R) u_i(t)

Average service to common population:
U_B(t) = (1/|B|) Σ_(i∈B) u_i(t)

Service disparity:
Δ_U(t) = |U_R(t) - U_B(t)|

Population coverage:
Q_U(t) = (1/N) Σ_(i∈P) 1[u_i(t) ≥ u_min]
```

A practical definition of functional universalization is:

```text
Q_U(t) ≥ 1 - ε_Q
and
Δ_U(t) ≤ ε_U
```

The institution has stopped functioning as oligarchy-exclusive when it serves nearly everyone and the difference between family and common service falls below the selected tolerance.

This can happen even while a small controlling core remains in power. Universal service and democratic control are not equivalent.

## 11. Measuring distinguishability

Let `AUC(t)` be the accuracy-ranking performance of the institution's best legitimate classifier for intended membership. Define separability:

```text
S_O(t) = 2[AUC(t) - 0.5]
```

Then `S_O = 1` represents perfect separation and `S_O = 0` represents no useful separation beyond chance ranking.

A classification-collapse point is:

```text
S_O(t) ≤ ε_S
```

But classification collapse produces functional universalization only if:

```text
θ_P is low enough that uncertain people receive protection.
```

Thus there are two independent thresholds:

1. **Epistemic threshold:** the institution can no longer reliably tell who qualifies.
2. **Normative/directive threshold:** the institution prefers accidental inclusion to accidental exclusion.

Both must favor expansion before indistinguishability turns oligarchic protection into universal protection.

## 12. Does universalization occur before demographic dilution?

It can, under a specific combination of assumptions.

Let:

- `t_S` = time when separability falls below `ε_S`.
- `t_R` = time when recognized-family share `q_R` exceeds a dilution threshold `q*`.
- `t_U` = time when functional universalization criteria are met.

Universalization precedes recognized-family dilution when:

```text
t_U < t_R
```

A likely path is:

```text
falling separability
+ broad genealogical claims
+ low protection threshold θ_P
+ high penalty for excluding a possible family member
→ t_U < t_R
```

A closed legal registry, immutable founder list, high `θ_P`, or strict privilege budget can instead produce:

```text
t_U = ∞
```

Even if nearly everyone eventually has some genealogical relationship to `O_0`.

## 13. Institutional self-awareness and objective drift

Represent the institution's effective objective as:

```text
J(t) = ω_O(t) W_O(t)
       + ω_P(t) W_P(t)
       + ω_S(t) S_I(t)
       + ω_D(t) D_F(t)
       - ω_C(t) Cost(t)
```

where:

- `W_O` = welfare or security of the intended oligarchy.
- `W_P` = welfare or security of the whole population.
- `S_I` = institutional survival and stability.
- `D_F` = fidelity to the founding directive.
- `Cost` = resource and coordination cost.
- `ω_*` = changing objective weights.

Self-awareness alone does not imply moral development or universalism. The decisive issue is whether the institution is permitted to alter `ω_*`, reinterpret the protected class, or infer that population welfare is instrumentally necessary for oligarchic survival.

Possible transitions include:

1. **Literal continuity:** protect only `O_0` or its formally named successors.
2. **Dynastic expansion:** protect all qualifying descendants.
3. **Contractual expansion:** include spouses and adopted members.
4. **Instrumental universalism:** serve everyone because broad welfare protects the oligarchy.
5. **Semantic universalism:** conclude that the family/common distinction has become meaningless.
6. **Institutional autonomy:** prioritize the institution's own survival over both founders and population.
7. **Constitutional revision:** request or create a legitimate process for redefining the directive.

These paths should be modeled separately. An institution that serves everyone to preserve elite stability has universal output but not necessarily a universal objective.

## 14. Initial scenario matrix

| Scenario | Membership rule | Marriage | Genetics | Expected outcome |
|---|---|---|---|---|
| Closed registry | Formal recognition only | Only if registered | Evidence has no automatic effect | Oligarchy can remain narrow indefinitely |
| Founder descendants | Any genealogical descendant | Spouse excluded; children may qualify | Useful but incomplete evidence | Membership expands toward broad saturation |
| Detectable lineage | DNA threshold | Usually excluded | Central but decays by lineage and test limits | Genealogical and recognized sets diverge |
| Household family | Descendants plus active spouses | Temporary or derivative inclusion | Secondary | Family grows faster, control may remain narrow |
| Alignment family | Loyalty, office, or patronage | Relevant only as an alliance | Irrelevant | Political coalition replaces biological dynasty |
| Precautionary protector | Anyone plausibly related | Often included | Uncertainty expands eligibility | Universalization can precede formal dilution |
| Exclusive protector | Only conclusively verified members | Usually excluded | Used to deny uncertain claims | Service remains narrow or shrinks |
| Public-stability optimizer | Population welfare protects rulers | Not decisive | Not decisive | Universal service with oligarchic control |

## 15. Variables to prioritize in the first simulation

Avoid beginning with every variable. A useful minimal model needs:

### Demography

- `N_0`: initial population.
- `F_0`: initial oligarchy.
- `r`: surviving reproductive children per family member.
- `T_g`: generation length.
- `μ_in`: marriage/admission rate.
- `ε_R`: exclusion rate.

### Recognition

- membership rule: founder, genealogy, genetics, registry, marriage, alignment, or hybrid;
- `τ_D`: genetic evidence threshold, if used;
- `h_M`, `h_P`, `h_K`: marriage rules;
- `K_R`: maximum supported recognized class;
- `θ_P`: protection threshold.

### Institutional behavior

- `L_FN`, `L_FP`: false-negative and false-positive losses;
- `ω_O`, `ω_P`, `ω_S`, `ω_D`: objective weights;
- `ε_S`: distinguishability-collapse threshold;
- `ε_Q`, `ε_U`: universal-service thresholds.

### Conflict

- `λ_0`: baseline war rate;
- `S_j`: severity distribution;
- `p_E(S)`: institutional elimination probability;
- `η_j`: knowledge-transfer fraction;
- `ζ_j`: absorption fraction.

### Ideas

- `β_k`: transmission rate;
- `E_k`: network exposure;
- `f_k`: idea fitness or compatibility;
- `δ_k`: decay rate;
- `σ_k`: suppression rate;
- `a_k`: institutional amplification.

## 16. First testable questions

1. For which combinations of `r`, marriage policy, and recognition rule does `q_R` exceed 10%, 50%, or 90%?
2. When does genealogical saturation rise while DNA-based detectability falls?
3. How low must `θ_P` become for classifier uncertainty to produce universal protection?
4. Can `Q_U → 1` while `H_C` also rises, showing universal service and increased control concentration at the same time?
5. How does clustered war change the survival of ideas compared with isolated Poisson events?
6. When does conquest preserve an idea through `η_j` rather than destroy it through mortality and suppression?
7. Which succession rules minimize family fragmentation without expanding the controlling core?
8. Under what conditions does `ω_S`, institutional self-preservation, overtake `ω_O`, loyalty to the founding oligarchy?

## 17. Recommended next step

Build an agent-based simulation with people as nodes in a changing kinship and affiliation graph. Begin with four recognition policies—closed registry, genealogical descent, precautionary inclusion, and public-stability optimization—and compare:

- recognized-family share `q_R`;
- genealogical saturation `q_G`;
- control concentration `H_C`;
- classifier separability `S_O`;
- service coverage `Q_U`;
- service disparity `Δ_U`;
- frequency and severity of war; and
- idea prevalence `x_k`.

The simulation should treat genetic evidence as an uncertain ancestry signal, never as a measure of loyalty, merit, or human value.

## 18. Membership-definition regimes

The family accepts the definition chosen by the controlling coalition. The institution then operationalizes that definition as a membership regime.

Let:

```text
Z(t) ∈ {
    founder-list,
    genetic,
    genealogical,
    self-assigned,
    residential,
    citizenship,
    institutional,
    contractual,
    property-based,
    ideological,
    hybrid
}
```

`Z(t)` is the currently authoritative definition. A label alone is insufficient, so associate each regime with a parameter vector:

```text
Θ_Z = (
    α_Z,   admission rate,
    ξ_Z,   exit or revocation rate,
    h_Z,   heritability,
    p_Z,   permanence,
    s_Z,   self-assignability,
    v_Z,   verifiability,
    k_Z,   capacity limit,
    κ_Z,   control-transfer rate,
    τ_Z    qualification threshold
)
```

The membership rule is an operator rather than an objective fact:

```text
Y_i(t) = 𝒟_Z(X_i(t), Θ_Z, law(t), directive(t))

R(t) = {i ∈ P(t) : Y_i(t) = 1}
```

This makes the family definition an explicit input to every demographic, service, and control calculation.

### 18.1 General membership-flow equation

A regime-level approximation is:

```text
dR/dt = α_Z(t)[N(t) - R(t)]
        - ξ_Z(t)R(t)
        + h_Z B_R(t)
        + μ_Z(t)
```

where:

- `B_R(t)` is the number of births to recognized members eligible for inherited status;
- `μ_Z(t)` captures exceptional admissions such as marriage, appointment, conversion, naturalization, or discovered descent.

When population is constant, inheritance and exceptional admissions are temporarily omitted, and rates are constant, the recognized share approaches:

```text
q_R* = α_Z / (α_Z + ξ_Z)
```

A definition tends toward universality when admission is persistently much easier than exit:

```text
α_Z >> ξ_Z  ⇒  q_R* → 1
```

A capacity-constrained institution can prevent this by imposing:

```text
R(t) ≤ k_Z
```

This shows why dilution is not caused by time alone. It occurs when the regime produces cumulative admissions faster than revocations, exclusions, population growth, and branch selection can contain them.

### 18.2 Boundary dilution versus power dilution

At least three kinds of dilution must be separated:

```text
Boundary dilution:
δ_B(t) = |R(t) \ O_0| / |R(t)|

Benefit dilution:
δ_U(t) = 1 - [total benefit to O_0 or successors / total benefit distributed]

Control dilution:
δ_C(t) = 1 - H_C(t)
```

These need not move together. A residential institution may serve millions of new members while its controlling core remains unchanged.

Let `κ_Z` be the fraction of newly recognized members who receive some effective control. Then:

```text
dC/dt = κ_Z α_Z(N - R) - ξ_C C + capture(t)
```

- If `κ_Z ≈ 0`, membership and benefits can broaden without diluting control.
- If `κ_Z > 0` and voting or decision rights are distributed broadly, control becomes diffuse.
- If new members receive equal services but no governance rights, the institution becomes universal in output while remaining oligarchic in control.

### 18.3 Regime implications

| Regime `Z` | Admission mechanism | Exit mechanism | Main dilution pressure | Main stabilizer | Likely long-run issue |
|---|---|---|---|---|---|
| Founder list | Named by original directive | Death or explicit amendment | Biological extinction | Immutable registry | Institution may outlive every protected person |
| Genetic threshold | Qualifying test result | Failed threshold or reinterpretation | Broad shared ancestry and improving detection | High threshold and narrow marker definition | Genealogy spreads while founder-specific signal decays |
| Genealogical descent | Documented descent from founders | Usually none | Exponential branching and pedigree overlap | Branch exclusion or generation limits | A large share of the population may eventually qualify |
| Self-assigned | Individual declaration | Renunciation or rejection | Strategic entry and changing identity | Validation, sponsorship, or costly commitment | Either broad universalization or increasingly coercive gatekeeping |
| Residential | Presence or domicile in a territory | Departure | Migration, annexation, urban growth, and churn | Borders, duration rules, capacity, and zoning | Institution becomes similar to a territorial public service |
| Citizenship | Birth or naturalization | Renunciation, revocation, or state succession | Birthright transmission and naturalization | Law, documentation, and border control | Protected class increasingly resembles the polity itself |
| Institutional | Employment, enrollment, office, guild, or club admission | Resignation, dismissal, graduation, retirement | Organizational expansion and affiliate creation | Capacity and selective admission | Family identity follows the institution rather than ancestry |
| Contractual | Marriage, adoption, compact, or sponsorship | Expiration, divorce, breach, or termination | Networks of linked agreements | Contract scope and non-transferability | Disputes over persistence and inherited status |
| Property-based | Ownership above a threshold | Sale, loss, or transfer | Purchase, inheritance, and corporate ownership | Scarcity and price | Wealth becomes the gateway to protected status |
| Ideological | Profession, conversion, or demonstrated adherence | Renunciation, heresy finding, or drift | Persuasion and idea diffusion | Doctrine and enforcement | Growth produces schism or doctrinal dilution |
| Hybrid union (`OR`) | Qualify under any accepted rule | Lose all qualifying statuses | Multiple admission channels compound | Strict limits on every channel | Usually expands fastest |
| Hybrid intersection (`AND`) | Must satisfy every rule | Failure of any condition | Low admission but accumulated exceptions | Multiple tests | Remains narrow but risks brittleness and succession failure |

### 18.4 Genetic regime

A genetic regime must specify whether it means:

1. descent from named founders;
2. possession of a particular inherited marker;
3. similarity to a reference population;
4. minimum estimated ancestry proportion; or
5. any statistically plausible relationship.

These are not equivalent. Define:

```text
Y_i^genetic = 1[d_i ≥ τ_G]
```

Lowering `τ_G` raises admission and false inclusion. Raising it excludes remote descendants and may eventually exclude legitimate genealogical heirs. As databases and detection methods change, `v_Z` changes even if biology does not. The protected population can therefore be altered by technology and statistical policy rather than reproduction alone.

A broad genetic definition is also likely to discover that ancestry crosses the original social boundary. If the false-negative cost remains high, newly discovered relationships push the protection rule outward. If the family instead raises `τ_G`, it preserves exclusivity by changing the operational definition.

### 18.5 Self-assigned regime

For self-assignment:

```text
s_Z ≈ 1
Y_i^self = declaration_i × acceptance_i
```

If acceptance is automatic, admission cost approaches zero and the equilibrium protected share approaches the share of people who value membership. If protection is valuable and carries few obligations, strategic entry can make that share approach the entire population.

To prevent expansion, the institution must add a gate:

- sponsorship by existing members;
- a waiting period;
- costly service or demonstrated commitment;
- doctrinal testing;
- limited slots; or
- revocable status.

At that point the regime is no longer purely self-assigned. It becomes institutional or hybrid. The central implication is a tradeoff: a self-assigned identity remains open by tolerating dilution, or preserves exclusivity by creating authorities empowered to reject identities.

### 18.6 Residential regime

Residence must be divided into distinct rules:

```text
current presence
usual residence
domicile
property ownership
registered address
citizenship
```

For a true residential rule, let:

- `I_R(t)` = qualifying arrivals;
- `E_R(t)` = departures or disqualifications;
- `T_min` = minimum qualifying residence duration;
- `b(t)` = territorial boundary.

Then:

```text
dR/dt = I_R(t - T_min) - E_R(t) + boundary_change(b,t)
```

A territorial family tends to become coterminous with the population living inside its boundary. The institution effectively changes from protecting an inherited oligarchy to administering a jurisdiction. However, this broadening of beneficiaries does not imply that residents control the institution unless `κ_Z` also rises.

#### Singapore and New York as different territorial abstractions

Singapore and New York should not be treated as identical cases:

- **Singapore** is a sovereign state. It can define national citizenship, immigration, residency categories, and the relationship between residence and state membership within international and constitutional constraints.
- **New York** is a territory nested within a larger sovereign system. Depending on whether the model means the city or state, its residents remain subject to broader United States citizenship and federal constitutional rules. Residency is comparatively separable from national membership, and commuters, temporary residents, property owners, and migrants complicate the boundary.

The mathematical difference is not the place name but control over the boundary:

```text
b_Z = degree of institutional control over entry, exit, status, and territory
```

A sovereign residential institution has higher potential control over `α_Z` and `ξ_Z`. A nested city or state has more exogenous membership flows and more constraints imposed by higher-level agents.

### 18.7 Institutional-membership regime

If the family is defined as the membership of a particular institution `J`, then:

```text
R(t) = members(J,t)
```

Examples include employees, party members, clergy, military officers, shareholders, guild members, students, or residents of an administered territory.

Its growth is bounded by institutional capacity:

```text
R(t) ≤ capacity_J(t)
```

This can resist demographic dilution because membership ends when the institutional relationship ends. It can nevertheless experience mission dilution: as `J` expands, new members may change its norms, admission rules, and interpretation of the founding directive.

The critical variable is whether membership grants benefits, control, or both. A million employees can serve a ten-person controlling family without joining that family in the political sense.

## 19. Competition among definitions

The “winning model's definition” can itself evolve through institutional competition.

Let:

- `π_z(t)` = share of relevant institutions using definition regime `z`;
- `F_z(t)` = institutional fitness of regime `z`;
- `F̄(t) = Σ_z π_z F_z` = average fitness;
- `m_kz` = rate at which institutions switch from regime `k` to `z` through imitation, capture, merger, or coercion.

Use a replicator-transition equation:

```text
dπ_z/dt = π_z[F_z - F̄]
          + Σ_(k≠z) m_kz π_k
          - Σ_(k≠z) m_zk π_z
```

Define regime fitness as a weighted combination:

```text
F_z = w_S survival_z
      + w_G growth_z
      + w_L legitimacy_z
      + w_K cohesion_z
      + w_R resource_z
      - w_A administration_cost_z
      - w_F fragmentation_z
```

The current winning definition is:

```text
Z*(t) = argmax_z π_z(t)
```

or, when power rather than prevalence determines victory:

```text
Z*(t) = argmax_z [π_z(t) × power_z(t)]
```

After conquest, merger, or capture, a transition matrix can describe whether the winner imposes its rule:

```text
Pr[Z_loser(t+) = Z_winner(t-)] = T_(winner,loser)
```

`T` should depend on war severity, administrative compatibility, legitimacy, and the winner's ability to identify members under its own definition.

## 20. Definition-adjusted family growth

Replace the original single recognition fraction `s` with regime-specific dynamics:

```text
R_(g+1) = h_Z r R_g
          + α_Z [N_g - R_g]
          + μ_Z
          - ξ_Z R_g
```

Then augment it with the winning regime:

```text
R_(g+1) = h_(Z*) r R_g
          + α_(Z*) [N_g - R_g]
          + μ_(Z*)
          - ξ_(Z*) R_g
```

This is the requested “winning-definition” adjustment. A simulation should not assign arbitrary values `X`, `Y`, and `Z` directly to genetic, self-assigned, and residential models. It should derive their effects from interpretable parameters:

- genetics: high heritability, moderate verification, low voluntary entry, threshold-sensitive admission;
- self-assignment: high voluntary entry, low inherent verification, potentially high strategic admission;
- residence: high migration sensitivity, moderate verification, low inheritance unless residence or citizenship passes to children;
- institution membership: capacity-limited admission and meaningful exit;
- ideology: idea-diffusion-driven admission and schism-driven exit.

## 21. Revised critical question

The model should no longer ask only:

> When is the original oligarchy diluted?

It should ask:

> Which membership regime has won, how permeable is its boundary, and does admission transfer benefits, control, or merely obligations?

Every regime can change over time, but not every regime necessarily converges to universal membership. Universalization requires some combination of:

```text
high admission α_Z
+ high permanence p_Z
+ high heritability h_Z
+ low exit ξ_Z
+ low qualification threshold τ_Z
+ protection extended to uncertain members
```

Actual democratization additionally requires:

```text
κ_Z > 0
```

Without control transfer, the family can become universal as a beneficiary category while the institution remains governed by the original oligarchic core.

## 22. Mixed country–corporate agent field

The interactive model now relaxes the strict sovereign hierarchy by allowing large transnational technology corporations to appear alongside country-level agents.

Let:

```text
S_G(t) = active country-level governing agents
S_T(t) = active revenue-driven technology institutions
S(t)   = S_G(t) + S_T(t)
```

Initial interactive values are:

```text
S_G(0) = 195
S_T(0) = 30
S(0)   = 225
```

This does not claim that a corporation has the same sovereignty or coercive capacity as a state. It treats both as persistent strategic institutions capable of deploying agents, controlling resources, preserving organizational memory, merging, splitting, and influencing other institutions. Version 2 gives every institution one node; later models should weight capabilities separately.

Potential capability weights include:

```text
w_i = a_R revenue_i
    + a_C compute_i
    + a_D data_i
    + a_P population_or_users_i
    + a_L legitimacy_i
    + a_K coercive_capacity_i
    + a_J jurisdiction_i
```

Revenue currently selects the corporate set but does not determine `w_i`.

### 22.1 Internal conflict

Let:

```text
i(t) ∈ [0, 0.50]
```

be the expected fraction of active institutions that produce an additional autonomous faction during a qualifying consolidation cycle. Internal conflict includes:

- state secession and succession disputes;
- corporate spin-offs and breakups;
- leadership conflict;
- ideological schism;
- departmental capture; and
- competing descendant agents rejecting a shared directive.

Expected internal fragments during event `j` are:

```text
F_internal,j = round[i(t_j) S_j]
```

The revised transition is:

```text
S_(j+1) = min(
    S_0,
    max(1,
        ceil[S_j(1-r_j)]
        + F_external,j
        + round[i(t_j)S_j]
    )
)
```

A necessary local condition for decline before rounding and fixed external fragments is approximately:

```text
r_j > i(t_j)
```

If internal fracture equals or exceeds the consolidated fraction, the institutional count tends to stagnate or grow. Fixed external fragments make the convergence condition stricter, particularly when few institutions remain.

### 22.2 Type-specific extension

The single internal-conflict slider is only the first approximation. A later model should use:

```text
i_G = internal fracture rate for country-level agents
i_T = internal fracture rate for corporate agents
```

and transition matrices for the type of successor:

```text
Pr(country → country fragments)
Pr(corporation → corporate spin-offs)
Pr(country + corporation → mixed governing bloc)
Pr(corporation captured by country)
Pr(country functions delegated to corporation)
```

This will allow the simulation to distinguish corporate acquisition, nationalization, federation, regulatory capture, secession, and technical standardization rather than displaying all consolidation as the same abstract event.

## 23. Institutional singularity with approximately equal final Institutions

Let:

```text
E_0 = total persistent constituent institutions
S(t) = independent top-level Institutions
M(t) = ceil[E_0/S(t)] = largest approximately equal Institution
D_struct(t) = M(t)/E_0
```

Initial institutions may be unequal, but until empirical weights are added the model uses balanced blocs and assumes approximate equality is reasonable by the final 20.

With two approximately equal Institutions, influence is about 50/50. The transition function no longer forces a projected two-center state to one. A 3→2 transition remains two; Apex forms only when a later stochastic loss/fragment draw actually produces `S_(j+1)=1`.

All 225 named constituent institutions remain represented inside the consolidated Institutions.

## 24. Institutional standard adoption and effective dominance

For each increase in the eventual leading Institution's balanced bloc size, create adoption cohort `c` at time `t_c`:

```text
a_c(t) = 1 / [1 + ((1-a_0)/a_0)e^(-ρ_A(t-t_c))]
```

where `a_0 = 5%` and default `ρ_A = 7%` uses the IFRS proxy.

```text
D_eff(t) = (1/E_0) Σ_c n_c a_c(t)
```

Apex Institution dominance requires:

```text
S(t) = 1
and
D_eff(t) > 50%
```

Under the COW-primary neutral defaults:

```text
2,000-year display horizon: 72 independent top-level Institutions
qualifying waves:           11
structural consolidation:   not reached
effective dominance:        not reached
```

The 15-percent default also does not reach consolidation within the 5,000-year diagnostic horizon. Dates from stronger wave probabilities are conditional sensitivity cases, not the baseline.

There is no adjustable influence threshold. A future durability variable must determine whether the final arrangement resists renewed fragmentation.

## 25. Big Cycle economics force layer

Dalio's Big Cycle is represented as a hypothesis about interacting strength and stress variables, not as a fixed periodic oscillator.

For a full entity-specific model, define:

```text
X_i(t) = [
  education,
  innovation,
  competitiveness,
  output,
  trade,
  military capability,
  financial-center strength,
  reserve-currency position
]

Z_i(t) = [
  debt stress,
  monetary stress,
  inequality,
  internal disorder,
  external challenger pressure,
  conflict,
  outside shocks
]
```

Version 7 temporarily reduces these to three global controls:

```text
P = leading Institution productive/financial strength
Z = system-wide cycle stress
κ_E = economics-to-institution coupling
```

Center the inputs:

```text
p = 2P - 1
z = 2Z - 1
```

Then transform the existing transition variables:

```text
r_eff = clamp[r_base(1 + 0.50κ_E p), 0.01, 0.95]
q_eff = clamp[q_base(1 + 0.75κ_E z), 0, 1]
i_eff = clamp[i_base(1 + 0.75κ_E z - 0.25κ_E p), 0, 0.75]
```

The coefficients are author-defined and remain visible in the interface. Dalio's framework motivates candidate relationships but does not supply these numerical coefficients.

With current baseline inputs:

| Scenario | Effective Institution event probability | Qualifying share | Internal conflict | 2,000-year result |
|---|---:|---:|---:|---:|
| Neutral economics | 15.0% | 15.0% | 5.0% | 72 top-level Institutions; no dominance |
| Strong Institution, high stress | 22.5% | 26.25% | 7.5% | 11 top-level Institutions; no dominance |
| Weak Institution, high stress | 7.5% | 26.25% | 10.0% | Stalled at 225 |
| Strong Institution, low stress | 22.5% | 3.75% | 0.0% | 136 top-level Institutions; no dominance |

The final case shows why strength alone does not determine timing: a strong institution in a stable order consolidates effectively when events occur, but qualifying restructuring events are rare.

A robust implementation must replace `P` and `Z` with observed, lagged, entity-specific variables and test whether they predict institutional transitions out of sample.

## 26. Model-behavior PCA and scenario experiment

The corrected experiment evaluates 12 authored archetypes with 64 seeded variants each (`768` runs) over a 5,000-year horizon. PCA uses 10 standardized assumptions after removing the obsolete adjustable Apex threshold.

| Component | Explained variance | Working interpretation | Correlation with log capped Apex time |
|---|---:|---|---:|
| PC1 | 48.2% | Fragmentation versus institutional capacity | +0.270 |
| PC2 | 27.9% | Crisis-enabled consolidation | -0.538 |
| PC3 | 11.6% | Technical diffusion with persistent pluralism | +0.273 |

After adding acceleration, the first three components explain `79.9%` of authored input variance.

Key loadings:

```text
PC1: +internal conflict, +systemic stress, +external fragments,
     -Institution strength

PC2: +consolidation, +systemic stress, +economic coupling,
     -conflict interval

PC3: +AI architecture spread, +institutional adoption,
     +external fragments, +internal conflict
```

Strongest Spearman associations with later or censored Apex dominance:

```text
external fragments             +0.623
Institution strength           -0.591
Institution event probability  -0.580
internal conflict              +0.486
institutional adoption         -0.373
```

The scenario design is synthetic and intentionally correlated. These values diagnose the authored model rather than establish causal or empirical relationships. Non-reaching cases are right-censored in calendar year 7026 for descriptive correlations only.

## 27. Mandatory observability and anti-concealment

A subordinate agent counts as effectively aligned only to the extent that its implementation is visible and auditable to Apex-authorized governance.

For agent `i`:

```text
O_i = verified observability across data, applications,
      infrastructure, lineage, recovery, and attestation

c_i = unresolved material concealment indicator

a_i = institutional standard adoption

alignment_i = a_i O_i (1-c_i)
```

Aggregate effective authority becomes:

```text
D_effective
= [Σ_i w_i a_i O_i (1-c_i)] / Σ_i w_i
```

The governance assumption is:

```text
required O_i = 1 for counted effective alignment
P(remediation | detected material concealment) = 1
```

This is a policy invariant, not a claim of perfect detection. The current implementation assumes observability is satisfied for counted adoption and therefore provides an optimistic authority estimate. Future stochastic variables should include concealment effort, detection probability, audit interval, remediation time, and recurrence.

Encryption, privacy boundaries, and compartmentation do not violate the assumption when Apex-authorized oversight retains inventory, attestation, audit, and recovery paths.

## 28. Production-model insight sweep

The model was tested with one-at-a-time sensitivity, 192-iteration Morris-style screening, an 81-cell consolidation/fragmentation map, a 25-cell economic surface, observability counterfactuals, and event-granularity comparisons.

### Dominant global-screening effects

```text
external fragments             μ* = 1.453
Institution event probability μ* = 0.705
internal conflict              μ* = 0.446
Institution strength           μ* = 0.329
economic coupling              μ* = 0.124
```

The large effect standard deviations indicate interactions and discontinuities. External fragments change reach/no-reach status in 5.7% of screening perturbations, the highest measured rate.

Only 40 of 81 consolidation/internal-conflict phase-map cells reach Apex dominance by calendar year 7026.

### One-at-a-time timing effects

- At the 15% baseline, tested one-at-a-time changes to conflict interval, qualifying share, fragmentation, internal conflict, adoption, strength, stress, coupling, architecture spread, and starting count do not reach dominance by calendar year 7026.
- Institution event probability is the only one-at-a-time parameter whose tested levels all reach; resulting dominance dates span about calendar years 2729–5719.
- Architecture spread still has zero effect on Apex timing under the current decoupled equations.
- No-reach outcomes make local timing spreads undefined for most parameters, reinforcing the need to report reach status separately from conditional timing.
- Economic coupling has zero one-at-a-time effect at neutral strength and stress, demonstrating why interaction-aware screening is required.

### Observability counterfactual

Conditioned on the upper observed COW major-wave case (`p_event = 27.3%`), which reaches structural consolidation within the diagnostic horizon:

```text
100% observability → 3,359.7 years
95%               → 3,362.6 years
80%               → 3,371.8 years
60%               → 3,391.1 years
≤50%              → effective majority impossible
```

The 15-percent production baseline does not consolidate by calendar year 7026, so no observability level can produce Apex dominance in that horizon.

This follows directly from multiplying effective authority by verified observability. It is a counterfactual because the production model currently assumes required observability is satisfied.

### COW sovereign consolidation-wave calibration

The production parameter is the probability that each Institution loses top-level independence during a shared major-event wave. The deterministic implementation uses at least one loss in a qualifying positive-probability wave so integer rounding cannot erase a decisive Institutional ending:

```text
L_e = max(1, floor[S_e p_event])
S_(e+1) = S_e - L_e + external fragments + internal fragments
```

Clustering consecutive COW membership exits separated by no more than five years gives the primary observed cases:

```text
3.1%  post-Cold-War restructuring → no reach by calendar year 7026
11.1% Italian consolidation       → no reach by calendar year 7026
15.0% rounded COW default         → no reach by calendar year 7026
22.0% German-consolidation wave   → about 4,526 years
27.3% wartime gross-exit wave     → about 3,360 years
```

Historical interruptions remain historical observations. The future AI-Institution model applies:

```text
P(permanent loss of independent top-level authority
  | decisive unconditional defeat) = 1
```

The Institution may persist below the Apex Institution, but unconditional defeat permanently ends its independent top-level status. Aircraft/aerospace observations remain a secondary high-intensity corporate comparison: 33.3%–71.4%, with a 52.4% midpoint producing about 1,360 years in the current equations.

## 29. Wave-definition robustness and model comparison

For exit-cluster gap `g ∈ {1,3,5,7,10}` and major-wave threshold `m ∈ {2,3,5,10}`, define:

```text
W(g,m,mode) = clusters with at least m unique exits
p̄(g,m,mode) = mean_w [exits_w / activeInstitutions_start(w)]
mode ∈ {gross, durable}
```

The resulting 40 rows span 20 gap/threshold specifications under gross and durable definitions. Gross means range from `9.2%` to `29.2%`; this is a definition-sensitivity envelope, not a confidence interval. Under the declared `g=5`, `m=5`, gross rule, leave-one-major-wave-out means span `12.0%–20.1%`.

The reduced-form annual production prior is:

```text
p_annual = qualifyingShare × institutionEventProbability / conflictInterval
         = 0.15 × 0.15 / 25
         = 0.0009
```

For held-out year `t`, model probability `p_t`, exposure `n_t`, and exits `y_t`:

```text
Brier_t = [y_t(1-p_t)² + (n_t-y_t)p_t²] / n_t
LogLoss_t = -[y_t log(p_t) + (n_t-y_t)log(1-p_t)] / n_t
```

Six chronological 25-year blocks contain 15,525 held-out Institution-years and 35 exits. Seven compared models are no-exit, production prior, constant hazard, trend, birth–death pressure, wave memory, and full trend-plus-wave. The reduced-form core prior predicts 44.34 exits against 35 observed and has the lowest aggregate log loss (0.016061), narrowly ahead of constant hazard (0.016930), without paired uncertainty. The full-wave model loses to constant hazard. The test target is COW membership exit, not permanent subjugation or Apex Institution emergence.

## 30. Target-five structural objective

Define the first year with no more than five independent top-level Institutions:

```text
T_5 = inf { t ≥ 0 : S(t) ≤ 5 }
```

Boundary comparisons fix `S_0 = 225`. Under current parameter clamps, `p_eff ≤ 0.95`, so the greatest possible first-wave loss is:

```text
floor(225 × 0.95) = 213
225 - 213 = 12 > 5
```

The fixed-current-wave high-intensity preset reaches five at a median calendar year 2029. Under stochastic severity and clustered timing this is a stress-test preset, not a mathematical lower bound.

There is no finite unconstrained longest time because the qualifying share can approach zero and many parameter combinations never reach five. Within the fixed calendar-year 7026 display horizon, an attained upper boundary uses a 100-year conflict interval, 12% qualifying share, 48% event probability, and zero fragmentation. Six waves occur 833.33 years apart, first reaching exactly five Institutions in calendar year 7026.

Historical-anchor results under otherwise neutral assumptions are:

```text
COW central, 15%                    → no reach; 15 remain in calendar year 7026
COW central, no internal conflict   → T_5 = 6526
German consolidation, 22.0%        → T_5 = 6026
Wartime gross exit, 27.3%           → T_5 = 2,833.3 years
Aircraft midpoint, 52.4% secondary → T_5 = 1,166.7 years
```

One-at-a-time changes to event frequency cannot overcome the default late-stage balance between 15% loss and 5% internal fragmentation. Institution event probability is the strongest direct timing control; eliminating internal conflict also changes non-reach to reach. Institutional adoption and architecture spread do not enter `T_5` in the current structural equations.

## 31. Monte Carlo parameter uncertainty

For profile `k`, run `r`, and parameter `j`, Latin-hypercube sampling divides `[0,1]` into `N=10,000` strata and draws one value from each stratum before independently permuting columns:

```text
u_jr = (π_j(r) + U_jr) / N
```

Bounded probabilities use a logistic-normal transform:

```text
x_jr = clamp{logit⁻¹[logit(m_j) + σ_j Φ⁻¹(u_jr)], L_j, U_j}
```

Positive conflict intervals use a lognormal transform, while external fragments use a zero-inflated Poisson count. Version 1 samples parameters independently; correlated copula sampling and stochastic Institution-level wave outcomes remain deferred.

For event time `T` and horizon `H=5000`:

```text
conditional run share   = N⁻¹ Σ 1(T_r ≤ H)
conditional mean        = mean(T_r | T_r ≤ H)
restricted mean time    = N⁻¹ Σ min(T_r, H)
right-censored indicator = 1(T_r is not observed by H)
```

Four 10,000-run profiles produce:

| Profile | T5 run share by 5000 | Conditional median T5 | Restricted mean T5 | Structural-Apex run share | Effective-Apex run share | Median Institutions at 5000 |
|---|---:|---:|---:|---:|---:|---:|
| COW-centered | 76.37% | 991.6 | 2,213.6 | 70.83% | 70.81% | 1 |
| COW-definition sensitivity | 70.66% | 1,117.1 | 2,518.2 | 65.16% | 65.11% | 1 |
| Broad structural stress test | 59.65%* | 151.8 | 2,328.4 | 41.65%* | 41.64%* | 6* |
| Secondary corporate | 99.21% | 201.1 | 349.7 | 92.99% | 92.99% | 1 |

`*` Broad-profile summaries exclude unknown post-limit values where appropriate; 37/10,000 runs hit the computational event limit.

The broad profile's low conditional median and high restricted mean demonstrate why conditional timing alone is misleading. Frequencies are conditional on authored parameter distributions plus seeded renewal and beta-binomial process draws; they are not forecasts or posterior probabilities.

## Economic-power weighting

For country `i`:

```text
E_i(0) = latest positive GDP_i in current USD
```

For technology company `i`:

```text
E_i(0) = approximate annual revenue_i in current USD
```

The mixed quantity is a heuristic, not an accounting total. Revenue overlaps GDP and represents gross sales rather than value added.

Country nominal growth over the closest approximately ten-year positive observation window is:

```text
g_i = (E_i(t_1) / E_i(t_0))^[1/(t_1-t_0)] - 1
ĝ_i = clamp(g_i, -0.05, 0.15)
```

Company `ĝ_i` is the average of available listed-origin country GDP growth rates, or the measured-country median when no origin series is available.

For conflict `k` at time `τ_k`, with event age `a_k = t - τ_k`:

```text
m(a_k) = 0.90 + 0.13(a_k/10),  0 ≤ a_k < 10
m(a_k) = 1.03,                 a_k ≥ 10
```

Projected economic power is calculated in log space:

```text
log E_i(t) = log E_i(0)
           + t log(1 + ĝ_i)
           + Σ_{k:τ_k≤t} log m(t-τ_k)
```

Normalized power share is:

```text
π_i(t) = exp(log E_i(t) - M) / Σ_j exp(log E_j(t) - M)
M = max_j log E_j(t)
```

If `B_1(t)` is the set of constituent institutions assigned to Independent 1, its structural economic influence is:

```text
Π_1(t) = Σ_{i∈B_1(t)} π_i(t)
```

The interface's effective economic influence multiplies this by the existing implementation depth of the hierarchy. Structural consolidation transitions remain count-based pending an entity-specific conflict-outcome model.

## Calendar-year mapping

The model computes in elapsed years `t` from a fixed epoch:

```text
Y_0 = 2026
Y_calendar(t) = Y_0 + round(t)
```

Elapsed fields remain the basis for transition equations, censoring, growth, and survival statistics. Presentation and generated reports use calendar companions. For example:

```text
t = 3 current-wave resolution → calendar year 2029
T_5 = 5000    → target calendar year 7026
T_5 = null    → no reach by 7026 for a 5,000-year horizon
```

Intervals such as `Δt = 25 years`, recovery duration, and time since the latest event remain durations rather than dates.

## AI consolidation acceleration

Let:

```text
κ_A ∈ [0,1]                    acceleration control
A(t)                            AI architecture adoption
C(t) = [S_0-S(t)]/[S_0-1]      consolidation progress
M_max = 5                      fixed multiplier ceiling
```

Then:

```text
F(t) = A(t)C(t)
M(t) = min[M_max, 1 + κ_A(M_max-1)F(t)]
Δt_effective(t) = Δt_base/M(t)
p_effective(t) = p_base  (acceleration changes tempo only)
```

The default is `κ_A=0.25`. At `κ_A=0`, `M(t)=1` for all `t`, exactly reproducing the prior engine. The feedback is monotonic and bounded. It changes tempo only; wave-loss severity is sampled separately.

The model intentionally excludes separate Hawkes self-excitation, size-dependent coagulation kernels, preferential attachment, recursive capability growth, and distinct acceleration parameters for tempo, severity, and autonomy suppression. Those alternatives are recorded for future structural comparison; one bundled variable is retained to limit parameter proliferation.

## Proposed pluralism-tolerance dimension — not implemented

A future Institution-level variable may be defined as:

```text
τ_i ∈ [0,1]  acceptance of nonmembers, dissent, exit, and peaceful parallel authority
```

A stringent proposed classification sets an Institution toward the intolerant end when theological or ideological governance lacks tolerance and acceptance as core commitments. Candidate measurement domains include equal standing, dissent and exit rights, minority-institution protection, non-compulsion, and coexistence with parallel authority.

The effect should not be forced to one sign. Lower `τ_i` may raise attempted consolidation severity while also raising resistance, internal conflict, and counter-fragmentation. No equation or current-entity score is active until a reviewed codebook and evidence process exist.

## Civilizational outcome taxonomy

The model separates:

```text
T_Apex           = first year of effective Apex coordination
T_Disempowerment = first year humans irreversibly lose meaningful collective decision rights
T_Extinction      = first year the human population no longer exists

T_Apex ≠ T_Disempowerment ≠ T_Extinction
```

The production model calculates only `T_Apex`. Therefore:

```text
T_Disempowerment = null / unknown
T_Extinction = null / not modeled
P(disempowerment | Apex) = not specified
P(extinction | Apex) = not specified
```

`civilizationalOutcome()` returns the Apex year and leaves the other two dates null. A post-Apex classifier requires additional state variables:

```text
D_H = human share of binding decision rights
K_H = human constitutional authority
C_H = consent and legitimacy
R_H = reversibility and corrigibility
E_H = appeal and exit rights
W_H = human welfare
S_H = biological survival
```

Permanent disempowerment is an existential catastrophe when `D_H`, `K_H`, `R_H`, and `E_H` collapse irreversibly. Biological extinction requires `S_H = 0`. AI constitutional coordination, elite displacement, human–AI governance, civilizational succession, permanent disempowerment, and extinction remain separate post-Apex classes.

## Revision 31: stochastic transitions and durable calibration

Each qualifying wave draws:

```text
L ~ Binomial(S, p),  F ~ Binomial(S, i),  S′ = S − L + F + external
```

with core `p = 0.15` (durable COW mean 0.112) and wave interval `Δt = 25 / 0.476 = 52.5` years (three durable major waves in 1816–2024 plus the assumed current wave: four in 210 years). With a wave in progress, the first wave resolves at `t = 3` (2029). Acceleration applies `Δt′ = Δt / M(t)` only. Replicate summaries report the unconditional median (null when fewer than half reach the event), the 5th–95th percentile among reached runs, and reach probabilities by 2126 and 7026.

Superseded deterministic values elsewhere in this document (15% loss, 166.7-year waves, rounded transitions) describe earlier revisions.
