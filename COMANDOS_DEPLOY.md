# 🚀 COMANDOS RÁPIDOS - DESPLIEGUE A HOSTINGER

## 📦 OPCIÓN 1: USAR SCRIPT AUTOMATIZADO (PowerShell - Windows)

```powershell
# 1. Navegar al proyecto
cd "C:\Users\Blade Omar Santana\Documents\GitHub\punta-cana-adventures-now"

# 2. Ejecutar script de build
.\deploy.ps1

# 3. Sigue las instrucciones en pantalla para subir los archivos
```

---

## 🔧 OPCIÓN 2: COMANDOS MANUALES (PowerShell - Windows)

```powershell
# 1. Navegar al proyecto
cd "C:\Users\Blade Omar Santana\Documents\GitHub\punta-cana-adventures-now"

# 2. Instalar dependencias (si es necesario)
npm install

# 3. Construir para producción
npm run build

# 4. Los archivos estarán en la carpeta dist\
# Ahora sube el CONTENIDO de dist\ a Hostinger usando FileZilla
```

---

## 📤 OPCIÓN 3: USANDO GIT BASH (Si tienes Git Bash instalado)

```bash
# 1. Abrir Git Bash en la carpeta del proyecto

# 2. Dar permisos al script
chmod +x deploy.sh

# 3. Ejecutar el script completo
./deploy.sh
```

**NOTA:** Antes de ejecutar `deploy.sh`, edita estas líneas:
```bash
SSH_USER="u123456789"              # Cambia por tu usuario
SSH_HOST="ssh.hostinger.com"       # Verifica el hostname
SSH_PORT="65002"                   # Verifica el puerto
REMOTE_PATH="/home/u123456789/public_html"  # Cambia la ruta
```

---

## 📋 OPCIÓN 4: PASOS SIMPLES PARA PRINCIPIANTES

### Paso 1: Construir el proyecto
```powershell
cd "C:\Users\Blade Omar Santana\Documents\GitHub\punta-cana-adventures-now"
npm run build
```

### Paso 2: Descargar FileZilla
- Descarga desde: https://filezilla-project.org/

### Paso 3: Conectar a Hostinger con FileZilla
1. Abre FileZilla
2. Archivo > Gestor de sitios > Nuevo sitio
3. Configura:
   - **Protocolo:** SFTP
   - **Servidor:** ssh.hostinger.com (o el que te dé Hostinger)
   - **Puerto:** 65002
   - **Usuario:** Tu usuario de Hostinger
   - **Contraseña:** Tu contraseña de Hostinger
4. Haz clic en "Conectar"

### Paso 4: Subir archivos
1. En el panel izquierdo: navega a `dist\`
2. Selecciona TODO el contenido (Ctrl+A)
3. En el panel derecho: navega a `/public_html`
4. Arrastra los archivos seleccionados
5. Espera a que termine

### Paso 5: Verificar
- Abre tu navegador
- Ve a tu dominio: https://tudominio.com
- ¡Listo! 🎉

---

## 🔑 DATOS QUE NECESITAS DE HOSTINGER

Antes de empezar, obtén estos datos desde tu panel de Hostinger (hPanel):

1. **Usuario SSH:** (ej: u123456789)
2. **Contraseña:** Tu contraseña de Hostinger
3. **Hostname SSH:** (generalmente: ssh.hostinger.com)
4. **Puerto SSH:** (generalmente: 65002)
5. **Ruta del sitio:** (generalmente: /public_html)

**Para obtenerlos:**
1. Inicia sesión en Hostinger
2. Ve a hPanel
3. Busca "SSH Access" o "Acceso SSH"
4. Copia los datos

---

## ⚡ COMANDO DE EMERGENCIA (Build rápido)

Si solo necesitas construir el proyecto:

```powershell
npm run build
```

Los archivos estarán en: `dist\`

---

## 🔄 ACTUALIZAR EL SITIO (después del primer despliegue)

Cada vez que hagas cambios:

```powershell
# 1. Construir nuevamente
npm run build

# 2. Subir SOLO los archivos que cambiaron usando FileZilla
# O ejecutar el script completo:
.\deploy.ps1
```

---

## 📞 ¿PROBLEMAS?

Consulta la guía completa: `GUIA_DEPLOY_HOSTINGER.md`

O contáctame con el error específico que te aparece.
