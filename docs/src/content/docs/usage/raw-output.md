---
title: Raw JSON Output
description: Use raw JSON output for scripting and piping.
---

## Overview

The `-r` / `--raw` flag outputs clean JSON instead of the formatted table. This makes ipwho composable with other tools.

## Usage

```bash
ipwho -r 8.8.8.8
```

```json
{
  "ip": "8.8.8.8",
  "city": "Mountain View",
  "region": "California",
  "country": "US",
  "org": "AS15169 Google LLC",
  "location": "37.4056,-122.0775",
  "timezone": "America/Los_Angeles"
}
```

## Pipe to jq

Extract specific fields:

```bash
# Get just the city
ipwho -r 8.8.8.8 | jq -r .city
# Mountain View

# Get coordinates
ipwho -r 8.8.8.8 | jq -r .location
# 37.4056,-122.0775
```

## Use in Scripts

```bash
#!/bin/bash
IP="8.8.8.8"
COUNTRY=$(ipwho -r "$IP" | jq -r .country)

if [ "$COUNTRY" = "US" ]; then
  echo "US-based IP"
fi
```

## Raw Compare Mode

Combine `-r` with `-c` to get JSON from all providers:

```bash
ipwho -c -r 1.1.1.1
```

Each provider's output is a separate JSON object, prefixed with a comment line (`// ipinfo`, `// ipapi`, etc.) for easy parsing.
