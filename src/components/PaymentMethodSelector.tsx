import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  MessageCircle, 
  CheckCircle, 
  Shield, 
  Clock,
  DollarSign,
  Wallet
} from 'lucide-react';

interface PaymentMethodSelectorProps {
  totalAmount: number;
  onSelectMethod: (method: 'paypal' | 'whatsapp') => void;
  tourTitle: string;
  guestCount: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  totalAmount,
  onSelectMethod,
  tourTitle,
  guestCount
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'whatsapp' | null>(null);

  const handleMethodSelect = (method: 'paypal' | 'whatsapp') => {
    setSelectedMethod(method);
    onSelectMethod(method);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Selecciona tu método de pago
        </h3>
        <p className="text-gray-600">
          Elige cómo prefieres pagar tu reserva
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pago con PayPal */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMethod === 'paypal' 
              ? 'ring-2 ring-yellow-500 bg-yellow-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => handleMethodSelect('paypal')}
        >
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  PayPal
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Paga con tu cuenta PayPal o tarjeta
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sin cuenta necesaria</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <Shield className="w-4 h-4" />
                  <span>100% seguro</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <Clock className="w-4 h-4" />
                  <span>Proceso rápido</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Pago completo</p>
              </div>

              <Badge variant="secondary" className="mt-2">
                Recomendado
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pago por WhatsApp */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMethod === 'whatsapp' 
              ? 'ring-2 ring-green-500 bg-green-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => handleMethodSelect('whatsapp')}
        >
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Coordinar por WhatsApp
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Habla directamente con nuestro equipo para coordinar el pago
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>Atención personalizada</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Múltiples opciones de pago</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>Flexibilidad total</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Coordinar pago</p>
              </div>

              <Badge variant="outline" className="mt-2">
                Tradicional
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center">
          <h4 className="font-medium text-gray-900 mb-2">Resumen de tu reserva</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Tour:</strong> {tourTitle}</p>
            <p><strong>Huéspedes:</strong> {guestCount}</p>
            <p><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {selectedMethod && (
        <div className="text-center">
          <Button
            onClick={() => {
              // Esta función se manejará en el componente padre
            }}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
          >
            {selectedMethod === 'paypal' && 'Continuar con PayPal'}
            {selectedMethod === 'whatsapp' && 'Continuar con WhatsApp'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
