# Search, answer engines and AI models

How warfarisk.com is made findable, and how to keep it that way. Everything here is generated at build time from the same data files the page uses, so it cannot drift from the page.

## What the build makes

`bun run build` runs `scripts/seo.ts` after the two Vite builds. It writes:

| File | What it is for |
| --- | --- |
| `index.html` | The page, with structured data (JSON-LD) in the head: the project, the two papers, the team, the code |
| `static-copy/index.html` | The same page as plain HTML. The Worker gives it to crawlers that do not run scripts (see below) |
| `team/<slug>/index.html` | One page per person, with a profile structured-data block. This is what a search for a name finds |
| `faq/index.html` | The same questions and answers on their own page, with FAQ structured data. The landing page has them too, as rows that open and close |
| `sitemap.xml` | The home page, the questions page and every team page |
| `llms.txt`, `llms-full.txt` | A plain summary for language models |

`public/robots.txt` allows search engines and the named AI crawlers, and points to the sitemap.

## Why a separate copy for crawlers

The page is drawn by JavaScript. Google runs it, but most AI crawlers (GPTBot, ClaudeBot, PerplexityBot and others) read only the HTML they are sent and would see an empty page. `worker/index.js` gives those crawlers `static-copy/index.html`, built from the same components, so the text and numbers are identical. Browsers, Googlebot and Bingbot get the normal page. The Worker also sends `www.warfarisk.com` to `warfarisk.com` with a permanent redirect.

To add a crawler, add its name to `NO_SCRIPT_BOTS` in `worker/index.js`.

## Where to change things

- Team members, LinkedIn, research profiles and affiliations: `src/data/team.ts`
- Questions and answers: `src/data/faq.ts` (the numbers in them come from `src/data/numbers.ts`)
- Papers: `src/data/papers.ts`
- Title and description: `index.html` and the two constants at the top of `scripts/seo.ts`

Markup must match what people can see. Only put a fact in structured data if it is on the page it describes.

## One-time steps in the search engines (need your own accounts)

1. **Google Search Console.** Add the domain `warfarisk.com` as a Domain property and verify it with the DNS TXT record Google gives you (add it in Cloudflare, under DNS). Then open Sitemaps and submit `https://warfarisk.com/sitemap.xml`. Then use URL Inspection, then Request Indexing, on the home page and on each team page. Google limits how many a day.
2. **Bing Webmaster Tools.** Add the site, or import it from Search Console, and submit the same sitemap. Bing also feeds ChatGPT search.
3. **IndexNow** (Bing, Yandex and others) is already set up: the key file is in `public/`. Submit changed URLs with a POST to `https://api.indexnow.org/indexnow`.

Indexing takes days to weeks. Nothing here can promise a ranking. A page with an exact name in its title and heading, linked from the home page and listed in the sitemap, is what gives a name search the best chance.

## Measuring

Pick 15 to 20 questions you want WarfaRisk to answer, such as "warfarin dose prediction ancestry calibration" and each team member's name. Every month, run them in Google, ChatGPT, Perplexity and Claude. Note whether the project is cited and what is cited instead. Search Console's Performance report shows Google traffic, including AI Overviews.

## Honest notes

- `llms.txt` is a proposal. No major AI company has said its crawlers read it. It costs nothing and is kept in step automatically.
- Google says no special markup or files are needed for AI Overviews. Good pages that are indexed and show a snippet are what counts.
- This is health content. Google expects clear authorship and trustworthy sources, which is why the team, the papers and the "not for clinical use" notice are on every page.
- Cloudflare's AI Crawl Control can block AI crawlers. It is not blocking them now. If answers stop citing the project, check that setting first.
