#!/usr/bin/env bash

set -euo pipefail

# Download DB-IP Lite MMDB files (free, no account needed, CC BY 4.0)
# https://db-ip.com/db/lite.php

DATA_DIR="$(cd "$(dirname "$0")/../data" && pwd)"
mkdir -p "$DATA_DIR"

YEAR=$(date +%Y)
MONTH=$(date +%m)

CITY_URL="https://download.db-ip.com/free/dbip-city-lite-${YEAR}-${MONTH}.mmdb.gz"
ASN_URL="https://download.db-ip.com/free/dbip-asn-lite-${YEAR}-${MONTH}.mmdb.gz"

echo "Downloading DB-IP Lite City database..."
curl -fsSL "$CITY_URL" | gunzip > "$DATA_DIR/dbip-city-lite.mmdb"
echo "  -> $DATA_DIR/dbip-city-lite.mmdb"

echo "Downloading DB-IP Lite ASN database..."
curl -fsSL "$ASN_URL" | gunzip > "$DATA_DIR/dbip-asn-lite.mmdb"
echo "  -> $DATA_DIR/dbip-asn-lite.mmdb"

echo "Done. Database files are ready."
