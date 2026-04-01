---
title: CLI Options
description: Complete reference for all ipwho command-line options.
---

## Synopsis

```
ipwho [options] [ip]
```

If no IP is provided, ipwho fetches your public IP automatically.

## Arguments

| Argument | Description |
|----------|-------------|
| `ip` | IPv4 or IPv6 address to look up. Optional — defaults to your public IP. |

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--provider NAME` | `-p` | Provider to use: `ipinfo`, `ipapi`, `ip-api` | `ipinfo` |
| `--compare` | `-c` | Query all providers and show results side-by-side | — |
| `--raw` | `-r` | Output raw JSON instead of formatted table | — |
| `--help` | `-h` | Show help message and exit | — |
| `--version` | `-v` | Show version and exit | — |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Error (invalid IP, network failure, unknown provider) |

## Environment

ipwho uses the built-in `fetch` API in Node.js 18+. It respects standard proxy environment variables (`HTTP_PROXY`, `HTTPS_PROXY`) if your Node.js version supports them.

## Examples

```bash
# Auto-detect your IP, default provider
ipwho

# Specific IP, specific provider
ipwho -p ip-api 1.1.1.1

# Compare all providers
ipwho -c 8.8.8.8

# Raw JSON piped to jq
ipwho -r 8.8.8.8 | jq .city

# Combine flags
ipwho -c -r 1.1.1.1
```
