# Google Search Console credentials

Place the downloaded Google OAuth **Desktop app** client JSON here as:

```text
google-oauth-client.local.json
```

Everything in this directory except this README is ignored by git. The MCP
launcher reads the client ID and client secret from that JSON at runtime; it
does not copy them into Codex configuration.
