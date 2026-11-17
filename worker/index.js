// Runs in front of the static files, only for the home page and the team pages (see wrangler.jsonc).
//
// 1. www.warfarisk.com goes to warfarisk.com with a permanent redirect, so there is one address for the site.
// 2. Crawlers that do not run scripts (most AI crawlers do not) get the page as plain HTML, from /static-copy/.
//    It is built from the same components as the live page, so the text and the numbers are the same.
//    Search engines that render the page (Google, Bing) and every browser get the normal page.

const APEX = "warfarisk.com";

// AI crawlers and answer-engine fetchers. They read raw HTML and do not run JavaScript.
const NO_SCRIPT_BOTS =
  /GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Bytespider|Amazonbot|DuckAssistBot|cohere-ai|MistralAI-User|YouBot|meta-externalagent|Diffbot|AI2Bot/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/" && NO_SCRIPT_BOTS.test(request.headers.get("user-agent") ?? "")) {
      const copy = await env.ASSETS.fetch(new Request(new URL("/static-copy/", url), request));
      if (copy.ok) {
        const response = new Response(copy.body, copy);
        response.headers.set("Content-Type", "text/html; charset=utf-8");
        response.headers.set("Vary", "User-Agent");
        return response;
      }
    }

    return env.ASSETS.fetch(request);
  },
};
