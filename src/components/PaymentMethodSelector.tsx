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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Selecciona tu método de pago
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Elige cómo prefieres pagar tu reserva
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pago con PayPal - Ultra optimizado para móvil */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg rounded-xl ${
            selectedMethod === 'paypal' 
              ? 'ring-2 ring-yellow-500 bg-yellow-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => handleMethodSelect('paypal')}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                </div>
              </div>
              
              <div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  PayPal
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Paga con tu cuenta PayPal o tarjeta
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-green-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Sin cuenta necesaria</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-green-600">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>100% seguro</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-green-600">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Proceso rápido</span>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Pago completo</p>
              </div>

              <Badge variant="secondary" className="mt-2 text-xs sm:text-sm">
                Recomendado
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pago por WhatsApp - Ultra optimizado para móvil */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg rounded-xl ${
            selectedMethod === 'whatsapp' 
              ? 'ring-2 ring-green-500 bg-green-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => handleMethodSelect('whatsapp')}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
              </div>
              
              <div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  Coordinar por WhatsApp
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Habla directamente con nuestro equipo para coordinar el pago
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-blue-600">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Atención personalizada</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-blue-600">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Múltiples opciones de pago</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-blue-600">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Flexibilidad total</span>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Coordinar pago</p>
              </div>

              <Badge variant="outline" className="mt-2 text-xs sm:text-sm">
                Tradicional
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional - Ultra optimizada para móvil */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-5 border border-gray-200">
        <div className="text-center">
          <h4 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Resumen de tu reserva</h4>
          <div className="text-xs sm:text-sm text-gray-600 space-y-2">
            <p className="flex justify-between items-center"><strong>Tour:</strong> <span className="text-right max-w-[60%]">{tourTitle}</span></p>
            <p className="flex justify-between"><strong>Huéspedes:</strong> <span>{guestCount}</span></p>
            <p className="flex justify-between font-bold text-gray-900"><strong>Total:</strong> <span>${totalAmount.toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      {selectedMethod && (
        <div className="text-center">
          <Button
            onClick={() => {
              // Esta función se manejará en el componente padre
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-sm sm:text-base py-3 sm:py-4 h-12 sm:h-14 font-bold rounded-lg shadow-lg"
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
