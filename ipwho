#!/usr/bin/env bash

set -euo pipefail

VERSION="1.0.0"
SELF_IP_URL="https://api.ipify.org"

# Colors (disabled if not a terminal)
if [ -t 1 ]; then
  BOLD="\033[1m"
  DIM="\033[2m"
  CYAN="\033[36m"
  GREEN="\033[32m"
  YELLOW="\033[33m"
  RED="\033[31m"
  RESET="\033[0m"
else
  BOLD="" DIM="" CYAN="" GREEN="" YELLOW="" RED="" RESET=""
fi

# ===========================================================================
# Helpers
# ===========================================================================

usage() {
  cat <<EOF
${BOLD}ipwho${RESET} - IP geolocation lookup from your terminal

${BOLD}USAGE${RESET}
  ipwho [options] [ip]

${BOLD}ARGUMENTS${RESET}
  ip                    IP address to look up (defaults to your public IP)

${BOLD}OPTIONS${RESET}
  -p, --provider NAME   Use a specific provider: ipinfo, ipapi, ip-api (default: ipinfo)
  -c, --compare         Compare results from all providers
  -r, --raw             Output raw JSON (no formatting)
  -h, --help            Show this help message
  -v, --version         Show version

${BOLD}EXAMPLES${RESET}
  ipwho                          Look up your own public IP
  ipwho 8.8.8.8                  Look up a specific IP
  ipwho -c                       Compare your IP across all providers
  ipwho -c 1.1.1.1              Compare a specific IP across all providers
  ipwho -p ipapi 8.8.8.8        Use a specific provider
  ipwho -r 8.8.8.8              Raw JSON output (pipe-friendly)
EOF
}

die() {
  echo -e "${RED}error:${RESET} $1" >&2
  exit 1
}

check_deps() {
  for cmd in curl jq; do
    if ! command -v "$cmd" &>/dev/null; then
      die "'$cmd' is required but not installed. Install it and try again."
    fi
  done
}

validate_ip() {
  local ip="$1"
  # Accept IPv4 and IPv6
  if [[ "$ip" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]] || [[ "$ip" =~ : ]]; then
    return 0
  fi
  die "invalid IP address: $ip"
}

get_public_ip() {
  local ip
  ip=$(curl -s --max-time 5 "$SELF_IP_URL") || die "failed to fetch your public IP. Check your internet connection."
  [ -z "$ip" ] && die "got empty response when fetching public IP."
  echo "$ip"
}

# ===========================================================================
# Provider fetchers
# ===========================================================================

fetch_ipinfo() {
  local ip="$1"
  curl -s --max-time 10 "https://ipinfo.io/$ip/json" || die "request to ipinfo.io failed."
}

fetch_ipapi() {
  local ip="$1"
  curl -s --max-time 10 "https://ipapi.co/$ip/json" || die "request to ipapi.co failed."
}

fetch_ipapi_com() {
  local ip="$1"
  curl -s --max-time 10 "http://ip-api.com/json/$ip" || die "request to ip-api.com failed."
}

# ===========================================================================
# Formatters
# ===========================================================================

format_ipinfo() {
  jq -r '
    "  IP:        \(.ip // "n/a")",
    "  City:      \(.city // "n/a")",
    "  Region:    \(.region // "n/a")",
    "  Country:   \(.country // "n/a")",
    "  Org:       \(.org // "n/a")",
    "  Location:  \(.loc // "n/a")",
    "  Timezone:  \(.timezone // "n/a")"
  '
}

format_ipapi() {
  jq -r '
    "  IP:        \(.ip // "n/a")",
    "  City:      \(.city // "n/a")",
    "  Region:    \(.region // "n/a")",
    "  Country:   \(.country_name // "n/a")",
    "  Org:       \(.org // "n/a")",
    "  Location:  \(.latitude // "n/a"), \(.longitude // "n/a")",
    "  Timezone:  \(.timezone // "n/a")"
  '
}

format_ipapi_com() {
  jq -r '
    "  IP:        \(.query // "n/a")",
    "  City:      \(.city // "n/a")",
    "  Region:    \(.regionName // "n/a")",
    "  Country:   \(.country // "n/a")",
    "  ISP:       \(.isp // "n/a")",
    "  Location:  \(.lat // "n/a"), \(.lon // "n/a")",
    "  Timezone:  \(.timezone // "n/a")"
  '
}

# ===========================================================================
# Commands
# ===========================================================================

cmd_lookup() {
  local ip="$1" provider="$2" raw="$3"
  local json

  case "$provider" in
    ipinfo)  json=$(fetch_ipinfo "$ip") ;;
    ipapi)   json=$(fetch_ipapi "$ip") ;;
    ip-api)  json=$(fetch_ipapi_com "$ip") ;;
    *)       die "unknown provider: $provider. Use ipinfo, ipapi, or ip-api." ;;
  esac

  if [ "$raw" = "true" ]; then
    echo "$json" | jq .
    return
  fi

  echo -e "${CYAN}${BOLD}[$provider]${RESET}"
  case "$provider" in
    ipinfo) echo "$json" | format_ipinfo ;;
    ipapi)  echo "$json" | format_ipapi ;;
    ip-api) echo "$json" | format_ipapi_com ;;
  esac
}

cmd_compare() {
  local ip="$1" raw="$2"

  echo -e "${BOLD}Comparing geolocation for:${RESET} ${GREEN}$ip${RESET}"
  echo -e "${DIM}────────────────────────────────────────${RESET}"
  echo

  local providers=("ipinfo" "ipapi" "ip-api")
  for p in "${providers[@]}"; do
    cmd_lookup "$ip" "$p" "$raw"
    echo
  done

  echo -e "${DIM}Done.${RESET}"
}

# ===========================================================================
# Argument parsing
# ===========================================================================

main() {
  check_deps

  local ip="" provider="ipinfo" compare=false raw=false

  while [[ $# -gt 0 ]]; do
    case "$1" in
      -h|--help)     usage; exit 0 ;;
      -v|--version)  echo "ipwho $VERSION"; exit 0 ;;
      -p|--provider) provider="${2:-}"; [ -z "$provider" ] && die "--provider requires a value."; shift 2 ;;
      -c|--compare)  compare=true; shift ;;
      -r|--raw)      raw=true; shift ;;
      -*)            die "unknown option: $1. Use --help for usage." ;;
      *)             ip="$1"; shift ;;
    esac
  done

  # Resolve IP
  if [ -z "$ip" ]; then
    echo -e "${DIM}Fetching your public IP...${RESET}"
    ip=$(get_public_ip)
    echo -e "${BOLD}Your IP:${RESET} ${GREEN}$ip${RESET}"
    echo
  else
    validate_ip "$ip"
  fi

  # Run
  if [ "$compare" = true ]; then
    cmd_compare "$ip" "$raw"
  else
    cmd_lookup "$ip" "$provider" "$raw"
  fi
}

main "$@"
