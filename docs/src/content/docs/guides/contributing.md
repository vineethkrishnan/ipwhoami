---
title: Contributing
description: How to contribute to ipwhoami.
---

Contributions are welcome! Whether it's a bug fix, new provider, or documentation improvement.

## Setup

```bash
git clone https://github.com/vineethkrishnan/ipwhoami.git
cd ipwhoami
```

No `npm install` needed — ipwhoami has zero dependencies.

## Development

Run the CLI directly:

```bash
node bin/ipwhoami.js --help
node bin/ipwhoami.js 8.8.8.8
node bin/ipwhoami.js -c 1.1.1.1
```

Check syntax:

```bash
node --check src/**/*.js bin/**/*.js
```

## Project Structure

```
ipwhoami/
├── bin/ipwhoami.js              # CLI entry point
├── src/
│   ├── cli.js                # Argument parsing & routing
│   ├── colors.js             # Terminal colors
│   ├── config.js             # Constants
│   ├── formatter.js          # Output formatting
│   ├── ip.js                 # IP validation & detection
│   └── providers/
│       ├── base.js           # Shared fetch logic
│       ├── index.js          # Provider registry
│       ├── ipinfo.js         # ipinfo.io
│       ├── ipapi.js          # ipapi.co
│       └── ip-api.js         # ip-api.com
├── scripts/                  # Standalone Bash/PowerShell
├── docs/                     # This documentation (Starlight)
```

## Making Changes

1. Create a branch for your change
2. Make your edits
3. Test locally with `node bin/ipwhoami.js`
4. Submit a pull request

## Adding a Provider

See the [Adding a Provider](/guides/adding-a-provider/) guide for the full walkthrough.

## Documentation

The docs site is built with [Astro Starlight](https://starlight.astro.build). To work on docs:

```bash
cd docs
npm install
npm run dev
```

This starts a local dev server at `http://localhost:4321`.

## Code Style

- ESM modules (`import`/`export`)
- No dependencies — use Node.js built-ins
- Keep provider implementations simple and consistent
- Return normalized result shapes from all providers
