import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { ContactInfo } from '@/types';
import { cn } from '@/lib/utils';

interface ContactSectionProps {
  contactInfo: ContactInfo | null;
  isChristmasTheme?: boolean;
}

export function ContactSection({ contactInfo, isChristmasTheme = false }: ContactSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className={cn(
        "text-lg font-semibold",
        "text-foreground"
      )}>Contact</h3>
      <div className="space-y-3">
        {contactInfo?.phone && (
          <div className="flex items-center space-x-3">
            <Phone className={cn(
              "h-4 w-4",
              "text-primary"
            )} />
            <a
              href={`tel:${contactInfo.phone}`}
              className={cn(
                "transition-colors",
                "text-muted-foreground hover:text-primary"
              )}
            >
              {contactInfo.phone}
            </a>
          </div>
        )}
        {contactInfo?.email && (
          <div className="flex items-center space-x-3">
            <Mail className={cn(
              "h-4 w-4",
              "text-primary"
            )} />
            <a
              href={`mailto:${contactInfo.email}`}
              className={cn(
                "transition-colors",
                "text-muted-foreground hover:text-primary"
              )}
            >
              {contactInfo.email}
            </a>
          </div>
        )}
        {contactInfo?.address && (
          <div className="flex items-start space-x-3">
            <MapPin className={cn(
              "h-4 w-4 mt-0.5",
              "text-primary"
            )} />
            <span className={cn(
              "text-sm",
              "text-muted-foreground"
            )}>
              {contactInfo.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}