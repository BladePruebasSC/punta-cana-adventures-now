// PayPal Webhook Handler
// Este archivo maneja los webhooks de PayPal para actualizar el estado de los pagos

import { supabase } from '@/integrations/supabase/client';

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  create_time: string;
  resource: {
    id: string;
    status: string;
    amount: {
      currency_code: string;
      value: string;
    };
    custom_id?: string;
    metadata?: any;
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export class PayPalWebhookHandler {
  private webhookId: string;

  constructor(webhookId: string) {
    this.webhookId = webhookId;
  }

  // Verificar que el webhook es válido
  async verifyWebhook(headers: any, body: any): Promise<boolean> {
    try {
      // En producción, deberías verificar la firma del webhook
      // Por ahora, solo verificamos que tenga los campos necesarios
      return body && body.id && body.event_type;
    } catch (error) {
      console.error('Error verifying webhook:', error);
      return false;
    }
  }

  // Procesar evento de webhook
  async processWebhook(event: PayPalWebhookEvent): Promise<void> {
    try {
      console.log('Processing PayPal webhook:', event.event_type);

      switch (event.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          await this.handlePaymentCompleted(event);
          break;
        
        case 'PAYMENT.CAPTURE.DENIED':
          await this.handlePaymentDenied(event);
          break;
        
        case 'PAYMENT.CAPTURE.REFUNDED':
          await this.handlePaymentRefunded(event);
          break;
        
        default:
          console.log('Unhandled webhook event type:', event.event_type);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  // Manejar pago completado
  private async handlePaymentCompleted(event: PayPalWebhookEvent): Promise<void> {
    try {
      const { resource } = event;
      const paymentId = resource.id;
      const amount = parseFloat(resource.amount.value);
      const currency = resource.amount.currency_code;

      console.log('Payment completed:', {
        paymentId,
        amount,
        currency,
        status: resource.status
      });

      // Buscar el pago en la base de datos
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_intent_id', paymentId)
        .single();

      if (paymentError) {
        console.error('Error finding payment:', paymentError);
        return;
      }

      if (!payment) {
        console.error('Payment not found:', paymentId);
        return;
      }

      // Actualizar estado del pago
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updateError) {
        console.error('Error updating payment:', updateError);
        return;
      }

      // Actualizar estado de la reserva
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.reservation_id);

      if (reservationError) {
        console.error('Error updating reservation:', reservationError);
        return;
      }

      console.log('Payment and reservation updated successfully');

    } catch (error) {
      console.error('Error handling payment completed:', error);
      throw error;
    }
  }

  // Manejar pago denegado
  private async handlePaymentDenied(event: PayPalWebhookEvent): Promise<void> {
    try {
      const { resource } = event;
      const paymentId = resource.id;

      console.log('Payment denied:', paymentId);

      // Buscar el pago en la base de datos
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_intent_id', paymentId)
        .single();

      if (paymentError) {
        console.error('Error finding payment:', paymentError);
        return;
      }

      if (!payment) {
        console.error('Payment not found:', paymentId);
        return;
      }

      // Actualizar estado del pago
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updateError) {
        console.error('Error updating payment:', updateError);
        return;
      }

      // Actualizar estado de la reserva
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.reservation_id);

      if (reservationError) {
        console.error('Error updating reservation:', reservationError);
        return;
      }

      console.log('Payment and reservation updated to failed status');

    } catch (error) {
      console.error('Error handling payment denied:', error);
      throw error;
    }
  }

  // Manejar reembolso
  private async handlePaymentRefunded(event: PayPalWebhookEvent): Promise<void> {
    try {
      const { resource } = event;
      const paymentId = resource.id;

      console.log('Payment refunded:', paymentId);

      // Buscar el pago en la base de datos
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_intent_id', paymentId)
        .single();

      if (paymentError) {
        console.error('Error finding payment:', paymentError);
        return;
      }

      if (!payment) {
        console.error('Payment not found:', paymentId);
        return;
      }

      // Actualizar estado del pago
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'refunded',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updateError) {
        console.error('Error updating payment:', updateError);
        return;
      }

      // Actualizar estado de la reserva
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          payment_status: 'refunded',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.reservation_id);

      if (reservationError) {
        console.error('Error updating reservation:', reservationError);
        return;
      }

      console.log('Payment and reservation updated to refunded status');

    } catch (error) {
      console.error('Error handling payment refunded:', error);
      throw error;
    }
  }
}

// Función para manejar webhooks (para usar en API routes)
export async function handlePayPalWebhook(
  headers: any,
  body: any,
  webhookId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const handler = new PayPalWebhookHandler(webhookId);
    
    // Verificar webhook
    const isValid = await handler.verifyWebhook(headers, body);
    if (!isValid) {
      return { success: false, message: 'Invalid webhook' };
    }

    // Procesar webhook
    await handler.processWebhook(body);
    
    return { success: true, message: 'Webhook processed successfully' };
    
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    return { success: false, message: 'Error processing webhook' };
  }
}
