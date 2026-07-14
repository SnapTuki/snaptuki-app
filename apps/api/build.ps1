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


Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🚀 SnapTuki Backend: Starting Integration Tests..." -ForegroundColor Cyan
write-Host "=============================================" -ForegroundColor Cyan

docker compose -f docker-compose.test.yml down -v

# Run the integration suite. 
# --abort-on-container-exit ensures the DB shuts down as soon as tests finish.
# --exit-code-from integration-runner passes the test result back to PowerShell.
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from integration-runner

$integrationExitCode = $LASTEXITCODE

#clean up the databae and volumes explicitly after the tests are done
Write-Host "Cleaning up test containers and volumes..." -ForegroundColor Yellow
docker compose -f docker-compose.test.yml down -v

if($integrationExitCode -ne 0) {
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host "❌ ERROR: Integration tests failed!" -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
    exit $integrationExitCode
}

Write-Host "=============================================" -ForegroundColor Green
Write-Host "✅ Success: All integration tests passed cleanly!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
