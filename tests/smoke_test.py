#!/usr/bin/env python3
"""Local HTTP smoke test for the dependency-free visualization."""

from __future__ import annotations

import contextlib
import functools
import http.server
import pathlib
import threading
import urllib.request


ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB = ROOT / "web"


def fetch(base_url: str, path: str) -> str:
    with urllib.request.urlopen(f"{base_url}/{path}", timeout=5) as response:
        assert response.status == 200, f"{path} returned {response.status}"
        return response.read().decode("utf-8")


def main() -> None:
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        base_url = f"http://127.0.0.1:{server.server_port}"
        html = fetch(base_url, "index.html")
        app = fetch(base_url, "app.mjs")
        model = fetch(base_url, "model.mjs")
        countries = fetch(base_url, "countries.mjs")
        companies = fetch(base_url, "tech-companies.mjs")
        economic_power_data = fetch(base_url, "economic-power-data.mjs")
        economic_power_model = fetch(base_url, "economic-power.mjs")
        references = fetch(base_url, "references.mjs")
        analysis = fetch(base_url, "analysis-results.mjs")
        empirical = fetch(base_url, "validation-results.mjs")
        program = fetch(base_url, "program-status.mjs")
        defaults = fetch(base_url, "default-rationales.mjs")
        insights = fetch(base_url, "model-insights.mjs")
        scenario_matrix = fetch(base_url, "scenario-matrix.mjs")
        wave_robustness = fetch(base_url, "cow-wave-robustness.mjs")
        model_comparison = fetch(base_url, "cow-model-comparison.mjs")
        target_five = fetch(base_url, "target-five-analysis.mjs")
        monte_carlo = fetch(base_url, "monte-carlo-results.mjs")
        monte_carlo_csv = fetch(base_url, "monte-carlo-summary.csv")
        bibliography = fetch(base_url, "annotated-bibliography.mjs")
        bibliography_markdown = fetch(base_url, "ANNOTATED_BIBLIOGRAPHY.md")
        css = fetch(base_url, "styles.css")

        required_html = (
            'id="casual-review"',
            'id="deeper-analysis"',
            'id="model-interface"',
            'id="tolerance-gap"',
            'id="tolerance-gap-title"',
            'data-reference="pluralismToleranceGap"',
            'id="simulation-analysis"',
            'id="references-assumptions"',
            'id="article-timeline-grid"',
            'id="article-uncertainty-grid"',
            'href="#model-interface"',
            'id="start-agents"',
            'id="internal-conflict"',
            'id="institutional-adoption-rate"',
            'id="leading-institution-strength"',
            'id="systemic-cycle-stress"',
            'id="economic-coupling"',
            'id="consolidation-acceleration"',
            'id="acceleration-multiplier"',
            'id="accelerated-loss"',
            'id="effective-consolidation"',
            'id="economic-power-summary"',
            'id="economic-power-table-body"',
            'id="conflict-power-state"',
            'id="singularity-title"',
            'id="power-calcification-title"',
            'data-reference="powerCalcification"',
            'data-reference="mandatoryObservability"',
            'id="timeline-chart"',
            'id="country-grid"',
            'id="interpretation-text"',
            'id="reference-ledger"',
            'id="existential-risk-scope"',
            'id="existential-risk-title"',
            'id="apex-scope-year"',
            'id="apex-scope-rate"',
            'Permanent human disempowerment year',
            'Biological extinction year',
            'data-reference="existentialRiskBoundary"',
            'id="annotated-bibliography-section"',
            'id="annotated-bibliography-title"',
            'id="annotated-bibliography-summary"',
            'id="annotated-bibliography"',
            'id="bibliography-variable-topics"',
            'id="insight-cards"',
            'id="granularity-results"',
            'id="target-five-year"',
            'data-preset="fast5"',
            'data-preset="slow5"',
            'id="target-five-summary"',
            'id="target-five-interaction-summary"',
            'id="target-five-sensitivity-table-body"',
            'id="challenge-summary"',
            'id="challenge-scenario-table-body"',
            'id="robustness-table-body"',
            'id="comparison-table-body"',
            'id="monte-carlo-profile"',
            'id="monte-carlo-stats"',
            'id="monte-carlo-histogram"',
            'id="monte-carlo-survival"',
            'id="monte-carlo-inputs-table-body"',
            'id="monte-carlo-sensitivity-table-body"',
            'id="monte-carlo-terminal-bands"',
            'id="monte-carlo-convergence-table-body"',
            'id="empirical-stats"',
            'id="phase-status-grid"',
            'id="pca-components"',
            'id="scenario-table-body"',
            'data-reference="conflictInterval"',
            'src="app.mjs?v=20261009-1045"',
            'id="bib-topic-consolidationAcceleration"',
            'GENERATED VARIABLE TOPICS START',
            'GENERATED BIBLIOGRAPHY START',
        )
        for marker in required_html:
            assert marker in html, f"missing required HTML marker: {marker}"
        assert html.count('<b data-reference="') == 14
        assert "Open Markdown bibliography" not in html, "every adjustable control needs a reference marker"
        assert html.count('data-article-part="') == 5
        assert 'id="historical-reset"' in html and 'id="historical-reset-title"' in html
        assert html.index('id="historical-reset"') < html.index('class="headline-grid"'), "historical comparison must precede quantitative findings"
        assert "Bias and grievance can persist too" in html and "deliberate unlearning" in html
        assert 'class="memory-decay-note"' in html
        assert 'id="scope-decisions"' in html and 'class="model-expansion-register"' in html
        assert "Count independent centers, not internal politics" in html
        assert "Data centers are not libraries" in html
        assert "Historical exit diagnostic—not model validation" in html
        assert "P(Apex by" not in app and "P(five by" not in app
        assert "sampleClusteredInterval" in model and "sampleExponential" not in model
        assert "3→2 must remain" in (ROOT / "tests/test-model.mjs").read_text(), "page must contain exactly five numbered article parts"
        assert html.count("Open paper/site ↗") == 74, "all bibliography links must be pre-rendered in HTML"
        assert html.count('class="bibliography-topic-card"') == 14, "all adjustable defaults need pre-rendered topic cards"
        assert html.count('class="bibliography-group"') == 3, "bibliography must have three expandable categories"
        article_ids = ["casual-review", "deeper-analysis", "model-interface", "simulation-analysis", "references-assumptions"]
        positions = [html.index(f'id="{article_id}"') for article_id in article_ids]
        assert positions == sorted(positions), "article parts must appear in the declared order"
        assert html.index('id="existential-risk-scope"') > html.index('id="method-title"'), "existential scope must follow the model boundary"
        assert html.index('id="annotated-bibliography-section"') > html.index('id="existential-risk-scope"'), "bibliography must follow existential scope"
        for article_id in article_ids:
            assert f'href="#{article_id}"' in html, f"missing article navigation link: {article_id}"

        assert "simulateConsolidation" in model
        assert "POWER_CALCIFICATION_ASSUMPTIONS" in model
        assert "apexStateAbsorbingWhileOperational" in model
        assert "renderConstellation" in app
        assert "renderArticleSummary" in app
        assert "bib-topic-${key}" in app
        assert "entry.referenceKeys ?? []" in app
        assert "declaredUrls.has" in app
        assert "annotated-bibliography.mjs?v=20261008-1129" in app
        assert 'document.createElement("details")' in app
        assert "Sources & default rationale" in app
        assert "Open bibliography sources & rationale" in app
        assert "Open paper/site" in app
        assert "formatCalendarYear" in app
        assert "calendarYear(bin.lower)" in app
        assert 'id === "cow_centered"' in app
        assert "TARGET_FIVE_ANALYSIS.boundaries.fastest.targetYear" in app
        assert "Independent 1" in app and "Leading Institution" not in app
        assert "State of Palestine (Observer State)" in countries
        assert "Meta Platforms" in companies
        assert "Salesforce" in companies
        assert "ECONOMIC_POWER_DATA" in economic_power_data and '"measuredCountryCount":192' in economic_power_data
        assert "rankEconomicPower" in economic_power_model and "conflictEventMultiplier" in economic_power_model
        assert "Author-defined" in references
        assert "Stanford HAI" in references
        assert "IFRS Foundation" in references
        assert "The Changing World Order" in references
        assert "World Inequality Database" in references
        assert "NIST SP 800-207" in references
        assert "GDP/revenue economic-power ranking" in references
        assert "Conflict shock, recovery, and rebound" in references
        assert "AI consolidation acceleration" in references
        assert "Hawkes" in references and "preferential attachment" in references
        assert "Civilizational outcomes after Apex coordination" in references
        assert "Pluralism tolerance and institutional intolerance" in references
        assert "No current entity is scored" in references
        assert "AI-mediated institutional power calcification" in references
        assert "they do not prove permanence" in references
        assert "Model-behavior" in references
        assert "ANALYSIS_RESULTS" in analysis
        assert "EMPIRICAL_RESULTS" in empirical
        assert "PROGRAM_STATUS" in program
        assert "DEFAULT_RATIONALES" in defaults
        assert "MODEL_INSIGHTS" in insights
        assert "waveCalibration" in insights
        assert "SCENARIO_MATRIX" in scenario_matrix and "strong-stressed-contender" in scenario_matrix
        assert "COW_WAVE_ROBUSTNESS" in wave_robustness and "grossMeanMinimum" in wave_robustness
        assert "COW_MODEL_COMPARISON" in model_comparison and "full_wave" in model_comparison
        assert "TARGET_FIVE_ANALYSIS" in target_five and '"targetCalendarYear":2029' in target_five and '"apexProbability"' in target_five and '"consolidationAcceleration":1' in target_five
        assert "ANNOTATED_BIBLIOGRAPHY" in bibliography and '"uniqueSourceCount":74' in bibliography
        assert '"limitations":' in bibliography and "https://" in bibliography
        assert "Complete Annotated Bibliography" in bibliography_markdown and "**Limitations/access:**" in bibliography_markdown
        assert "MONTE_CARLO_RESULTS" in monte_carlo and '"totalRuns":40000' in monte_carlo
        assert '"censoringCalendarYear":7026' in monte_carlo and '"consolidationAcceleration"' in monte_carlo
        assert '"processUncertainty":true' in monte_carlo
        assert "renderConstellation(activeAgents, economicContext)" in app, "Institution click rerender must preserve economic context"
        assert "p95" in app and "p100" not in app, "article uses stable p95 rather than finite-sample maximum"
        assert "cow_centered,10000" in monte_carlo_csv and "corporate_secondary,10000" in monte_carlo_csv
        assert "durable COW three-wave mean" in defaults
        assert "forecastClaimsAuthorized\":false" in program
        assert "Bostrom" in references
        assert "Vinge" in references
        assert ".reference__popover" in css
        assert ".control__sources" in css
        assert ".country-grid" in css
        assert ".entity-node--company" in css

        print(f"✓ index and twenty-one static assets returned HTTP 200 on port {server.server_port}")
        print("✓ five-part article, generated headline findings, model CTA, controls, simulation explorers, and reference sections present")
        print("✓ model, renderer, baselines, economic-power data, references, annotated bibliography, empirical/PCA results, status, rationales, insights, scenarios, robustness, model comparison, target-five, Monte Carlo summaries, and styles present")
        print("HTTP smoke test passed.")
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


if __name__ == "__main__":
    with contextlib.suppress(KeyboardInterrupt):
        main()
