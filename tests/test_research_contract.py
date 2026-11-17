#!/usr/bin/env python3
"""Validate the Phase 0 empirical research contract and generated artifacts."""

from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    contract_path = RESEARCH / "analysis-contract.v1.json"
    variables_path = RESEARCH / "variables.v1.1.json"
    sources_path = RESEARCH / "source-catalog.v1.json"
    graphs_path = RESEARCH / "causal-graphs.v1.json"
    manifest_path = RESEARCH / "phase0-manifest.json"

    contract = json.loads(contract_path.read_text())
    variables = json.loads(variables_path.read_text())
    sources = json.loads(sources_path.read_text())
    graphs = json.loads(graphs_path.read_text())

    hypothesis_ids = [item["id"] for item in contract["hypotheses"]]
    assert hypothesis_ids == [f"H{index}" for index in range(1, 8)]
    assert len(contract["outcomes"]) >= 9
    assert contract["predictionHorizonsYears"] == [1, 5, 10, 25, 50]
    assert contract["evaluationPolicy"]["splitStrategy"].startswith("Rolling-origin")
    assert "Never replace" in contract["evaluationPolicy"]["rightCensoring"]

    variable_ids = {item["id"] for item in variables["variables"]}
    source_ids = {item["id"] for item in sources["sources"]}
    outcome_ids = {item["id"] for item in contract["outcomes"]}
    assert len(variable_ids) >= 40
    assert len(source_ids) >= 20

    for hypothesis in contract["hypotheses"]:
        assert hypothesis["predictors"]
        assert set(hypothesis["predictors"]) <= variable_ids
        assert set(hypothesis["outcomes"]) <= outcome_ids
        assert set(hypothesis["sourceIds"]) <= source_ids
        assert hypothesis["horizonsYears"]
        assert hypothesis["evaluationMetrics"]
        assert len(hypothesis["falsification"]) > 40

    for variable in variables["variables"]:
        assert set(variable["sourceIds"]) <= source_ids
        assert variable["missingPolicy"]
        assert variable["leakageRisk"]

    for source in sources["sources"]:
        assert source["url"].startswith("https://")
        assert source["version"]
        assert source["verificationStatus"]
        assert source["licenseStatus"]

    for graph in graphs["graphs"]:
        nodes = {node["id"] for node in graph["nodes"]}
        assert len(nodes) == len(graph["nodes"])
        assert graph["warnings"]
        assert all(source in nodes and target in nodes for source, target in graph["edges"])

    subprocess.run(
        ["python3", str(RESEARCH / "generate_phase0_docs.py")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    manifest = json.loads(manifest_path.read_text())
    assert manifest["gateA"] == "PASS"
    assert not manifest["validationErrors"]

    for relative, expected in manifest["sourceArtifacts"].items():
        assert sha256(ROOT / relative) == expected, f"source checksum mismatch: {relative}"
    for relative, expected in manifest["generatedArtifacts"].items():
        assert sha256(ROOT / relative) == expected, f"generated checksum mismatch: {relative}"

    required_docs = {
        "docs/HYPOTHESIS_REGISTRY.md": "Falsification",
        "docs/VARIABLE_DICTIONARY.md": "Leakage risk",
        "docs/CAUSAL_DIAGRAMS.md": "```mermaid",
        "docs/DATA_GOVERNANCE.md": "Right-censoring",
        "docs/PHASE_0_REPORT.md": "**Gate A:** PASS",
    }
    for relative, marker in required_docs.items():
        text = (ROOT / relative).read_text()
        assert marker in text, f"{relative} missing marker {marker}"

    subprocess.run(
        ["node", str(ROOT / "analysis/generate_release_manifest.mjs")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    release = json.loads((RESEARCH / "release-manifest.v34.json").read_text())
    assert release["release"] == "Revision 34"
    assert release["claimLevel"].startswith("L1 authored scenario")
    assert set(release["headline"]["apexRunShareThresholdCalendarYears"]) == {"p25", "p50", "p75", "p95"}
    for relative, expected in {**release["executableInputs"], **release["artifacts"]}.items():
        assert sha256(ROOT / relative) == expected, f"release checksum mismatch: {relative}"

    print(f"✓ {len(hypothesis_ids)} falsifiable hypotheses and {len(outcome_ids)} outcomes")
    print(f"✓ {len(variable_ids)} variables and {len(source_ids)} versioned source records")
    print(f"✓ {len(graphs['graphs'])} valid causal diagrams")
    print("✓ deterministic documents plus Revision 34 executable/artifact manifest")
    print("Gate A validation passed.")


if __name__ == "__main__":
    main()
