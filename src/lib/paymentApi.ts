// API para manejar pagos con Stripe
// Este archivo simula las llamadas a la API que normalmente estarían en el backend

interface CreatePaymentIntentRequest {
  amount: number; // en centavos
  currency: string;
  metadata: Record<string, string>;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  error?: string;
}

// Simulación de API endpoint para crear PaymentIntent
// En producción, esto debería ser un endpoint real en tu backend
export const createPaymentIntent = async (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
  try {
    // Simular llamada a API
    console.log('Creating payment intent with data:', data);
    
    // En un entorno real, aquí harías una llamada a tu backend:
    // const response = await fetch('/api/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    
    // Por ahora, simulamos una respuesta exitosa
    // En producción, necesitarás configurar Stripe en tu backend
    const mockClientSecret = `pi_mock_${Date.now()}_secret_mock`;
    
    return {
      clientSecret: mockClientSecret
    };
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      clientSecret: '',
      error: 'Error creating payment intent'
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
