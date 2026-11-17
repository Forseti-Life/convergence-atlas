// Revenue-led global technology institution baseline for the 2026 thought experiment.
// Ranks 1–25 follow the 2025 Fortune Global 500-derived technology revenue table.
// HP, Intel, Broadcom, Salesforce, and SAP extend the set to 30 using recent
// reported annual-revenue scale. Values are approximate and time-sensitive.

export const TECH_COMPANIES = Object.freeze([
  { name: "Amazon", revenueRank: 1, approximateRevenueUsdB: 637.9, origin: "United States", sector: "Cloud and e-commerce" },
  { name: "Apple", revenueRank: 2, approximateRevenueUsdB: 416.0, origin: "United States", sector: "Consumer technology" },
  { name: "Alphabet (Google)", revenueRank: 3, approximateRevenueUsdB: 350.0, origin: "United States", sector: "Internet and cloud" },
  { name: "Microsoft", revenueRank: 4, approximateRevenueUsdB: 281.7, origin: "United States", sector: "Software and cloud" },
  { name: "Samsung Electronics", revenueRank: 5, approximateRevenueUsdB: 220.3, origin: "South Korea", sector: "Electronics and semiconductors" },
  { name: "Foxconn", revenueRank: 6, approximateRevenueUsdB: 213.9, origin: "Taiwan", sector: "Electronics manufacturing" },
  { name: "Meta Platforms", revenueRank: 7, approximateRevenueUsdB: 164.5, origin: "United States", sector: "Social platforms" },
  { name: "JD.com", revenueRank: 8, approximateRevenueUsdB: 158.8, origin: "China", sector: "E-commerce and logistics" },
  { name: "Alibaba Group", revenueRank: 9, approximateRevenueUsdB: 137.3, origin: "China", sector: "E-commerce and cloud" },
  { name: "Nvidia", revenueRank: 10, approximateRevenueUsdB: 130.5, origin: "United States", sector: "Semiconductors and AI" },
  { name: "AT&T", revenueRank: 11, approximateRevenueUsdB: 122.3, origin: "United States", sector: "Telecommunications" },
  { name: "Huawei", revenueRank: 12, approximateRevenueUsdB: 118.1, origin: "China", sector: "Telecommunications and devices" },
  { name: "Deutsche Telekom", revenueRank: 13, approximateRevenueUsdB: 112.0, origin: "Germany", sector: "Telecommunications" },
  { name: "Dell Technologies", revenueRank: 14, approximateRevenueUsdB: 95.6, origin: "United States", sector: "Enterprise hardware" },
  { name: "Tencent", revenueRank: 15, approximateRevenueUsdB: 91.8, origin: "China", sector: "Internet and gaming" },
  { name: "Sony", revenueRank: 16, approximateRevenueUsdB: 90.1, origin: "Japan", sector: "Electronics and entertainment" },
  { name: "TSMC", revenueRank: 17, approximateRevenueUsdB: 88.3, origin: "Taiwan", sector: "Semiconductor foundry" },
  { name: "Hitachi", revenueRank: 18, approximateRevenueUsdB: 80.4, origin: "Japan", sector: "Industrial technology" },
  { name: "Lenovo", revenueRank: 19, approximateRevenueUsdB: 69.0, origin: "China / United States", sector: "Computing hardware" },
  { name: "Accenture", revenueRank: 20, approximateRevenueUsdB: 64.9, origin: "Ireland / United States", sector: "Technology services" },
  { name: "IBM", revenueRank: 21, approximateRevenueUsdB: 62.7, origin: "United States", sector: "Enterprise technology" },
  { name: "LG Electronics", revenueRank: 22, approximateRevenueUsdB: 57.7, origin: "South Korea", sector: "Consumer electronics" },
  { name: "Oracle", revenueRank: 23, approximateRevenueUsdB: 57.4, origin: "United States", sector: "Enterprise software and cloud" },
  { name: "Cisco", revenueRank: 24, approximateRevenueUsdB: 56.7, origin: "United States", sector: "Networking" },
  { name: "Panasonic", revenueRank: 25, approximateRevenueUsdB: 55.3, origin: "Japan", sector: "Electronics and industrial systems" },
  { name: "HP Inc.", revenueRank: 26, approximateRevenueUsdB: 53.6, origin: "United States", sector: "Computing and printing" },
  { name: "Intel", revenueRank: 27, approximateRevenueUsdB: 53.1, origin: "United States", sector: "Semiconductors" },
  { name: "Broadcom", revenueRank: 28, approximateRevenueUsdB: 51.6, origin: "United States", sector: "Semiconductors and infrastructure software" },
  { name: "Salesforce", revenueRank: 29, approximateRevenueUsdB: 37.9, origin: "United States", sector: "Enterprise software" },
  { name: "SAP", revenueRank: 30, approximateRevenueUsdB: 37.6, origin: "Germany", sector: "Enterprise software" },
]);

export const TECH_REVENUE_BASIS = Object.freeze({
  primaryYear: 2025,
  primarySource: "Fortune Global 500-derived technology revenue list",
  supplementalNote: "Ranks 26–30 are revenue-scale supplements from recent annual reporting.",
  retrieved: "2026-10-06",
});
