param(
    [switch]$Push,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

if(-not $SkipTests) {
    rite-Host "=============================================" -ForegroundColor Cyan
    Write-Host "🎨 SnapTuki Frontend: Starting Type Checks & Tests..." -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan

    docker build --target test -f Docker.prod -t snaptuki-staff-portal-test .

    if($LASTEXITCODE -ne 0) {
        Write-Host "❌ Type Checks & Tests failed. Aborting build." -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ Type Checks & Tests passed." -ForegroundColor Green
    }
}else{
    Write-Host "=============================================" -ForegroundColor Yellow
    Write-Host "⚠️  Skipping Type Checks & Tests as per user request." -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Yellow
}


# ---------------------------------------------------------
# PHASE 3: PRODUCTION BUILD & PUSH
# ---------------------------------------------------------

Write-Host "`n📦 Building production Nginx image..." -ForegroundColor Yellow
$Registry = "ghcr.io/snaptuki"
$ImageName = "$Registry/snaptuki-staff-portal:latest"

docker build --target runner -f Docker.prod -t $ImageName .

if($LASTEXITCODE -ne 0) {
    Write-Host "❌ Production build failed. Aborting." -ForegroundColor Red
    exit 1
}

if(-not $Push) {
    Write-Host "`n✅ Build complete! Image '$ImageName' is available locally." -ForegroundColor Green
    exit 0
}

Write-Host "`n📤 Pushing frontend to GHCR..." -ForegroundColor Yellow
docker push $ImageName

if($LASTEXITCODE -ne 0) {
   Write-Host "❌ ERROR: Failed to push frontend to GHCR!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n🎉 SUCCESS: Frontend image pushed to GHCR!" -ForegroundColor Green