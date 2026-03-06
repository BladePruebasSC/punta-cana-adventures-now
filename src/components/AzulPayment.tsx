import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AzulPaymentProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  tourTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

const AzulPayment: React.FC<AzulPaymentProps> = ({
  amount,
  currency = 'DOP',
  onPaymentSuccess,
  onPaymentError,
  tourTitle,
  guestName,
  guestEmail,
  guestPhone
}) => {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'deposit'>('full');
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: guestName,
    expirationMonth: '',
    expirationYear: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.slice(0, 19); // Máximo 16 dígitos + 3 espacios
    }
    
    // Limitar mes a 2 dígitos
    if (name === 'expirationMonth') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
      if (parseInt(formattedValue) > 12) formattedValue = '12';
    }
    
    // Limitar año a 2 dígitos
    if (name === 'expirationYear') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    }
    
    // Limitar CVC a 3-4 dígitos
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateCard = (): string | null => {
    // Validar número de tarjeta (debe tener 16 dígitos)
    const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length < 15 || cardNumberClean.length > 16) {
      return 'Número de tarjeta inválido';
    }
    
    // Validar titular
    if (!cardData.cardHolder || cardData.cardHolder.length < 3) {
      return 'Nombre del titular requerido';
    }
    
    // Validar mes
    const month = parseInt(cardData.expirationMonth);
    if (!month || month < 1 || month > 12) {
      return 'Mes de expiración inválido';
    }
    
    // Validar año
    const year = parseInt(cardData.expirationYear);
    const currentYear = new Date().getFullYear() % 100;
    if (!year || year < currentYear) {
      return 'Año de expiración inválido';
    }
    
    // Validar CVC
    if (!cardData.cvc || cardData.cvc.length < 3) {
      return 'CVC inválido';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar tarjeta
    const validationError = validateCard();
    if (validationError) {
      toast({
        title: "Error de validación",
        description: validationError,
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);

    try {
      const finalAmount = paymentMethod === 'full' ? amount : amount * 0.3;
      
      // Preparar datos para Azul
      const paymentData = {
        orderNumber: `ORD-${Date.now()}`,
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        cardHolder: cardData.cardHolder,
        expirationDate: `${cardData.expirationYear}${cardData.expirationMonth.padStart(2, '0')}`,
        cvc: cardData.cvc,
        amount: Math.round(finalAmount * 100), // Azul usa centavos
        currency: currency,
        metadata: {
          tourTitle,
          guestName,
          guestEmail,
          guestPhone,
          paymentType: paymentMethod
        }
      };

      // Llamar al backend para procesar el pago
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/azul/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el pago');
      }

      const result = await response.json();
      
      if (result.success) {
        onPaymentSuccess({
          authorizationCode: result.authorizationCode,
          orderNumber: paymentData.orderNumber,
          amount: finalAmount,
          paymentMethod: 'azul'
        });
        
        toast({
          title: "¡Pago exitoso!",
          description: `Tu reserva ha sido confirmada. Código de autorización: ${result.authorizationCode}`,
        });
      } else {
        throw new Error(result.message || 'Pago rechazado');
      }

    } catch (error: any) {
      console.error('Error processing Azul payment:', error);
      onPaymentError(error);
      
      toast({
        title: "Error en el pago",
        description: error.message || "No se pudo procesar el pago con Azul",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Opciones de pago */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tipo de Pago</h3>
        
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
                <CreditCard className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium">Depósito (30%)</h4>
                  <p className="text-sm text-gray-600">${(amount * 0.3).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formulario de tarjeta */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Información de la Tarjeta</h3>
        
        {/* Nombre del titular */}
        <div className="space-y-2">
          <Label htmlFor="cardHolder">Nombre del Titular *</Label>
          <Input
            id="cardHolder"
            name="cardHolder"
            value={cardData.cardHolder}
            onChange={handleInputChange}
            placeholder="Como aparece en la tarjeta"
            required
            className="text-base"
          />
        </div>

        {/* Número de tarjeta */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              required
              className="text-base pr-10"
              maxLength={19}
            />
            <CreditCard className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
        </div>

        {/* Fecha de expiración y CVC */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expirationMonth">Mes *</Label>
            <Input
              id="expirationMonth"
              name="expirationMonth"
              value={cardData.expirationMonth}
              onChange={handleInputChange}
              placeholder="MM"
              required
              maxLength={2}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationYear">Año *</Label>
            <Input
              id="expirationYear"
              name="expirationYear"
              value={cardData.expirationYear}
              onChange={handleInputChange}
              placeholder="AA"
              required
              maxLength={2}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvc">CVC *</Label>
            <Input
              id="cvc"
              name="cvc"
              value={cardData.cvc}
              onChange={handleInputChange}
              placeholder="123"
              required
              maxLength={4}
              className="text-base"
            />
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>Pago seguro procesado por Azul (Banco Popular Dominicano)</span>
        </div>
      </div>

      {/* Resumen del pago */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumen del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tour:</span>
            <span className="font-medium text-right">{tourTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Método:</span>
            <span className="font-medium">
              {paymentMethod === 'full' ? 'Pago Completo' : 'Depósito (30%)'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monto:</span>
            <span className="font-medium">
              ${paymentMethod === 'full' ? amount.toFixed(2) : (amount * 0.3).toFixed(2)}
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
                ${paymentMethod === 'full' ? amount.toFixed(2) : (amount * 0.3).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de pago */}
      <Button
        type="submit"
        disabled={processing}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 py-3"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Procesando pago con Azul...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {paymentMethod === 'full' ? 'Pagar Ahora' : 'Pagar Depósito'}
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
              <li>• Aceptamos Visa, Mastercard y American Express</li>
              <li>• Procesado por Azul - Banco Popular Dominicano</li>
              <li>• Pago 100% seguro con encriptación SSL</li>
              <li>• Soporta tarjetas dominicanas e internacionales</li>
              <li>• Recibirás un comprobante por email</li>
              {paymentMethod === 'deposit' && (
                <li>• El saldo restante se pagará antes del tour</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Logo de Azul */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" />
          Procesado por Azul - Banco Popular Dominicano
        </p>
      </div>
    </form>
  );
};

export default AzulPayment;
