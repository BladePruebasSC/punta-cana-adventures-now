import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Traducciones completas
const translations = {
  es: {
    // Header y navegación
    tours: "Tours",
    transportation: "Transporte",
    aboutUs: "Nosotros",
    contact: "Contacto",
    languageSelector: "Idioma",
    
    // Hero Section
    heroTitle: "EXPLORA TODO PUNTA CANA AHORA",
    heroSubtitle: "Transportación • Tours • Excursiones • Experiencias Inolvidables",
    searchPlaceholder: "Buscar tours, aventuras...",
    exploreButton: "Explorar Tours",
    reviews: "+1000 Reseñas 5★",
    smallGroups: "Grupos Pequeños",
    localGuides: "Guías Locales",
    
    // Tours
    featuredTours: "Tours Destacados",
    featuredSubtitle: "Disfruta de las mejores actividades y aventuras de Punta Cana. Con la mejor calidad, mejores precios y Servicios Garantizados",
    allTours: "Todos los Tours",
    adventure: "Aventura",
    beach: "Playa & Mar",
    culture: "Cultura",
    nature: "Naturaleza",
    toursFound: "tours encontrados para",
    noToursFound: "No se encontraron tours para",
    clearSearch: "Limpiar búsqueda",
    loadingTours: "Cargando tours increíbles...",
    loadingSubtitle: "Preparando las mejores experiencias para ti",
    noToursCategory: "No hay tours disponibles en esta categoría.",
    noToursSearch: "No se encontraron tours que coincidan con tu búsqueda.",
    viewAllTours: "Ver todos los tours",
    reserveNow: "Reservar Ahora",
    photos: "fotos",
    duration: "horas",
    upTo: "Hasta",
    people: "personas",
    
    // Detalles del tour
    pickupAndReturn: "Recogida y regreso al hotel",
    fastTrack: "Recorrido por el campo dominicano",
    funForEveryone: "Diversión entre lodo, charcos y aventura",
    
    // Página de Reserva
    backButton: "Volver",
    reserveThisTour: "Reservar este Tour",
    completeForm: "Completa el formulario para reservar tu aventura",
    fullName: "Nombre Completo",
    yourName: "Tu nombre completo",
    email: "Email",
    yourEmail: "tu@email.com",
    phone: "Teléfono",
    yourPhone: "+1 (809) 840 8257",
    preferredDate: "Fecha Preferida",
    numberOfGuests: "Número de Huéspedes",
    specialRequests: "Solicitudes Especiales",
    anySpecialRequests: "¿Alguna solicitud especial?",
    tourIncludes: "Lo que incluye:",
    requiredFields: "Campos requeridos",
    completeAllFields: "Por favor completa todos los campos obligatorios",
    reservationSent: "¡Reserva enviada!",
    redirectingToWhatsApp: "Redirigiendo a WhatsApp para confirmar tu reserva...",
    reservationConfirmed: "¡Reserva confirmada!",
    paidSuccessfully: "Tu reserva ha sido pagada y confirmada exitosamente",
    errorProcessing: "Error",
    errorMessage: "No se pudo procesar tu reserva. Contacta soporte.",
    paymentError: "Error en el pago",
    paymentProblem: "Hubo un problema procesando tu pago",
    loading: "Cargando",
    loadingTourInfo: "Cargando información del tour...",
    tourNotFound: "Tour no encontrado",
    tourDoesNotExist: "El tour que buscas no existe o ha sido eliminado.",
    backToHome: "Volver al Inicio",
    reservationSummary: "Resumen de la Reserva",
    tour: "Tour",
    pricePerPerson: "Precio por persona",
    guests: "Huéspedes",
    estimatedTotal: "Total estimado",
    confirmReservation: "Confirmar Reserva",
    processing: "Procesando...",
    continueWithPayment: "Continuar con el Pago",
    
    // Métodos de pago
    selectPaymentMethod: "Seleccionar Método de Pago",
    choosePaymentMethod: "Elige cómo quieres pagar",
    azulPayment: "Pago con Azul 🇩🇴",
    azulDescription: "Pago seguro procesado por Banco Popular Dominicano",
    paypalPayment: "Pago con PayPal",
    paypalDescription: "Pago internacional seguro",
    whatsappReservation: "Reservar por WhatsApp",
    whatsappDescription: "Confirma tu reserva directamente con nosotros",
    cancel: "Cancelar",
    backToPaymentOptions: "Volver a opciones de pago",
    
    // Footer
    readyForAdventure: "¿Listo para tu Aventura?",
    contactExperts: "Contacta con nuestros expertos locales para crear tu experiencia perfecta",
    popularTours: "Tours Populares",
    services: "Servicios",
    privateTours: "Tours Privados",
    corporateGroups: "Grupos Corporativos",
    certifiedGuides: "Guías Certificados",
    copyright: "© 2024 Jon Tours Punta Cana. Todos los derechos reservados.",
    authenticExperiences: "Experiencias Auténticas",
    hours: "7:00 AM - 10:00 PM",
    
    // Transporte
    transportTitle: "Servicio de Transporte",
    transportSubtitle: "Traslados seguros y cómodos desde cualquier punto de Punta Cana",
    airportTransfer: "Traslado Aeropuerto",
    hotelTransfer: "Traslado Hotel",
    privateTransport: "Transporte Privado",
    from: "Desde",
    requestTransport: "Solicitar Transporte",
    
    // Nosotros
    aboutTitle: "Sobre Nosotros",
    aboutDescription: "Somos expertos locales apasionados por compartir la belleza de Punta Cana",
    ourMission: "Nuestra Misión",
    ourVision: "Nuestra Visión",
    ourValues: "Nuestros Valores",
    ourTeam: "Nuestro Equipo",
    
    // Contacto
    contactTitle: "Contáctanos",
    contactDescription: "Estamos aquí para ayudarte a planear tu aventura perfecta",
    sendMessage: "Enviar Mensaje",
    yourMessage: "Tu mensaje",
    subject: "Asunto",
  },
  en: {
    // Header and navigation
    tours: "Tours",
    transportation: "Transportation",
    aboutUs: "About Us",
    contact: "Contact",
    languageSelector: "Language",
    
    // Hero Section
    heroTitle: "EXPLORE ALL PUNTA CANA NOW",
    heroSubtitle: "Transportation • Tours • Excursions • Unforgettable Experiences",
    searchPlaceholder: "Search tours, adventures...",
    exploreButton: "Explore Tours",
    reviews: "+1000 5★ Reviews",
    smallGroups: "Small Groups",
    localGuides: "Local Guides",
    
    // Tours
    featuredTours: "Featured Tours",
    featuredSubtitle: "Enjoy the best activities and adventures in Punta Cana. With the best quality, prices and Guaranteed Services",
    allTours: "All Tours",
    adventure: "Adventure",
    beach: "Beach & Sea",
    culture: "Culture",
    nature: "Nature",
    toursFound: "tours found for",
    noToursFound: "No tours found for",
    clearSearch: "Clear search",
    loadingTours: "Loading incredible tours...",
    loadingSubtitle: "Preparing the best experiences for you",
    noToursCategory: "No tours available in this category.",
    noToursSearch: "No tours found matching your search.",
    viewAllTours: "View all tours",
    reserveNow: "Reserve Now",
    photos: "photos",
    duration: "hours",
    upTo: "Up to",
    people: "people",
    
    // Tour details
    pickupAndReturn: "Pickup and return to hotel",
    fastTrack: "Tour through the Dominican countryside",
    funForEveryone: "Fun in mud, puddles and adventure",
    
    // Booking Page
    backButton: "Back",
    reserveThisTour: "Reserve this Tour",
    completeForm: "Complete the form to book your adventure",
    fullName: "Full Name",
    yourName: "Your full name",
    email: "Email",
    yourEmail: "your@email.com",
    phone: "Phone",
    yourPhone: "+1 (809) 840 8257",
    preferredDate: "Preferred Date",
    numberOfGuests: "Number of Guests",
    specialRequests: "Special Requests",
    anySpecialRequests: "Any special requests?",
    tourIncludes: "What's included:",
    requiredFields: "Required fields",
    completeAllFields: "Please complete all required fields",
    reservationSent: "Reservation sent!",
    redirectingToWhatsApp: "Redirecting to WhatsApp to confirm your reservation...",
    reservationConfirmed: "Reservation confirmed!",
    paidSuccessfully: "Your reservation has been paid and confirmed successfully",
    errorProcessing: "Error",
    errorMessage: "Could not process your reservation. Contact support.",
    paymentError: "Payment error",
    paymentProblem: "There was a problem processing your payment",
    loading: "Loading",
    loadingTourInfo: "Loading tour information...",
    tourNotFound: "Tour not found",
    tourDoesNotExist: "The tour you're looking for doesn't exist or has been deleted.",
    backToHome: "Back to Home",
    reservationSummary: "Reservation Summary",
    tour: "Tour",
    pricePerPerson: "Price per person",
    guests: "Guests",
    estimatedTotal: "Estimated total",
    confirmReservation: "Confirm Reservation",
    processing: "Processing...",
    continueWithPayment: "Continue with Payment",
    
    // Payment methods
    selectPaymentMethod: "Select Payment Method",
    choosePaymentMethod: "Choose how you want to pay",
    azulPayment: "Pay with Azul 🇩🇴",
    azulDescription: "Secure payment processed by Banco Popular Dominicano",
    paypalPayment: "Pay with PayPal",
    paypalDescription: "Secure international payment",
    whatsappReservation: "Reserve via WhatsApp",
    whatsappDescription: "Confirm your reservation directly with us",
    cancel: "Cancel",
    backToPaymentOptions: "Back to payment options",
    
    // Footer
    readyForAdventure: "Ready for Your Adventure?",
    contactExperts: "Contact our local experts to create your perfect experience",
    popularTours: "Popular Tours",
    services: "Services",
    privateTours: "Private Tours",
    corporateGroups: "Corporate Groups",
    certifiedGuides: "Certified Guides",
    copyright: "© 2024 Jon Tours Punta Cana. All rights reserved.",
    authenticExperiences: "Authentic Experiences",
    hours: "7:00 AM - 10:00 PM",
    
    // Transportation
    transportTitle: "Transportation Service",
    transportSubtitle: "Safe and comfortable transfers from anywhere in Punta Cana",
    airportTransfer: "Airport Transfer",
    hotelTransfer: "Hotel Transfer",
    privateTransport: "Private Transport",
    from: "From",
    requestTransport: "Request Transport",
    
    // About Us
    aboutTitle: "About Us",
    aboutDescription: "We are local experts passionate about sharing the beauty of Punta Cana",
    ourMission: "Our Mission",
    ourVision: "Our Vision",
    ourValues: "Our Values",
    ourTeam: "Our Team",
    
    // Contact
    contactTitle: "Contact Us",
    contactDescription: "We're here to help you plan your perfect adventure",
    sendMessage: "Send Message",
    yourMessage: "Your message",
    subject: "Subject",
  }
};

// Tipo para las claves de traducción
export type TranslationKey = keyof typeof translations.es;
export type Language = 'es' | 'en';

// Contexto de idioma
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.es;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider de idioma
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = useMemo(() => {
    return translations[language];
  }, [language]);

  // Guardar idioma en localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para usar el contexto de idioma
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
