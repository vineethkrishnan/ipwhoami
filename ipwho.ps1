#!/usr/bin/env pwsh

<#
.SYNOPSIS
    ipwho - IP geolocation lookup from your terminal
.DESCRIPTION
    Look up geolocation data for any IP address using multiple providers.
    Works on Windows, macOS, and Linux via PowerShell.
#>

param(
    [Parameter(Position = 0)]
    [string]$IP,

    [Alias("p")]
    [ValidateSet("ipinfo", "ipapi", "ip-api")]
    [string]$Provider = "ipinfo",

    [Alias("c")]
    [switch]$Compare,

    [Alias("r")]
    [switch]$Raw,

    [Alias("h")]
    [switch]$Help,

    [Alias("v")]
    [switch]$Version
)

$AppVersion = "1.0.0"
$SelfIpUrl = "https://api.ipify.org"

# ===========================================================================
# Helpers
# ===========================================================================

function Show-Usage {
    Write-Host @"
ipwho - IP geolocation lookup from your terminal

USAGE
  ipwho [options] [ip]

ARGUMENTS
  ip                    IP address to look up (defaults to your public IP)

OPTIONS
  -Provider NAME        Use a specific provider: ipinfo, ipapi, ip-api (default: ipinfo)
  -Compare              Compare results from all providers
  -Raw                  Output raw JSON (no formatting)
  -Help                 Show this help message
  -Version              Show version

EXAMPLES
  ipwho                          Look up your own public IP
  ipwho 8.8.8.8                  Look up a specific IP
  ipwho -Compare                 Compare your IP across all providers
  ipwho -Compare 1.1.1.1        Compare a specific IP across all providers
  ipwho -Provider ipapi 8.8.8.8 Use a specific provider
  ipwho -Raw 8.8.8.8            Raw JSON output (pipe-friendly)
"@
}

function Write-Error-And-Exit {
    param([string]$Message)
    Write-Host "error: $Message" -ForegroundColor Red
    exit 1
}

function Test-ValidIP {
    param([string]$Address)
    # Accept IPv4 and IPv6
    $ipv4 = $Address -match '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    $ipv6 = $Address -match ':'
    if (-not $ipv4 -and -not $ipv6) {
        Write-Error-And-Exit "invalid IP address: $Address"
    }
}

function Get-PublicIP {
    try {
        $response = Invoke-RestMethod -Uri $SelfIpUrl -TimeoutSec 5
        if ([string]::IsNullOrWhiteSpace($response)) {
            Write-Error-And-Exit "got empty response when fetching public IP."
        }
        return $response.Trim()
    }
    catch {
        Write-Error-And-Exit "failed to fetch your public IP. Check your internet connection."
    }
}

# ===========================================================================
# Provider fetchers
# ===========================================================================

function Invoke-Provider {
    param([string]$Url)
    try {
        return Invoke-RestMethod -Uri $Url -TimeoutSec 10
    }
    catch {
        Write-Error-And-Exit "request to $Url failed."
    }
}

# ===========================================================================
# Formatters
# ===========================================================================

function Format-Result {
    param([hashtable]$Fields)
    foreach ($key in $Fields.Keys) {
        $value = if ($Fields[$key]) { $Fields[$key] } else { "n/a" }
        Write-Host ("  {0,-10} {1}" -f "${key}:", $value)
    }
}

function Show-Result {
    param([string]$Address, [string]$ProviderName, [switch]$RawOutput)

    switch ($ProviderName) {
        "ipinfo" {
            $data = Invoke-Provider "https://ipinfo.io/$Address/json"
            if ($RawOutput) { $data | ConvertTo-Json -Depth 5; return }
            Write-Host "[$ProviderName]" -ForegroundColor Cyan
            $ordered = [ordered]@{
                IP       = $data.ip
                City     = $data.city
                Region   = $data.region
                Country  = $data.country
                Org      = $data.org
                Location = $data.loc
                Timezone = $data.timezone
            }
        }
        "ipapi" {
            $data = Invoke-Provider "https://ipapi.co/$Address/json"
            if ($RawOutput) { $data | ConvertTo-Json -Depth 5; return }
            Write-Host "[$ProviderName]" -ForegroundColor Cyan
            $ordered = [ordered]@{
                IP       = $data.ip
                City     = $data.city
                Region   = $data.region
                Country  = $data.country_name
                Org      = $data.org
                Location = "$($data.latitude), $($data.longitude)"
                Timezone = $data.timezone
            }
        }
        "ip-api" {
            $data = Invoke-Provider "http://ip-api.com/json/$Address"
            if ($RawOutput) { $data | ConvertTo-Json -Depth 5; return }
            Write-Host "[$ProviderName]" -ForegroundColor Cyan
            $ordered = [ordered]@{
                IP       = $data.query
                City     = $data.city
                Region   = $data.regionName
                Country  = $data.country
                ISP      = $data.isp
                Location = "$($data.lat), $($data.lon)"
                Timezone = $data.timezone
            }
        }
    }

    foreach ($key in $ordered.Keys) {
        $value = if ($ordered[$key]) { $ordered[$key] } else { "n/a" }
        Write-Host ("  {0,-10} {1}" -f "${key}:", $value)
    }
}

# ===========================================================================
# Main
# ===========================================================================

if ($Help) { Show-Usage; exit 0 }
if ($Version) { Write-Host "ipwho $AppVersion"; exit 0 }

# Resolve IP
if ([string]::IsNullOrWhiteSpace($IP)) {
    Write-Host "Fetching your public IP..." -ForegroundColor DarkGray
    $IP = Get-PublicIP
    Write-Host "Your IP: " -NoNewline
    Write-Host $IP -ForegroundColor Green
    Write-Host ""
}
else {
    Test-ValidIP $IP
}

# Run
if ($Compare) {
    Write-Host "Comparing geolocation for: " -NoNewline
    Write-Host $IP -ForegroundColor Green
    Write-Host ("─" * 40) -ForegroundColor DarkGray
    Write-Host ""

    foreach ($p in @("ipinfo", "ipapi", "ip-api")) {
        Show-Result -Address $IP -ProviderName $p -RawOutput:$Raw
        Write-Host ""
    }

    Write-Host "Done." -ForegroundColor DarkGray
}
else {
    Show-Result -Address $IP -ProviderName $Provider -RawOutput:$Raw
}
