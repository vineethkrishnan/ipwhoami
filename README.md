<p align="center">
  <h1 align="center">ipwhoami</h1>
  <p align="center">
    <strong>IP geolocation lookup from your terminal</strong>
  </p>
  <p align="center">
    Query multiple providers. Compare results side-by-side. Zero dependencies.
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/ipwhoami"><img src="https://img.shields.io/npm/v/ipwhoami?color=blue&label=npm" alt="npm version"></a>
    <a href="https://github.com/vineethkrishnan/ipwhoami/actions/workflows/ci.yml"><img src="https://github.com/vineethkrishnan/ipwhoami/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
    <a href="https://github.com/vineethkrishnan/ipwhoami/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/ipwhoami?color=green" alt="License"></a>
    <a href="https://www.npmjs.com/package/ipwhoami"><img src="https://img.shields.io/npm/dm/ipwhoami?color=orange" alt="Downloads"></a>
    <a href="https://img.shields.io/node/v/ipwhoami"><img src="https://img.shields.io/node/v/ipwhoami?color=brightgreen" alt="Node version"></a>
  </p>
  <p align="center">
    <a href="https://ipwhoami-docs.vineethnk.in"><strong>Documentation</strong></a>
    &nbsp;&bull;&nbsp;
    <a href="https://github.com/vineethkrishnan/ipwhoami/issues">Report Bug</a>
    &nbsp;&bull;&nbsp;
    <a href="https://github.com/vineethkrishnan/ipwhoami/issues">Request Feature</a>
  </p>
</p>

<br/>

```bash
$ ipwhoami 8.8.8.8

[ipinfo]
  IP         8.8.8.8
  City       Mountain View
  Region     California
  Country    US
  Org        AS15169 Google LLC
  Location   37.4056,-122.0775
  Timezone   America/Los_Angeles
```

<br/>

## Quick Start

```bash
# Install globally
npm install -g ipwhoami

# Or run instantly without installing
npx ipwhoami 8.8.8.8
```

## Why ipwhoami?

- **Zero dependencies** — Uses Node.js 18+ built-in `fetch`. No bloated `node_modules`.
- **Multiple providers** — Query [ipinfo.io](https://ipinfo.io), [ipapi.co](https://ipapi.co), and [ip-api.com](http://ip-api.com) from one tool.
- **Compare mode** — See how providers differ for the same IP, side-by-side.
- **Pipe-friendly** — Raw JSON output for scripting, CI pipelines, and composing with `jq`.
- **Cross-platform** — npm, Homebrew, Scoop, Docker, standalone Bash & PowerShell scripts.
- **No API keys** — Works out of the box with free tiers.

## Install

<table>
<tr><td><strong>npm</strong></td><td>

```bash
npm install -g ipwhoami
```

</td></tr>
<tr><td><strong>Homebrew</strong></td><td>

```bash
brew tap vineethkrishnan/ipwhoami && brew install ipwhoami
```

</td></tr>
<tr><td><strong>Scoop</strong></td><td>

```powershell
scoop bucket add ipwhoami https://github.com/vineethkrishnan/scoop-ipwhoami
scoop install ipwhoami
```

</td></tr>
<tr><td><strong>Docker</strong></td><td>

```bash
docker run --rm vineethnkrishnan/ipwhoami 8.8.8.8
```

</td></tr>
<tr><td><strong>Shell</strong></td><td>

```bash
curl -fsSL https://raw.githubusercontent.com/vineethkrishnan/ipwhoami/main/install.sh | bash
```

</td></tr>
</table>

> See the [Installation Guide](https://ipwhoami-docs.vineethnk.in/installation/) for all methods including PowerShell and manual install.

## Usage

```
ipwhoami [options] [ip]
```

| Flag | Description |
|------|-------------|
| `-p, --provider NAME` | Provider: `ipinfo`, `ipapi`, `ip-api` (default: `ipinfo`) |
| `-c, --compare` | Compare results from all providers |
| `-r, --raw` | Output raw JSON |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

### Examples

```bash
ipwhoami                        # Your public IP
ipwhoami 8.8.8.8                # Specific IP
ipwhoami -c 1.1.1.1             # Compare all providers
ipwhoami -p ipapi 8.8.8.8       # Choose provider
ipwhoami -r 8.8.8.8 | jq .city  # Raw JSON, pipe to jq
```

### Compare Mode

```
$ ipwhoami -c 8.8.8.8
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

## Providers

| Provider | HTTPS | Rate Limit | Notes |
|----------|-------|------------|-------|
| [ipinfo.io](https://ipinfo.io) | Yes | 50k/month | Default |
| [ipapi.co](https://ipapi.co) | Yes | 1k/day | Full country names |
| [ip-api.com](http://ip-api.com) | No | 45/min | ISP info |

## Contributing

Contributions are welcome! ipwhoami uses a clean **provider pattern** — adding a new geolocation source is just one file + one line.

```bash
git clone https://github.com/vineethkrishnan/ipwhoami.git
cd ipwhoami
node bin/ipwhoami.js 8.8.8.8  # zero dependencies, works immediately
```

See the [Contributing Guide](https://ipwhoami-docs.vineethnk.in/guides/contributing/) and [Adding a Provider](https://ipwhoami-docs.vineethnk.in/guides/adding-a-provider/) docs.

## Documentation

Full documentation is available at **[ipwhoami-docs.vineethnk.in](https://ipwhoami-docs.vineethnk.in)**

- [Getting Started](https://ipwhoami-docs.vineethnk.in/getting-started/)
- [Installation](https://ipwhoami-docs.vineethnk.in/installation/)
- [CLI Reference](https://ipwhoami-docs.vineethnk.in/reference/cli-options/)
- [Providers](https://ipwhoami-docs.vineethnk.in/reference/providers/)
- [Adding a Provider](https://ipwhoami-docs.vineethnk.in/guides/adding-a-provider/)

## License

[MIT](LICENSE) &copy; [Vineeth Krishnan](https://github.com/vineethkrishnan)
