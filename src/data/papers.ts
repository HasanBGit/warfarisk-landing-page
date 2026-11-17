import { links } from "./numbers";

// The two papers, used by the Papers section, the structured data and the people pages.
export const papers = [
  {
    key: "jpm",
    title: "Beyond Mean Absolute Error: Ancestry-Stratified Calibration and Explainability for Warfarin Dosing Models",
    venue: "Journal of Personalized Medicine, 2026, 16(10), 531",
    journal: "Journal of Personalized Medicine",
    volume: "16",
    issue: "10",
    article: "531",
    year: "2026",
    point: "Accuracy, who the tool misses, how sure it is, and why, on the same patients.",
    href: links.jpm,
    doi: "10.3390/jpm16100531",
  },
  {
    key: "ai",
    title: "WarfaRisk: A Reproducible, Fairness-Aware Machine Learning Pipeline for Warfarin Dose Prediction (Prototype)",
    venue: "AI, 2026, 7(10), 431",
    journal: "AI",
    volume: "7",
    issue: "10",
    article: "431",
    year: "2026",
    point: "The tool: the nine steps, the three screens, and what it takes to reach a clinician.",
    href: links.ai,
    doi: "10.3390/ai7100431",
  },
] as const;
