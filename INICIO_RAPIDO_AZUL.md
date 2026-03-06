# ⚡ INICIO RÁPIDO - Azul Payment Gateway

## 🎯 Implementar Azul en 3 Pasos

---

## PASO 1: Afiliarte a Azul (Hazlo primero)

### Contacta a Azul:

```
☎️  LLAMA AHORA:
    809-544-2985 (Santo Domingo)
    809-544-6565 (Soporte técnico)

📧 O ENVÍA EMAIL:
    solucionesecommerce@azul.com.do

💬 DI:
    "Hola, quiero afiliarme como comercio electrónico 
     para aceptar pagos con tarjeta en mi sitio web de tours"
```

### Documentos que necesitas:

- 📄 RNC (Registro Nacional de Contribuyentes)
- 📄 Cédula del representante
- 📄 Descripción del negocio
- 💻 URL del sitio web

### Recibirás (en 3-5 días hábiles):

- 🆔 **Store ID** (ejemplo: 39038540005)
- 🔑 **Auth1** y **Auth2** (claves de autenticación)
- 🔐 **Certificados SSL** (.pem files)
- 📚 **Documentación técnica**

---

## PASO 2: Configurar Backend (Mientras esperas afiliación)

Puedes empezar a desarrollar con **modo simulado** (sin certificados):

### 2.1 Crear backend

```powershell
# Crear carpeta
New-Item -Path backend-azul -ItemType Directory -Force
Set-Location backend-azul

# Inicializar
npm init -y

# Instalar dependencias
npm install express cors dotenv axios
npm install --save-dev nodemon
```

### 2.2 Copiar servidor

```powershell
Copy-Item ..\backend-azul-example.js -Destination server.js
```

### 2.3 Crear .env

```powershell
New-Item -Path .env -ItemType File -Force
```

Contenido de `backend-azul/.env`:

```env
# SANDBOX (Pruebas - mientras esperas afiliación)
AZUL_STORE_ID=39038540005
AZUL_AUTH1=testazul1
AZUL_AUTH2=testazul2

# Certificados (dejar vacío por ahora)
AZUL_CERT_PATH=./certs/azul_cert.pem
AZUL_KEY_PATH=./certs/ssl_key_cert.pem

# General
PORT=3001
FRONTEND_URL=http://localhost:5173
CUSTOMER_SERVICE_PHONE=809-840-8257
NODE_ENV=development
```

### 2.4 Actualizar package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2.5 Iniciar servidor

```powershell
npm start
```

Verás:
```
🚀 Servidor de pagos Azul corriendo en puerto 3001
🔐 Certificados SSL: ❌
```

Esto es normal. El servidor funciona en **modo simulado** sin certificados.

---

## PASO 3: Probar la Interfaz

### 3.1 Iniciar frontend

**Nueva terminal:**
```powershell
Set-Location ..
npm run dev
```

### 3.2 Hacer una prueba

1. Abre: **http://localhost:5173**
2. Selecciona un tour
3. Clic en "Reservar"
4. Completa el formulario
5. Clic en "Continuar con el Pago"
6. **Selecciona "Azul"** 🇩🇴
7. Ingresa datos de prueba:

```
Titular:    Juan Pérez
Número:     4012 0010 3714 1112
Mes:        12
Año:        28
CVC:        123
```

8. Clic en "Pagar Ahora"

✅ Verás: **"Pago simulado (certificados SSL no configurados)"**

Esto es correcto. Estás probando la **UI** sin hacer cargos reales.

---

## ⏳ Cuando recibas las credenciales de Azul

### 1. Actualizar .env

```env
# Reemplaza con tus credenciales reales
AZUL_STORE_ID=tu_store_id_real
AZUL_AUTH1=tu_auth1_real
AZUL_AUTH2=tu_auth2_real
```

### 2. Colocar certificados

```powershell
# Crear carpeta certs
New-Item -Path backend-azul\certs -ItemType Directory -Force

# Copiar certificados que te dio Azul:
# - azul_cert.pem
# - ssl_key_cert.pem
# A la carpeta backend-azul/certs/
```

### 3. Reiniciar servidor

```powershell
# Ctrl+C para detener
npm start
```

Ahora verás:
```
🚀 Servidor de pagos Azul corriendo en puerto 3001
🔐 Certificados SSL: ✅
```

### 4. Probar con tarjetas reales de prueba

Azul te proporcionará tarjetas específicas para el Sandbox. Úsalas para probar.

---

## 🏪 Opciones de Integración

### Opción 1: API Directa (la que implementé)

**Pros:**
- ✅ Control total
- ✅ Integración personalizada
- ✅ UX consistente con tu app

**Contras:**
- ❌ Requiere certificados SSL
- ❌ Responsabilidad PCI compliance
- ❌ Más complejo

**Usa si**: Quieres control total y una experiencia integrada.

### Opción 2: Página Hospedada

**Pros:**
- ✅ Más fácil de implementar
- ✅ Azul maneja la seguridad
- ✅ No necesitas certificados
- ✅ Menos responsabilidad PCI

**Contras:**
- ❌ Usuario sale de tu sitio
- ❌ Menos control del diseño
- ❌ Experiencia menos fluida

**Usa si**: Quieres implementación rápida y simple.

---

## 💻 Modo Simulado (Sin certificados)

Mientras no tengas certificados, el backend funciona en **modo simulado**:

```javascript
// backend-azul-example.js línea 78-86
if (process.env.NODE_ENV === 'development') {
  return res.json({
    success: true,
    authorizationCode: `SIM-${Date.now()}`,
    message: 'Pago simulado (certificados SSL no configurados)',
    orderNumber,
    amount: amount / 100
  });
}
```

Esto te permite:
- ✅ Desarrollar la UI
- ✅ Probar el flujo
- ✅ Verificar integraciones con Supabase
- ✅ Testear en diferentes dispositivos

**Sin hacer cargos reales** hasta que tengas los certificados.

---

## 🎨 Personalización

### Cambiar colores de Azul:

En `AzulPayment.tsx`:

```typescript
// Color del botón (línea 177)
className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"

// Badge de Azul en selector (PaymentMethodSelector.tsx)
className="bg-cyan-100 text-cyan-700"
```

### Agregar logo de Azul:

1. Descarga el logo oficial de Azul
2. Guárdalo en `public/azul-logo.png`
3. En `AzulPayment.tsx`, agrega:

```tsx
<img 
  src="/azul-logo.png" 
  alt="Azul" 
  className="h-8 mx-auto"
/>
```

---

## 🔍 Debugging

### Backend no inicia:

```powershell
# Verificar dependencias
cd backend-azul
npm install

# Verificar .env
Get-Content .env

# Ver errores detallados
node server.js
```

### "Cannot find module 'axios'":

```powershell
npm install axios
```

### Frontend no se conecta:

1. Verifica que el backend esté corriendo
2. Prueba: `curl http://localhost:3001/health`
3. Debería responder: `{"status":"ok","processor":"Azul"}`

### CORS Error:

En `backend-azul/server.js`, verifica:

```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Debe coincidir
  credentials: true
}));
```

---

## 📦 Dependencias del Backend

```json
{
  "dependencies": {
    "express": "^4.18.2",    // Framework web
    "cors": "^2.8.5",        // CORS
    "dotenv": "^16.3.1",     // Variables de entorno
    "axios": "^1.6.0"        // HTTP client para Azul
  }
}
```

**Nota**: NO necesitas `stripe` si solo usas Azul.

---

## 🚀 Deploy a Producción

### Backend (Railway - Recomendado):

```
1. Ve a: railway.app
2. "New Project" → GitHub repo
3. Selecciona rama con backend-azul/
4. Agrega variables de entorno:
   - AZUL_STORE_ID
   - AZUL_AUTH1
   - AZUL_AUTH2
   - AZUL_CERT_CONTENT (certificado en base64)
   - AZUL_KEY_CONTENT (llave en base64)
   - FRONTEND_URL=https://tu-dominio.com
   - NODE_ENV=production
5. Deploy automático
```

### Para convertir certificados a base64:

```powershell
# En PowerShell
$cert = Get-Content certs\azul_cert.pem -Raw
$certBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($cert))
Write-Output $certBase64
```

Copia el output y úsalo como variable de entorno.

---

## 📊 Verificar Transacciones

### En tu base de datos (Supabase):

```sql
-- Ver pagos con Azul
SELECT * FROM payments 
WHERE payment_method = 'azul' 
ORDER BY created_at DESC 
LIMIT 10;

-- Ver reservas pagadas con Azul
SELECT r.*, p.payment_intent_id 
FROM reservations r
JOIN payments p ON p.reservation_id = r.id
WHERE r.payment_method = 'azul'
ORDER BY r.created_at DESC;
```

### En portal de Azul:

1. https://comercios.azul.com.do
2. Login con tu usuario
3. "Transacciones" → Ver historial
4. Filtra, descarga reportes

---

## ✅ Checklist Rápido

### Pre-implementación:
- [ ] Llamar a Azul para afiliarse
- [ ] Enviar documentos requeridos
- [ ] Esperar aprobación

### Con credenciales Sandbox:
- [ ] Backend creado
- [ ] Dependencias instaladas
- [ ] .env configurado con credenciales Sandbox
- [ ] Certificados colocados en `/certs`
- [ ] Servidor iniciado correctamente
- [ ] Frontend se conecta sin errores
- [ ] Tarjeta de prueba funciona
- [ ] Transacción aparece en portal

### Producción:
- [ ] Credenciales de producción obtenidas
- [ ] Certificados de producción colocados
- [ ] Variables de entorno actualizadas
- [ ] Backend desplegado con HTTPS
- [ ] DNS configurado
- [ ] Pruebas exitosas con tarjetas reales
- [ ] Monitoreo activo

---

## 🆘 ¿Problemas?

### No tengo certificados aún:

✅ **No hay problema**. El servidor funciona en modo simulado. Puedes desarrollar toda la UI sin certificados.

### Azul no responde mis llamadas:

- Intenta diferentes números
- Envía email a solucionesecommerce@azul.com.do
- Visita una sucursal del Banco Popular
- Pide hablar con "E-commerce" o "Soluciones digitales"

### No soy empresa, ¿puedo afiliarme?

Sí, Azul acepta:
- Empresas (SRL, SA, etc.)
- Personas físicas con RNC
- Microempresas

Consulta con Azul los requisitos para tu caso.

---

## 💡 Consejo Pro

**Mientras esperas la afiliación de Azul:**

1. Usa **PayPal** y **WhatsApp** (ya los tienes funcionando)
2. Desarrolla toda la UI de Azul en modo simulado
3. Cuando recibas las credenciales, solo configura `.env`
4. ¡Ya estás listo para aceptar pagos! 🎉

**No pierdas tiempo esperando. Sigue generando ventas con los otros métodos.** 💰

---

## 📞 Contactos Útiles de Azul

| Departamento | Teléfono | Email |
|--------------|----------|-------|
| **Afiliación** | 809-544-2985 | solucionesecommerce@azul.com.do |
| **Soporte Técnico** | 809-544-6565 | solucionesecommerce@azul.com.do |
| **Atención General** | 809-544-5000 | - |

**Horario**: Lun-Vie 9am-5pm, Sáb 9am-1pm

---

## 🎉 ¡Próximo Paso!

```powershell
# 1. Llama a Azul AHORA
# 2. Mientras esperas, prueba la UI:

cd backend-azul
npm start

# Nueva terminal:
npm run dev

# Abre: http://localhost:5173
# Prueba la opción "Azul" en el pago
```

¡Éxito! 🚀🇩🇴
