import React from 'react';
import { Phone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { contactMilnaWhatsApp, callMilna } from '@/services/whatsapp';
import { cn } from '@/lib/utils';

export function ContactButtons() {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <button
        onClick={async () => await contactMilnaWhatsApp()}
        className={cn(
          "p-2 rounded-full transition-colors",
          "text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground"
        )}
        title="WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
      </button>
      <button
        onClick={async () => await callMilna()}
        className={cn(
          "p-2 rounded-full transition-colors",
          "text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground"
        )}
        title="Appeler"
      >
        <Phone className="h-5 w-5" />
      </button>
    </div>
  );
}