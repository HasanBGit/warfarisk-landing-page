// Real outputs of the exported WarfaRisk CatBoost model (combined features), run locally
// on these four example patients. Group coverage and the portability penalty come from the papers
// (JPM Table 1, AI Section 6.2). The interval has the same width for everyone, as the papers report.

export type Status = "green" | "amber" | "red" | "none";

export type Impact = { label: string; value: number; kind: "gene" | "clinical" };

export type Case = {
  id: string;
  title: string;
  short: string;
  patient: {
    age: number;
    weight: number;
    height: number;
    targetInr: string;
    indication: string;
    ancestry: string;
    amiodarone: boolean;
    statin: boolean;
    inducer: boolean;
    cyp2c9: string | null;
    vkorc1: string | null;
  };
  dose: number;
  interval: [number, number];
  status: Status;
  coverage: number | null;
  notice: string;
  penalty: string | null;
  impacts: Impact[];
};

export const model = {
  name: "CatBoost",
  mae: 8.87,
  r2: 0.446,
  pw20: 0.455,
  cohort: "IWPC-6256",
  testPatients: 1207,
  halfWidth: 18.8, // mg/week, the 90th percentile of the model's absolute error on its test patients
};

const BELOW =
  "The interval is less reliable for this ancestry group than the 90% it promises. Add your own clinical judgment.";

export const cases: Case[] = [
  {
    id: "a",
    title: "Han Chinese man, 68",
    short: "Han Chinese, VKORC1 AG",
    patient: {
      age: 68, weight: 72, height: 168, targetInr: "2.5", indication: "Atrial fibrillation",
      ancestry: "Han Chinese", amiodarone: false, statin: false, inducer: false, cyp2c9: "*1/*1", vkorc1: "AG",
    },
    dose: 31.8,
    interval: [13.0, 50.6],
    status: "green",
    coverage: 100,
    notice: "The interval met its 90% target for this group on the test patients.",
    penalty: "Separate warning: when Han Chinese patients are left out of training, the error rises by 2.13 mg/week.",
    impacts: [
      { label: "Age (60 to 69)", value: 3.2, kind: "clinical" },
      { label: "Weight (72 kg)", value: -0.7, kind: "clinical" },
    ],
  },
  {
    id: "b",
    title: "Black or African American woman, 54",
    short: "Black or African American, CYP2C9 *1/*3",
    patient: {
      age: 54, weight: 88, height: 175, targetInr: "2.5", indication: "Deep vein thrombosis or pulmonary embolism",
      ancestry: "Black or African American", amiodarone: false, statin: true, inducer: false, cyp2c9: "*1/*3", vkorc1: "GG",
    },
    dose: 33.7,
    interval: [14.9, 52.5],
    status: "red",
    coverage: 69.2,
    notice: BELOW,
    penalty: null,
    impacts: [
      { label: "CYP2C9 (*1/*3)", value: -12.6, kind: "gene" },
      { label: "Age (50 to 59)", value: 6.4, kind: "clinical" },
      { label: "VKORC1 (GG)", value: 5.1, kind: "gene" },
      { label: "Weight (88 kg)", value: 2.6, kind: "clinical" },
      { label: "Height (175 cm)", value: 1.9, kind: "clinical" },
    ],
  },
  {
    id: "c",
    title: "Caucasian man, 72",
    short: "Caucasian, VKORC1 AA, on amiodarone",
    patient: {
      age: 72, weight: 80, height: 178, targetInr: "3.0", indication: "Mechanical heart valve",
      ancestry: "Caucasian", amiodarone: true, statin: true, inducer: false, cyp2c9: "*2/*2", vkorc1: "AA",
    },
    dose: 10.4,
    interval: [5.0, 29.2],
    status: "amber",
    coverage: 86.3,
    notice: "Slightly under 90% for this group, but not clearly different from 90%. Treat the interval with some care.",
    penalty: null,
    impacts: [
      { label: "CYP2C9 (*2/*2)", value: -8.5, kind: "gene" },
      { label: "VKORC1 (AA)", value: -4.6, kind: "gene" },
      { label: "Amiodarone", value: -3.8, kind: "clinical" },
      { label: "Height (178 cm)", value: 1.2, kind: "clinical" },
      { label: "Weight (80 kg)", value: 0.7, kind: "clinical" },
    ],
  },
  {
    id: "d",
    title: "Genes not entered, 62",
    short: "Clinical details only",
    patient: {
      age: 62, weight: 75, height: 170, targetInr: "2.5", indication: "Atrial fibrillation",
      ancestry: "Other or unspecified", amiodarone: false, statin: false, inducer: false, cyp2c9: null, vkorc1: null,
    },
    dose: 31.3,
    interval: [12.4, 50.1],
    status: "none",
    coverage: null,
    notice: "No genes were entered, so the model ran without them. The group check was not run for this case.",
    penalty: null,
    impacts: [
      { label: "Age (60 to 69)", value: 3.6, kind: "clinical" },
      { label: "CYP2C9 (not entered)", value: -3.7, kind: "gene" },
      { label: "VKORC1 (not entered)", value: 2.7, kind: "gene" },
      { label: "Height (170 cm)", value: 0.3, kind: "clinical" },
    ],
  },
];
