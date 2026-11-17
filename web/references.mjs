export const REFERENCES = Object.freeze({
  combinedBaseline: {
    title: "225 starting institutions",
    kind: "Empirical anchor + selection rule",
    summary: "The country count is anchored to 193 UN Member States and two Observer States. The 30-company set is revenue-led. Countries and firms are not legally or coercively equivalent. Peer-node treatment is a simplifying future-technology premise motivated by the author’s expectation that strategic firms become nationalized, state-directed, or equivalently dependent under sustained conflict; the model does not estimate that outcome.",
    sources: [
      { label: "UN at a glance — 195 flags", url: "https://www.un.org/en/model-united-nations/un-glance" },
      { label: "Fortune Global 500 ranking", url: "https://fortune.com/ranking/global500/" },
      { label: "Technology companies by revenue — 2025 table", url: "https://en.wikipedia.org/wiki/List_of_largest_technology_companies_by_revenue" },
    ],
  },
  oligarchyAbstraction: {
    title: "Institution as oligarchic agent",
    kind: "Author-defined abstraction",
    summary: "The exercise assigns each institution a controlling coalition. Real regimes vary, and the model must not be read as classifying every government identically. V-Dem provides hundreds of indicators for replacing this assumption with heterogeneous governance data.",
    sources: [
      { label: "V-Dem Dataset v16", url: "https://www.v-dem.net/data/the-v-dem-dataset/" },
      { label: "Britannica — iron law of oligarchy", url: "https://www.britannica.com/topic/iron-law-of-oligarchy" },
    ],
  },
  conflictInterval: {
    title: "Average conflict interval",
    kind: "Calibratable empirical variable",
    summary: "The default 25-year interval is illustrative. Interstate and intrastate event frequencies should be estimated from a declared conflict dataset, time window, unit of analysis, and inclusion threshold.",
    sources: [
      { label: "UCDP datasets and downloads", url: "https://ucdp.uu.se/downloads/" },
      { label: "Correlates of War — Militarized Interstate Disputes", url: "https://correlatesofwar.org/data-sets/MIDs/" },
    ],
  },
  qualifyingConflict: {
    title: "Qualifying or severe conflict share",
    kind: "Author-defined threshold with empirical analogues",
    summary: "The default 47.6% share is an authored 52.5-year mean recurrence (25 ÷ 0.476). It is numerically equivalent to four waves in 210 years only if the assumed current wave is counted; the historical-only reference is three observed durable waves in 208 years, or 69.4 years. The 52.5-year recurrence and 15% mean loss are separate authored assumptions. UCDP battle-death thresholds remain an alternative severity definition.",
    sources: [
      { label: "UCDP definitions", url: "https://ucdp.uu.se/definitions" },
      { label: "UCDP/PRIO Armed Conflict Dataset codebooks", url: "https://ucdp.uu.se/downloads/ucdpprio/" },
    ],
  },
  institutionEventProbability: {
    title: "Institution loss probability per consolidation wave",
    kind: "Core assumption bounded by durable COW sovereign waves",
    summary: "Core assumption: each Institution uses a 15% mean within-run draw for permanently losing top-level autonomy during each qualifying wave, including the wave under way in 2026. The durable COW rule (five-year gap, five-exit threshold) averages 11.2% across three major waves; the 1866–71 durable wave reached 19.5%. Gross waves average 15.9% but include interruptions later reversed, which conflicts with the permanent-loss rule. Across 40 specifications, means range from 8.5% to 29.2%. Losses are drawn binomially per wave; aircraft/aerospace remains secondary.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "COW Intra-State War v5.1", url: "https://correlatesofwar.org/data-sets/cow-war/" },
      { label: "USITC Publication 3143 — secondary aircraft comparison", url: "https://www.usitc.gov/publications/332/pub3143.pdf" },
      { label: "RAND MR-1696 — secondary combat-aircraft comparison", url: "https://www.rand.org/pubs/monograph_reports/MR1696.html" },
    ],
  },
  externalFragmentation: {
    title: "New external fragments per event",
    kind: "Author-defined transition with historical anchors",
    summary: "This fixed count represents pre-Apex secession, institutional replacement, or newly autonomous organizations. Once the model reaches one operational Apex center, later organizational births are curated subordinates and do not increase the independent-center count. Historical state creation does not validate that permanence rule.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "UN growth in membership", url: "https://www.un.org/en/about-us/growth-in-un-membership" },
    ],
  },
  internalConflict: {
    title: "Internal conflict and faction creation",
    kind: "Author-defined mechanism with empirical proxies",
    summary: "The slider counts only completed pre-Apex splits that create a fully independent top-level Institution. It does not predict disputes, factions, or partial autonomy inside a parent. State conflict can be anchored to UCDP; corporate spin-offs need different measures. After Apex formation, churn remains subordinate by assumption.",
    sources: [
      { label: "UCDP conflict definitions and actor types", url: "https://ucdp.uu.se/definitions" },
      { label: "Jensen & Meckling — agency costs", url: "https://doi.org/10.1016/0304-405X(76)90026-X" },
      { label: "World Bank Worldwide Governance Indicators", url: "https://www.worldbank.org/en/publication/worldwide-governance-indicators" },
    ],
  },
  aiSpread: {
    title: "AI architecture diffusion rate",
    kind: "Published diffusion method; uncalibrated default",
    summary: "The 15% logistic rate is illustrative. Stanford reports rapid but uneven AI adoption and growing national AI-sovereignty efforts. A robust version should fit country- and sector-specific adoption curves rather than one global rate.",
    sources: [
      { label: "Stanford HAI — 2026 AI Index", url: "https://hai.stanford.edu/ai-index/2026-ai-index-report" },
      { label: "OECD.AI policy and data observatory", url: "https://oecd.ai/" },
      { label: "Bass diffusion model", url: "https://doi.org/10.1287/mnsc.15.5.215" },
    ],
  },
  consolidationAcceleration: {
    title: "AI consolidation acceleration",
    kind: "Author-defined bounded feedback variable",
    summary: "One control bundles the theory that AI adoption and accumulated consolidation make later consolidation faster and more effective. The multiplier starts at 1x, rises with adoption times consolidation progress, is capped at 5x, and shortens wave intervals only; it no longer compounds loss probability. We deliberately do not separately implement Hawkes event clustering, coagulation merger kernels, preferential attachment, independent tempo/severity/suppression controls, or unbounded recursive acceleration.",
    sources: [
      { label: "Hawkes — self-exciting point processes", url: "https://doi.org/10.1093/biomet/58.1.83" },
      { label: "Arthur — increasing returns and path dependence", url: "https://doi.org/10.2307/2234208" },
      { label: "Barabási & Albert — preferential attachment", url: "https://doi.org/10.1126/science.286.5439.509" },
      { label: "Stanford HAI — 2026 AI Index", url: "https://hai.stanford.edu/ai-index/2026-ai-index-report" },
    ],
  },
  currentWave: {
    title: "Current wave in progress",
    kind: "Core author assumption",
    summary: "The core scenario stipulates that centers of power are reorganizing in 2026. Ray Dalio described February 2026 as Stage 6 of his Big Cycle—great disorder, weakened rules, and a clash of great powers. That supports the author’s interpretation of a current wave; it does not estimate how consolidating the wave will be. Resolution in 2029 and the 15% mean loss remain scenario assumptions.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "Dalio — It’s Official: The World Order Has Broken Down", url: "https://raydalio.substack.com/p/its-official-the-world-order-has" },
    ],
  },
  modelHorizon: {
    title: "Model horizon",
    kind: "Analyst-selected display parameter",
    summary: "The horizon changes what is visible, not the underlying event rate. Calendar years through 7026 are simulation stress-test coordinates without predictive or evidentiary status. Long horizons expose asymptotic model behavior rather than forecast historical time.",
    sources: [
      { label: "NIST — uncertainty and sensitivity in process models", url: "https://www.itl.nist.gov/div898/handbook/pri/section5/pri531.htm" },
    ],
  },
  expectedValue: {
    title: "Seeded stochastic scenario timeline",
    kind: "Authored clustered-gap bootstrap and beta-binomial process",
    summary: "Later-wave arrivals sample normalized 6-, 36-, and 124-year gaps, preserving short, medium, and long clustered spacing around the selected mean. Each wave also draws latent beta severity before institution-level binomial losses. The sparse gap bootstrap and beta concentration are authored conventions, not fitted forecasts; Hawkes self-excitation remains unimplemented.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "Hawkes — self-exciting point processes", url: "https://doi.org/10.1093/biomet/58.1.83" },
    ],
  },
  transitionRule: {
    title: "Agent-count transition equation",
    kind: "Author-defined mathematical assumption",
    summary: "The count-only transition combines beta-binomial wave losses, fixed external fragments, and binomial completed splits. It does not identify winners, parents, lineages, internal politics, or partial autonomy. Institutions remain exchangeable within each wave.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "US DOJ/FTC Merger Guidelines", url: "https://www.justice.gov/atr/2023-merger-guidelines" },
    ],
  },
  equalWeight: {
    title: "One institution, one structural node",
    kind: "Residual structural simplifying assumption",
    summary: "Structural consolidation still counts each country or company as one top-level node, but the interface now ranks economic influence using country GDP and company revenue. Winner identity is outside scope; transition counts remain unweighted. States and firms are explicitly not equivalent in sovereignty or coercive capacity.",
    sources: [
      { label: "World Bank — GDP data", url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD" },
      { label: "COW National Material Capabilities", url: "https://correlatesofwar.org/data-sets/national-material-capabilities/" },
      { label: "Fortune Global 500", url: "https://fortune.com/ranking/global500/" },
    ],
  },
  economicPowerRanking: {
    title: "GDP/revenue economic-power ranking",
    kind: "Measured inputs + author-defined cross-type heuristic",
    summary: "Countries use latest positive World Bank GDP in current USD and technology companies use approximate annual revenue. Country growth is a roughly ten-year nominal-USD GDP CAGR; company growth uses origin-country GDP as a proxy. GDP is value added while revenue is gross sales, so the joint rank double-counts activity and is not an accounting-consistent total or a complete measure of political power.",
    sources: [
      { label: "World Bank — GDP current USD", url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD" },
      { label: "Fortune Global 500 ranking", url: "https://fortune.com/ranking/global500/" },
    ],
  },
  conflictEconomicCycle: {
    title: "Conflict shock, recovery, and rebound",
    kind: "Author-defined economic path with empirical motivation",
    summary: "Every modeled baseline conflict immediately reduces each institution's economic-power level by 10%, recovers linearly over ten years, and ends 3% above its pre-event path. Conflict costs are empirically motivated, but a net-positive rebound is not universal and the 10/10/3 values are scenario assumptions.",
    sources: [
      { label: "IMF — The Macroeconomic Costs of Conflict", url: "https://www.imf.org/en/Publications/WP/Issues/2020/06/26/The-Macroeconomic-Costs-of-Conflict-49515" },
      { label: "World Bank — GDP growth", url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG" },
    ],
  },
  syntheticBlocs: {
    title: "Synthetic bloc assignment",
    kind: "Visualization-only assumption",
    summary: "Entities are distributed evenly and deterministically for legibility. Colors do not use geography, alliances, ownership, trade, cloud dependency, ideology, or supply chains. A network model should replace this assignment.",
    sources: [
      { label: "COW Formal Alliances dataset", url: "https://correlatesofwar.org/data-sets/formal-alliances/" },
      { label: "COW Trade dataset", url: "https://correlatesofwar.org/data-sets/bilateral-trade/" },
    ],
  },
  technicalVsPolitical: {
    title: "Technical adoption versus governing authority",
    kind: "Core conceptual distinction",
    summary: "Compatible AI systems can spread while states retain separate sovereignty and directives. Stanford's AI Index reports both rapid adoption and increased emphasis on national AI sovereignty; the model therefore keeps adoption and political consolidation separate.",
    sources: [
      { label: "Stanford HAI — AI economy", url: "https://hai.stanford.edu/ai-index/2026-ai-index-report/economy" },
      { label: "Stanford HAI — policy and governance", url: "https://hai.stanford.edu/ai-index/2026-ai-index-report/policy-and-governance" },
    ],
  },
  powerCalcification: {
    title: "AI-mediated institutional power calcification",
    kind: "Author-defined core premise and falsifiable hypothesis",
    summary: "The model assumes that AI-mediated authority can preserve objectives, records, threat models, enforcement logic, biases, and grievances across succession and generational turnover. Historical forgetting, economic reset, administrative decay, and blind spots therefore stop automatically reopening the field. Persistent memory can preserve competence or inherited prejudice; deliberate unlearning is not modeled. New organizations may still form, but only as curated subordinates after Apex. AI and singleton sources motivate the mechanism; they do not prove permanence.",
    sources: [
      { label: "Stanford HAI — 2026 AI Index", url: "https://hai.stanford.edu/ai-index/2026-ai-index-report" },
      { label: "NIST AI RMF Generative AI Profile", url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" },
      { label: "Bostrom — What is a Singleton?", url: "https://nickbostrom.com/fut/singleton" },
    ],
  },
  pluralismToleranceGap: {
    title: "Pluralism tolerance and institutional intolerance",
    kind: "Unmodeled author-defined classification proposal",
    summary: "A future dimension would classify a theologically or ideologically driven Institution as intolerant when tolerance and acceptance of nonmembers, dissenters, and peaceful parallel institutions are not core governing commitments. No current entity is scored. Doctrine, formal rules, and observed behavior require separate evidence and review; intolerance may increase consolidation attempts while also increasing resistance and fragmentation.",
    sources: [
      { label: "Universal Declaration of Human Rights — Articles 18–20", url: "https://www.un.org/en/about-us/universal-declaration-of-human-rights" },
      { label: "International Covenant on Civil and Political Rights", url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-civil-and-political-rights" },
      { label: "V-Dem Dataset v16", url: "https://www.v-dem.net/data/the-v-dem-dataset/" },
      { label: "Pew — Global Restrictions on Religion", url: "https://www.pewresearch.org/religion/feature/religious-restrictions-around-the-world/" },
    ],
  },
  existentialRiskBoundary: {
    title: "Civilizational outcomes after Apex coordination",
    kind: "Author-defined scope and outcome taxonomy",
    summary: "Apex coordination, permanent human disempowerment, and biological extinction are separate outcomes. The current equations calculate only Apex coordination. They do not determine whether the result becomes AI constitutional governance, human-elite displacement, a human–AI institution, civilizational succession, permanent disempowerment, or biological extinction. Permanent disempowerment is an existential catastrophe, not biological extinction.",
    sources: [
      { label: "Bostrom — What is a Singleton?", url: "https://nickbostrom.com/fut/singleton" },
      { label: "NIST AI RMF Generative AI Profile", url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" },
      { label: "Stanford HAI — 2026 AI Index", url: "https://hai.stanford.edu/ai-index/2026-ai-index-report" },
    ],
  },
  governanceHeterogeneity: {
    title: "Governance heterogeneity",
    kind: "Robustness requirement",
    summary: "A single oligarchy label suppresses differences in regime structure, stability, accountability, and effectiveness. V-Dem and WGI provide country-year indicators that can parameterize heterogeneous agents.",
    sources: [
      { label: "V-Dem Dataset v16", url: "https://www.v-dem.net/data/the-v-dem-dataset/" },
      { label: "World Bank WGI 2026", url: "https://www.worldbank.org/en/publication/worldwide-governance-indicators" },
    ],
  },
  apexMajorityRule: {
    title: "Apex Institution coordination threshold",
    kind: "Author-defined dominance threshold",
    summary: "The forced terminal shortcut has been removed. Two approximately equal centers can persist until a stochastic transition actually leaves one independent center; structural influence then jumps from about 50% to 100%. Effective Apex coordination additionally requires more than 50% internal standard adoption.",
    sources: [
      { label: "Bostrom — What is a Singleton?", url: "https://nickbostrom.com/fut/singleton" },
      { label: "DOJ/FTC Merger Guidelines — concentration frameworks", url: "https://www.justice.gov/atr/2023-merger-guidelines" },
    ],
  },
  institutionalAdoption: {
    title: "Institutional standard adoption rate",
    kind: "Proxy-calibrated variable",
    summary: "The 7% default is an approximate logistic coefficient derived from IFRS growth: nearly 120 jurisdictions requiring IFRS in 2016 versus more than 140 today, normalized against 170 current jurisdiction profiles. IFRS is a standards-adoption proxy, not an AI-governance estimate, and formal requirement does not prove complete internal enforcement.",
    sources: [
      { label: "IFRS Foundation — current jurisdiction profiles", url: "https://www.ifrs.org/use-around-the-world/use-of-ifrs-standards-by-jurisdiction/" },
      { label: "IFRS Foundation — 2016 global reporting language", url: "https://www.ifrs.org/content/dam/ifrs/around-the-world/adoption/the-global-financial-reporting-language-may-2016.pdf" },
      { label: "Bass diffusion model", url: "https://doi.org/10.1287/mnsc.15.5.215" },
    ],
  },
  bigCycleStrength: {
    title: "Independent 1 economic strength",
    kind: "Dalio-inspired composite; manually selected",
    summary: "This temporary score combines education, innovation, competitiveness, output, trade, military capability, financial-center strength, and reserve-currency position. Dalio supplies the hypothesis structure; WIPO, World Bank, SIPRI, COW, BIS, and IMF data should eventually replace the slider with separate observed dimensions.",
    sources: [
      { label: "Dalio — The Changing World Order", url: "https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf" },
      { label: "WIPO Global Innovation Index", url: "https://www.wipo.int/global_innovation_index/en/" },
      { label: "SIPRI Military Expenditure Database", url: "https://www.sipri.org/databases/milex" },
      { label: "IMF COFER reserve-currency data", url: "https://data.imf.org/COFER" },
    ],
  },
  bigCycleStress: {
    title: "Systemic Big Cycle stress",
    kind: "Dalio-inspired composite; manually selected",
    summary: "This score combines debt and monetary stress, inequality, internal disorder, external power transition, conflict, and shocks. It is not a measured current-world index. Independent datasets are linked for later calibration and falsification.",
    sources: [
      { label: "Dalio — The Changing World Order", url: "https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf" },
      { label: "IMF Global Debt Database", url: "https://www.imf.org/external/datamapper/datasets/GDD" },
      { label: "World Inequality Database", url: "https://wid.world/data/" },
      { label: "World Bank Worldwide Governance Indicators", url: "https://www.worldbank.org/en/publication/worldwide-governance-indicators" },
      { label: "UCDP conflict datasets", url: "https://ucdp.uu.se/downloads/" },
    ],
  },
  bigCycleCoupling: {
    title: "Economics-to-institution coupling",
    kind: "Author-defined sensitivity parameter",
    summary: "This controls how strongly economic strength and systemic stress alter consolidation, qualifying-event frequency, and internal fracture. The coefficients are transparent scenario choices, not estimates made by Dalio or fitted from history. A zero setting disables the economics layer.",
    sources: [
      { label: "Project framework — Dalio source manuscript", url: "https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf" },
      { label: "COW State System Membership for future calibration", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "V-Dem country-year governance data", url: "https://www.v-dem.net/data/the-v-dem-dataset/" },
    ],
  },
  modelSensitivity: {
    title: "Model sensitivity and structural alternatives",
    kind: "Diagnostic analysis — not forecast uncertainty",
    summary: "One-at-a-time and Morris-style screening identify influential assumptions. Phase maps, observability cases, and wave-calibration cases compare model structures; their spread is not a confidence interval around one forecast.",
    sources: [
      { label: "NIST sensitivity analysis", url: "https://www.itl.nist.gov/div898/handbook/pri/section5/pri531.htm" },
    ],
  },
  monteCarloUncertainty: {
    title: "Monte Carlo parameter-uncertainty propagation",
    kind: "L1 model-behavior analysis — not posterior forecasting",
    summary: "Four independent Latin-hypercube ensembles propagate transparent parameter distributions through the seeded binomial transition model. Non-reaching times remain censored. Transformed bell curves respect parameter bounds; external fragments use a zero-inflated count distribution.",
    sources: [
      { label: "McKay, Beckman & Conover — Latin hypercube sampling", url: "https://doi.org/10.1080/00401706.1979.10489755" },
      { label: "NIST sensitivity analysis", url: "https://www.itl.nist.gov/div898/handbook/pri/section5/pri531.htm" },
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
    ],
  },
  targetFiveObjective: {
    title: "First year at five top-level Institutions",
    kind: "Structural model objective — not a forecast",
    summary: "T₅ is the first modeled year with at most five independent top-level Institutions. Boundary comparisons lock the starting field at 225. Two years is the proven lower bound under current clamps; 5,000 years is an attained display-horizon boundary, not a natural maximum.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "NIST sensitivity analysis", url: "https://www.itl.nist.gov/div898/handbook/pri/section5/pri531.htm" },
    ],
  },
  modelChallengeAnalysis: {
    title: "COW wave robustness and model comparison",
    kind: "Historical diagnostic — L1 sourced-exploratory",
    summary: "Forty definition specifications and four leave-one-wave-out estimates test calibration fragility. Seven models are compared in six chronological test blocks. The target is COW membership exit, not permanent subjugation or Apex emergence.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "NIST model validation and process modeling", url: "https://www.itl.nist.gov/div898/handbook/pmd/pmd.htm" },
    ],
  },
  aircraftConsolidationProxy: {
    title: "Aircraft manufacturing consolidation-wave reference",
    kind: "Bounded corporate proxy",
    summary: "USITC and RAND observations imply severe aerospace wave-loss shares from 33.3% to 71.4%, with a 52.4% midpoint and a rounded 50% corporate scenario. This secondary high-intensity comparison does not calibrate the 15% sovereign production default.",
    sources: [
      { label: "USITC Publication 3143 — large civil aircraft", url: "https://www.usitc.gov/publications/332/pub3143.pdf" },
      { label: "RAND MR-1696 — combat aircraft", url: "https://www.rand.org/pubs/monograph_reports/MR1696.html" },
      { label: "RAND MR-1537 — defense aerospace", url: "https://www.rand.org/pubs/monograph_reports/MR1537.html" },
    ],
  },
  cowEmpiricalBaseline: {
    title: "COW empirical membership baseline",
    kind: "Observed historical data — limited outcome semantics",
    summary: "The baseline uses 244 dated state-system membership spells from COW v2024. Membership exits are observed events, but their causes have not yet been coded as consolidation, fragmentation, dissolution, or interruption. The hazard is a benchmark, not validation of the full model.",
    sources: [
      { label: "COW State System Membership v2024", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
      { label: "NIST — survival analysis overview", url: "https://www.itl.nist.gov/div898/handbook/apr/section1/apr15.htm" },
    ],
  },
  validationProgram: {
    title: "Empirical validation gates",
    kind: "Research governance control",
    summary: "Phases advance only when required data and tests exist. A blocked phase is an intentional result that prevents unsupported analysis. Forecast claims remain unauthorized until the final publication gate passes.",
    sources: [
      { label: "NIST — process modeling and experimental design", url: "https://www.itl.nist.gov/div898/handbook/pri/pri.htm" },
      { label: "COW State System Membership", url: "https://correlatesofwar.org/data-sets/state-system-membership/" },
    ],
  },
  modelBehaviorPca: {
    title: "Model-behavior principal component analysis",
    kind: "Synthetic diagnostic — not empirical PCA",
    summary: "PCA is applied to standardized assumptions from 768 seeded variants around 12 authored archetypes. It identifies correlated directions in our scenario design, not latent factors discovered in observed world data. Component signs are arbitrary and variance structure depends on the authored sample.",
    sources: [
      { label: "NIST — principal components", url: "https://www.itl.nist.gov/div898/handbook/pmc/section5/pmc55.htm" },
      { label: "Generated PCA methodology and report", url: "https://en.wikipedia.org/wiki/Principal_component_analysis" },
    ],
  },
  scenarioTesting: {
    title: "Seeded scenario testing",
    kind: "Designed model experiment",
    summary: "Twelve archetypes receive 64 seeded perturbations each. Frequencies across those 768 rows describe model behavior under the selected design; they are not real-world event probabilities. Censored scenarios remain in the analysis at the 5,000-year horizon.",
    sources: [
      { label: "NIST — process modeling and experimental design", url: "https://www.itl.nist.gov/div898/handbook/pri/pri.htm" },
      { label: "NIST — sensitivity analysis", url: "https://www.itl.nist.gov/div898/handbook/pri/section5/pri531.htm" },
    ],
  },
  mandatoryObservability: {
    title: "Mandatory observability and anti-concealment",
    kind: "Core governance assumption",
    summary: "Subordinate agents receive effective-alignment credit only when material data, core applications, infrastructure, dependencies, logs, lineage, and recovery paths are visible to Apex-authorized governance. Detected material concealment always triggers remediation; detection itself remains imperfect.",
    sources: [
      { label: "NIST SP 800-53 Rev. 5", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
      { label: "NIST SP 800-207 Zero Trust Architecture", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      { label: "NIST Cybersecurity Framework 2.0", url: "https://www.nist.gov/cyberframework" },
    ],
  },
  institutionalSingularity: {
    title: "Institutional singularity",
    kind: "Project-defined institutional model",
    summary: "One institution becomes the dominant coordinating authority while other institutions continue as subordinate or locally autonomous agents. The model concerns institutional primacy and implemented authority, not biological organization.",
    sources: [
      { label: "Bostrom — singleton at the highest decision level", url: "https://nickbostrom.com/fut/singleton" },
    ],
  },
  technologicalSingularity: {
    title: "Technological singularity",
    kind: "Neighboring model — not the current trigger",
    summary: "Vinge's model centers on greater-than-human intelligence and accelerating technological progress. Our Apex Institution event is a coordination threshold and can occur without recursive capability growth.",
    sources: [
      { label: "Vinge — The Coming Technological Singularity (1993)", url: "https://frc.ri.cmu.edu/~hpm/book98/com.ch1/vinge.singularity.html" },
    ],
  },
  singletonModel: {
    title: "Singleton model",
    kind: "Closest neighboring governance model",
    summary: "Bostrom's singleton has one decision-making agency at the highest level. The Apex Institution model is an incomplete or hierarchical singleton because subordinate institutions retain local agency and independent centers may remain outside the hierarchy.",
    sources: [
      { label: "Bostrom — What is a Singleton?", url: "https://nickbostrom.com/fut/singleton" },
    ],
  },
  economicSingularity: {
    title: "Economic growth singularity",
    kind: "Independent neighboring model",
    summary: "Hanson models transitions between successively faster economic growth modes. Apex Institution coordination can emerge without an output-growth discontinuity, so economic output must remain a separate state variable.",
    sources: [
      { label: "Hanson — Long-Term Growth as Exponential Modes", url: "https://hanson.gmu.edu/longgrow.html" },
    ],
  },
  multipolarServices: {
    title: "Multipolar or comprehensive AI services",
    kind: "Neighboring plural-agent model",
    summary: "Services-oriented models retain many specialized systems. Those systems resemble the subordinate institutions; the Apex Institution question is whether one institution acquires final coordination and dispute-resolution authority over them.",
    sources: [
      { label: "Drexler — Comprehensive AI Services materials", url: "https://futureoflife.org/wp-content/uploads/2019/02/drexler_thursday_pm.pdf" },
    ],
  },
});

export const REFERENCE_ORDER = Object.freeze([
  "combinedBaseline",
  "oligarchyAbstraction",
  "conflictInterval",
  "qualifyingConflict",
  "institutionEventProbability",
  "externalFragmentation",
  "internalConflict",
  "aiSpread",
  "consolidationAcceleration",
  "currentWave",
  "modelHorizon",
  "expectedValue",
  "transitionRule",
  "equalWeight",
  "economicPowerRanking",
  "conflictEconomicCycle",
  "syntheticBlocs",
  "technicalVsPolitical",
  "powerCalcification",
  "pluralismToleranceGap",
  "existentialRiskBoundary",
  "governanceHeterogeneity",
  "apexMajorityRule",
  "institutionalAdoption",
  "bigCycleStrength",
  "bigCycleStress",
  "bigCycleCoupling",
  "modelSensitivity",
  "monteCarloUncertainty",
  "targetFiveObjective",
  "modelChallengeAnalysis",
  "aircraftConsolidationProxy",
  "cowEmpiricalBaseline",
  "validationProgram",
  "modelBehaviorPca",
  "scenarioTesting",
  "mandatoryObservability",
  "institutionalSingularity",
  "technologicalSingularity",
  "singletonModel",
  "economicSingularity",
  "multipolarServices",
]);
