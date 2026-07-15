param(
    [switch]$Push,
    [Switch]$SkipTests
)
# build.ps1 - Backend Builder Script for SnapTuki API

$ErrorActionPreference = "Stop"

if (-not $SkipTests) {
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "🚀 SnapTuki Backend: Starting Unit Tests..." -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan

    Write-Host "📦 Building multi-stage Docker image up to 'test' target..." -ForegroundColor Yellow
    docker build --target test -f Dockerfile.prod -t snaptuki-backend-test .

    if ($LASTEXITCODE -ne 0) {
        Write-Host "=============================================" -ForegroundColor Red
        Write-Host "❌ ERROR: Tests failed or image failed to build!" -ForegroundColor Red
        Write-Host "=============================================" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "✅ Success: All unit tests passed cleanly!" -ForegroundColor Green

    Write-Host "`n🚀 SnapTuki Backend: Starting Integration Tests..." -ForegroundColor Cyan
    docker compose -f docker-compose.test.yml down -v

    docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from integration-runner

    $integrationExitCode = $LASTEXITCODE

    Write-Host "Cleaning up test containers and volumes..." -ForegroundColor Yellow
    docker compose -f docker-compose.test.yml down -v

    if ($integrationExitCode -ne 0) {
        Write-Host "=============================================" -ForegroundColor Red
        Write-Host "❌ ERROR: Integration tests failed!" -ForegroundColor Red
        Write-Host "=============================================" -ForegroundColor Red
        exit $integrationExitCode
    }

    Write-Host "✅ Success: All integration tests passed cleanly!" -ForegroundColor Green

}
else {
    Write-Host "=============================================" -ForegroundColor Yellow
    Write-Host "⚠️  SnapTuki Backend: Skipping Tests as per user request." -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Yellow
}

# ---------------------------------------------------------
# PHASE 3: THIS MUST BE OUTSIDE THE IF/ELSE BLOCK
# ---------------------------------------------------------

Write-Host "`n📦 Building final production Docker image..." -ForegroundColor Yellow
# Update this registry name to your lowercase GitHub username
$Registry = "ghcr.io/yourlowercaseusername"
$ImageName = "$Registry/snaptuki-backend:latest"

docker build --target runner -f Dockerfile.prod -t $ImageName .

if ($LASTEXITCODE -ne 0) {
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host "❌ ERROR: Production image failed to build!" -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
    exit $LASTEXITCODE
}

if (-not $Push) {
    Write-Host "`n✅ Build complete! Image '$ImageName' is available locally." -ForegroundColor Green
    Write-Host "🛑 Skipping GHCR Push (run with -Push to push to registry)." -ForegroundColor DarkGray
    exit 0
}

Write-Host "`n📤 Pushing production image to GitHub Container Registry (GHCR)..." -ForegroundColor Yellow
docker push $ImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host "❌ ERROR: Failed to push production image to GHCR!" -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "=============================================" -ForegroundColor Green
Write-Host "🎉 SUCCESS: Image successfully pushed to GHCR!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green