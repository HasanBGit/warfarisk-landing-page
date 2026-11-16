# Where each number comes from

Every figure on the page is defined in `src/data/numbers.ts` or `src/demo/demoData.ts`. This table says where each one comes from.

JPM is Beyond Mean Absolute Error (J. Pers. Med. 2026, 16, 531). AI is the WarfaRisk prototype paper (AI 2026, 7, 431).

## Figures from the papers (`src/data/numbers.ts`)

| Name in the file | What it is | Source |
| --- | --- | --- |
| `testSize` | 64 patients in the small test behind the best published error (0.77 mg/week), against 1,207 in the careful test | JPM Introduction and Section 3 |
| `accuracy` | Average error of simple methods and the best model, on the 1,207 test patients | JPM Tables 2 and 3 |
| `best` | Best model: average error 8.55 mg/week, R squared 0.475, 46.6% of doses within 20% (AutoGluon, combined features) | JPM Table 3 |
| `pw20Mark` | The usual bar for doses within 20%, which is 50% | JPM Section 4.3 |
| `coverage` | Overall coverage 89.8%, the deep-ensemble shortcut 24.9%, and the range width of about 37.7 mg/week | JPM Section 5.4 and Table 1 |
| `groups` | Share of true doses inside the 90% range for each ancestry label, with test patients per label | JPM Table 1 |
| `groups[].ci` | Exact (Clopper-Pearson) 95% interval for each label | JPM Table 7 |
| `groups[].significant` | Whether the group is still below 90% after multiple-testing correction (Benjamini-Hochberg, 18 groups) | JPM Section 5.4 |
| `mondrian` | Coverage before and after calibrating each group on its own | AI Section 6.2 |
| `shap` | Average push of each input on the dose for all patients, and for patients labelled Black (74 patients) | JPM Tables 9 and 10 |
| `rigor` | 11 leak checks, 1,207 test patients, 4,830 training patients | JPM Sections 4.1 and 3.2 |
| `phases` | The nine steps. Steps 1 to 6 are the evaluated core, steps 7 to 9 are implemented extensions at prototype stage | AI Section 3 and Figure 1, AI Section 3.1 |

## Demo outputs (`src/demo/demoData.ts`)

The four example patients are fixed. For each one, the predicted dose, the 90% range and the effect of each input are real outputs of the exported CatBoost model (combined features, cohort IWPC-6256), run locally.

- The range is the model's 90th-percentile absolute error on its 1,207 test patients, 18.8 mg/week either side of the dose.
- The model figures shown on the Dose screen (average error 8.87 mg/week, R squared 0.446, 0.455 within 20%) are for this exported CatBoost model. They differ from the best-model figures in the findings section (8.55 mg/week), which come from the AutoGluon model in the paper.
- The group check on the Dose screen (for example 69.2% for Black or African American patients) comes from JPM Table 1, not from the demo.
- The extra warning for Han Chinese patients comes from AI Section 6.2.

## Rule

Do not type a figure into a component. Add it to the data file with its source, then import it.
