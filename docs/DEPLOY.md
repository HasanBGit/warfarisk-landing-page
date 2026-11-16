# Deploying to warfarisk.com

The site is a static build served by a Cloudflare Worker at https://warfarisk.com. The Worker is named `warfarisk` and serves the files in `dist/`.

## How it deploys

From the project folder:

```
bun run build
bunx wrangler deploy
```

`wrangler.jsonc` holds the Worker name, the `dist/` folder, and the two custom domains (`warfarisk.com` and `www.warfarisk.com`). You need to be logged in to the Cloudflare account that owns the domain (`bunx wrangler login`). Nothing deploys on a push to GitHub.

## DNS

The domain is registered at IONOS, but its name servers point to Cloudflare:

- `dalary.ns.cloudflare.com`
- `denver.ns.cloudflare.com`

DNS records are managed in the Cloudflare dashboard, under the `warfarisk.com` zone. The `warfarisk.com` and `www` records are created by the Worker's custom domains, so do not add records with those names by hand.

**Keep the email records.** The domain uses IONOS mail. These records must stay, all set to "DNS only" (grey cloud):

| Type | Name | Value |
| --- | --- | --- |
| MX | `@` | `mx00.ionos.com` (priority 10) |
| MX | `@` | `mx01.ionos.com` (priority 10) |
| TXT | `@` | `"v=spf1 include:_spf-us.ionos.com ~all"` |
| CNAME | `_dmarc` | `dmarc.ionos.com` |
| CNAME | `s1-ionos._domainkey` | `s1.dkim.ionos.com` |
| CNAME | `s2-ionos._domainkey` | `s2.dkim.ionos.com` |
| CNAME | `autodiscover` | `adsredir.ionos.info` |
| CNAME | `_domainconnect` | `_domainconnect.ionos.com` |

Deleting them would stop email for the domain.

## Checking it

```
dig +short NS warfarisk.com
dig +short MX warfarisk.com
curl -sI https://warfarisk.com
```

HTTPS certificates are issued and renewed by Cloudflare. After a DNS change, resolvers can keep the old answer for up to an hour.
