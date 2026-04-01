---
title: Getting Started
description: Get up and running with ipwhoami in under a minute.
---

**ipwhoami** is a command-line tool that looks up geolocation data for any IP address. It supports multiple providers, lets you compare results side-by-side, and outputs clean JSON for scripting. It also includes a [self-hosted API](/reference/self-hosted-api/) powered by offline databases — no rate limits, no API keys.

## Quick Install

The fastest way to get started is via npm:

```bash
npm install -g ipwhoami
```

Or run it directly without installing:

```bash
npx ipwhoami 8.8.8.8
```

For other install methods (Bash script, PowerShell), see the [Installation](/installation/) page.

## Your First Lookup

Run `ipwhoami` with no arguments to look up your own public IP:

```bash
ipwhoami
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

Or pass a specific IP:

```bash
ipwhoami 8.8.8.8
```

## Compare Providers

Use `-c` to see how different providers report the same IP:

```bash
ipwhoami -c 1.1.1.1
```

This queries all three providers and shows results side-by-side — useful for verifying accuracy.

## Self-Hosted API

Tired of rate limits? ipwhoami includes a self-hosted geolocation API that runs on your own machine using offline databases:

```bash
cd api && npm install && npm run download-db && npm start
# curl localhost:3001/lookup/8.8.8.8
```

See the [Self-Hosted API](/reference/self-hosted-api/) guide for full details.

## What's Next?

- [Installation](/installation/) — All install methods
- [Basic Usage](/usage/basic/) — Flags, providers, and examples
- [CLI Options](/reference/cli-options/) — Complete reference
- [Self-Hosted API](/reference/self-hosted-api/) — Run your own geolocation API
