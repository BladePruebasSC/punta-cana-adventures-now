// API para manejar pagos con Stripe
// Este archivo simula las llamadas a la API que normalmente estarían en el backend

export interface CreatePaymentIntentRequest {
  amount: number; // en centavos
  currency: string;
  metadata: Record<string, string>;
  paymentMethodTypes?: string[]; // Métodos de pago habilitados
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  error?: string;
}

// PRODUCCIÓN: Reemplaza esta función con una llamada real a tu backend
export const createPaymentIntent = async (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
  try {
    console.log('Creating payment intent with data:', data);
    
    // 🚨 IMPORTANTE: Este es un endpoint simulado para desarrollo
    // En PRODUCCIÓN, debes implementar un backend real
    
    // ==========================================
    // OPCIÓN 1: Backend Node.js + Express
    // ==========================================
    // Descomenta esto cuando tengas tu backend corriendo:
    /*
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${API_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear PaymentIntent');
    }
    
    const result = await response.json();
    return { clientSecret: result.clientSecret };
    */
    
    // ==========================================
    // OPCIÓN 2: Supabase Edge Function
    // ==========================================
    // Descomenta esto si usas Supabase Edge Functions:
    /*
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(data)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear PaymentIntent');
    }
    
    const result = await response.json();
    return { clientSecret: result.clientSecret };
    */
    
    // ==========================================
    // MODO DESARROLLO: Simulación
    // ==========================================
    // ⚠️ ELIMINA ESTE CÓDIGO EN PRODUCCIÓN
    console.warn('⚠️ USANDO MODO SIMULADO - Configura tu backend para producción');
    
    const mockClientSecret = `pi_mock_${Date.now()}_secret_mock`;
    
    return {
      clientSecret: mockClientSecret
    };
    
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return {
      clientSecret: '',
      error: error.message || 'Error creating payment intent'
    };
  }
};

// Función para verificar el estado de un pago
export const verifyPaymentStatus = async (paymentIntentId: string): Promise<{
  status: string;
  error?: string;
}> => {
  try {
    // Simular verificación de estado
    console.log('Verifying payment status for:', paymentIntentId);
    
    // En producción, esto verificaría con Stripe
    return {
      status: 'succeeded'
    };
    
  } catch (error) {
    console.error('Error verifying payment status:', error);
    return {
      status: 'failed',
      error: 'Error verifying payment status'
    };
  }
};

// Configuración de Stripe para desarrollo
export const STRIPE_CONFIG = {
  // Claves de prueba de Stripe
  // Reemplaza con tus claves reales
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  
  // Configuración de elementos
  elementOptions: {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
    hidePostalCode: false,
  }
};

// Tipos para el sistema de pagos
export interface PaymentData {
  amount: number;
  currency: string;
  tourTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  tourDate: string;
  specialRequests?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: any;
  error?: string;
  reservationId?: string;
}

// Constantes para estados de pago
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
} as const;

export const PAYMENT_METHOD = {
  CARD: 'card',
  DEPOSIT: 'deposit',
  WHATSAPP: 'whatsapp',
} as const;

export const PAYMENT_TYPE = {
  FULL: 'full',
  DEPOSIT: 'deposit',
} as const;
