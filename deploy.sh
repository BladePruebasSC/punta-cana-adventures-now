#!/bin/bash

# ============================================================
# SCRIPT DE DESPLIEGUE AUTOMATIZADO A HOSTINGER
# Jon Tours Punta Cana
# ============================================================

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================
# CONFIGURACIÓN (CAMBIA ESTOS VALORES)
# ============================================================
SSH_USER="u123456789"              # Tu usuario SSH de Hostinger
SSH_HOST="ssh.hostinger.com"       # Hostname de Hostinger
SSH_PORT="65002"                   # Puerto SSH de Hostinger
REMOTE_PATH="/home/u123456789/public_html"  # Ruta en el servidor

# ============================================================
# FUNCIONES
# ============================================================

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  🚀 DESPLIEGUE A HOSTINGER${NC}"
    echo -e "${BLUE}  Jon Tours Punta Cana${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}➜ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ Error: $1${NC}"
}

# ============================================================
# INICIO DEL SCRIPT
# ============================================================

print_header

# 1. Verificar que estamos en el directorio correcto
print_step "Verificando directorio..."
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en la raíz del proyecto."
    exit 1
fi
print_success "Directorio correcto"

# 2. Verificar dependencias
print_step "Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    print_step "Instalando dependencias..."
    npm install
fi
print_success "Dependencias verificadas"

# 3. Limpiar build anterior
print_step "Limpiando build anterior..."
rm -rf dist
print_success "Build anterior eliminado"

# 4. Construir proyecto
print_step "Construyendo proyecto para producción..."
npm run build

if [ ! -d "dist" ]; then
    print_error "La construcción falló. No se generó la carpeta dist/"
    exit 1
fi
print_success "Proyecto construido exitosamente"

# 5. Verificar conexión SSH
print_step "Verificando conexión con servidor..."
ssh -p $SSH_PORT -o ConnectTimeout=10 $SSH_USER@$SSH_HOST "echo 'Conexión exitosa'" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    print_error "No se pudo conectar al servidor. Verifica tus credenciales SSH."
    exit 1
fi
print_success "Conexión con servidor establecida"

# 6. Hacer backup del sitio actual
print_step "Creando backup del sitio actual..."
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cd $REMOTE_PATH && mkdir -p ../backups && tar -czf ../backups/$BACKUP_NAME.tar.gz ." 2>/dev/null
print_success "Backup creado: $BACKUP_NAME.tar.gz"

# 7. Subir archivos
print_step "Subiendo archivos al servidor..."
rsync -avz --delete \
    -e "ssh -p $SSH_PORT" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.env.local' \
    dist/ $SSH_USER@$SSH_HOST:$REMOTE_PATH/

if [ $? -ne 0 ]; then
    print_error "Falló la subida de archivos"
    exit 1
fi
print_success "Archivos subidos correctamente"

# 8. Crear/actualizar .htaccess
print_step "Configurando .htaccess..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cat > $REMOTE_PATH/.htaccess" << 'HTACCESS'
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
HTACCESS

print_success ".htaccess configurado"

# 9. Configurar permisos
print_step "Configurando permisos..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "chmod 755 $REMOTE_PATH && chmod 644 $REMOTE_PATH/.htaccess && chmod 644 $REMOTE_PATH/index.html"
print_success "Permisos configurados"

# 10. Limpiar caché (opcional)
print_step "Limpiando caché del servidor..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "find $REMOTE_PATH -name '.htaccess' -exec touch {} \;" 2>/dev/null
print_success "Caché limpiado"

# ============================================================
# FINALIZACIÓN
# ============================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ DESPLIEGUE COMPLETADO${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Estadísticas:${NC}"
echo -e "  • Archivos subidos: $(find dist -type f | wc -l) archivos"
echo -e "  • Tamaño total: $(du -sh dist | cut -f1)"
echo -e "  • Backup: ../backups/$BACKUP_NAME.tar.gz"
echo ""
echo -e "${BLUE}🌐 Tu sitio está disponible en:${NC}"
echo -e "  https://tudominio.com"
echo ""
echo -e "${YELLOW}💡 Próximos pasos:${NC}"
echo -e "  1. Verifica que el sitio cargue correctamente"
echo -e "  2. Prueba las rutas (ej: /reservar/:id)"
echo -e "  3. Verifica el cambio de idioma"
echo -e "  4. Prueba la conexión con Supabase"
echo ""
