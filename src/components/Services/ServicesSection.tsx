import React, { useEffect, useState } from 'react';
import { specialServicesService } from '@/services';
import { SpecialService } from '@/types';
import { ServiceOrderModal } from './ServiceOrderModal';
import { Button } from '@/components/ui/button';

/**
 * Section "Nos services" : Panier gourmand, Boîte pancake (si activée par l'admin).
 * Les services inactifs ne sont pas renvoyés par l'API et n'apparaissent donc pas.
 * Prix sur devis : communiqué par le vendeur après réception de la commande.
 */
export function ServicesSection() {
  const [services, setServices] = useState<SpecialService[]>([]);
  const [selectedService, setSelectedService] = useState<SpecialService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    specialServicesService
      .getActive()
      .then((response) => {
        if (!cancelled) setServices((response.data as SpecialService[]) ?? []);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des services:', error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rien à afficher : pas de section vide dans la page
  if (loading || services.length === 0) return null;

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Nos <span className="bg-gradient-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des attentions gourmandes préparées sur mesure. Le prix vous est communiqué
            par le vendeur après réception de votre commande.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {services.map((service) => (
            <article
              key={service.id}
              className="group relative rounded-xl overflow-hidden bg-card border border-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            >
              {service.image && (
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Prix sur devis
                  </span>
                </div>
              )}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{service.description}</p>
                )}
                <Button className="w-full" onClick={() => setSelectedService(service)}>
                  Commander
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ServiceOrderModal service={selectedService} onClose={() => setSelectedService(null)} />
    </section>
  );
}
