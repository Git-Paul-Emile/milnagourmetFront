import { useContactData } from '@/hooks/useContactData';
import { transformContactMethods, transformSocialLinks } from '@/lib/contactUtils';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { ContactHeader } from './ContactSection/ContactHeader';
import { ContactMethodsList } from './ContactSection/ContactMethodsList';
import { LoadingState } from './ContactSection/LoadingState';
import { LocationSection } from './ContactSection/LocationSection';
import { SocialLinksSection } from './ContactSection/SocialLinksSection';
import { StoreHoursSection } from './ContactSection/StoreHoursSection';

export function ContactSection() {
  const { contactData, loading } = useContactData();
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';

  if (loading || !contactData) {
    return <LoadingState />;
  }

  const contactMethods = transformContactMethods(contactData.methods);
  const socialLinks = transformSocialLinks(contactData.socialLinks);

  return (
    <section id="contact" className={cn("py-20", isChristmasTheme ? "bg-[#FFF9F0]" : "")}>
      <div className="container mx-auto px-4">
        <ContactHeader title={contactData.title} description={contactData.description} isChristmasTheme={isChristmasTheme} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ContactMethodsList methods={contactMethods} isChristmasTheme={isChristmasTheme} />
          <StoreHoursSection storeHours={contactData.storeHours} isChristmasTheme={isChristmasTheme} />
          <div className="lg:col-span-1">
            <SocialLinksSection socialLinks={socialLinks} isChristmasTheme={isChristmasTheme} />
            <LocationSection address={contactData.address} isChristmasTheme={isChristmasTheme} />
          </div>
        </div>
      </div>
    </section>
  );
}