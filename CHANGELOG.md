# Changelog

## [1.1.0](https://github.com/vineethkrishnan/ipwho/compare/ipwho-v1.0.1...ipwho-v1.1.0) (2026-04-01)


### Features

* add Homebrew, Docker, and Scoop distribution channels ([14e172d](https://github.com/vineethkrishnan/ipwho/commit/14e172d6eab69f5310958ca758c4b8f73823773b))
* initial release of ipwho CLI ([c7cbb1f](https://github.com/vineethkrishnan/ipwho/commit/c7cbb1f41864e5db30b746941fd49afc7e2dec6d))


### Bug Fixes

* **ci:** use correct secret names for release workflow ([0c5c37e](https://github.com/vineethkrishnan/ipwho/commit/0c5c37e52b8ba3a2720f8e1118bbfb5405dc5707))
* **ci:** use Node 22 for docs build (Astro 6 requirement) ([a581433](https://github.com/vineethkrishnan/ipwho/commit/a581433df63cf3ddc3fdd400dad44a87769fab44))

## [1.0.0](https://github.com/vineethkrishnan/ipwho/releases/tag/v1.0.0) (2026-04-01)

### Features

* IP geolocation lookup with 3 providers (ipinfo.io, ipapi.co, ip-api.com)
* Compare mode to query all providers side-by-side
* Auto-detect public IP when no argument given
* Raw JSON output for scripting
* Node.js CLI (`npx ipwho`)
* Standalone Bash script (macOS/Linux)
* Standalone PowerShell script (Windows/macOS/Linux)
* One-liner install script
* Homebrew tap, Scoop bucket, and Docker image
