# Google Search Console connector

This project uses a local, read-only MCP connector so Codex can inspect real
Google Search Console data while troubleshooting SEO.

## Security and scope

- OAuth scope: `https://www.googleapis.com/auth/webmasters.readonly`
- Exposed data: accessible properties, search performance, dimensions and
  filters, and URL inspection/indexing results
- Exposed writes: none
- OAuth client JSON: `.gsc/google-oauth-client.local.json` (gitignored)
- Default property: `sc-domain:jobstash.xyz`
- User token on macOS:
  `~/Library/Application Support/flin-google-search-console-mcp/token.json`
- Installed connector version: `flin-google-search-console-mcp==0.1.2`

The launcher reads Google's downloaded Desktop app JSON at runtime. Neither the
client secret nor the user token is stored in the repository or Codex's
`config.toml`.

## One-time Google setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create or
   select a project intended for local SEO tooling.
2. [Enable the Google Search Console API](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com)
   for that project.
3. In [Google Auth Platform](https://console.cloud.google.com/auth/overview),
   configure the consent screen. For a personal setup, choose `External`, keep
   the app in `Testing`, and add the Google account that has Search Console
   access as a test user.
4. In [Google Auth Platform clients](https://console.cloud.google.com/auth/clients),
   create an OAuth client with application type `Desktop app` and download its
   JSON.
5. Save or move the downloaded file to:

   ```text
   /Users/d/Desktop/workspace/jobstash/webapp/.gsc/google-oauth-client.local.json
   ```

Do not paste the JSON into chat or commit it. Google may expire refresh tokens
for external apps left in testing, in which case a later tool call will reopen
the consent flow.

## Connect and verify

After the OAuth client JSON is in place:

1. Restart Codex so it reloads the `google_search_console` MCP server.
2. Run the connector's `health_check` tool.
3. Run `list_sites`. The first authenticated call opens Google in the default
   browser; sign in with the account that owns or can read the JobStash Search
   Console property and approve read-only access.
4. Use the exact property string returned by `list_sites`; do not guess between
   a domain property such as `sc-domain:jobstash.xyz` and a URL-prefix property
   such as `https://jobstash.xyz/`.

Useful first investigations:

- Compare clicks, impressions, CTR, and average position over two periods.
- Find high-impression queries ranking in positions 6-20.
- Find pages losing clicks or impressions week over week.
- Segment performance by query, page, country, device, date, or search
  appearance.
- Inspect canonical selection, crawl state, robots status, fetch state, and rich
  results for specific URLs.

## Local commands

Check the registered server:

```bash
codex mcp get google_search_console
```

The MCP launcher is:

```bash
node scripts/google-search-console-mcp.mjs
```

To revoke access, remove the app from the Google Account's third-party
connections and delete the local token file shown above.
