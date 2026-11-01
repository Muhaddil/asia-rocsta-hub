param(
  [string]$Subdomain = "",
  [int]$Port = 3001
)

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js/npx no está instalado."
  exit 1
}

$subArg = if ($Subdomain) { "--subdomain", $Subdomain } else { @() }

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Iniciando localtunnel para Rocsta API...          ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║  API local:   http://localhost:$Port                  ║" -ForegroundColor Cyan
Write-Host "║  Tunnel URL:  https://${Subdomain}loca.lt (cuando conecte)" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Copia la URL .loca.lt y pégala en:"
Write-Host "  1. Tu archivo .env en la raíz del proyecto:"
Write-Host "     VITE_API_URL=https://lo-que-sea.loca.lt"
Write-Host "  2. Vuelve a hacer deploy del frontend a GitHub Pages"
Write-Host "     para que use la nueva URL."
Write-Host ""

npx localtunnel --port $Port @subArg
