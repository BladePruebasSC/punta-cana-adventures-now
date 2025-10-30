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
  paypalOptions: any;
}> = ({ amount, currency, onPaymentSuccess, onPaymentError, tourTitle, guestName, guestEmail, paypalOptions }) => {
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
      <div className="flex items-center justify-center p-6 sm:p-8">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Cargando PayPal...</span>
      </div>
    );
  }

  // Si no hay Client ID, mostrar error
  if (!paypalOptions.clientId || paypalOptions.clientId === 'sandbox_client_id') {
    return (
      <div className="text-center p-6 sm:p-8">
        <div className="text-red-600 mb-4">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
          <h3 className="text-base sm:text-lg font-bold">Error de configuración</h3>
          <p className="text-xs sm:text-sm">PayPal no está configurado correctamente</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-sm sm:text-base h-10 sm:h-11 rounded-lg"
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
        height: 40,
        tagline: false,
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

  const depositAmount = amount * 0.3;
  const finalAmount = paymentMethod === 'full' ? amount : depositAmount;

  // Configuración de PayPal
  const paypalOptions = {
    clientId: 'AQBlrrU_qy8FrHs6jAB6Ej261iUjLWAyg4eb6dYhXKFXOAI_INaftOm-syu6pOSDS3HF3fPkmRly1hev',
    currency: currency.toUpperCase(),
    intent: 'capture' as const,
    components: 'buttons' as const,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Opciones de pago - Ultra optimizadas para móvil */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Método de Pago PayPal</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Card 
            className={`cursor-pointer transition-all rounded-xl ${
              paymentMethod === 'full' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setPaymentMethod('full')}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Pago Completo</h4>
                  <p className="text-xs sm:text-sm text-gray-600">${amount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all rounded-xl ${
              paymentMethod === 'deposit' 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setPaymentMethod('deposit')}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Depósito</h4>
                  <p className="text-xs sm:text-sm text-gray-600">${depositAmount.toFixed(2)} (30%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resumen del pago - Ultra optimizado para móvil */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <CardHeader className="pb-3 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Resumen del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
          <div className="flex justify-between items-start text-xs sm:text-sm">
            <span className="font-medium">Tour:</span>
            <span className="text-right max-w-[60%]">{tourTitle}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="font-medium">Método:</span>
            <span className="font-semibold">
              {paymentMethod === 'full' ? 'Pago Completo' : 'Depósito (30%)'}
            </span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="font-medium">Monto:</span>
            <span className="font-semibold">${finalAmount.toFixed(2)}</span>
          </div>
          {paymentMethod === 'deposit' && (
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Saldo pendiente:</span>
              <span>${(amount * 0.7).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between font-bold text-sm sm:text-base">
              <span>Total a pagar:</span>
              <span className="text-blue-900 text-base sm:text-lg">${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de PayPal - Ultra optimizados para móvil */}
      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Pagar con PayPal</h4>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
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
            paypalOptions={paypalOptions}
          />
        </PayPalScriptProvider>
      </div>

      {/* Información adicional - Ultra optimizada para móvil */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-blue-800">
            <p className="font-bold mb-2">Información importante:</p>
            <ul className="space-y-1">
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
