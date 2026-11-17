// Runs after the two builds (`vite build` and `vite build --ssr`). It writes everything search engines and
// AI answer engines read, from the same data files the page uses, so none of it can drift from the page:
//
//   dist/index.html              the page, plus structured data (JSON-LD) in the head
//   dist/static-copy/index.html  the same page as plain HTML, for crawlers that do not run scripts
//   dist/team/<slug>/index.html  one page per team member, so a search for a name finds the project
//   dist/sitemap.xml
//   dist/llms.txt, llms-full.txt a plain-text summary for language models
//
// See docs/SEO.md.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../.ssr/entry-server.js";
import { faq } from "../src/data/faq";
import { accuracy, best, coverage, groups, links, mondrian, rigor, testSize } from "../src/data/numbers";
import { papers } from "../src/data/papers";
import { displayName, everyone, leads, members, type Person } from "../src/data/team";

const SITE = "https://warfarisk.com";
const DIST = new URL("../dist/", import.meta.url).pathname;
const OG_IMAGE = `${SITE}/og-image-3.png`;
const TITLE = "WarfaRisk: warfarin dose prediction and how far to trust it";
const DESCRIPTION =
  "Predicts a weekly warfarin dose and a range around it, then checks how well that range held up for each ancestry group. Research prototype, not for clinical use.";
const SUMMARY =
  "WarfaRisk is an open research project that predicts a weekly warfarin dose with a 90% range around it, then checks how well that range held up for each ancestry group. It is a research prototype, not tested in patients and not for clinical use.";

const lastmod = (() => {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cI", "--", "src", "public", "index.html"], { encoding: "utf8" }).trim().slice(0, 10) || new Date().toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
})();

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const write = (path: string, body: string) => {
  const full = DIST + path;
  mkdirSync(full.slice(0, full.lastIndexOf("/")), { recursive: true });
  writeFileSync(full, body);
};
const jsonLd = (data: unknown) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const ids = { website: `${SITE}/#website`, page: `${SITE}/#webpage`, project: `${SITE}/#project` };
const personUrl = (p: Person) => `${SITE}/team/${p.slug}/`;
const personId = (p: Person) => `${personUrl(p)}#person`;
const articleId = (key: string) => `${SITE}/#paper-${key}`;
const paperByKey = (key: string) => papers.find((p) => p.key === key)!;
// The order the authors are printed in on the AI paper.
const aiAuthors = ["hassan", "siraj", "omar", "muath", "abdullah", "mariam"].map((id) => everyone.find((p) => p.id === id)!);

const project = {
  "@type": "ResearchProject",
  "@id": ids.project,
  name: "WarfaRisk",
  description: SUMMARY,
  url: `${SITE}/`,
  sameAs: [links.code, links.ui, links.models],
  sponsor: {
    "@type": "Organization",
    name: "Alfaisal AI Center",
    url: links.aic,
    parentOrganization: { "@type": "CollegeOrUniversity", name: "Alfaisal University", url: "https://alfaisal.edu" },
  },
};

const website = {
  "@type": "WebSite",
  "@id": ids.website,
  url: `${SITE}/`,
  name: "WarfaRisk",
  description: DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": ids.project },
};

// `email` and `profiles` are included only where the page shows them: emails on the home page and the person's
// page, extra research profiles on the person's page only.
function personNode(p: Person, shown: { email?: boolean; profiles?: boolean } = {}) {
  const sameAs = [p.linkedin, ...(shown.profiles ? (p.profiles ?? []).map((x) => x.url) : [])].filter(Boolean);
  return {
    "@type": "Person",
    "@id": personId(p),
    name: p.name,
    honorificPrefix: p.title,
    alternateName: p.alternateNames ? [...p.alternateNames] : undefined,
    url: personUrl(p),
    image: p.photo ? `${SITE}${p.photo}` : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    email: shown.email && p.email ? p.email : undefined,
    affiliation:
      shown.profiles && p.affiliations
        ? p.affiliations.map((a) => ({ "@type": "Organization", name: a.name, url: a.url }))
        : undefined,
    memberOf: { "@id": ids.project },
  };
}

function paperNode(key: string, withAuthors = true) {
  const paper = paperByKey(key);
  return {
    "@type": "ScholarlyArticle",
    "@id": articleId(key),
    headline: paper.title,
    name: paper.title,
    url: paper.href,
    sameAs: `https://doi.org/${paper.doi}`,
    identifier: { "@type": "PropertyValue", propertyID: "DOI", value: paper.doi },
    datePublished: paper.year,
    inLanguage: "en",
    isPartOf: {
      "@type": "PublicationIssue",
      issueNumber: paper.issue,
      isPartOf: { "@type": "PublicationVolume", volumeNumber: paper.volume, isPartOf: { "@type": "Periodical", name: paper.journal } },
    },
    publisher: { "@type": "Organization", name: "MDPI" },
    author: withAuthors && key === "ai" ? aiAuthors.map((p) => ({ "@id": personId(p) })) : undefined,
    about: { "@id": ids.project },
  };
}

function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      website,
      {
        "@type": "WebPage",
        "@id": ids.page,
        url: `${SITE}/`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.project },
        inLanguage: "en",
        dateModified: lastmod,
        primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE, width: 1200, height: 630 },
      },
      { ...project, member: everyone.map((p) => ({ "@id": personId(p) })), subjectOf: papers.map((p) => ({ "@id": articleId(p.key) })) },
      ...everyone.map((p) => personNode(p, { email: true })),
      ...papers.map((p) => paperNode(p.key)),
      { "@type": "SoftwareSourceCode", name: "WarfaRisk pipeline and prototype app", codeRepository: links.code, url: links.code, about: { "@id": ids.project } },
      { "@type": "SoftwareSourceCode", name: "WarfaRisk prototype interface", codeRepository: links.ui, url: links.ui, about: { "@id": ids.project } },
    ],
  };
}

const isLead = (p: Person) => leads.some((l) => l.id === p.id);
const describe = (p: Person) =>
  isLead(p)
    ? `${displayName(p)} is one of the three project leads of WarfaRisk, an open research project on warfarin dose prediction.`
    : `${p.name} is a member of the WarfaRisk research team, an open research project on warfarin dose prediction.`;

function personGraph(p: Person) {
  const url = personUrl(p);
  return {
    "@context": "https://schema.org",
    "@graph": [
      website,
      project,
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: `${p.name} | WarfaRisk team`,
        description: describe(p),
        isPartOf: { "@id": ids.website },
        inLanguage: "en",
        dateModified: lastmod,
        mainEntity: { "@id": personId(p) },
      },
      { ...personNode(p, { email: true, profiles: true }), description: describe(p), subjectOf: p.authorOfAi ? { "@id": articleId("ai") } : undefined },
      ...(p.authorOfAi ? [paperNode("ai", false)] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "WarfaRisk", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Team", item: `${SITE}/#team` },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
    ],
  };
}

// ---- the page and the crawler copy ---------------------------------------------------------------------

const built = readFileSync(`${DIST}index.html`, "utf8");
if (!built.includes("<!--jsonld-->")) throw new Error("index.html lost its <!--jsonld--> marker");
const home = built.replace("<!--jsonld-->", jsonLd(homeGraph()));
write("index.html", home);

const page = renderPage().replace(/<span class="p-only">[\s\S]*?<\/span>/g, "");
const snapshot = home
  .replace('<div id="root"></div>', `<div id="root">${page}</div>`)
  .replace(/<script type="module"[^>]*><\/script>/g, "")
  .replace(/<link rel="modulepreload"[^>]*>/g, "");
write("static-copy/index.html", snapshot);

// The crawler copy must hold every section of the live page. The live page lists its sections in App.tsx.
const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
for (const [, key] of appSource.matchAll(/key: "([a-z]+)"/g)) {
  const present = key === "closing" ? snapshot.includes('class="closing"') : snapshot.includes(`id="${key}"`);
  if (!present) throw new Error(`The crawler copy is missing the "${key}" section. Add it to src/entry-server.tsx.`);
}

// ---- one page per person -------------------------------------------------------------------------------

const personCss = `:root{--ink:#1c1518;--muted:#5d5458;--line:#e5dce0;--accent:#8a2d5c;--accent-hover:#6f2249;--tint:#f8f3f5}
*{box-sizing:border-box}body{margin:0;color:var(--ink);background:#fff;font:400 1.0625rem/1.6 Inter,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-underline-offset:3px}a:hover{color:var(--accent-hover)}
.bar{border-bottom:1px solid var(--line)}.wrap{max-width:46rem;margin:0 auto;padding:0 20px}.bar .wrap{display:flex;align-items:center;height:68px}
.brand{font-weight:700;font-size:1.125rem;color:var(--ink);text-decoration:none}
.crumbs{margin:32px 0 0;font-size:.9375rem;color:var(--muted)}.crumbs a{color:var(--muted)}
.head{display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:24px}
.head img{width:120px;height:120px;border-radius:50%;object-fit:cover;background:var(--tint)}
h1{margin:0;font-size:clamp(2rem,5vw,2.75rem);line-height:1.1;letter-spacing:-.02em}
h2{margin:40px 0 8px;padding-top:20px;border-top:1px solid var(--line);font-size:1.25rem}
p{margin:0 0 12px}.muted{color:var(--muted)}ul{margin:0;padding-left:1.2rem}li{margin:.3rem 0}
.note{margin-top:40px;padding:16px 20px;background:var(--tint);border-radius:16px;color:var(--muted);font-size:.9375rem}
footer{margin:48px 0 40px;color:var(--muted);font-size:.9375rem}`;

function shell(o: { title: string; description: string; url: string; graph: unknown; ogType: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${o.url}">
<meta property="og:type" content="${o.ogType}">
<meta property="og:site_name" content="WarfaRisk">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:url" content="${o.url}">
<meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231c1518'/%3E%3Crect x='7' y='15' width='18' height='3' rx='1.5' fill='%23ffffff'/%3E%3Ccircle cx='16' cy='16.5' r='4' fill='%238a2d5c'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>${personCss}</style>
${jsonLd(o.graph)}
</head>
<body>
<header class="bar"><div class="wrap"><a class="brand" href="/">WarfaRisk</a></div></header>
<main class="wrap">
${o.body}
<p class="note">Research prototype. Not tested in patients and not for clinical use. The dose and range shown by WarfaRisk must not be used to make dosing decisions.</p>
</main>
<footer class="wrap"><a href="/">warfarisk.com</a></footer>
</body>
</html>
`;
}

function personPage(p: Person): string {
  const url = personUrl(p);
  const name = displayName(p);
  const ai = paperByKey("ai");
  const others = everyone.filter((o) => o.id !== p.id);
  const metaDescription = `${describe(p)} Research prototype, not for clinical use.`.slice(0, 200);
  const authored = p.authorOfAi
    ? `<h2>Publication</h2><p>${esc(name)} is an author${p.corresponding ? " (corresponding author)" : ""} of <a href="${esc(ai.href)}">${esc(ai.title)}</a>, ${esc(ai.venue)}. DOI: <a href="https://doi.org/${ai.doi}">${ai.doi}</a>.</p>`
    : "";
  const arabic = (p.alternateNames ?? []).filter((n) => /[\u0600-\u06FF]/.test(n));
  const otherNames = (p.alternateNames ?? []).filter((n) => !arabic.includes(n));
  const names =
    arabic.length || otherNames.length
      ? `<p class="muted">${[arabic.length ? `Name in Arabic: <span lang="ar" dir="rtl">${arabic.map(esc).join(", ")}</span>` : "", otherNames.length ? `Also written: ${otherNames.map(esc).join(", ")}` : ""].filter(Boolean).join(". ")}.</p>`
      : "";
  const affiliations = p.affiliations?.length
    ? `<h2>Affiliations</h2><ul>${p.affiliations.map((a) => `<li>${a.url ? `<a href="${esc(a.url)}">${esc(a.name)}</a>` : esc(a.name)}${a.role ? `, ${esc(a.role)}` : ""}</li>`).join("")}</ul>`
    : "";
  const profiles = p.profiles?.length
    ? `<h2>Research profiles</h2><ul>${p.profiles.map((x) => `<li><a href="${esc(x.url)}" rel="me noopener">${esc(x.label)}</a></li>`).join("")}</ul>`
    : "";
  const contact = [
    p.linkedin ? `<li><a href="${esc(p.linkedin)}" rel="me noopener">${esc(name)} on LinkedIn</a></li>` : "",
    p.email ? `<li>Email: <a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>` : "",
    `<li><a href="/">WarfaRisk project page</a></li>`,
    `<li><a href="${esc(links.code)}">WarfaRisk code on GitHub</a></li>`,
  ].join("");
  return shell({
    title: `${p.name} | WarfaRisk team`,
    description: metaDescription,
    url,
    graph: personGraph(p),
    ogType: "profile",
    body: `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">WarfaRisk</a> / <a href="/#team">Team</a> / ${esc(p.name)}</nav>
<div class="head">${p.photo ? `<img src="${p.photo}" alt="${esc(name)}" width="120" height="120">` : ""}<div><h1>${esc(name)}</h1><p class="muted">${isLead(p) ? "Project lead" : "Team member"}, WarfaRisk</p></div></div>
<p style="margin-top:24px">${esc(describe(p))}</p>
${names}
${authored}
${affiliations}
${profiles}
<h2>About WarfaRisk</h2>
<p>${esc(SUMMARY)}</p>
<p>The project is described in two peer-reviewed papers from 2026. The code and trained models are open.</p>
<h2>Links</h2>
<ul>${contact}</ul>
<h2>The rest of the team</h2>
<ul>${others.map((o) => `<li><a href="${personUrl(o)}">${esc(displayName(o))}</a></li>`).join("")}</ul>`,
  });
}

// The questions and answers live on their own page, not on the landing page.
const faqUrl = `${SITE}/faq/`;
const faqTitle = "Common questions about WarfaRisk";
function faqPage(): string {
  const description = "Short answers about WarfaRisk, a research prototype for warfarin dose prediction: what it is, how accurate it is, who it misses, who built it, and why it is not for clinical use.";
  return shell({
    title: `${faqTitle} | WarfaRisk`,
    description,
    url: faqUrl,
    ogType: "article",
    graph: {
      "@context": "https://schema.org",
      "@graph": [
        website,
        project,
        {
          "@type": "FAQPage",
          "@id": `${faqUrl}#faq`,
          url: faqUrl,
          name: faqTitle,
          isPartOf: { "@id": ids.website },
          about: { "@id": ids.project },
          inLanguage: "en",
          dateModified: lastmod,
          mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "WarfaRisk", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Common questions", item: faqUrl },
          ],
        },
      ],
    },
    body: `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">WarfaRisk</a> / Common questions</nav>
<h1 style="margin-top:24px">${faqTitle}</h1>
<p class="muted" style="margin-top:8px">Short answers, with the numbers from the papers. The full project page is at <a href="/">warfarisk.com</a>.</p>
${faq.map((f) => `<h2>${esc(f.q)}</h2>\n<p>${esc(f.a)}</p>`).join("\n")}
<h2>Read more</h2>
<ul>${papers.map((p) => `<li><a href="${esc(p.href)}">${esc(p.title)}</a> (${esc(p.venue)})</li>`).join("")}<li><a href="${esc(links.code)}">WarfaRisk code on GitHub</a></li><li><a href="${esc(links.models)}">Trained models on Hugging Face</a></li></ul>`,
  });
}
write("faq/index.html", faqPage());

for (const p of everyone) write(`team/${p.slug}/index.html`, personPage(p));

// ---- sitemap ---------------------------------------------------------------------------------------------

const urls = [`${SITE}/`, faqUrl, ...everyone.map(personUrl)];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);

// ---- llms.txt (a plain summary for language models; harmless, and cheap to keep in step) ----------------

const iwpc = accuracy[2];
const facts = [
  `Average error of the best model: ${best.mae} mg per week on ${testSize.large.toLocaleString("en-US")} test patients (published IWPC formula: ${iwpc.mae}).`,
  `Doses within 20% of the true dose: ${(best.pw20 * 100).toFixed(1)}% (the usual bar is 50%).`,
  `The 90% range held for ${coverage.overall}% of all patients, but for ${groups.find((g) => g.label === "Black or African American")!.coverage}% of patients labelled Black or African American and ${groups.find((g) => g.label === "African-American")!.coverage}% of African-American patients.`,
  `${rigor.leakChecks} leak checks ran before any model trained. Training and test patients never overlap.`,
];

write(
  "llms.txt",
  `# WarfaRisk

> ${SUMMARY}

${facts.map((f) => `- ${f}`).join("\n")}

## Pages

- [WarfaRisk](${SITE}/): the project page, with the findings, an interactive example and the papers
- [Common questions](${faqUrl}): short answers about what WarfaRisk is, how accurate it is and who it misses
- [Full text](${SITE}/llms-full.txt): the findings, questions and answers, and the team in one file

## Papers

${papers.map((p) => `- [${p.title}](${p.href}): ${p.venue}. DOI ${p.doi}`).join("\n")}

## Code and models

- [WarfaRisk pipeline and prototype app](${links.code})
- [WarfaRisk prototype interface](${links.ui})
- [Trained models](${links.models})

## Team

${everyone.map((p) => `- [${displayName(p)}](${personUrl(p)}): ${isLead(p) ? "project lead" : "team member"}`).join("\n")}

## Optional

- [Alfaisal AI Center](${links.aic}): supported the project with infrastructure
`,
);

write(
  "llms-full.txt",
  `# WarfaRisk

> ${SUMMARY}

## Questions and answers

${faq.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Key figures

${facts.map((f) => `- ${f}`).join("\n")}

## Share of true doses inside the 90% range, by ancestry label

| Label | Test patients | Inside the range | 95% interval |
| --- | --- | --- | --- |
${groups.map((g) => `| ${g.label} | ${g.n} | ${g.coverage}% | ${g.ci[0]} to ${g.ci[1]}% |`).join("\n")}

Calibrating each group on its own: ${mondrian.map((m) => `${m.label} went from ${m.before}% to ${m.after}%`).join("; ")}.

## Papers

${papers.map((p) => `- ${p.title}. ${p.venue}. ${p.href} (DOI ${p.doi})`).join("\n")}

## Team

Project leads:
${leads.map((p) => `- ${displayName(p)}${p.email ? `, ${p.email}` : ""}${p.linkedin ? `, ${p.linkedin}` : ""}, ${personUrl(p)}`).join("\n")}

Team:
${members.map((p) => `- ${p.name}${p.linkedin ? `, ${p.linkedin}` : ""}, ${personUrl(p)}`).join("\n")}

## Notice

WarfaRisk is a research prototype. It was not tested in patients and is not for clinical use. The dose and range it shows must not be used to make dosing decisions.
`,
);

// ---- checks ----------------------------------------------------------------------------------------------

const checks: [string, boolean][] = [
  ["title is 30 to 65 characters", TITLE.length >= 30 && TITLE.length <= 65],
  ["description is 70 to 165 characters", DESCRIPTION.length >= 70 && DESCRIPTION.length <= 165],
  ["crawler copy has exactly one h1", (snapshot.match(/<h1[ >]/g) ?? []).length === 1],
  ["crawler copy has no phone-only duplicates", !snapshot.includes('class="p-only"')],
  ["every FAQ answer is on the FAQ page", (() => { const html = readFileSync(`${DIST}faq/index.html`, "utf8"); return faq.every((f) => html.includes(esc(f.a))); })()],
  ["the landing page has no FAQ markup", !home.includes("FAQPage")],
  ["structured data parses", (() => { try { JSON.parse(JSON.stringify(homeGraph())); return true; } catch { return false; } })()],
  ["every person has a page", everyone.every((p) => readFileSync(`${DIST}team/${p.slug}/index.html`, "utf8").includes(`<h1>${esc(displayName(p))}</h1>`))],
];
for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
if (checks.some(([, ok]) => !ok)) throw new Error("SEO checks failed");
console.log(`seo: ${urls.length} URLs, lastmod ${lastmod}, crawler copy ${(snapshot.length / 1024).toFixed(0)} KB`);
