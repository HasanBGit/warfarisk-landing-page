import { best, coverage, groups, mondrian, testSize, accuracy } from "./numbers";
import { leads } from "./team";

// The questions people ask, with short answers that start with the answer.
// The page, the structured data and llms.txt all read from here, so they always say the same thing.
// Every number comes from numbers.ts, which says which table of which paper it is from.

const pct = (v: number) => `${v}%`;
const group = (label: string) => groups.find((g) => g.label === label);
const shift = (label: string) => mondrian.find((m) => m.label === label);
const iwpc = accuracy[2];
const black = group("Black or African American");
const african = group("African-American");
const blackLabel = shift("Black");
const blackAmerican = shift("Black or African American");
const names = leads.map((p) => `${p.title} ${p.name}`);

export const faq = [
  {
    q: "What is WarfaRisk?",
    a: "WarfaRisk is an open research project that predicts a weekly warfarin dose with a 90% range around it, then checks how well that range held up for each ancestry group. It is described in two peer-reviewed papers from 2026 and shown here as a prototype. It is not for clinical use.",
  },
  {
    q: "Can WarfaRisk be used to dose a patient?",
    a: "No. WarfaRisk is a research prototype, trained on public research data and not tested in patients. The dose and range shown on this page must not be used to make dosing decisions. Dosing decisions belong to a clinician.",
  },
  {
    q: "How accurate is the dose prediction?",
    a: `On ${testSize.large.toLocaleString("en-US")} test patients, the best model's average error was ${best.mae} mg per week, against ${iwpc.mae} for the published IWPC dosing formula. ${(best.pw20 * 100).toFixed(1)}% of doses were within 20% of the true dose, below the usual bar of 50%. These figures are from the Journal of Personalized Medicine paper.`,
  },
  {
    q: "Does it work equally well for every ancestry group?",
    a: `No. The 90% range held for ${pct(coverage.overall)} of all patients, but for patients labelled Black or African American it held for ${pct(black!.coverage)} (${black!.n} patients), and for African-American patients ${pct(african!.coverage)} (${african!.n} patients). Both are below the ${coverage.target}% goal. Calibrating each group on its own raised the Black label from ${pct(blackLabel!.before)} to ${pct(blackLabel!.after)}, and Black or African American from ${pct(blackAmerican!.before)} to ${pct(blackAmerican!.after)}.`,
  },
  {
    q: "Who built WarfaRisk?",
    a: `WarfaRisk is a research project from Alfaisal University and partner institutions in Saudi Arabia. The project leads are ${names[0]}, ${names[1]} and ${names[2]}. The team page lists everyone who worked on it, with links to their profiles.`,
  },
  {
    q: "Is the code open?",
    a: "Yes. The pipeline code, the prototype app, the interface demo and the trained models are open. Links to the papers, the code and the models are in the Papers section of this page.",
  },
] as const;
