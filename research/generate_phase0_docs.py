#!/usr/bin/env python3
"""Generate Phase 0 research documents from versioned JSON contracts."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research"
DOCS = ROOT / "docs"

CONTRACT_PATH = RESEARCH / "analysis-contract.v1.json"
VARIABLES_PATH = RESEARCH / "variables.v1.1.json"
SOURCES_PATH = RESEARCH / "source-catalog.v1.json"
GRAPHS_PATH = RESEARCH / "causal-graphs.v1.json"
MANIFEST_PATH = RESEARCH / "phase0-manifest.json"

GENERATED_PATHS = {
    "hypotheses": DOCS / "HYPOTHESIS_REGISTRY.md",
    "variables": DOCS / "VARIABLE_DICTIONARY.md",
    "causal": DOCS / "CAUSAL_DIAGRAMS.md",
    "governance": DOCS / "DATA_GOVERNANCE.md",
    "report": DOCS / "PHASE_0_REPORT.md",
}


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_contracts(
    contract: dict[str, Any],
    dictionary: dict[str, Any],
    catalog: dict[str, Any],
    graphs: dict[str, Any],
) -> list[str]:
    errors: list[str] = []
    hypotheses = contract.get("hypotheses", [])
    outcomes = {item["id"] for item in contract.get("outcomes", [])}
    variables = {item["id"] for item in dictionary.get("variables", [])}
    sources = {item["id"] for item in catalog.get("sources", [])}

    def unique(items: list[dict], label: str) -> None:
        identifiers = [item.get("id") for item in items]
        if len(identifiers) != len(set(identifiers)):
            errors.append(f"Duplicate {label} identifiers")
        if any(not identifier for identifier in identifiers):
            errors.append(f"Missing {label} identifier")

    unique(hypotheses, "hypothesis")
    unique(contract.get("outcomes", []), "outcome")
    unique(dictionary.get("variables", []), "variable")
    unique(catalog.get("sources", []), "source")
    unique(graphs.get("graphs", []), "causal graph")

    required_hypothesis_fields = {
        "id",
        "statement",
        "units",
        "predictors",
        "outcomes",
        "horizonsYears",
        "nullModel",
        "evaluationMetrics",
        "falsification",
        "sourceIds",
    }
    for hypothesis in hypotheses:
        missing = required_hypothesis_fields - set(hypothesis)
        if missing:
            errors.append(f"{hypothesis.get('id', '?')} missing fields: {sorted(missing)}")
        if not hypothesis.get("horizonsYears"):
            errors.append(f"{hypothesis.get('id')} has no prediction horizon")
        if not hypothesis.get("evaluationMetrics"):
            errors.append(f"{hypothesis.get('id')} has no metrics")
        if not hypothesis.get("falsification"):
            errors.append(f"{hypothesis.get('id')} has no falsification rule")
        for outcome in hypothesis.get("outcomes", []):
            if outcome not in outcomes:
                errors.append(f"{hypothesis.get('id')} references unknown outcome {outcome}")
        for predictor in hypothesis.get("predictors", []):
            if predictor not in variables:
                errors.append(f"{hypothesis.get('id')} references unknown variable {predictor}")
        for source in hypothesis.get("sourceIds", []):
            if source not in sources:
                errors.append(f"{hypothesis.get('id')} references unknown source {source}")

    required_variable_fields = {
        "id",
        "label",
        "role",
        "level",
        "unit",
        "sourceIds",
        "availability",
        "missingPolicy",
        "leakageRisk",
        "modelMapping",
        "status",
    }
    for variable in dictionary.get("variables", []):
        missing = required_variable_fields - set(variable)
        if missing:
            errors.append(f"Variable {variable.get('id', '?')} missing fields: {sorted(missing)}")
        for source in variable.get("sourceIds", []):
            if source not in sources:
                errors.append(f"Variable {variable.get('id')} references unknown source {source}")

    required_source_fields = {
        "id",
        "name",
        "owner",
        "url",
        "version",
        "coverage",
        "plannedUse",
        "verificationStatus",
        "licenseStatus",
        "accessNotes",
    }
    for source in catalog.get("sources", []):
        missing = required_source_fields - set(source)
        if missing:
            errors.append(f"Source {source.get('id', '?')} missing fields: {sorted(missing)}")
        if not str(source.get("url", "")).startswith("https://"):
            errors.append(f"Source {source.get('id')} does not use HTTPS")

    for graph in graphs.get("graphs", []):
        node_ids = {node["id"] for node in graph.get("nodes", [])}
        if len(node_ids) != len(graph.get("nodes", [])):
            errors.append(f"Graph {graph.get('id')} has duplicate nodes")
        for edge in graph.get("edges", []):
            if len(edge) != 2 or edge[0] not in node_ids or edge[1] not in node_ids:
                errors.append(f"Graph {graph.get('id')} has invalid edge {edge}")

    required_gate_phrases = {
        "observable outcomes",
        "prediction horizon",
        "falsification condition",
        "evaluation metrics",
        "source identifiers",
        "Censoring and leakage",
    }
    gate_text = " ".join(contract.get("phaseGate", {}).get("requirements", []))
    for phrase in required_gate_phrases:
        if phrase.lower() not in gate_text.lower():
            errors.append(f"Phase gate does not cover: {phrase}")

    return errors


def generate_hypotheses(contract: dict[str, Any], catalog: dict[str, Any]) -> str:
    source_names = {item["id"]: item["name"] for item in catalog["sources"]}
    lines = [
        "# Hypothesis Registry",
        "",
        f"**Contract version:** {contract['contractVersion']}  ",
        f"**Frozen:** {contract['frozenAt']}  ",
        f"**Status:** {contract['status']}",
        "",
        "> These hypotheses are intended to be rejected when evidence fails their declared tests. They are not conclusions.",
        "",
        "## Summary",
        "",
        "| ID | Hypothesis | Primary outcomes | Horizons |",
        "|---|---|---|---|",
    ]
    for item in contract["hypotheses"]:
        lines.append(
            f"| {item['id']} | {item['statement']} | {', '.join(item['outcomes'])} "
            f"| {', '.join(map(str, item['horizonsYears']))} years |"
        )
    for item in contract["hypotheses"]:
        lines.extend([
            "",
            f"## {item['id']} — {item['statement']}",
            "",
            f"- **Units:** {', '.join(item['units'])}",
            f"- **Predictors:** {', '.join(item['predictors'])}",
            f"- **Outcomes:** {', '.join(item['outcomes'])}",
            f"- **Horizons:** {', '.join(map(str, item['horizonsYears']))} years",
            f"- **Null model:** {item['nullModel']}",
            f"- **Metrics:** {', '.join(item['evaluationMetrics'])}",
            f"- **Falsification:** {item['falsification']}",
            "- **Sources:** " + "; ".join(source_names[source] for source in item["sourceIds"]),
        ])
    lines.extend([
        "",
        "## Evaluation policy",
        "",
        f"- **Temporal splits:** {contract['evaluationPolicy']['splitStrategy']}",
        f"- **Model selection:** {contract['evaluationPolicy']['selectionRule']}",
        f"- **Right-censoring:** {contract['evaluationPolicy']['rightCensoring']}",
        f"- **Rare events:** {contract['evaluationPolicy']['rareEvents']}",
        f"- **Negative results:** {contract['evaluationPolicy']['negativeResults']}",
        "",
    ])
    return "\n".join(lines)


def generate_variables(dictionary: dict[str, Any], catalog: dict[str, Any]) -> str:
    source_names = {item["id"]: item["name"] for item in catalog["sources"]}
    lines = [
        "# Variable Dictionary",
        "",
        f"**Dictionary version:** {dictionary['dictionaryVersion']}  ",
        f"**Variables:** {len(dictionary['variables'])}",
        "",
        "| Variable | Label | Role | Level | Unit | Status |",
        "|---|---|---|---|---|---|",
    ]
    for item in dictionary["variables"]:
        lines.append(
            f"| `{item['id']}` | {item['label']} | {item['role']} | {item['level']} "
            f"| {item['unit']} | {item['status']} |"
        )
    lines.extend(["", "## Detailed definitions"])
    for item in dictionary["variables"]:
        sources = ", ".join(source_names[source] for source in item["sourceIds"]) or "None — non-empirical/display only"
        lines.extend([
            "",
            f"### `{item['id']}` — {item['label']}",
            "",
            f"- **Role / level:** {item['role']} / {item['level']}",
            f"- **Unit:** {item['unit']}",
            f"- **Availability:** {item['availability']}",
            f"- **Sources:** {sources}",
            f"- **Missingness:** {item['missingPolicy']}",
            f"- **Leakage risk:** {item['leakageRisk']}",
            f"- **Current model mapping:** {item['modelMapping']}",
            f"- **Status:** {item['status']}",
        ])
    lines.append("")
    return "\n".join(lines)


def mermaid_label(text: str) -> str:
    return text.replace('"', "'")


def generate_causal(graphs: dict[str, Any]) -> str:
    lines = [
        "# Causal Diagrams",
        "",
        f"**Graph version:** {graphs['graphVersion']}",
        "",
        "> Arrows encode hypotheses and adjustment concerns. They are not evidence that a causal relationship has been established.",
    ]
    for graph in graphs["graphs"]:
        lines.extend([
            "",
            f"## {graph['title']}",
            "",
            graph["description"],
            "",
            "```mermaid",
            "graph LR",
        ])
        for node in graph["nodes"]:
            lines.append(f"    {node['id']}[\"{mermaid_label(node['label'])}\"]")
        for source, target in graph["edges"]:
            lines.append(f"    {source} --> {target}")
        lines.extend(["```", "", "### Identification warnings", ""])
        lines.extend(f"- {warning}" for warning in graph["warnings"])
    lines.extend([
        "",
        "## Use in analysis",
        "",
        "1. Select adjustment variables from a declared causal question, not from automated significance searches.",
        "2. Do not control for mediators when estimating total effects.",
        "3. Do not use future revisions, successors, or event classifications as predictors at an earlier origin.",
        "4. Update graph versions when mechanisms change; never edit the frozen version silently.",
        "",
    ])
    return "\n".join(lines)


def generate_governance(contract: dict[str, Any], catalog: dict[str, Any]) -> str:
    lines = [
        "# Data Governance",
        "",
        f"**Contract version:** {contract['contractVersion']}  ",
        f"**Last source review:** {catalog['lastReviewed']}",
        "",
        "## Classification",
        "",
        "The planned research uses public or licensed institutional, economic, political, and historical data. It must not include credentials, personal records, restricted CTDI data, or individual-level sensitive data without a separate approved design.",
        "",
        "## Storage zones",
        "",
        "| Zone | Purpose | Commit policy |",
        "|---|---|---|",
        "| `data/raw/` | Immutable source-native downloads | Do not commit unless redistribution is explicitly permitted |",
        "| `data/interim/` | Parsed but not analytically final data | Do not commit large or restricted extracts |",
        "| `data/processed/` | Versioned analysis-ready tables | Commit only if license and size permit |",
        "| `data/crosswalks/` | Identifier mappings and adjudication | Commit reviewed non-restricted mappings |",
        "| `research/` | Frozen contracts, manifests, and source catalog | Commit |",
        "",
        "## Required provenance per dataset",
        "",
        "- Source ID and owner",
        "- Exact version or snapshot date",
        "- Retrieval timestamp",
        "- Original URL and checksum",
        "- License and redistribution decision",
        "- Native schema and units",
        "- Transformations and code version",
        "- Missingness and imputation flags",
        "- Historical revision or vintage limitations",
        "",
        "## Source catalog",
        "",
        "| ID | Source | Version | Coverage | Verification | License status |",
        "|---|---|---|---|---|---|",
    ]
    for source in catalog["sources"]:
        lines.append(
            f"| `{source['id']}` | [{source['name']}]({source['url']}) | {source['version']} "
            f"| {source['coverage']} | {source['verificationStatus']} | {source['licenseStatus']} |"
        )
    lines.extend([
        "",
        "## Leakage and censoring controls",
        "",
        "- **Right-censoring:** Preserve event indicators and censoring times. Never convert a non-event at the observation horizon into an observed transition.",
        "",
        "1. Maintain observation-vintage dates where available.", 
        "2. Build predictors only from information available at the prediction origin.",
        "3. Freeze final test intervals before model selection.",
        "4. Keep event coding independent from predictor construction.",
        "5. Treat missingness as potentially informative; never silently convert it to zero.",
        "6. Prevent successor identity and future alliance information from entering predecessor-year features.",
        "",
        "## Quality controls",
        "",
        "- Unique composite keys",
        "- Referential integrity across identifiers",
        "- Temporal continuity and valid entry/exit windows",
        "- Unit and range validation",
        "- Duplicate and revision detection",
        "- Source-to-processed row reconciliation",
        "- Dual review of transition and predecessor/successor coding",
        "",
        "## Change control",
        "",
        "Frozen contract files receive new versioned filenames rather than silent edits. Any hypothesis, outcome, or metric change after inspecting results must be labeled exploratory and recorded in the changelog.",
        "",
    ])
    return "\n".join(lines)


def generate_report(contract: dict[str, Any], errors: list[str]) -> str:
    requirements = contract["phaseGate"]["requirements"]
    status = "PASS" if not errors else "FAIL"
    lines = [
        "# Phase 0 Gate Report",
        "",
        f"**Generated:** {contract['frozenAt']}  ",
        f"**Contract:** {contract['contractVersion']}  ",
        f"**Gate A:** {status}",
        "",
        "## Gate requirements",
        "",
        "| Requirement | Status |",
        "|---|---|",
    ]
    lines.extend(f"| {requirement} | {'PASS' if not errors else 'REVIEW'} |" for requirement in requirements)
    lines.extend([
        "",
        "## Contract counts",
        "",
        f"- Hypotheses: {len(contract['hypotheses'])}",
        f"- Outcomes: {len(contract['outcomes'])}",
        f"- Prediction horizons: {len(contract['predictionHorizonsYears'])}",
        f"- Comparison model families: {len(contract['modelFamilies'])}",
        "",
        "## Validation errors",
        "",
    ])
    lines.extend(f"- {error}" for error in errors)
    if not errors:
        lines.append("- None")
    lines.extend([
        "",
        "## Decision",
        "",
        "Gate A passing authorizes Phase 1 data-foundation work. It does not authorize empirical claims or forecasts.",
        "",
    ])
    return "\n".join(lines)


def main() -> None:
    contract = load(CONTRACT_PATH)
    dictionary = load(VARIABLES_PATH)
    catalog = load(SOURCES_PATH)
    graphs = load(GRAPHS_PATH)
    errors = validate_contracts(contract, dictionary, catalog, graphs)

    DOCS.mkdir(parents=True, exist_ok=True)
    GENERATED_PATHS["hypotheses"].write_text(generate_hypotheses(contract, catalog), encoding="utf-8")
    GENERATED_PATHS["variables"].write_text(generate_variables(dictionary, catalog), encoding="utf-8")
    GENERATED_PATHS["causal"].write_text(generate_causal(graphs), encoding="utf-8")
    GENERATED_PATHS["governance"].write_text(generate_governance(contract, catalog), encoding="utf-8")
    GENERATED_PATHS["report"].write_text(generate_report(contract, errors), encoding="utf-8")

    source_paths = [CONTRACT_PATH, VARIABLES_PATH, SOURCES_PATH, GRAPHS_PATH, Path(__file__).resolve()]
    manifest = {
        "manifestVersion": "1.0.0",
        "contractVersion": contract["contractVersion"],
        "frozenAt": contract["frozenAt"],
        "gateA": "PASS" if not errors else "FAIL",
        "sourceArtifacts": {
            str(path.relative_to(ROOT)): sha256(path) for path in source_paths
        },
        "generatedArtifacts": {
            str(path.relative_to(ROOT)): sha256(path) for path in GENERATED_PATHS.values()
        },
        "validationErrors": errors,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    print(f"Generated {len(GENERATED_PATHS)} Phase 0 documents")
    print(f"Gate A: {manifest['gateA']}")
    print(f"Manifest: {MANIFEST_PATH}")
    if errors:
        raise SystemExit("\n".join(errors))


if __name__ == "__main__":
    main()
