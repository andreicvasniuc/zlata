<#
.SYNOPSIS
  Deploys a branch to the Heroku app with a Heroku API key (no `heroku login`, no stored git credentials).
.DESCRIPTION
  Pushes <Branch> to the app's `main` branch at git.heroku.com, then shows the newest release.
  The API key is read from $env:HEROKU_API_KEY, or else from .mcp.json (heroku server, env.HEROKU_API_KEY).
  It is sent as an HTTP header for this one push only: it is never printed, put in a URL or saved by git.
.PARAMETER Branch
  Branch to deploy (default: develop).
.PARAMETER App
  Heroku app name (default: zlata-weddingfashion).
.PARAMETER Yes
  Do not ask for confirmation.
#>
[CmdletBinding()]
param(
  [string]$Branch = 'develop',
  [string]$App = 'zlata-weddingfashion',
  [switch]$Yes
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$key = $env:HEROKU_API_KEY
if (-not $key -and (Test-Path .mcp.json)) {
  $key = (Get-Content .mcp.json -Raw | ConvertFrom-Json).mcpServers.heroku.env.HEROKU_API_KEY
}
if (-not $key) { throw 'No Heroku API key: set $env:HEROKU_API_KEY or add it to .mcp.json.' }

& git rev-parse --verify --quiet "refs/heads/$Branch" | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Branch '$Branch' does not exist." }
$commit = (& git log -1 --format='%h %s' $Branch).Trim()
if (& git status --porcelain) { Write-Warning 'Uncommitted changes are not deployed (only commits on the branch are).' }

Write-Host "Deploy $Branch ($commit) to Heroku app '$App'"
if (-not $Yes -and (Read-Host 'Continue? [y/N]') -notmatch '^[yY]') { Write-Host 'Cancelled.'; return }

$header = 'Authorization: Basic ' + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$key"))
Write-Host '==> Pushing'
& git -c "http.extraHeader=$header" push "https://git.heroku.com/$App.git" "${Branch}:main"
if ($LASTEXITCODE -ne 0) { throw "git push failed (exit code $LASTEXITCODE)" }

Write-Host '==> Latest release'
$api = @{ Authorization = "Bearer $key"; Accept = 'application/vnd.heroku+json; version=3' }
$release = Invoke-RestMethod "https://api.heroku.com/apps/$App/releases" -Headers $api | ForEach-Object { $_ } | Sort-Object version | Select-Object -Last 1
Write-Host ("v{0}  {1}  {2}" -f $release.version, $release.status, $release.description)
$web = Invoke-RestMethod "https://api.heroku.com/apps/$App" -Headers $api
Write-Host $web.web_url
