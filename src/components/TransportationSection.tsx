import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import WhatsAppIcon from '@/components/ui/whatsapp-icon';
import { sendWhatsAppMessage } from '@/lib/utils';

interface TransportationDestination {
  name: string;
  price: number;
  zone?: string;
}

const TransportationSection = () => {
  const destinations: TransportationDestination[] = [
    { name: "Hotel Sivoy P.C. / Zoëtry Agua Punta Cana", price: 80 },
    { name: "Excellence P.C. / Sirenis / Jewel Punta Cana", price: 70 },
    { name: "Live Aqua / Dreams onyx / Breathless", price: 70 },
    { name: "Dreams Macao", price: 60 },
    { name: "Hotel hard rock", price: 50 },
    { name: "Occidental Caribe / Riu Republica", price: 40 },
    { name: "Hoteles majestic", price: 40 },
    { name: "Hoteles Riu", price: 40 },
    { name: "Hoteles grand Bahía Principe", price: 40 },
    { name: "Hoteles Iberostar", price: 40 },
    { name: "Hoteles Ocean blue", price: 40 },
    { name: "Hotel Punta Cana Princess", price: 40 },
    { name: "Hotel gran princesa /Paradisus punta cana", price: 35 },
    { name: "Hotel Caribe club Princess", price: 35 },
    { name: "Plaza bávaro", price: 35 },
    { name: "Hotel occidental Grand punta cana", price: 35 },
    { name: "Hoteles Palladium", price: 35 },
    { name: "Cruce de Friusa", price: 30 },
    { name: "Manatí Park", price: 30 },
    { name: "Hotel cortecito Inn / Capitán Cook", price: 35 },
    { name: "Vista Sol", price: 35 },
    { name: "Impressive Resort", price: 35 },
    { name: "Hotel los corales / Gran Caribe", price: 35 },
    { name: "Dreams Royal Beach / Secrets Royal Beach", price: 35 },
    { name: "Hotel Meliá punta cana / Palma Real", price: 30 },
    { name: "Plaza palma Real (shopping Village)", price: 30 },
    { name: "Lopesan", price: 30 },
    { name: "Hoteles Barceló", price: 30 },
    { name: "Plaza San Juan / Cocoloco", price: 25 },
    { name: "Hotel natura Park Resort", price: 30 },
    { name: "Jewel Palm Beach / Be Live / Catalonia", price: 30 },
    { name: "Hospiten Bávaro", price: 20 },
    { name: "Hotel Club Med / Los Corales Punta Cana", price: 20 },
    { name: "Hotel Punta Cana Resort & Club / Marina P.C.", price: 20 },
    { name: "Cap cana", price: 10 },
    { name: "Four Points", price: 30 }
  ];

  const handleWhatsAppContact = () => {
    const phoneNumber = '18098408257';
    const message = `🚖 *CONSULTA - SERVICIO DE TAXI* 🚖

¡Hola! Me interesa el servicio de taxi 24 horas. ¿Podrías ayudarme con información sobre transporte y tarifas?

✅ Servicio 24 horas
✅ Máximo 4 personas
✅ Persona extra: US$5

¡Espero tu respuesta! 🎉`;

    const encodedMessage = encodeURIComponent(message);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
      setTimeout(() => {
        window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');
      }, 2000);
    } else {
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Car className="w-4 h-4" />
            TAXI SERVICE 24 HOURS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servicio de Transporte
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transporte seguro y confiable las 24 horas del día. Tarifas fijas desde tu hotel hacia cualquier destino en Punta Cana.
          </p>
        </div>

        {/* Service Features */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center p-4">
            <CardContent className="pt-4">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">24 Horas</h3>
              <p className="text-sm text-gray-600">Disponible siempre</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="pt-4">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Hasta 4 Personas</h3>
              <p className="text-sm text-gray-600">Máximo por viaje</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="pt-4">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Tarifas Fijas</h3>
              <p className="text-sm text-gray-600">Sin sorpresas</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="pt-4">
              <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Vehículos Seguros</h3>
              <p className="text-sm text-gray-600">Flota moderna</p>
            </CardContent>
          </Card>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {destinations.map((destination, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <h3 className="font-medium text-sm leading-tight">
                        {destination.name}
                      </h3>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    US${destination.price}.00
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info & CTA */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Información Adicional
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-800">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                4 personas máximo
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Persona extra: US$5 cada una
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Servicio 24/7
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleWhatsAppContact}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Solicitar Transporte
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TransportationSection;