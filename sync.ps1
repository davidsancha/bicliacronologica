# Script de Sincronização Automática
# Este script incrementa o número do commit e faz o push para o GitHub

$lastNumeric = git log --pretty=format:%s -n 50 | Where-Object { $_ -match '^\d+$' } | Select-Object -First 1

if ($lastNumeric) {
    $nextNum = [int]$lastNumeric + 1
} else {
    $nextNum = 1
}

$nextCommitMsg = $nextNum.ToString("00")

Write-Host ">>> Iniciando Sincronização (Commit: $nextCommitMsg)..." -ForegroundColor Cyan

git add .
$status = git status --porcelain
if (-not $status) {
    Write-Host ">>> Nada para sincronizar. Tudo atualizado!" -ForegroundColor Yellow
    exit
}

git commit -m $nextCommitMsg
git push

Write-Host ">>> Sincronização concluída com sucesso! (ID: $nextCommitMsg)" -ForegroundColor Green
