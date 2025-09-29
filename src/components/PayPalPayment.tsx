import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PayPalPaymentProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  tourTitle: string;
  guestName: string;
  guestEmail: string;
}

// Componente interno para los botones de PayPal
const PayPalButtonsComponent: React.FC<{
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  tourTitle: string;
  guestName: string;
  guestEmail: string;
}> = ({ amount, currency, onPaymentSuccess, onPaymentError, tourTitle, guestName, guestEmail }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const { toast } = useToast();

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: currency.toUpperCase(),
          },
          description: `Reserva de tour: ${tourTitle}`,
          custom_id: `tour_${Date.now()}`,
        },
      ],
      application_context: {
        brand_name: 'Jon Tour Punta Cana',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: window.location.origin + '/reserva-exitosa',
        cancel_url: window.location.origin + '/reserva-cancelada',
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();
      
      // Datos del pago exitoso
      const paymentData = {
        id: order.id,
        status: order.status,
        amount: amount,
        currency: currency,
        payer: order.payer,
        create_time: order.create_time,
        update_time: order.update_time,
        purchase_units: order.purchase_units,
      };

      onPaymentSuccess(paymentData);
      
      toast({
        title: "¡Pago exitoso!",
        description: "Tu reserva ha sido confirmada y pagada con PayPal",
      });
      
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      onPaymentError(error);
      
      toast({
        title: "Error en el pago",
        description: "Hubo un problema procesando tu pago con PayPal",
        variant: "destructive",
      });
    }
  };

  const onError = (error: any) => {
    console.error('PayPal error:', error);
    onPaymentError(error);
    
    toast({
      title: "Error en el pago",
      description: "Hubo un problema con PayPal. Inténtalo de nuevo.",
      variant: "destructive",
    });
  };

  const onCancel = (data: any) => {
    console.log('PayPal payment cancelled:', data);
    toast({
      title: "Pago cancelado",
      description: "Has cancelado el pago con PayPal",
      variant: "destructive",
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando PayPal...</span>
      </div>
    );
  }

  // Si no hay Client ID, mostrar error
  if (!paypalOptions.clientId || paypalOptions.clientId === 'sandbox_client_id') {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Error de configuración</h3>
          <p className="text-sm">PayPal no está configurado correctamente</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Recargar página
        </Button>
      </div>
    );
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
      onCancel={onCancel}
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 45,
      }}
    />
  );
};

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  currency = 'USD',
  onPaymentSuccess,
  onPaymentError,
  tourTitle,
  guestName,
  guestEmail
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'deposit'>('full');

  // Configuración de PayPal
  const paypalOptions = {
    clientId: 'AQBlrrU_qy8FrHs6jAB6Ej261iUjLWAyg4eb6dYhXKFXOAI_INaftOm-syu6pOSDS3HF3fPkmRly1hev',
    currency: currency.toUpperCase(),
    intent: 'capture' as const,
    components: 'buttons' as const,
  };

  // Debug: Verificar que la variable se esté cargando
  console.log('PayPal Client ID:', import.meta.env.VITE_PAYPAL_CLIENT_ID);
  console.log('PayPal Options:', paypalOptions);

  const depositAmount = amount * 0.3;
  const finalAmount = paymentMethod === 'full' ? amount : depositAmount;

  return (
    <div className="space-y-6">
      {/* Opciones de pago */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Método de Pago PayPal</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'full' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setPaymentMethod('full')}
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
                  <p className="text-sm text-gray-600">${depositAmount.toFixed(2)} (30%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
              {paymentMethod === 'full' ? 'Pago Completo' : 'Depósito (30%)'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monto:</span>
            <span className="font-medium">${finalAmount.toFixed(2)}</span>
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
              <span className="text-lg">${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de PayPal */}
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="font-medium text-gray-900 mb-2">Pagar con PayPal</h4>
          <p className="text-sm text-gray-600 mb-4">
            Paga de forma segura con tu cuenta de PayPal
          </p>
        </div>

        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtonsComponent
            amount={finalAmount}
            currency={currency}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            tourTitle={tourTitle}
            guestName={guestName}
            guestEmail={guestEmail}
          />
        </PayPalScriptProvider>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <ul className="space-y-1 text-xs">
              <li>• PayPal es 100% seguro y confiable</li>
              <li>• No necesitas cuenta de PayPal para pagar</li>
              <li>• Acepta tarjetas de crédito y débito</li>
              <li>• Recibirás confirmación por email</li>
              {paymentMethod === 'deposit' && (
                <li>• El saldo restante se pagará antes del tour</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalPayment;
