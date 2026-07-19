# Switch the live GitHub profile README to a chosen version.
# Usage:  .\scripts\use-version.ps1 v1        (v1 | v2 | v3, or a name)
param([Parameter(Mandatory = $true)][string]$Version)

$map = @{
  "v1" = "README.v1-signature.md"; "signature" = "README.v1-signature.md"
  "v2" = "README.v2-editorial.md"; "editorial" = "README.v2-editorial.md"
  "v3" = "README.v3-terminal.md";  "terminal"  = "README.v3-terminal.md"
}

$key = $Version.ToLower()
if (-not $map.ContainsKey($key)) {
  Write-Host "Unknown version '$Version'. Choose: v1 (signature) | v2 (editorial) | v3 (terminal)" -ForegroundColor Red
  exit 1
}

$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root $map[$key]
$dst = Join-Path $root "README.md"

if (-not (Test-Path $src)) { Write-Host "Missing file: $src" -ForegroundColor Red; exit 1 }

Copy-Item $src $dst -Force
Write-Host "OK  README.md is now '$($map[$key])'." -ForegroundColor Green
Write-Host "    Preview:  Ctrl+Shift+V   |   Then:  git add -A; git commit -m 'switch profile README'; git push" -ForegroundColor DarkGray
