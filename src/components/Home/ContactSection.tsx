import { useContactData } from '@/hooks/useContactData';
import { transformContactMethods, transformSocialLinks } from '@/lib/contactUtils';
import { cn } from '@/lib/utils';
import { ContactHeader } from './ContactSection/ContactHeader';
import { ContactMethodsList } from './ContactSection/ContactMethodsList';
import { LoadingState } from './ContactSection/LoadingState';
import { SocialLinksSection } from './ContactSection/SocialLinksSection';
import { StoreHoursSection } from './ContactSection/StoreHoursSection';

export function ContactSection() {
  const { contactData, loading } = useContactData();

  if (loading || !contactData) {
    return <LoadingState />;
  }

  const contactMethods = transformContactMethods(contactData.methods);
  const socialLinks = transformSocialLinks(contactData.socialLinks);

  return (
    <section id="contact" className={cn("py-20", "")}>
      <div className="container mx-auto px-4">
        <ContactHeader title={contactData.title} description={contactData.description} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ContactMethodsList methods={contactMethods} address={contactData.address} />
          <StoreHoursSection storeHours={contactData.storeHours} />
          <div className="lg:col-span-1">
            <SocialLinksSection socialLinks={socialLinks} />
          </div>
        </div>
      </div>
    </section>
  );
}