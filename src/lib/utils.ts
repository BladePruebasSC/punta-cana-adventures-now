import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sendWhatsAppMessage(tourInfo: {
  title: string;
  price: number;
  duration: string;
  description: string;
  highlights?: string[];
}) {
  const phoneNumber = '18098408257';
  
  const whatsappMessage = `🌴 *CONSULTA - ${tourInfo.title}* 🌴

💰 Precio: $${tourInfo.price} | ⏱️ ${tourInfo.duration}

¡Hola! Me interesa este tour y me gustaría más información. ¿Podrías ayudarme? 🎉`;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  
  // iOS-friendly WhatsApp redirect
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    // For iOS, use whatsapp:// protocol first
    window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    // Fallback to web version after a short delay if the app doesn't open
    setTimeout(() => {
      const fallbackUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      window.open(fallbackUrl, '_blank');
    }, 1500);
  } else {
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  }
}
