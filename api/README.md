# ipwhoami API

Self-hosted IP geolocation API powered by [DB-IP Lite](https://db-ip.com/db/lite.php). No rate limits, no API keys, no third-party calls.

## Quick Start

```bash
# 1. Download the geolocation databases (free, ~70MB)
npm run download-db

# 2. Start the server
npm start
```

The API runs at `http://localhost:3001`.

## Endpoints

### `GET /lookup/:ip`

Look up geolocation for a specific IP.

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
  "location": "37.386, -122.0838",
  "timezone": "America/Los_Angeles",
  "postal": "94035",
  "accuracy_radius": 1000,
  "provider": "ipwhoami"
}
```

### `GET /lookup`

Auto-detect caller's IP and return geolocation.

### `GET /health`

Health check with database status.

```json
{
  "status": "ok",
  "db_version": "2026-04-01",
  "db_age_hours": 12,
  "totalTracked": 42,
  "totalBanned": 0
}
```

## Rate Limiting & Abuse Prevention

Built-in protection with zero external dependencies:

| Measure | Default |
|---------|---------|
| Rate limit | 100 requests/minute per IP |
| Auto-ban threshold | 300 requests/minute (3x limit) |
| Ban duration | 10 minutes |
| Response headers | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` |

Abusive clients are automatically banned after exceeding 3x the rate limit within a window.

## Database

Uses **DB-IP Lite** (CC BY 4.0, free, no signup required):

- `dbip-city-lite.mmdb` — City-level geolocation (~30MB)
- `dbip-asn-lite.mmdb` — ASN/ISP info (~10MB)

Update monthly:

```bash
npm run download-db
```

## Development

```bash
npm run dev     # Start with --watch
npm test        # Run tests
```

## Attribution

This product includes GeoLite data created by [DB-IP](https://db-ip.com).
