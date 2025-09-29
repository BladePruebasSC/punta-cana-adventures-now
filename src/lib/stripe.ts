import { loadStripe, Stripe } from '@stripe/stripe-js';

// Configuración de Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY no está configurada en las variables de entorno');
}

// Inicializar Stripe
export const stripePromise: Promise<Stripe | null> = loadStripe(
  stripePublishableKey || 'pk_test_...'
);

// Configuración de elementos de Stripe
export const stripeElementOptions = {
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
};

// Función para crear un PaymentIntent
export const createPaymentIntent = async (data: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100), // Stripe usa centavos
        currency: data.currency || 'usd',
        metadata: data.metadata || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Función para confirmar un pago
export const confirmPayment = async (
  stripe: Stripe,
  elements: any,
  clientSecret: string,
  billingDetails: {
    name: string;
    email: string;
  }
) => {
  try {
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: billingDetails,
        },
      }
    );

    return { error, paymentIntent };
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Tipos para el sistema de pagos
export interface PaymentData {
  amount: number;
  currency?: string;
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
