#!/usr/bin/env python3
"""Validate ten-phase status reporting and claim controls."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    subprocess.run(
        ["python3", str(ROOT / "research/run_validation_program.py")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    status_doc = ROOT / "docs/VALIDATION_STATUS.md"
    web_module = ROOT / "web/program-status.mjs"
    assert status_doc.exists() and web_module.exists()

    module_text = web_module.read_text()
    payload = module_text.split("Object.freeze(", 1)[1].rsplit(");", 1)[0]
    status = json.loads(payload)
    assert len(status["phases"]) == 10
    assert [phase["phase"] for phase in status["phases"]] == list(range(10))
    assert status["phases"][0]["status"] == "COMPLETE"
    assert status["phases"][0]["gate"] == "GATE 0: PASS"
    assert status["phases"][1]["status"] == "COMPLETE"
    assert status["phases"][2]["status"] == "IN PROGRESS"
    assert status["phases"][3]["status"] == "PARTIAL"
    assert "3,512" in " ".join(status["phases"][3]["evidence"])
    assert "Only 1 membership exit" in " ".join(status["phases"][4]["blockers"])
    assert status["phases"][4]["status"] == "PARTIAL"
    assert status["phases"][5]["status"] == "PARTIAL"
    assert "15,525 chronological Institution-years" in " ".join(status["phases"][4]["evidence"])
    assert "full-wave exit analogue loses" in " ".join(status["phases"][4]["evidence"])
    assert "40 gross/durable" in " ".join(status["phases"][5]["evidence"])
    assert "GDP/revenue display weighting is implemented" in " ".join(status["phases"][5]["blockers"])
    assert "outcome hazards" in " ".join(status["phases"][5]["blockers"])
    assert "high-intensity median 2029" in " ".join(status["phases"][5]["evidence"])
    assert "slow-preset median" in " ".join(status["phases"][5]["evidence"])
    assert "40,000 seeded Latin-hypercube runs" in " ".join(status["phases"][5]["evidence"])
    assert "right-censored" in " ".join(status["phases"][5]["evidence"])
    assert "samples parameters independently" in " ".join(status["phases"][5]["blockers"])
    assert status["phases"][6]["status"] == "PARTIAL"
    assert status["phases"][7]["status"] == "PARTIAL"
    assert status["phases"][8]["status"] == "BLOCKED"
    assert status["phases"][9]["status"] == "DRAFT"
    assert status["forecastClaimsAuthorized"] is False
    assert all(phase["blockers"] for phase in status["phases"] if phase["status"] in {"BLOCKED", "PARTIAL", "IN PROGRESS", "DRAFT"})

    doc = status_doc.read_text()
    assert "Forecast claims authorized:** NO" in doc
    assert "A blocked phase is a successful gate outcome" in doc
    assert "scenario outputs—not forecasts" in doc

    model_card = (ROOT / "MODEL_CARD.md").read_text()
    assert "Forecast claims authorized:** No" in model_card
    assert "Prohibited or unsupported uses" in model_card
    assert "No forecast claim" in model_card

    print("✓ ten ordered phase records with evidence and blockers")
    print("✓ blocked gates cannot be reported as completed")
    print("✓ forecast claims remain explicitly unauthorized")
    print("✓ draft model card contains use and non-use controls")
    print("Validation program status test passed.")


if __name__ == "__main__":
    main()
