# build.ps1 - Backend Builder Script for SnapTuki API

# Exit the script immediately if any command fails
$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🚀 SnapTuki Backend: Starting Unit Tests..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Step 1: Build the Dockerfile until the 'test' target stage

Write-Host "📦 Building multi-stage Docker image up to 'test' target..." -ForegroundColor Yellow
docker build --target test -f Dockerfile.prod -t snaptuki-backend-test .

if ($LASTEXITCODE -ne 0) {
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host "❌ ERROR: Tests failed or image failed to build!" -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
    # Exit the script with the error code so GitHub Actions also knows it failed
    exit $LASTEXITCODE
}
Write-Host "=============================================" -ForegroundColor Green
Write-Host "✅ Success: All unit tests passed cleanly!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green