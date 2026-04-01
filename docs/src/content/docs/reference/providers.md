---
title: Providers
description: Details on each geolocation provider supported by ipwhoami.
---

ipwhoami normalizes the response from each provider into a consistent format:

```json
{
  "ip": "...",
  "city": "...",
  "region": "...",
  "country": "...",
  "org": "...",
  "location": "lat, lon",
  "timezone": "..."
}
```

## ipinfo.io

| | |
|---|---|
| **Flag value** | `ipinfo` |
| **Default** | Yes |
| **HTTPS** | Yes |
| **Free tier** | 50,000 requests/month |
| **API docs** | [ipinfo.io/developers](https://ipinfo.io/developers) |

```bash
ipwhoami -p ipinfo 8.8.8.8
```

Returns IP, city, region, country (ISO code), org (ASN + name), coordinates as `lat,lon`, and timezone.

## ipapi.co

| | |
|---|---|
| **Flag value** | `ipapi` |
| **HTTPS** | Yes |
| **Free tier** | 1,000 requests/day |
| **API docs** | [ipapi.co](https://ipapi.co) |

```bash
ipwhoami -p ipapi 8.8.8.8
```

Returns IP, city, region, country (full name), org, separate lat/lon (combined by ipwhoami), and timezone.

## ip-api.com

| | |
|---|---|
| **Flag value** | `ip-api` |
| **HTTPS** | No (HTTP only on free tier) |
| **Free tier** | 45 requests/minute |
| **API docs** | [ip-api.com/docs](http://ip-api.com/docs) |

```bash
ipwhoami -p ip-api 8.8.8.8
```

Returns query IP, city, region name, country, ISP (mapped to `org`), separate lat/lon, and timezone.

:::caution
ip-api.com's free tier uses **HTTP only** (not HTTPS). Do not send sensitive data. The paid tier supports HTTPS.
:::

## Rate Limits

All providers have rate limits on their free tiers. If you hit a limit, you'll see an error like:

```
error: request to https://ipapi.co/8.8.8.8/json failed: HTTP 429
```

Wait a moment and retry, or switch to a different provider with `-p`.
