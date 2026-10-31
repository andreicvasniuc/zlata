<#
.SYNOPSIS
  Stops and removes the production-like stack started by ./up.ps1.
.DESCRIPTION
  The database lives in ./mongo-data-prod and is kept, so the next ./up.ps1 starts with the same data.
.PARAMETER RemoveData
  Also delete ./mongo-data-prod (the next ./up.ps1 restores from the dump again).
#>
[CmdletBinding()]
param(
  [switch]$RemoveData
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

& docker compose -f docker-compose.prod.yml down --remove-orphans
if ($LASTEXITCODE -ne 0) { throw "docker compose down failed (exit code $LASTEXITCODE)" }

if ($RemoveData) {
  $data = Join-Path $PSScriptRoot 'mongo-data-prod'
  if (Test-Path $data) {
    Remove-Item -Recurse -Force $data
    Write-Host "Removed $data"
  }
}
