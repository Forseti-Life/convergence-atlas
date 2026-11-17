# Causal Diagrams

**Graph version:** 1.0.0

> Arrows encode hypotheses and adjustment concerns. They are not evidence that a causal relationship has been established.

## Institutional transition mechanisms

Proposed causal structure for productive strength, systemic stress, conflict, consolidation, and fragmentation. Arrows are hypotheses, not established causal findings.

```mermaid
graph LR
    education["Education"]
    innovation["Innovation"]
    productivity["Competitiveness and productivity"]
    economic_power["Economic and trade power"]
    material_power["Material and military power"]
    debt["Debt stress"]
    inequality["Inequality"]
    governance["Governance capacity"]
    disorder["Internal disorder"]
    external_pressure["External transition pressure"]
    conflict["Qualifying conflict"]
    network["Network dependency"]
    consolidation["Consolidation gain"]
    fragmentation["Fragmentation or lost autonomy"]
    shocks["External shocks"]
    education --> innovation
    innovation --> productivity
    productivity --> economic_power
    economic_power --> material_power
    economic_power --> consolidation
    material_power --> consolidation
    debt --> disorder
    inequality --> disorder
    governance --> disorder
    governance --> consolidation
    disorder --> fragmentation
    external_pressure --> conflict
    disorder --> conflict
    shocks --> debt
    shocks --> disorder
    conflict --> consolidation
    conflict --> fragmentation
    network --> consolidation
    network --> fragmentation
```

### Identification warnings

- Economic power, military power, and network centrality can be jointly determined.
- Conflict is both an outcome of stress and a mediator of institutional transitions.
- Governance indicators may partly measure consequences of prior disorder.
- Historical selection into recognized state systems can bias all relationships.

## Formal adoption to effective implementation

Separates formal adoption from internal implementation and durable compliance.

```mermaid
graph LR
    formal_rule["Formal adoption or consolidation"]
    mandate["Mandate strength"]
    capacity["Administrative capacity"]
    switching["Switching cost"]
    compatibility["Technical compatibility"]
    incentive["Network and economic incentive"]
    implementation["Implementation coverage"]
    enforcement["Enforcement"]
    effective_authority["Effective institutional authority"]
    resistance["Internal resistance"]
    reversal["Reversal or defection"]
    formal_rule --> implementation
    mandate --> implementation
    capacity --> implementation
    switching --> implementation
    compatibility --> implementation
    incentive --> implementation
    resistance --> implementation
    implementation --> enforcement
    enforcement --> effective_authority
    resistance --> reversal
    effective_authority --> reversal
```

### Identification warnings

- Formal requirements must not be used as a direct substitute for implementation coverage.
- Enforcement can influence measured compliance and reporting quality simultaneously.
- Institutions choosing early adoption may differ systematically from late adopters.

## Measurement, selection, and leakage risks

Documents major pathways that can create spurious validation.

```mermaid
graph LR
    true_strength["Latent institutional strength"]
    survival["Historical survival"]
    sample["Observed sample"]
    data_quality["Data availability and quality"]
    reported_strength["Reported indicators"]
    future_revision["Future data revisions"]
    model_selection["Model selection"]
    test_performance["Reported test performance"]
    outcome["Institutional transition"]
    true_strength --> survival
    outcome --> survival
    survival --> sample
    data_quality --> sample
    data_quality --> reported_strength
    true_strength --> reported_strength
    future_revision --> reported_strength
    reported_strength --> model_selection
    model_selection --> test_performance
    outcome --> test_performance
```

### Identification warnings

- Using only current countries or top companies creates survivor bias.
- Revised historical indicators may contain information unavailable at the prediction origin.
- Repeated test-set use turns the test interval into training data.
- Missing data is often informative and must not be silently zero-filled.

## Use in analysis

1. Select adjustment variables from a declared causal question, not from automated significance searches.
2. Do not control for mediators when estimating total effects.
3. Do not use future revisions, successors, or event classifications as predictors at an earlier origin.
4. Update graph versions when mechanisms change; never edit the frozen version silently.
