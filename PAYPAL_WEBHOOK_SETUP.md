# Configuración de Webhook de PayPal

## Descripción

Este documento explica cómo configurar y usar el webhook de PayPal para recibir notificaciones automáticas cuando se procesen los pagos.

## Archivos Creados

### 1. `src/lib/paypalWebhook.ts`
- Maneja la lógica de procesamiento de webhooks
- Actualiza el estado de pagos y reservas
- Maneja eventos: COMPLETED, DENIED, REFUNDED

### 2. `src/pages/api/paypal-webhook.ts`
- Endpoint de API para recibir webhooks
- Verifica y procesa las notificaciones
- Retorna respuestas apropiadas

## Configuración

### 1. Variables de Entorno

Agregar al archivo `.env.local`:

```env
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_WEBHOOK_ID=tu_webhook_id
```

### 2. Configurar Webhook en PayPal

1. **Ve a PayPal Developer Dashboard**
   - https://developer.paypal.com/
   - Selecciona tu aplicación

2. **Crear Webhook**
   - Click en "Webhooks"
   - Click en "Create Webhook"
   - **Webhook URL**: `https://tu-dominio.com/api/paypal-webhook`
   - **Event Types**:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`

3. **Obtener Webhook ID**
   - Después de crear, copia el Webhook ID
   - Agrégalo a tu archivo `.env.local`

## Funcionamiento

### Flujo de Webhook

1. **Cliente paga con PayPal**
2. **PayPal procesa el pago**
3. **PayPal envía webhook a tu endpoint**
4. **Sistema actualiza base de datos**
5. **Cliente recibe confirmación**

### Eventos Manejados

#### `PAYMENT.CAPTURE.COMPLETED`
- Pago exitoso
- Actualiza estado a "succeeded"
- Confirma la reserva

#### `PAYMENT.CAPTURE.DENIED`
- Pago rechazado
- Actualiza estado a "failed"
- Cancela la reserva

#### `PAYMENT.CAPTURE.REFUNDED`
- Reembolso procesado
- Actualiza estado a "refunded"
- Cancela la reserva

## Testing

### 1. Modo Sandbox
- Usa las claves de sandbox
- Los webhooks se envían a tu endpoint de desarrollo
- No se procesan pagos reales

### 2. Modo Producción
- Usa las claves de live
- Los webhooks se envían a tu endpoint de producción
- Se procesan pagos reales

### 3. Probar Webhook
1. **En PayPal Developer Dashboard**
   - Ve a tu webhook
   - Click en "Test Webhook"
   - PayPal enviará un evento de prueba

2. **Verificar logs**
   - Revisa la consola del servidor
   - Deberías ver mensajes de webhook procesado

## Seguridad

### 1. Verificación de Webhook
- El webhook debe ser verificado
- PayPal firma las notificaciones
- Solo procesar webhooks válidos

### 2. HTTPS Requerido
- Los webhooks solo funcionan con HTTPS
- No usar HTTP en producción
- Configurar certificado SSL

## Troubleshooting

### Problemas Comunes

1. **Webhook no se recibe**
   - Verificar URL del webhook
   - Verificar que el endpoint esté accesible
   - Revisar logs del servidor

2. **Webhook falla**
   - Verificar configuración de base de datos
   - Revisar logs de error
   - Verificar que el webhook ID sea correcto

3. **Pagos no se actualizan**
   - Verificar conexión a Supabase
   - Revisar permisos de base de datos
   - Verificar que el payment_intent_id coincida

## Próximos Pasos

1. **Configurar webhook en PayPal**
2. **Agregar webhook ID a variables de entorno**
3. **Probar con pagos de sandbox**
4. **Configurar para producción**

## Soporte

Para problemas con webhooks:
1. Revisar logs del servidor
2. Verificar configuración de PayPal
3. Contactar soporte técnico
