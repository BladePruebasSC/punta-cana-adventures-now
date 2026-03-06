# 🇩🇴 Guía Completa - Implementar Pagos con Azul (Banco Popular)

## 🎯 ¿Qué es Azul?

**Azul** es el procesador de pagos del **Banco Popular Dominicano**, el banco más grande de República Dominicana. Permite aceptar pagos con tarjetas:
- 💳 **Visa** (dominicanas e internacionales)
- 💳 **Mastercard** (dominicanas e internacionales)
- 💳 **American Express**
- 🏦 **Tarjetas de débito locales**

---

## ✅ Lo que ya está implementado

He creado todo el código necesario en tu proyecto:

- ✅ `src/components/AzulPayment.tsx` - Formulario de pago con Azul
- ✅ `backend-azul-example.js` - Servidor backend completo
- ✅ `src/components/PaymentMethodSelector.tsx` - Actualizado con opción Azul
- ✅ `src/pages/Reservar.tsx` - Integración completa del flujo
- ✅ Manejo de errores y validaciones
- ✅ UI responsive para móvil

---

## 🚀 GUÍA PASO A PASO

### PASO 1: Afiliarse como comercio en Azul (1-2 semanas)

Para usar Azul, necesitas ser un **comercio afiliado**:

#### 1.1 Contactar a Azul

**Opciones:**

A) **Llamar directamente:**
- 📞 **809-544-2985** (Santo Domingo)
- 📞 **1-809-200-0305** (Toll-free RD)
- 📞 **809-544-6565** (Soporte técnico)

B) **Email:**
- 📧 **solucionesecommerce@azul.com.do**

C) **Visitar oficina:**
- Banco Popular más cercano
- Pide hablar con el departamento de **"E-commerce"** o **"Comercio Electrónico"**

#### 1.2 Documentos necesarios

Llevar:
- 📄 **RNC** (Registro Nacional de Contribuyentes)
- 📄 **Cédula** del representante legal
- 📄 **Certificado de registro mercantil** (si aplica)
- 📄 **Descripción del negocio** (tours y excursiones)
- 💻 **URL del sitio web** (tu dominio)

#### 1.3 Proceso de aprobación

1. Azul revisa tu solicitud (3-5 días hábiles)
2. Te contactan para más información si es necesario
3. Una vez aprobado, recibes:
   - 🔑 **Store ID** (ID de tienda)
   - 🔑 **Auth1** y **Auth2** (claves de autenticación)
   - 🔐 **Certificados SSL** (.pem files)
   - 📚 **Documentación técnica**

---

### PASO 2: Configurar cuenta de desarrollador

#### 2.1 Acceder al portal de desarrolladores

Ve a: **https://dev.azul.com.do**

1. Solicita acceso al portal de desarrolladores
2. Recibirás credenciales para el ambiente de **Sandbox** (pruebas)
3. También recibirás credenciales de **Producción**

#### 2.2 Obtener credenciales de Sandbox (para pruebas)

En el portal de desarrolladores obtendrás:

```
Store ID (Sandbox):    39038540005
Auth1 (Sandbox):       testazul1
Auth2 (Sandbox):       testazul2
Endpoint (Sandbox):    https://pruebas.azul.com.do/webservices/JSON/Default.aspx
```

---

### PASO 3: Descargar certificados SSL

Azul requiere certificados SSL para la comunicación segura.

#### 3.1 Obtener certificados

Los certificados te los proporciona Azul cuando te afilias:
- `azul_cert.pem` - Certificado del comercio
- `ssl_key_cert.pem` - Llave privada

#### 3.2 Guardar certificados

En tu proyecto, crea una carpeta para los certificados:

```powershell
# Crear carpeta certs en backend
New-Item -Path backend-azul\certs -ItemType Directory -Force
```

Coloca los archivos `.pem` que te dio Azul en `backend-azul/certs/`.

⚠️ **IMPORTANTE**: 
- NO subas los certificados a GitHub
- Guárdalos de forma segura
- En producción, usa variables de entorno o servicios seguros

---

### PASO 4: Configurar el backend (5 minutos)

#### 4.1 Crear carpeta del backend

```powershell
# Crear carpeta backend-azul
New-Item -Path backend-azul -ItemType Directory -Force
Set-Location backend-azul
```

#### 4.2 Inicializar proyecto

```powershell
npm init -y
```

#### 4.3 Instalar dependencias

```powershell
npm install express cors dotenv axios
npm install --save-dev nodemon
```

Dependencias:
- `express` - Framework web
- `cors` - Para permitir peticiones del frontend
- `dotenv` - Variables de entorno
- `axios` - Cliente HTTP para llamar a Azul

#### 4.4 Copiar código del servidor

```powershell
Copy-Item ..\backend-azul-example.js -Destination server.js
```

#### 4.5 Crear archivo `.env`

```powershell
New-Item -Path .env -ItemType File -Force
```

Abre `backend-azul/.env` y agrega:

```env
# ============================================
# AZUL - CONFIGURACIÓN (SANDBOX/PRUEBAS)
# ============================================

# Store ID (proporcionado por Azul)
AZUL_STORE_ID=39038540005

# Claves de autenticación
AZUL_AUTH1=testazul1
AZUL_AUTH2=testazul2

# Rutas a certificados SSL
AZUL_CERT_PATH=./certs/azul_cert.pem
AZUL_KEY_PATH=./certs/ssl_key_cert.pem

# ============================================
# CONFIGURACIÓN GENERAL
# ============================================

PORT=3001
FRONTEND_URL=http://localhost:5173
CUSTOMER_SERVICE_PHONE=809-840-8257
NODE_ENV=development

# ============================================
# PRODUCCIÓN (cambiar cuando estés listo)
# ============================================

# Cuando pases a producción, reemplaza con:
# AZUL_STORE_ID=tu_store_id_real
# AZUL_AUTH1=tu_auth1_real
# AZUL_AUTH2=tu_auth2_real
# NODE_ENV=production
```

#### 4.6 Actualizar package.json

Abre `backend-azul/package.json` y actualiza:

```json
{
  "name": "punta-cana-adventures-azul-backend",
  "version": "1.0.0",
  "description": "Backend para procesar pagos con Azul",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

#### 4.7 Iniciar el servidor

```powershell
npm start
```

Deberías ver:
```
🚀 Servidor de pagos Azul corriendo en puerto 3001
📝 Modo: development
🏪 Store ID: 39038540005
🔐 Certificados SSL: ❌ (normal en desarrollo sin certificados)
```

---

### PASO 5: Configurar variables de entorno del frontend (1 minuto)

Si aún no lo hiciste, crea `.env` en la **raíz** del proyecto:

```powershell
Set-Location ..
New-Item -Path .env -ItemType File -Force
```

Agrega:

```env
# URL del backend de Azul
VITE_API_URL=http://localhost:3001

# Supabase (ya las deberías tener)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

---

### PASO 6: Iniciar y probar (3 minutos)

#### 6.1 Iniciar backend

**Terminal 1:**
```powershell
cd backend-azul
npm start
```

#### 6.2 Iniciar frontend

**Terminal 2:**
```powershell
# Desde la raíz del proyecto
npm run dev
```

#### 6.3 Probar el flujo

1. Abre: **http://localhost:5173**
2. Selecciona un tour
3. Haz clic en "Reservar"
4. Completa el formulario
5. Clic en "Continuar con el Pago"
6. **Selecciona "Azul" (Banco Popular)**
7. Ingresa datos de tarjeta de prueba (ver abajo)
8. Clic en "Pagar Ahora"

---

### PASO 7: Tarjetas de prueba

#### Para ambiente Sandbox de Azul:

**Tarjeta exitosa:**
```
Número:    4012001037141112  (Visa)
Titular:   TEST CARD
Fecha:     12/28
CVC:       123
```

**Otras tarjetas de prueba:**
```
Visa:              4012001037141112
Mastercard:        5425233430109903
American Express:  371449635398431
```

**Tarjeta declinada** (para probar errores):
```
Número:    4111111111111111
```

⚠️ **Nota**: Las tarjetas de prueba específicas dependen de tu configuración con Azul. Consulta la documentación que te proporcionen.

---

## 🔧 Configuración Avanzada

### Manejo de diferentes monedas

Azul soporta:
- **USD** (Dólares)
- **DOP** (Pesos dominicanos)
- **EUR** (Euros)

En `AzulPayment.tsx`, el prop `currency` controla esto:

```typescript
<AzulPayment
  amount={100}
  currency="USD"  // Cambiar a "DOP" para pesos
  // ...
/>
```

### ITBIS (Impuesto dominicano)

El backend calcula automáticamente el **ITBIS (18%)**:

```javascript
const itbis = Math.round(amount * 0.18);
```

Si tu negocio está exento o usa otra tasa, modifica `backend-azul-example.js` línea 76.

### Pagos en cuotas

Para habilitar pagos diferidos (3, 6, 12 meses):

En `backend-azul-example.js`, modifica:

```javascript
// Cambiar de:
Payments: "1",
Plan: "0",

// A (por ejemplo, 3 cuotas):
Payments: "3",
Plan: "3",
```

Consulta con Azul qué planes están disponibles para tu comercio.

---

## 📋 Integración con Supabase

Los pagos ya se guardan automáticamente en tu base de datos. Verifica que tengas estas tablas:

### Tabla `reservations`:
- `payment_method`: 'azul'
- `payment_status`: 'paid'

### Tabla `payments`:
- `payment_intent_id`: Código de autorización de Azul
- `metadata`: Incluye `azul_authorization_code` y `azul_order_number`

---

## 🔐 Seguridad

### Certificados SSL

Los certificados son **obligatorios** en producción. Protegen la comunicación con Azul.

**Para desarrollo sin certificados:**
- El código detecta automáticamente si no existen
- Simula una respuesta exitosa
- Muestra advertencia en consola: `⚠️  Certificados SSL no encontrados`

**Para producción:**
- Coloca los certificados en `backend-azul/certs/`
- O usa variables de entorno con el contenido del certificado
- Cambia `rejectUnauthorized` a `true` en producción

### PCI Compliance

Al procesar tarjetas directamente, debes:
- ✅ Usar HTTPS en producción (obligatorio)
- ✅ No guardar números de tarjeta completos
- ✅ No guardar CVC
- ✅ Usar certificados SSL para comunicación con Azul
- ✅ Cumplir con estándares PCI DSS

**Recomendación**: Si no quieres manejar PCI DSS, usa la **Página de Pago Hospedada** de Azul (ver más abajo).

---

## 🌐 Alternativa: Página de Pago Hospedada

Si prefieres no manejar datos de tarjeta directamente, Azul ofrece una **página de pago hospedada**:

### Ventajas:
- ✅ Azul maneja toda la seguridad
- ✅ No necesitas PCI compliance
- ✅ No manejas datos sensibles
- ✅ Más fácil de implementar

### Cómo funciona:
1. Creas un request de pago
2. Rediriges al usuario a `pagos.azul.com.do`
3. Usuario completa el pago en el sitio de Azul
4. Azul redirige de vuelta a tu sitio con el resultado

### Implementación:

```javascript
// En tu backend
app.post('/api/azul/create-hosted-payment', async (req, res) => {
  const { amount, orderNumber, metadata } = req.body;
  
  // Generar URL de pago
  const paymentUrl = `https://pagos.azul.com.do/PaymentPage/` +
    `?MerchantId=${AZUL_CONFIG.store}` +
    `&MerchantName=Jon+Tour+Punta+Cana` +
    `&MerchantType=E-Commerce` +
    `&CurrencyCode=$` +
    `&OrderNumber=${orderNumber}` +
    `&Amount=${amount}` +
    `&ITBIS=${Math.round(amount * 0.18)}` +
    `&ApprovedUrl=${process.env.FRONTEND_URL}/payment-success` +
    `&DeclinedUrl=${process.env.FRONTEND_URL}/payment-declined` +
    `&CancelUrl=${process.env.FRONTEND_URL}/payment-cancel` +
    `&UseCustomField1=0`;
  
  res.json({ paymentUrl });
});
```

```typescript
// En tu frontend
const response = await fetch('/api/azul/create-hosted-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount, orderNumber, metadata })
});

const { paymentUrl } = await response.json();

// Redirigir al usuario
window.location.href = paymentUrl;
```

---

## 💰 Costos y Tarifas

### Tarifas de Azul (aproximadas):

- **Tarjetas dominicanas**: 2.5% - 3.5% + RD$10
- **Tarjetas internacionales**: 3.5% - 4.5% + RD$15
- **American Express**: 4% - 5%

### Comparación con otros procesadores:

| Procesador | Tarjetas RD | Tarjetas Int. | Setup | Mensual |
|------------|-------------|---------------|-------|---------|
| **Azul** | 2.5-3.5% | 3.5-4.5% | Gratis | ~RD$500 |
| **Stripe** | N/A | 2.9% + $0.30 | Gratis | $0 |
| **PayPal** | 3.4% + fixed | 3.4% + fixed | Gratis | $0 |

**Ventaja de Azul**: Es el procesador local más confiable en RD y acepta tarjetas dominicanas.

---

## 🧪 Testing

### Con certificados reales (Sandbox):

Si ya tienes los certificados de Sandbox:

1. Coloca los certificados en `backend-azul/certs/`
2. Usa las credenciales de Sandbox en `.env`
3. Usa las tarjetas de prueba proporcionadas por Azul

### Sin certificados (Desarrollo):

El backend detecta automáticamente si no hay certificados y simula:

```
✅ Pago simulado (certificados SSL no configurados)
Código de autorización: SIM-1234567890
```

Esto te permite desarrollar la UI sin esperar la afiliación.

---

## 📱 Pruebas en Dispositivos Móviles

Para probar en tu teléfono:

```powershell
# 1. Obtén tu IP local
ipconfig

# Busca "IPv4 Address" (ejemplo: 192.168.1.100)

# 2. Actualiza backend-azul/.env:
# FRONTEND_URL=http://192.168.1.100:5173

# 3. Reinicia el backend

# 4. En tu teléfono (misma red WiFi):
# Abre: http://192.168.1.100:5173
```

---

## 🔄 Flujo Completo de Pago

```
1. Usuario completa formulario de reserva
   ↓
2. Selecciona "Azul" como método de pago
   ↓
3. Ingresa datos de tarjeta:
   - Número de tarjeta
   - Titular
   - Fecha de expiración (MM/AA)
   - CVC
   ↓
4. Frontend valida formato de tarjeta
   ↓
5. Frontend envía datos a tu backend
   ↓
6. Backend llama a Azul con certificados SSL
   ↓
7. Azul procesa el pago
   ↓
8. Azul responde con:
   - ResponseCode: "ISO8583"
   - IsoCode: "00" (éxito) o error
   - AuthorizationCode: "123456"
   ↓
9. Backend devuelve resultado al frontend
   ↓
10. Si exitoso:
    - Guarda reserva en Supabase
    - Guarda pago con authorization_code
    - Muestra confirmación al usuario
    - Opcional: Envía email de confirmación
```

---

## 🛡️ Validaciones Implementadas

El componente `AzulPayment` incluye validaciones:

### Número de tarjeta:
- ✅ Formato automático (espacios cada 4 dígitos)
- ✅ Longitud: 15-16 dígitos
- ✅ Solo números

### Fecha de expiración:
- ✅ Mes: 01-12
- ✅ Año: No puede ser pasado
- ✅ Formato: MM/AA

### CVC:
- ✅ Longitud: 3-4 dígitos (Amex usa 4)
- ✅ Solo números

### Titular:
- ✅ Mínimo 3 caracteres
- ✅ No puede estar vacío

---

## 📊 Monitoreo y Logs

### En tu backend:

```javascript
// Los logs muestran:
console.log('Procesando pago con Azul:', {
  orderNumber,
  amount: amount / 100,
  metadata
});

console.log('✅ Pago exitoso: ORD-123 - AUTH456');
console.log('❌ Pago rechazado: ORD-123 - Fondos insuficientes');
```

### En Azul Portal:

1. Ve a: https://comercios.azul.com.do
2. Inicia sesión con tus credenciales
3. Ve a "Transacciones"
4. Filtra por fecha, monto, estado
5. Descarga reportes

---

## 🔄 Reembolsos y Devoluciones

Para procesar un reembolso:

```javascript
// En tu backend, agregar endpoint:
app.post('/api/azul/refund', async (req, res) => {
  const { orderNumber, amount, authorizationCode } = req.body;
  
  const azulRequest = {
    Channel: "EC",
    Store: AZUL_CONFIG.store,
    OrderNumber: orderNumber,
    Amount: amount,
    OriginalTrxTicketNumber: authorizationCode,
    TrxType: "Refund",
    // ... otros campos
  };
  
  // Llamar a Azul
  const response = await axios.post(AZUL_CONFIG.endpoint, azulRequest, {
    headers: {
      'Auth1': AZUL_CONFIG.auth1,
      'Auth2': AZUL_CONFIG.auth2
    },
    httpsAgent
  });
  
  // Manejar respuesta
  res.json(response.data);
});
```

---

## 🌍 Pasar a Producción

### 1. Completar afiliación

Asegúrate de:
- ✅ Afiliación aprobada
- ✅ Certificados de **producción** recibidos
- ✅ Store ID de producción recibido
- ✅ Credenciales Auth1 y Auth2 de producción

### 2. Actualizar configuración

```env
# backend-azul/.env (PRODUCCIÓN)
AZUL_STORE_ID=tu_store_id_real_de_produccion
AZUL_AUTH1=tu_auth1_real
AZUL_AUTH2=tu_auth2_real
AZUL_CERT_PATH=./certs/azul_cert_prod.pem
AZUL_KEY_PATH=./certs/ssl_key_cert_prod.pem
FRONTEND_URL=https://tu-dominio.com
NODE_ENV=production
```

### 3. Actualizar endpoint

En `backend-azul-example.js`, cambia:

```javascript
const AZUL_CONFIG = {
  // Sandbox (pruebas):
  // endpoint: 'https://pruebas.azul.com.do/webservices/JSON/Default.aspx',
  
  // Producción:
  endpoint: 'https://pagos.azul.com.do/webservices/JSON/Default.aspx',
  
  // ... resto de config
};
```

### 4. Configurar HTTPS

**Obligatorio** para procesar pagos reales.

Opciones:
- **Vercel/Netlify**: HTTPS automático ✅
- **Railway**: HTTPS automático ✅
- **Servidor propio**: Certificado SSL Let's Encrypt

### 5. Guardar certificados de forma segura

**Opciones:**

A) **Variables de entorno** (recomendado):
```javascript
const certContent = process.env.AZUL_CERT_CONTENT;
const keyContent = process.env.AZUL_KEY_CONTENT;

const httpsAgent = new https.Agent({
  cert: Buffer.from(certContent, 'base64'),
  key: Buffer.from(keyContent, 'base64'),
  rejectUnauthorized: true
});
```

B) **Secrets Manager** (AWS/Google Cloud):
- Guarda certificados en AWS Secrets Manager o Google Secret Manager
- Accede a ellos en runtime

C) **Archivos en servidor** (menos seguro):
- Coloca certificados fuera de la carpeta pública
- Permisos 400 (solo lectura para el dueño)

### 6. Activar cambio en el código

En `backend-azul-example.js` línea 87, cambia:

```javascript
rejectUnauthorized: true  // En producción, DEBE ser true
```

---

## ✅ CHECKLIST DE PRODUCCIÓN

### Azul:
- [ ] Afiliación aprobada
- [ ] Store ID de producción obtenido
- [ ] Auth1 y Auth2 de producción obtenidos
- [ ] Certificados SSL de producción descargados
- [ ] Endpoint cambiado a producción
- [ ] Tarjetas de prueba funcionan en Sandbox

### Backend:
- [ ] Variables de entorno de producción configuradas
- [ ] Certificados SSL colocados correctamente
- [ ] `rejectUnauthorized: true` activado
- [ ] HTTPS configurado
- [ ] CORS restringido a tu dominio real
- [ ] Logs y monitoreo activos

### Frontend:
- [ ] `VITE_API_URL` apunta a backend de producción
- [ ] Dominio con HTTPS
- [ ] Sin errores en consola
- [ ] UI testeada en móviles

### Legal:
- [ ] Términos y condiciones actualizados
- [ ] Política de privacidad menciona procesamiento de pagos
- [ ] Política de reembolsos definida
- [ ] Aviso de ITBIS visible

---

## 📞 Soporte de Azul

### Contactos:
- 📞 **Soporte técnico**: 809-544-6565
- 📧 **Email**: solucionesecommerce@azul.com.do
- 🌐 **Portal**: https://dev.azul.com.do
- 🏢 **Dirección**: Banco Popular, cualquier sucursal

### Horario:
- Lunes a Viernes: 9:00 AM - 5:00 PM
- Sábados: 9:00 AM - 1:00 PM

---

## 🆚 Azul vs Stripe vs PayPal

### ¿Cuál usar?

| Criterio | Azul 🇩🇴 | Stripe 🌎 | PayPal 🌎 |
|----------|----------|-----------|-----------|
| **Tarjetas RD** | ✅ Sí | ❌ No | ⚠️  Limitado |
| **Tarjetas Int.** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Apple/Google Pay** | ❌ No | ✅ Sí | ⚠️  Limitado |
| **Setup** | 🟡 Requiere afiliación | ✅ Inmediato | ✅ Inmediato |
| **Tarifas RD** | 2.5-3.5% | N/A | 3.4% + fee |
| **Tarifas Int.** | 3.5-4.5% | 2.9% + $0.30 | 3.4% + fee |
| **Mensualidad** | ~RD$500 | $0 | $0 |
| **Soporte local** | ✅ RD | ❌ No | ❌ No |
| **Pesos RD (DOP)** | ✅ Sí | ⚠️  Limitado | ✅ Sí |

### Recomendación:

**Usa Azul si:**
- 🇩🇴 Tu mercado principal es República Dominicana
- 💳 Necesitas aceptar tarjetas dominicanas
- 🏦 Prefieres un banco local
- 💵 Cobras en pesos dominicanos (DOP)

**Usa Stripe si:**
- 🌎 Tu mercado es internacional
- 📱 Quieres Apple Pay / Google Pay
- ⚡ Quieres setup instantáneo
- 💻 Prefieres integración moderna

**Usa ambos** para maximizar conversión:
- Azul para clientes dominicanos
- Stripe para clientes internacionales

**Ya tienes ambos implementados en tu app** ✅

---

## 🔧 Configuración Multi-procesador

Para aceptar Azul, Stripe y PayPal simultáneamente:

### 1. Ya está implementado

Tu `PaymentMethodSelector` ya muestra las 4 opciones:
1. Azul (Banco Popular) 🇩🇴
2. Stripe (Tarjeta/Wallet) 🌎
3. PayPal 💰
4. WhatsApp 💬

### 2. Ruteo inteligente

Puedes detectar la ubicación del usuario y sugerir el método:

```typescript
// En PaymentMethodSelector.tsx
useEffect(() => {
  // Detectar país del usuario
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      if (data.country_code === 'DO') {
        // Sugerir Azul para dominicanos
        setRecommended('azul');
      } else {
        // Sugerir Stripe para internacionales
        setRecommended('stripe');
      }
    });
}, []);
```

### 3. Lógica de negocio

```typescript
// Ejemplo: Tours baratos con Azul, caros con Stripe
if (totalAmount < 50 && userCountry === 'DO') {
  // Sugerir Azul (menos fees)
} else {
  // Sugerir Stripe (mejor UX)
}
```

---

## 📝 Resumen de Archivos Creados

### Frontend:
- ✅ `src/components/AzulPayment.tsx` - Formulario de pago
- ✅ `src/components/PaymentMethodSelector.tsx` - Actualizado
- ✅ `src/pages/Reservar.tsx` - Flujo integrado

### Backend:
- ✅ `backend-azul-example.js` - Servidor completo
- ✅ `backend.azul.env.example` - Template de configuración

### Documentación:
- ✅ `GUIA_AZUL_COMPLETA.md` - Este archivo
- ✅ `INICIO_RAPIDO_AZUL.md` - Comandos rápidos
- ✅ `COMPARACION_PROCESADORES.md` - Azul vs Stripe vs PayPal

---

## 🎯 Próximos Pasos

### Inmediato (mientras esperas afiliación):
1. ✅ Probar la UI con el modo simulado
2. ✅ Ajustar diseño y experiencia de usuario
3. ✅ Preparar emails de confirmación
4. ✅ Configurar base de datos

### Con credenciales de Sandbox:
1. Configurar backend con credenciales reales
2. Colocar certificados SSL
3. Probar con tarjetas de prueba de Azul
4. Verificar transacciones en portal de comercios

### Producción:
1. Obtener credenciales de producción
2. Actualizar certificados
3. Desplegar a servidor con HTTPS
4. Configurar monitoreo
5. ¡Empezar a aceptar pagos reales! 🎉

---

## 📚 Recursos

- **Portal de Azul**: https://dev.azul.com.do
- **API Documentation**: Proporcionado por Azul al afiliarte
- **Portal de comercios**: https://comercios.azul.com.do
- **Soporte técnico**: 809-544-6565

---

## 💡 Tips Finales

### Para mejorar conversión:
- Muestra logo de Azul (genera confianza en RD)
- Indica que aceptas tarjetas dominicanas
- Muestra logos de Visa/Mastercard/Amex
- Agrega badge "Procesado por Banco Popular"

### Para UX:
- Formatea el número de tarjeta automáticamente (ya implementado)
- Detecta tipo de tarjeta por los primeros dígitos
- Muestra errores claros en español
- Confirma antes de procesar

### Para seguridad:
- NUNCA guardes CVC en base de datos
- NUNCA guardes número de tarjeta completo
- Usa HTTPS en producción
- Implementa rate limiting (máx 3 intentos por minuto)
- Log todas las transacciones

---

## 🎉 ¡Listo para Azul!

Ya tienes todo el código necesario. Solo necesitas:

1. ⏱️ **Afiliarte** con Azul (1-2 semanas)
2. ⏱️ **Configurar credenciales** (5 minutos)
3. ⏱️ **Probar** en Sandbox (10 minutos)
4. ⏱️ **Producción** (1 día para deployment)

**Total técnico**: ~20 minutos de configuración
**Total proceso**: 1-2 semanas (esperando afiliación)

¡Éxito con tu implementación! 🚀🇩🇴
