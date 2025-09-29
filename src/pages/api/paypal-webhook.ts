// API Endpoint para PayPal Webhooks
// Este endpoint recibe las notificaciones de PayPal cuando se procesan los pagos

import { NextApiRequest, NextApiResponse } from 'next';
import { handlePayPalWebhook } from '@/lib/paypalWebhook';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Solo permitir POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Obtener webhook ID desde variables de entorno
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    
    if (!webhookId) {
      console.error('PAYPAL_WEBHOOK_ID not configured');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    // Procesar webhook
    const result = await handlePayPalWebhook(
      req.headers,
      req.body,
      webhookId
    );

    if (result.success) {
      console.log('Webhook processed successfully:', req.body.event_type);
      return res.status(200).json({ message: 'Webhook processed' });
    } else {
      console.error('Webhook processing failed:', result.message);
      return res.status(400).json({ error: result.message });
    }

  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Configurar para no parsear el body automáticamente
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
