# 🚀 GUÍA COMPLETA: Subir Página a Hostinger

## 📋 REQUISITOS PREVIOS

Antes de empezar, necesitas:
- ✅ Cuenta de Hostinger activa
- ✅ Dominio configurado (ej: jontourspc.com)
- ✅ Acceso SSH habilitado en Hostinger
- ✅ Git instalado en tu computadora

---

## 🔧 PASO 1: PREPARAR EL PROYECTO

### 1.1 Construir la aplicación para producción

```bash
# En la carpeta raíz del proyecto
cd "C:\Users\Blade Omar Santana\Documents\GitHub\punta-cana-adventures-now"

# Instalar dependencias (si no lo has hecho)
npm install

# Construir para producción
npm run build
```

Esto creará una carpeta `dist` con todos los archivos optimizados.

---

## 🌐 PASO 2: CONFIGURAR HOSTINGER

### 2.1 Obtener credenciales SSH de Hostinger

1. Inicia sesión en [Hostinger](https://www.hostinger.com)
2. Ve a **Panel de Control (hPanel)**
3. Busca **"SSH Access"** o **"Acceso SSH"**
4. Activa el acceso SSH si no está activado
5. Anota estos datos:
   - **Hostname**: `ssh.hostinger.com` (o similar)
   - **Puerto**: `65002` (o el que te indiquen)
   - **Usuario**: `u123456789` (tu usuario)
   - **Contraseña**: Tu contraseña de Hostinger

### 2.2 Configurar dominio

1. En hPanel, ve a **"Domains"** o **"Dominios"**
2. Asegúrate de que tu dominio apunte a tu hosting
3. Anota la **ruta del dominio** (generalmente: `/home/usuario/public_html` o `/home/usuario/domains/tudominio.com/public_html`)

---

## 📤 PASO 3: SUBIR ARCHIVOS (Opción 1 - FTP)

### 3.1 Usando FileZilla (Recomendado)

**Descargar FileZilla:**
```bash
# Descarga desde: https://filezilla-project.org/
```

**Configurar conexión:**
1. Abre FileZilla
2. Ve a **Archivo > Gestor de sitios**
3. Haz clic en **"Nuevo sitio"**
4. Configura:
   - **Protocolo**: SFTP
   - **Servidor**: Hostname de Hostinger
   - **Puerto**: 65002
   - **Usuario**: Tu usuario SSH
   - **Contraseña**: Tu contraseña

**Subir archivos:**
1. En el panel izquierdo (local), navega a: `C:\Users\Blade Omar Santana\Documents\GitHub\punta-cana-adventures-now\dist`
2. En el panel derecho (servidor), navega a: `/public_html`
3. **Selecciona TODO el contenido de la carpeta `dist`** (no la carpeta misma)
4. Arrastra los archivos al panel derecho
5. Espera a que termine la transferencia

---

## 📤 PASO 4: SUBIR ARCHIVOS (Opción 2 - Git/SSH)

### 4.1 Conectar por SSH

```bash
# Conectarse a Hostinger
ssh u123456789@ssh.hostinger.com -p 65002
```

Ingresa tu contraseña cuando te la pida.

### 4.2 Clonar repositorio directamente en Hostinger

```bash
# Navegar a la carpeta del dominio
cd domains/tudominio.com/public_html

# Limpiar la carpeta (CUIDADO: esto borra todo)
rm -rf *

# Clonar tu repositorio
git clone https://github.com/tu-usuario/punta-cana-adventures-now.git temp

# Mover archivos a la raíz
mv temp/* ./
mv temp/.* ./ 2>/dev/null
rm -rf temp

# Instalar dependencias
npm install

# Construir para producción
npm run build

# Mover archivos de dist a la raíz
mv dist/* ./
rm -rf dist
```

---

## 🔄 PASO 5: CONFIGURAR VARIABLES DE ENTORNO

### 5.1 Crear archivo .env en el servidor

Si usas SSH:

```bash
# Conectado por SSH
nano .env
```

Luego pega tu configuración:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_key_de_supabase
```

Guarda con `Ctrl + O`, `Enter`, `Ctrl + X`

---

## ⚙️ PASO 6: CONFIGURAR REDIRECCIONAMIENTO (SPA)

Para que las rutas de React funcionen correctamente, necesitas configurar el redireccionamiento.

### 6.1 Crear/Editar archivo .htaccess

Si usas SSH:

```bash
nano .htaccess
```

Pega este contenido:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Si el archivo o directorio existe, usarlo directamente
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # De lo contrario, redirigir a index.html
  RewriteRule ^ /index.html [L]
</IfModule>

# Habilitar compresión GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Caché del navegador
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

# Seguridad adicional
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

Guarda con `Ctrl + O`, `Enter`, `Ctrl + X`

---

## 🔄 PASO 7: SCRIPT DE DESPLIEGUE AUTOMATIZADO

### 7.1 Crear script de despliegue local

Crea un archivo `deploy.sh` en tu proyecto:

```bash
#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando despliegue a Hostinger...${NC}"

# 1. Construir proyecto
echo -e "${YELLOW}📦 Construyendo proyecto...${NC}"
npm run build

# 2. Conectar y subir archivos
echo -e "${YELLOW}📤 Subiendo archivos...${NC}"

# Configuración (CAMBIA ESTOS VALORES)
SSH_USER="u123456789"
SSH_HOST="ssh.hostinger.com"
SSH_PORT="65002"
REMOTE_PATH="/home/u123456789/public_html"

# Subir archivos con rsync (más rápido que scp)
rsync -avz --delete -e "ssh -p $SSH_PORT" dist/ "$SSH_USER@$SSH_HOST:$REMOTE_PATH/"

echo -e "${GREEN}✅ Despliegue completado!${NC}"
echo -e "${GREEN}🌐 Tu sitio está en: https://tudominio.com${NC}"
```

### 7.2 Dar permisos de ejecución (Git Bash en Windows)

```bash
chmod +x deploy.sh
```

### 7.3 Ejecutar despliegue

```bash
./deploy.sh
```

---

## 📋 PASO 8: VERIFICACIÓN POST-DESPLIEGUE

### 8.1 Verificar archivos

```bash
# Conectado por SSH
ls -la /public_html
```

Debes ver:
- `index.html`
- `assets/` (carpeta con CSS y JS)
- `.htaccess`
- Otros archivos estáticos

### 8.2 Verificar permisos

```bash
# Asegurar permisos correctos
chmod 755 /public_html
chmod 644 /public_html/index.html
chmod 644 /public_html/.htaccess
```

### 8.3 Probar el sitio

1. Abre tu navegador
2. Ve a: `https://tudominio.com`
3. Verifica que:
   - La página carga correctamente
   - Las rutas funcionan (ej: `/reservar/xxx`)
   - Las imágenes se muestran
   - El cambio de idioma funciona

---

## 🔄 PASO 9: ACTUALIZACIONES FUTURAS

Cuando hagas cambios en tu código:

```bash
# Opción 1: Script automatizado
./deploy.sh

# Opción 2: Manual
npm run build
# Luego sube los archivos de dist/ por FTP

# Opción 3: SSH directo
ssh u123456789@ssh.hostinger.com -p 65002
cd public_html
git pull
npm run build
mv dist/* ./
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema: "Error 500"
**Solución:**
```bash
# Verificar permisos
chmod 755 /public_html
chmod 644 /public_html/.htaccess
```

### Problema: "Página en blanco"
**Solución:**
1. Verifica que el archivo `index.html` esté en la raíz de `public_html`
2. Abre la consola del navegador (F12) para ver errores
3. Verifica rutas de assets en el HTML

### Problema: "Rutas no funcionan (Error 404)"
**Solución:**
- Asegúrate de que el archivo `.htaccess` esté presente y configurado correctamente
- Verifica que `mod_rewrite` esté habilitado en tu hosting

### Problema: "Variables de entorno no funcionan"
**Solución:**
- Las variables de Vite deben estar en tiempo de compilación
- Construye localmente con las variables correctas:
```bash
# Windows PowerShell
$env:VITE_SUPABASE_URL="tu_url"; $env:VITE_SUPABASE_ANON_KEY="tu_key"; npm run build

# Linux/Mac
VITE_SUPABASE_URL=tu_url VITE_SUPABASE_ANON_KEY=tu_key npm run build
```

---

## ✅ CHECKLIST FINAL

- [ ] Proyecto construido (`npm run build`)
- [ ] Archivos subidos a `/public_html`
- [ ] Archivo `.htaccess` configurado
- [ ] Variables de entorno configuradas
- [ ] Permisos correctos (755 para carpetas, 644 para archivos)
- [ ] Sitio accesible en el navegador
- [ ] Rutas funcionando correctamente
- [ ] Imágenes cargando
- [ ] Cambio de idioma funciona
- [ ] Conexión con Supabase funciona

---

## 🎉 ¡LISTO!

Tu página ya debería estar en línea en Hostinger.

**URL del sitio:** https://tudominio.com

**Próximos pasos opcionales:**
1. Configurar SSL/HTTPS (generalmente automático en Hostinger)
2. Configurar CDN de Cloudflare para mejor rendimiento
3. Configurar Google Analytics
4. Configurar dominio personalizado de correo

---

¿Necesitas ayuda con algún paso específico? ¡Avísame! 🚀
