import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Configuración de Stripe - usar claves de prueba por ahora
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
  tourTitle: string;
  guestName: string;
  guestEmail: string;
}

const PaymentFormComponent: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'usd',
  onPaymentSuccess,
  onPaymentError,
  tourTitle,
  guestName,
  guestEmail
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'deposit'>('card');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Crear PaymentIntent usando la API simulada
      const { clientSecret, error: backendError } = await import('@/lib/paymentApi').then(api => 
        api.createPaymentIntent({
          amount: Math.round(amount * 100), // Stripe usa centavos
          currency,
          metadata: {
            tourTitle,
            guestName,
            guestEmail,
            paymentType: paymentMethod
          }
        })
      );

      if (backendError) {
        throw new Error(backendError);
      }

      // Confirmar el pago
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: guestName,
            email: guestEmail,
          },
        }
      });

      if (error) {
        onPaymentError(error);
        toast({
          title: "Error en el pago",
          description: error.message || "Hubo un problema procesando tu pago",
          variant: "destructive",
        });
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
        toast({
          title: "¡Pago exitoso!",
          description: "Tu reserva ha sido confirmada y pagada",
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      onPaymentError(error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Opciones de pago */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Método de Pago</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'card' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-medium">Pago Completo</h4>
                  <p className="text-sm text-gray-600">${amount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'deposit' 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setPaymentMethod('deposit')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium">Depósito</h4>
                  <p className="text-sm text-gray-600">${(amount * 0.3).toFixed(2)} (30%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formulario de tarjeta */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Información de la Tarjeta
            </label>
            <div className="p-4 border border-gray-300 rounded-lg bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Tu información está protegida con encriptación SSL</span>
          </div>
        </div>
      )}

      {/* Resumen del pago */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumen del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tour: {tourTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Método:</span>
            <span className="font-medium">
              {paymentMethod === 'card' ? 'Pago Completo' : 'Depósito (30%)'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monto:</span>
            <span className="font-medium">
              ${paymentMethod === 'card' ? amount.toFixed(2) : (amount * 0.3).toFixed(2)}
            </span>
          </div>
          {paymentMethod === 'deposit' && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Saldo pendiente:</span>
              <span>${(amount * 0.7).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold">
              <span>Total a pagar:</span>
              <span className="text-lg">
                ${paymentMethod === 'card' ? amount.toFixed(2) : (amount * 0.3).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de pago */}
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 py-3"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Procesando pago...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {paymentMethod === 'card' ? 'Pagar Ahora' : 'Pagar Depósito'}
          </>
        )}
      </Button>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <ul className="space-y-1 text-xs">
              <li>• Aceptamos tarjetas Visa, Mastercard y American Express</li>
              <li>• Los pagos se procesan de forma segura con Stripe</li>
              <li>• Recibirás un comprobante por email</li>
              {paymentMethod === 'deposit' && (
                <li>• El saldo restante se pagará antes del tour</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormComponent {...props} />
    </Elements>
  );
};

export default PaymentForm;
