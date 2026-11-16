# Deploying to warfarisk.com

The site is a static build served by GitHub Pages at https://warfarisk.com.

## How it deploys

`.github/workflows/pages.yml` runs on every push to `main`. It installs with Bun, runs `bun run build`, and publishes the `dist/` folder. `public/CNAME` contains `warfarisk.com`, and Vite copies it into `dist/` so the custom domain survives each deploy. You can also run the workflow by hand from the Actions tab.

In the repository settings, Pages must use "GitHub Actions" as its source and `warfarisk.com` as its custom domain.

## DNS records at IONOS

Open IONOS, then Domains & SSL, then `warfarisk.com`, then DNS. The name servers can stay on the IONOS defaults. Change only these records.

Delete the two records that point to IONOS's placeholder page:

| Type | Name | Value to delete |
| --- | --- | --- |
| A | `@` | 74.208.236.197 |
| AAAA | `@` | 2607:f1c0:100f:f000::200 |

Add GitHub Pages:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | 185.199.108.153 |
| A | `@` | 185.199.109.153 |
| A | `@` | 185.199.110.153 |
| A | `@` | 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153 |
| AAAA | `@` | 2606:50c0:8001::153 |
| AAAA | `@` | 2606:50c0:8002::153 |
| AAAA | `@` | 2606:50c0:8003::153 |
| CNAME | `www` | hasanbgit.github.io |

**Leave the email records alone.** The domain has IONOS mail records (`MX` to `mx00.ionos.com` and `mx01.ionos.com`, and an SPF `TXT` record). Deleting them would stop email for the domain.

These values are the ones in GitHub's documentation for apex domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Checking it

```
dig +short A warfarisk.com
dig +short AAAA warfarisk.com
dig +short CNAME www.warfarisk.com
```

The first should list the four 185.199.x.153 addresses. DNS changes can take from a few minutes to a few hours. After GitHub finds the records it issues an HTTPS certificate, which can take up to an hour. Then turn on "Enforce HTTPS" in the Pages settings.

## Optional: verify the domain

To stop anyone else from claiming the domain on GitHub, verify `warfarisk.com` under your account settings, Pages, "Add a domain". GitHub gives a `TXT` record to add at IONOS.
