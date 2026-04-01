---
title: Compare Mode
description: Compare geolocation results across all providers.
---

## Overview

Different geolocation providers can return different results for the same IP. Compare mode queries **all providers** in one command so you can spot discrepancies.

## Usage

```bash
ipwho -c 8.8.8.8
```

```
Comparing geolocation for: 8.8.8.8
────────────────────────────────────────

[ipinfo]
  IP         8.8.8.8
  City       Mountain View
  Region     California
  Country    US
  Org        AS15169 Google LLC
  Location   37.4056,-122.0775
  Timezone   America/Los_Angeles

[ipapi]
  IP         8.8.8.8
  City       Mountain View
  Region     California
  Country    United States
  Org        Google LLC
  Location   37.4223, -122.085
  Timezone   America/Los_Angeles

[ip-api]
  IP         8.8.8.8
  City       Mountain View
  Region     California
  Country    United States
  ISP        Google LLC
  Location   37.4056, -122.0775
  Timezone   America/Los_Angeles
```

## Compare Your Own IP

Omit the IP argument to compare your public IP:

```bash
ipwho -c
```

## Compare with Raw JSON

Combine with `-r` for machine-readable output:

```bash
ipwho -c -r 1.1.1.1
```

This outputs each provider's result as a separate JSON block, labeled with a comment line.

## Why Results Differ

Geolocation databases are maintained independently by each provider. Differences are common for:

- **Coordinates** — Providers may point to different locations within the same city
- **Organization** — Some show the ASN, others the ISP name
- **Country format** — ISO codes (`US`) vs full names (`United States`)
- **Region granularity** — State vs province vs administrative region
