import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { specialServicesService } from '@/services';
import { SpecialService } from '@/types';
import { ServiceOrderModal } from './ServiceOrderModal';

/**
 * Section "Nos services" — cartes colorées (design validé), alimentées par
 * l'API : les services et leurs éléments sont gérés par l'admin, les services
 * inactifs ne sont pas renvoyés. Le clic ouvre le modal de commande, dont la
 * logique dépend du type de service (panier fixe/personnalisé, boîtes).
 */

// Une couleur par carte, appliquée en rotation (palette du site).
const CARD_STYLES = [
  { background: '#43A2F2', ink: '#FFFFFF' }, // Bleu
  { background: '#d64c86', ink: '#FFFFFF' }, // Rose
  { background: '#F9F871', ink: '#111111' }, // Jaune
  { background: '#eb975e', ink: '#111111' }, // Orange
] as const;

const ROTATION_MS = 6000;

interface ServiceCardProps {
  service: SpecialService;
  style: { background: string; ink: string };
  onOrder: () => void;
}

function ServiceCard({ service, style, onOrder }: ServiceCardProps) {
  // Liste des couvertures : `covers` (plusieurs) sinon l'image unique.
  const covers = service.covers && service.covers.length > 0
    ? service.covers
    : service.image
    ? [service.image]
    : [];
  const hasCover = covers.length > 0;

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // Rotation automatique des couvertures (uniquement s'il y en a plusieurs,
  // et si l'utilisateur n'a pas demandé la réduction des animations).
  useEffect(() => {
    if (covers.length <= 1) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      activeRef.current = (activeRef.current + 1) % covers.length;
      setActive(activeRef.current);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [covers.length]);

  return (
    <article
      style={{ background: style.background, color: style.ink }}
      className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-strong"
    >
      {/* Halo décoratif */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl ${
          style.ink === '#FFFFFF' ? 'bg-white/15' : 'bg-white/25'
        }`}
      />

      {/* Couverture(s) en découpe sur la droite. Plusieurs couvertures sont
          empilées et se relaient en fondu ; le texte reste à gauche. */}
      {hasCover && (
        <div className="pointer-events-none absolute -bottom-1 right-0 z-0 h-[82%] w-[58%]">
          {covers.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className={`absolute inset-0 h-full w-full object-contain object-right-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] transition-all duration-700 ease-in-out group-hover:scale-105 ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      )}

      {/* Badge prix */}
      <span
        className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-medium ${
          style.ink === '#FFFFFF' ? 'bg-black/15' : 'bg-white/40'
        }`}
      >
        {service.basePrice > 0
          ? `À partir de ${service.basePrice.toLocaleString('fr-FR')} FCFA`
          : 'Prix sur devis'}
      </span>

      {/* Titre et description (largeur limitée pour laisser la place à l'image) */}
      <div className={`relative z-10 mt-8 ${hasCover ? 'max-w-[60%]' : 'max-w-[85%]'}`}>
        <h3 className="text-xl font-bold leading-tight">{service.name}</h3>
        {service.description && (
          <p className="mt-2 text-sm opacity-90">{service.description}</p>
        )}
      </div>

      {/* Commander */}
      <button
        type="button"
        onClick={onOrder}
        className="relative z-10 mt-auto inline-flex items-center gap-2 self-start text-sm font-semibold underline-offset-4 transition-all cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
      >
        Commander
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </article>
  );
}

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

  // Pas de section vide dans la page
  if (loading || services.length === 0) return null;

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#212121]">
            Nos Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des attentions gourmandes préparées sur mesure. Paniers à partir de
            25 000 FCFA — le prix final est confirmé par le vendeur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              style={CARD_STYLES[index % CARD_STYLES.length]}
              onOrder={() => setSelectedService(service)}
            />
          ))}
        </div>
      </div>

      <ServiceOrderModal service={selectedService} onClose={() => setSelectedService(null)} />
    </section>
  );
}
