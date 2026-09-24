param([string]$msg = "chore: auto commit $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
Set-Location $PSScriptRoot/..
if (-not (git diff --quiet) -or -not (git diff --cached --quiet)) {} else { Write-Host "no changes"; exit 0 }
git add -A
git commit -m $msg
git push origin HEAD
Write-Host "pushed: $msg"
