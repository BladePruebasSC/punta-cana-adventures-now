# ============================================================
# SCRIPT DE DESPLIEGUE AUTOMATIZADO A HOSTINGER (PowerShell)
# Jon Tours Punta Cana
# ============================================================

# Colores para mensajes
function Write-Header { Write-Host "`n========================================" -ForegroundColor Blue }
function Write-Step { param($msg) Write-Host "➜ $msg" -ForegroundColor Yellow }
function Write-Success { param($msg) Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "✗ Error: $msg" -ForegroundColor Red }

# ============================================================
# CONFIGURACIÓN (CAMBIA ESTOS VALORES)
# ============================================================
$SSH_USER = "u123456789"                          # Tu usuario SSH de Hostinger
$SSH_HOST = "ssh.hostinger.com"                   # Hostname de Hostinger
$SSH_PORT = "65002"                               # Puerto SSH de Hostinger
$REMOTE_PATH = "/home/u123456789/public_html"     # Ruta en el servidor

# ============================================================
# INICIO DEL SCRIPT
# ============================================================

Write-Header
Write-Host "  🚀 DESPLIEGUE A HOSTINGER" -ForegroundColor Blue
Write-Host "  Jon Tours Punta Cana" -ForegroundColor Blue
Write-Header
Write-Host ""

# 1. Verificar que estamos en el directorio correcto
Write-Step "Verificando directorio..."
if (-Not (Test-Path "package.json")) {
    Write-Error "No se encontró package.json. Asegúrate de estar en la raíz del proyecto."
    exit 1
}
Write-Success "Directorio correcto"

# 2. Verificar dependencias
Write-Step "Verificando dependencias..."
if (-Not (Test-Path "node_modules")) {
    Write-Step "Instalando dependencias..."
    npm install
}
Write-Success "Dependencias verificadas"

# 3. Limpiar build anterior
Write-Step "Limpiando build anterior..."
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
}
Write-Success "Build anterior eliminado"

# 4. Construir proyecto
Write-Step "Construyendo proyecto para producción..."
npm run build

if (-Not (Test-Path "dist")) {
    Write-Error "La construcción falló. No se generó la carpeta dist/"
    exit 1
}
Write-Success "Proyecto construido exitosamente"

# 5. Información sobre la subida
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📤 INSTRUCCIONES PARA SUBIR ARCHIVOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "La carpeta 'dist' ha sido creada con éxito." -ForegroundColor Green
Write-Host ""
Write-Host "OPCIÓN 1 - Usando FileZilla (RECOMENDADO):" -ForegroundColor Yellow
Write-Host "  1. Abre FileZilla"
Write-Host "  2. Conéctate con estas credenciales:"
Write-Host "     • Servidor: $SSH_HOST"
Write-Host "     • Puerto: $SSH_PORT"
Write-Host "     • Usuario: $SSH_USER"
Write-Host "     • Protocolo: SFTP"
Write-Host "  3. Navega a la carpeta: dist\"
Write-Host "  4. Selecciona TODO el contenido de dist\"
Write-Host "  5. Arrástralo a: $REMOTE_PATH"
Write-Host ""
Write-Host "OPCIÓN 2 - Usando Git Bash con rsync:" -ForegroundColor Yellow
Write-Host "  Abre Git Bash y ejecuta:"
Write-Host "  cd `"C:\Users\Blade Omar Santana\Documents\GitHub\punta-cana-adventures-now`""
Write-Host "  ./deploy.sh"
Write-Host ""
Write-Host "OPCIÓN 3 - Usando SCP (requiere OpenSSH en Windows):" -ForegroundColor Yellow
Write-Host "  scp -P $SSH_PORT -r dist/* ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 6. Crear archivo .htaccess local para referencia
Write-Step "Creando archivo .htaccess de referencia..."
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ /index.html [L]
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
"@

$htaccessContent | Out-File -FilePath "dist\.htaccess" -Encoding ASCII
Write-Success "Archivo .htaccess creado en dist\.htaccess"

# 7. Mostrar resumen
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ BUILD COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estadísticas:" -ForegroundColor Blue
$fileCount = (Get-ChildItem -Path "dist" -Recurse -File).Count
$folderSize = "{0:N2} MB" -f ((Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB)
Write-Host "  • Archivos generados: $fileCount archivos"
Write-Host "  • Tamaño total: $folderSize"
Write-Host ""
Write-Host "📁 Los archivos están en:" -ForegroundColor Blue
Write-Host "  $(Resolve-Path 'dist')"
Write-Host ""
Write-Host "💡 Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Sube los archivos usando una de las opciones anteriores"
Write-Host "  2. Asegúrate de que el archivo .htaccess esté en el servidor"
Write-Host "  3. Verifica que el sitio cargue correctamente"
Write-Host "  4. Prueba las rutas (ej: /reservar/:id)"
Write-Host ""
Write-Host "🌐 Tu sitio estará disponible en:" -ForegroundColor Cyan
Write-Host "  https://tudominio.com"
Write-Host ""
