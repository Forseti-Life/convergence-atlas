# Model Card — Institutional Agents

**Version:** Draft 0.1  
**Date:** October 6, 2026  
**Validation status:** L1 achieved; L2 in progress  
**Forecast claims authorized:** No (L3 not achieved)

## Intended purpose

Explore transparent hypotheses about consolidation of top-level power, AI-mediated institutional calcification, fragmentation, economic stress, standards adoption, and the possibility of one operational Apex Institution while constituent institutions continue to exist.

The purpose is not to predict which countries, cultures, religions, or ethnic
groups will win. Map colors and institutional assignments are illustrative
scenario outputs, not predicted alliances or territorial outcomes.

## Omitted boundary analysis and improvement opportunity

The model does not analyze ethnic, cultural, linguistic, or religious boundaries,
either within countries or across borders. Broad “Western” and “Eastern”
groupings are not modeled blocs. These omissions limit what its coordination,
resistance, alliance, and fragmentation scenarios can describe.

A future improvement could introduce evidence-based, time-varying networks
that account for overlapping identities and diversity within populations.
This requires contextual definitions, reviewed sources, and uncertainty
analysis, not assumptions that countries or groups are homogeneous or have
inherent dispositions. This capability is not currently implemented.

## Appropriate current uses

- Thought experiments
- Assumption comparison
- Software and equation testing
- Synthetic scenario analysis
- Research-design development
- Demonstrating the difference between technical adoption and institutional authority

## Prohibited or unsupported uses

- Predicting a real date for global institutional dominance
- Rating a current country, company, ethnic group, religion, or population as destined to win or fail
- Assigning civic rights or institutional membership from genetics
- Operational political, military, investment, or corporate decisions
- Treating synthetic scenario frequencies as probabilities
- Treating current 225 nodes as equally powerful in reality
- Claiming Dalio's Big Cycle coefficients have been estimated or validated

## Current model

The interactive model contains:

- 195 current country-level names
- 30 current revenue-driven technology corporations
- conflict, consolidation, fragmentation, internal-conflict, adoption, and economics variables
- approximately equal final Institutions
- no forced terminal transition; two centers persist until a stochastic draw actually leaves one
- majority internal implementation required after structural consolidation
- mandatory Apex-authorized observability for effective alignment
- an absorbing post-Apex power state while the coordinating systems remain operational
- zero uncurated top-level institutional births and zero modeled authority decay after Apex formation
- continued creation and retirement of machine-curated constituent institutions
- detected material concealment always triggers remediation under the policy assumption
- seeded stochastic scenario analysis and synthetic-design PCA

## Current empirical evidence

Three COW sources have been ingested for local analysis:

- State System Membership v2024: 244 membership spells and 17,512 state-year rows
- MID v5.0: 2,436 disputes, 5,883 participants, and 4,774 state-year rows through 2014
- Formal Alliances v4.1: 148,258 directed-year records and 9,349 state-year rows through 2012
- World Bank WDI snapshot: 14,322 country-year rows across six indicators
- WGI 2026 workbook: 5,696 country-year rows with six governance dimensions and uncertainty fields
- Provisional common panel: 3,512 rows across 187 Institutions; 970 complete 12-variable cases
- Observable taxonomy for all 49 COW exits: 26 re-entry interruptions, 5 immediate successor candidates, 10 nearby-entry candidates, and 8 unclassified
- 195 current crosswalk candidates: 193 provisional candidates, 2 unresolved observer states, none verified

Implemented empirical methods:

- Kaplan–Meier membership survival baseline
- Crude annual exit hazard
- Deterministic 2,000-sample bootstrap interval
- Six rolling-origin constant-hazard backtests
- Alliance density, component, degree, and concentration features
- Level, first-difference, and next-year alliance/MID correlations
- Partial six-variable WDI PCA on 1,847 complete cases across 135 countries/economies
- Provisional 12-variable WDI/WGI PCA; first component is primarily governance/development
- Event-support gate: one common-period membership exit versus 120 screening events required
- Exploratory next-year MID benchmark: full model AUC 0.735 with better Brier/log loss than null on one split

These methods validate analytical plumbing, not the full theory. COW membership exits have not yet been classified into merger, conquest, fragmentation, dissolution, or administrative interruption.

## Synthetic evidence

The synthetic scenario experiment includes 12 archetypes and 768 deterministic variants. PCA describes the authored assumption distribution and is not empirical inference.

## Major limitations

1. No complete empirical state-year predictor panel.
2. No verified cross-source identifier mapping.
3. No transition-cause coding.
4. No observed alliance/trade/infrastructure multiplex network.
5. No historical corporate transition population.
6. No state–corporate transition model.
7. No calibrated likelihood or posterior distribution.
8. No external review.
9. Equal-final-Institution and terminal-majority assumptions remain unvalidated.
10. Institutional-adoption proxy uses IFRS as an analogy rather than AI governance evidence.
11. Current effective-authority calculations assume required observability is satisfied; detection and concealment are not yet stochastic variables.
12. Centralized observability creates surveillance, concentration, and single-compromise risks.
13. Institution outcomes use a beta-binomial wave-loss process, but institutions remain exchangeable within a wave and network dependence is unmodeled.
14. Aircraft/aerospace manufacturing supplies a bounded 33.3%–71.4% severe corporate-wave reference and cannot calibrate sovereign events directly.

15. The 15% loss default is an author core assumption bounded by three durable author-clustered COW exit waves (mean 11.2%, maximum 19.5%); clustering and the five-exit threshold are not causal estimates.
16. Permanent loss after decisive unconditional defeat is a future-model definition, not a claim that historical COW exits were permanent.
17. Wave-definition choices produce mean loss shares from 8.5% to 29.2%; 15% is an assumed scenario center rather than an estimate.
18. The rolling model comparison predicts COW membership exits only. Its production-prior score does not validate Apex emergence, causality, or permanent subjugation, and the richer full-wave model underperforms constant hazard.
19. The fixed-current-wave high-intensity preset reaches five at a median 2029. It is a stress test, not a mathematical lower bound; stochastic arrival times have no positive deterministic lower bound.

20. Monte Carlo v1.4 propagates independent authored parameter distributions through clustered-gap wave arrivals and beta-binomial wave losses. Run shares are neither posterior nor real-world probabilities; parameter correlations and entity/network effects remain unmodeled.
21. Post-Apex permanence is imposed, not estimated. LLM-scale analysis may strengthen monitoring and coordination, but current evidence does not prove that operational AI authority eliminates decay, escape, objective drift, or independent institutional rebirth.
22. System shutdown, infrastructure collapse, observability loss, successful escape, and replacement of the Apex objective system are outside the current transition graph.

## Data and provenance

Machine-readable contracts and checksums are in `research/`. Source ingestion is controlled by `data/catalog.yml` and generated manifests. Raw external data is excluded from version control unless redistribution is explicitly permitted.

## Evaluation policy

- Rolling-origin temporal tests
- Proper scoring rules and calibration
- Competing risks and right-censoring
- Comparison against simpler baselines
- Publication of negative results
- Final untouched test interval
- No forecast claim until the final credibility gate passes

## Ethical considerations

The model can encourage anthropomorphism, deterministic political narratives, or unsupported classification of real groups. All public presentation must distinguish descriptive analogy, authored assumptions, empirical estimates, and observed facts.

## Reproducibility

```bash
python3 research/generate_phase0_docs.py
python3 tests/test_research_contract.py
node research/generate_crosswalk_seed.mjs
python3 research/ingest_cow_states.py
python3 analysis/cow_empirical_baseline.py
python3 tests/test_cow_ingestion.py
python3 tests/test_empirical_baseline.py
```

## Current decision

The project is suitable for L1 sourced-exploratory claims: variables, defaults, and ranges may be discussed with their references and evidence tiers. L2 empirical anchoring remains in progress. It may not represent scenario dates or synthetic reach frequencies as real-world forecasts.

## Economic-power extension

The browser includes a 225-entity economic ordering. Countries use latest available current-USD GDP and approximately ten-year nominal GDP CAGR. Technology companies use approximate annual revenue and an origin-country GDP-growth proxy. Independent 1's displayed influence is economic-share weighted; consolidation timing and forecast-gated empirical models remain structurally count-based.

The conflict path imposes a 10% initial loss, ten-year linear recovery, and 3% positive level premium after every baseline conflict. This is an author-defined scenario mechanism.

Additional limitations:

23. GDP and company revenue are not directly comparable accounting quantities; their joint rank double-counts corporate activity contained in national GDP.
24. Nominal-USD GDP growth includes inflation and exchange-rate effects and is not real output growth.
25. Origin-country GDP growth is not company revenue growth and can be a poor proxy for multinational firms.
26. Three displayed countries lack measured GDP in the cached panel and receive no modeled economic share.
27. A universal positive post-conflict premium is imposed rather than estimated; many real conflicts have persistent negative effects.
28. Economic weighting changes interface ordering and influence display but does not yet estimate entity-specific victory, absorption, or fragmentation hazards.

## Article presentation layer

The browser presents the work in five parts: casual review, deeper analysis, interactive model, simulations/statistical analysis, and references/assumptions. Headline target-five and COW-centered uncertainty values are read from generated artifacts rather than maintained manually.

The casual-review ordering improves accessibility but does not raise the claim level. Simplified headline statements must be interpreted with the detailed censoring, proxy, accounting, and validation limitations in sections four and five.

## Time presentation

The model epoch is 2026. User-facing outcomes are calendar years; internal elapsed values remain available for computation and reproducibility. Null events display as “No reach by 7026” for the standard 5,000-year horizon. Conflict intervals, recovery periods, event ages, and annual rates remain durations.

## Acceleration extension

The model contains one bounded AI consolidation-acceleration control (`0–1`, default `0.25`). It combines AI architecture adoption and accumulated consolidation, affecting event tempo only with a fixed `5×` ceiling. Zero is an exact constant-rate ablation.

Additional limitations:

29. The 25-percent default and fivefold ceiling are author-defined, not estimated.
30. The one-sided tempo multiplier is author-defined and does not represent possible AI-driven fragmentation or deceleration.
31. Hawkes clustering, coagulation kernels, preferential attachment, suppression feedback, and recursive capability growth are excluded.
32. The COW-centered profile's 76.4% five-center and 70.8% Apex run shares are conditional on authored distributions and are not real-world probabilities.

## Unmodeled pluralism tolerance

The current model does not classify countries, companies, religions, or populations by tolerance. A future dimension may evaluate whether theologically or ideologically driven Institutions make tolerance and acceptance of nonmembers, dissenters, and peaceful parallel institutions core governing commitments. Classification is prohibited until a reviewed codebook separates doctrine, formal rules, and observed behavior and records uncertainty and reviewer disagreement.

## Reference presentation

The article ends with a generated, linked annotated bibliography covering all external research references currently discovered in authored project and license documents. Inclusion records relevance and provenance; it does not indicate endorsement or validation of the model. Verification, licensing, and limitation annotations remain visible for each source.

## Civilizational outcome classification

The model calculates Apex coordination and does not infer permanent human disempowerment or biological extinction from that event.

Current output contract:

- `civilizationalOutcome().apexCoordinationYear` contains the effective Apex year when reached.
- `humanDisempowermentYear` remains null.
- `biologicalExtinctionYear` remains null.
- `postApexClassification` remains `unclassified-post-apex-governance` after Apex formation.

Potential classes include AI constitutional coordination, human-elite displacement, a shared human–AI institution, civilizational succession, permanent human disempowerment, and biological extinction. Permanent disempowerment is an existential catastrophe but not biological extinction.

The model excludes self-sufficient material takeover, physical recursive self-expansion, incremental AI mass-destruction hazard, multipolar machine control, objective drift, infrastructure cascades, and non-state bypass. These exclusions do not resolve the post-Apex class.

## Revision 32 core scenario and process uncertainty

- The core is authored: a wave is in progress and resolves in 2029; later arrivals bootstrap normalized short/medium/long gaps around a 52.5-year mean; mean durable loss is 15%.
- A latent beta severity with concentration 14 precedes each institution-level binomial loss draw. Acceleration shortens intervals only.
- The coherent historical-only comparison turns off the current wave and restores a 69.4-year mean from the three observed durable waves.
- Featured columns report the year by which 25%, 50%, 75%, and 95% of runs complete. The former 100% column was a sample maximum and has been removed.
- Event-limit runs are computationally censored and excluded from summaries requiring unknown post-limit states.
- Economic conflict shocks scale with COW MID exposure; long-run growth converges to 4% nominal with a 25-year time constant.

Limitations: 33. Sensitivity sweeps use 25 replicates and carry sampling noise relative to 1,000-replicate anchors. 34. Conflict exposure uses 1946–2014 MID onset rates as a proxy for future exposure. 35. The current-wave, 52.5-year recurrence, 15% mean loss, clustered-gap bootstrap, and beta concentration are scenario assumptions, not empirical forecasts. 36. Permanent Apex authority, zero external fragmentation in the core, and zero post-Apex independent births favor convergence. The forced terminal shortcut has been removed; a transition must actually produce one center.

## Revision 33: Historical reset mechanism

The core premise removes historical reset channels: succession no longer replaces institutional memory, generational turnover no longer weakens objectives or grievances automatically, economic pressure can be continuously managed, administrative knowledge persists, and emerging rivals become legible earlier. This is an authored causal premise. The model does not independently parameterize memory decay, deliberate unlearning, forgiveness, constitutional rule expiration, or correction of inherited bias. Persistent machine memory may preserve beneficial knowledge or harmful grievance.

## Revision 34: Critical responses and retained scope

- Removed the forced terminal shortcut; a 3→2 transition remains two.
- Later-wave timing now bootstraps normalized 6/36/124-year gaps rather than using exponential interarrivals.
- Human-facing outputs use run-share language; internal probability keys remain for schema compatibility.
- Winner identity and internal politics remain outside scope. Internal conflict counts only a completed split into an independent center.
- Composite controls are retained as a tractability choice; they are not separately identified estimates.
- States and corporations are not equivalent. Peer-node treatment reflects an authored expectation of future nationalization/state direction of strategic technology firms.
- The current-wave premise is informed by Dalio’s February 2026 Stage 6 interpretation; wave severity and 2029 resolution remain authored.
- Historical prediction is a descriptive analogue diagnostic, not validation of the future AI mechanism.
- Calendar years through 7026 are stress-test coordinates, not forecast dates.
