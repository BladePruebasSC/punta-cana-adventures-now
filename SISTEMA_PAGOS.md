# Sistema de Pagos - Jon Tour Punta Cana

## Descripción General

Se ha implementado un sistema de pagos integrado que permite a los clientes pagar sus reservas de tours de forma segura usando **PayPal** o coordinar el pago tradicionalmente por **WhatsApp**.

**Nota**: Stripe no está disponible en República Dominicana, por lo que se utiliza PayPal como método de pago en línea principal.

## Características Implementadas

### 1. **Doble Opción de Pago**
- **Pago con PayPal**: Sin necesidad de cuenta PayPal, acepta tarjetas
- **Coordinación por WhatsApp**: Método tradicional para clientes que prefieren coordinar el pago

### 2. **Componentes Creados**

#### `PaymentMethodSelector.tsx`
- Interfaz para seleccionar entre PayPal o WhatsApp
- Muestra resumen de la reserva
- Diseño responsive con 2 opciones

#### `PayPalPayment.tsx`
- Formulario de pago con PayPal
- Opciones de pago completo o depósito (30%)
- Integración con PayPal SDK
- Manejo de errores específicos

#### `paymentApi.ts`
- API simulada para PayPal
- Configuración de PayPal
- Manejo de errores

### 3. **Base de Datos**

#### Nueva Tabla: `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id),
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_type VARCHAR(50),
  deposit_amount DECIMAL(10,2),
  remaining_amount DECIMAL(10,2),
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Campos Agregados a `reservations`
- `payment_status`: Estado del pago
- `payment_method`: Método de pago utilizado
- `total_amount`: Monto total de la reserva

### 4. **Flujo de Pago**

#### Pago con PayPal:
1. Cliente completa formulario de reserva
2. Selecciona "Pago con PayPal"
3. Se abre interfaz de PayPal
4. Cliente paga con PayPal o tarjeta
5. PayPal procesa el pago
6. Se crea reserva con estado "confirmed"
7. Se registra el pago en la base de datos

#### Pago por WhatsApp:
1. Cliente completa formulario de reserva
2. Selecciona "Coordinar por WhatsApp"
3. Se crea reserva con estado "pending"
4. Se redirige a WhatsApp con mensaje pre-llenado
5. Cliente coordina pago con el equipo

## Configuración Requerida

### 1. **Variables de Entorno**
```env
VITE_PAYPAL_CLIENT_ID=tu_clave_publica_de_paypal
```

### 2. **Claves de PayPal**
- Obtén tus claves de PayPal en: https://developer.paypal.com/
- Usa claves de sandbox para desarrollo
- Configura claves de producción para el sitio en vivo

### 3. **Migración de Base de Datos**
```bash
# Ejecutar la migración en Supabase
supabase db push
```

## Funcionalidades

### ✅ Implementado
- [x] Selector de método de pago (2 opciones)
- [x] Formulario de pago con PayPal
- [x] Integración con base de datos
- [x] Manejo de errores
- [x] Diseño responsive
- [x] Validación de formularios
- [x] Estados de pago
- [x] Registro de pagos
- [x] Opciones de depósito (30%)

### 🔄 Pendiente (Para Producción)
- [ ] Configurar backend real para PayPal
- [ ] Implementar webhooks de PayPal
- [ ] Configurar claves de producción
- [ ] Testing con tarjetas reales
- [ ] Emails de confirmación
- [ ] Dashboard de pagos

## Seguridad

### PayPal
- Cumple con estándares de seguridad internacionales
- Encriptación SSL/TLS
- Protección del comprador
- Reembolsos automáticos

### Base de Datos
- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Validación de datos

## Testing

### Cuentas de Prueba de PayPal
```
Email: sb-buyer@personal.example.com
Contraseña: password123

O usar tarjetas de prueba en PayPal
```

## Próximos Pasos

1. **Configurar PayPal en Producción**
   - Crear cuenta de PayPal Business
   - Configurar webhooks
   - Obtener claves de producción

2. **Implementar Backend**
   - Crear endpoints para PayPal
   - Manejar webhooks de PayPal
   - Implementar lógica de negocio

3. **Mejoras Adicionales**
   - Emails de confirmación
   - Dashboard de pagos
   - Reportes de ventas
   - Integración con contabilidad

## Soporte

Para soporte técnico o preguntas sobre el sistema de pagos, contacta al equipo de desarrollo.

---

**Nota**: Este sistema está configurado para desarrollo. Para producción, se requiere configuración adicional de PayPal y backend.

## ¿A qué cuenta caen los pagos?

### PayPal
- Los pagos se depositan en tu cuenta de PayPal Business
- Puedes transferir fondos a tu cuenta bancaria
- Los fondos están disponibles inmediatamente

### Configuración de Cuentas
1. **PayPal**: Dashboard → Wallet → Agregar cuenta bancaria
2. **WhatsApp**: Los pagos se coordinan manualmente con el cliente
