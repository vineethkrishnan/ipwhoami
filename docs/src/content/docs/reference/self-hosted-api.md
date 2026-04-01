---
title: Self-Hosted API
description: Run your own IP geolocation API with zero rate limits.
---

ipwhoami includes a self-hosted geolocation API in the `api/` directory. It uses offline databases for sub-millisecond lookups with no rate limits, no API keys, and no third-party calls.

## Why Self-Host?

Third-party providers impose rate limits on free tiers:

| Provider | Free Limit |
|----------|-----------|
| ipinfo.io | 50k/month |
| ipapi.co | 1k/day |
| ip-api.com | 45/min |

The self-hosted API has **no such limits** — it runs entirely on your own infrastructure using a local database.

## Quick Start

```bash
cd api
npm install
npm run download-db   # Downloads free DB-IP Lite databases (~70MB)
npm start             # Starts on http://localhost:3001
```

## Endpoints

### `GET /lookup/:ip`

Look up geolocation for a specific IP address.

```bash
curl http://localhost:3001/lookup/8.8.8.8
```

```json
{
  "ip": "8.8.8.8",
  "city": "Mountain View",
  "region": "California",
  "country": "US",
  "country_name": "United States",
  "org": "AS15169 Google LLC",
  "location": "37.422, -122.085",
  "provider": "ipwhoami"
}
```

### `GET /lookup`

Auto-detect the caller's IP from request headers and return geolocation. Checks headers in order: `CF-Connecting-IP`, `X-Forwarded-For`, `X-Real-IP`, `Fly-Client-IP`, then socket address.

### `GET /health`

Returns server status and database freshness.

```json
{
  "status": "ok",
  "db_version": "2026-04-01",
  "db_age_hours": 12,
  "totalTracked": 42,
  "totalBanned": 0
}
```

### `GET /`

Returns API info and available endpoints.

## Rate Limiting & Abuse Prevention

The API includes built-in protection with zero external dependencies:

| Measure | Default |
|---------|---------|
| **Rate limit** | 100 requests/minute per IP |
| **Auto-ban threshold** | 300 requests/minute (3x limit) |
| **Ban duration** | 10 minutes |
| **Cleanup** | Stale entries purged every 30 seconds |

### Response Headers

Every response from `/lookup` includes:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `Retry-After` | Seconds to wait (only on 429) |
| `X-Database-Date` | Date of the geolocation database |

### How It Works

- **Sliding window**: Tracks request timestamps per IP within a 1-minute window
- **Soft limit**: Returns `429 Too Many Requests` with `Retry-After` header
- **Auto-ban**: If a client exceeds 3x the rate limit, they are banned for 10 minutes
- **In-memory**: No external dependencies (Redis, etc.) — runs entirely in-process

## Database

The API uses **DB-IP Lite** — a free geolocation database (CC BY 4.0 license, no signup required).

| File | Purpose | Size |
|------|---------|------|
| `dbip-city-lite.mmdb` | City-level geolocation | ~30MB |
| `dbip-asn-lite.mmdb` | ASN / ISP info | ~10MB |

### Updating

Databases are updated monthly by DB-IP. To update:

```bash
npm run download-db
```

The server auto-detects any `*city*.mmdb` and `*asn*.mmdb` file in `api/data/`, so it also works with MaxMind GeoLite2 databases if you prefer.

### ASN is Optional

The server starts with just the city database. If the ASN database is missing, the `org` field will be `null` in responses.

## Tech Stack

| Component | Choice |
|-----------|--------|
| Runtime | Node.js 18+ |
| Framework | [Hono](https://hono.dev) (ultra-lightweight) |
| MMDB Reader | [`maxmind`](https://www.npmjs.com/package/maxmind) npm package |
| Dependencies | 3 total (hono, @hono/node-server, maxmind) |

## Project Structure

```
api/
├── src/
│   ├── index.js          # Hono app with all routes
│   ├── db.js             # MMDB database loader
│   ├── ip.js             # Client IP extraction from headers
│   ├── response.js       # Normalize DB result to API shape
│   └── rate-limiter.js   # Sliding window + auto-ban
├── test/                 # 34 tests
├── scripts/
│   └── download-db.sh    # Downloads free MMDB files
├── data/                 # MMDB files (gitignored)
└── package.json
```

## Attribution

This product includes GeoLite data created by [DB-IP](https://db-ip.com).
