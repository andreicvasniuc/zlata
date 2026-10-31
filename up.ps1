<#
.SYNOPSIS
  Builds and starts the production-like stack (docker-compose.prod.yml) and opens it in the browser.
.DESCRIPTION
  The first run (empty database) restores the newest *.archive.gz from the dump folder, if there is one.
  Stop it again with ./down.ps1.
.PARAMETER DumpDir
  Folder with mongodump archives (default: ..\_dumps, outside the repo).
.PARAMETER NoBrowser
  Do not open the links.
#>
[CmdletBinding()]
param(
  [string]$DumpDir,
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not $DumpDir) { $DumpDir = Join-Path $PSScriptRoot '..\_dumps' }
$compose = @('compose', '-f', 'docker-compose.prod.yml')

function Invoke-Docker {
  & docker @args
  if ($LASTEXITCODE -ne 0) { throw "docker $($args -join ' ') failed (exit code $LASTEXITCODE)" }
}

New-Item -ItemType Directory -Force (Join-Path $PSScriptRoot 'mongo-data-prod') | Out-Null

Write-Host '==> Starting MongoDB'
Invoke-Docker @compose up -d --wait mongo

$collections = (& docker @compose exec -T mongo mongosh --quiet ishop --eval 'db.getCollectionNames().length' | Out-String).Trim()
if ($collections -eq '0') {
  $dump = $null
  if (Test-Path $DumpDir) {
    $dump = Get-ChildItem $DumpDir -Filter '*.archive.gz' | Sort-Object LastWriteTime | Select-Object -Last 1
  }
  if ($dump) {
    Write-Host "==> Database is empty, restoring $($dump.Name)"
    # '$db$' / '$col$' map whatever database name the dump has (Atlas: heroku_...) to ishop
    Invoke-Docker run --rm --network zlata-prod_default -v "$($dump.DirectoryName):/dump:ro" mongo:8.0.34 `
      mongorestore --host mongo --archive="/dump/$($dump.Name)" --gzip --nsFrom '$db$.$col$' --nsTo 'ishop.$col$'
  } else {
    Write-Warning "Database is empty and no *.archive.gz was found in $DumpDir. The site will show no content."
  }
}

Write-Host '==> Building and starting the app'
Invoke-Docker @compose up -d --build --wait --wait-timeout 300

$links = [ordered]@{
  'Site'              = 'http://localhost:8080'
  'Admin'             = 'http://localhost:8080/admin'
  'Mongoku (data)'    = 'http://localhost:3101'
}
Write-Host ''
$links.GetEnumerator() | ForEach-Object { Write-Host ("{0,-16} {1}" -f $_.Key, $_.Value) }
if (-not $NoBrowser) {
  $links.Values | ForEach-Object { Start-Process $_ }
}
