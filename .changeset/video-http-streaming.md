---
"@nx.js/runtime": minor
---

feat: `Video` streams `http://` sources with HTTP range requests instead of downloading the whole response into memory first. The decoder thread reads sequentially from the connection and seeks by re-requesting from the new offset (small forward skips are read through), so large files start playing immediately and seeking works without buffering the whole resource. `https:` and other schemes keep the fetch-to-memory path. Servers must answer `Range` requests with `206` and a `Content-Range` header; a `200` with `Content-Length` is accepted for the initial request only.
