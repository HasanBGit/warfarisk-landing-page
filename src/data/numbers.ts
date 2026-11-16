// Every number shown on the page lives here, with where it comes from.
// JPM = Beyond Mean Absolute Error (J. Pers. Med. 2026, 16, 531).
// AI  = WarfaRisk prototype paper (AI 2026, 7, 431).

export const links = {
  jpm: "https://www.mdpi.com/2075-4426/16/10/531",
  ai: "https://www.mdpi.com/2673-2688/7/10/431",
  code: "https://github.com/HasanBGit/WarfaRisk",
  app: "https://github.com/HasanBGit/WarfaRisk/tree/main/prototype_app",
  ui: "https://github.com/HasanBGit/WarfaRisk-Prototype-UI",
  models: "https://huggingface.co/collections/HassanB4/beyond-mae-ancestry-stratified-warfarin-dose-prediction",
  aic: "https://ai.alfaisal.edu",
};

// JPM Introduction and Section 3.
export const testSize = { small: 64, large: 1207, bestPublishedMae: 0.77 };

// JPM Table 2 and Table 3 (IWPC-6256, 1,207 test patients, MAE in mg/week).
export const accuracy = [
  { label: "Guess the median dose", mae: 12.34 },
  { label: "Clinical details only, linear model", mae: 10.86 },
  { label: "Published IWPC dosing formula", mae: 9.18 },
  { label: "Best WarfaRisk model", mae: 8.55 },
] as const;
export const best = { mae: 8.55, r2: 0.475, pw20: 0.466 }; // JPM Table 3, AutoGluon, combined features
export const pw20Mark = 0.5; // JPM Section 4.3

// JPM Section 5.4 and Table 1.
export const coverage = {
  target: 90,
  overall: 89.8,
  deepEnsemble: 24.9,
  widthAll: 37.7,
  widthRange: "37.6 to 38.1",
};

// JPM Table 1: MAPIE coverage by ancestry label, IWPC-6256, with test patients per label.
// ci = exact (Clopper-Pearson) 95% interval in percent, JPM Table 7.
// significant = still below target after multiple-testing correction (JPM Section 5.4).
export const groups = [
  { label: "Korean", n: 53, coverage: 96.2, significant: false, ci: [87.0, 99.5] },
  { label: "Japanese", n: 170, coverage: 95.9, significant: false, ci: [91.7, 98.3] },
  { label: "White", n: 493, coverage: 91.3, significant: false, ci: [88.4, 93.6] },
  { label: "Chinese", n: 28, coverage: 89.3, significant: false, ci: [71.8, 97.7] },
  { label: "Caucasian", n: 124, coverage: 86.3, significant: false, ci: [79.0, 91.8] },
  { label: "Intermediate", n: 14, coverage: 85.7, significant: false, ci: [57.2, 98.2] },
  { label: "Black", n: 73, coverage: 82.2, significant: false, ci: [71.5, 90.2] },
  { label: "Black or African American", n: 52, coverage: 69.2, significant: true, ci: [54.9, 81.3] },
  { label: "African-American", n: 24, coverage: 62.5, significant: true, ci: [40.6, 81.2] },
] as const;

// The overall bar first, then each group (JPM Section 5.4 and Table 1).
export const coverageBars = [
  { label: "All patients", n: 1207, coverage: 89.8, significant: false, ci: null },
  ...groups,
] as const;

// AI Section 6.2: group-by-group calibration (Mondrian) versus the single margin (MAPIE).
export const mondrian = [
  { label: "Black", before: 82.2, after: 93.2 },
  { label: "African-American", before: 62.5, after: 87.5 },
  { label: "Black or African American", before: 69.2, after: 78.8 },
] as const;

// JPM Table 9 (value, all patients) and Table 10 (black, patients labelled Black, n = 74), IWPC-1780, stacking model.
// Mean |SHAP|: the average push each input gives the predicted dose.
export const shap = {
  geneShare: 64,
  vkorc1All: 8.11,
  vkorc1Black: 0.453,
  rows: [
    { feature: "VKORC1 (AA)", value: 8.11, kind: "gene", black: 0.453 },
    { feature: "VKORC1 (AG)", value: 3.911, kind: "gene", black: 3.14 },
    { feature: "Age", value: 3.284, kind: "clinical", black: 3.839 },
    { feature: "Weight", value: 2.044, kind: "clinical", black: 2.411 },
    { feature: "Height", value: 1.576, kind: "clinical", black: 1.691 },
    { feature: "CYP2C9 (*3 type)", value: 1.124, kind: "gene", black: 0.389 },
    { feature: "CYP2C9 (*2 type)", value: 0.857, kind: "gene", black: 0.234 },
  ],
} as const;

// JPM Section 4.1 and 3.2.
export const rigor = { leakChecks: 11, seed: 20260725, trainPatients: 4830, testPatients: 1207, cohort: 6037 };

// Nine phases, AI Section 3 and JPM Figure 1. Phases 1 to 6 are the fully evaluated core, 7 to 9 are implemented extensions at prototype stage (AI Section 3.1, Figure 1).
export const phases = [
  { name: "Clean the data", line: "Fit every fix on training patients only, then run 11 checks for leaks." },
  { name: "Set the bars to beat", line: "Three simple methods, including the published IWPC formula." },
  { name: "Compare nine models", line: "Each one with clinical details, genes, and both together." },
  { name: "Leave one group out", line: "Train without one ancestry group, then test on it." },
  { name: "Check the intervals", line: "Check how often the real dose lands inside, by group." },
  { name: "Explain each dose", line: "Show which inputs pushed the dose up or down." },
  { name: "Follow doses over time", line: "Test on hospital records with repeated INR checks." },
  { name: "Report fairness one way", line: "Same tables for every group, in every result." },
  { name: "Write the reason", line: "A short plain explanation that cites its sources." },
] as const;
export const evaluatedPhases = 6;
