import { testSize } from "../data/numbers";

const COLS = 43;
const GAP = 14;

// One dot per patient in the careful test. The first 64 (teal) are the size of the small test behind the best published score.
export function DotField() {
  const total = testSize.large;
  const rows = Math.ceil(total / COLS);
  return (
    <svg
      className="dotfield-svg"
      viewBox={`0 0 ${COLS * GAP} ${rows * GAP}`}
      role="img"
      aria-label={`${total.toLocaleString("en-US")} dots, one for each patient in the careful test. The first ${testSize.small} are highlighted: the size of the small test.`}
    >
      {Array.from({ length: total }, (_, i) => {
        const small = i % COLS < 8 && Math.floor(i / COLS) < 8;
        return <circle key={i} className={small ? "dot-small" : "dot-rest"} cx={(i % COLS) * GAP + GAP / 2} cy={Math.floor(i / COLS) * GAP + GAP / 2} r={3.8} />;
      })}
    </svg>
  );
}
