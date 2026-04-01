---
title: Basic Usage
description: Core usage patterns for ipwho.
---

## Look Up Your Public IP

Run with no arguments to auto-detect and look up your own IP:

```bash
ipwho
```

```
Fetching your public IP...
Your IP: 203.0.113.42

[ipinfo]
  IP         203.0.113.42
  City       Sydney
  Region     New South Wales
  Country    AU
  Org        AS12345 Example ISP
  Location   -33.8688,151.2093
  Timezone   Australia/Sydney
```

## Look Up a Specific IP

Pass an IPv4 or IPv6 address as an argument:

```bash
ipwho 8.8.8.8
```

```bash
ipwho 2001:4860:4860::8888
```

## Choose a Provider

By default, ipwho uses `ipinfo.io`. Switch with `-p`:

```bash
# Use ipapi.co
ipwho -p ipapi 8.8.8.8

# Use ip-api.com
ipwho -p ip-api 8.8.8.8
```

See [Providers](/reference/providers/) for details on each provider.

## Combine Flags

Flags can be combined freely:

```bash
# Raw JSON from a specific provider
ipwho -r -p ipapi 1.1.1.1

# Compare all providers with raw output
ipwho -c -r 8.8.8.8
```
