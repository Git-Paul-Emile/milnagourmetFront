import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Section "Nos services" — réplique fidèle du visuel de référence.
 *
 * Version statique (provisoire) : 4 cartes colorées, une couleur par carte,
 * titre en haut à gauche et lien "Order Now" en bas à gauche.
 * Les images des produits sont volontairement absentes pour l'instant :
 * l'emplacement (à droite de chaque carte) est réservé pour les ajouter plus tard.
 */

interface ServiceCard {
  title: string;
  description: string;
  /** Couleur de fond de la carte, puisée dans la palette de marque. */
  background: string;
  /** Couleur du texte posé sur cette carte. */
  ink: string;
}

/**
 * Une couleur de fond par carte, avec l'encre associée.
 *
 * Bleu et rose : texte blanc, comme demandé. RÉSERVE D'ACCESSIBILITÉ —
 * le contraste y reste sous le seuil WCAG AA de 4,5:1 pour le petit texte :
 * 2,73:1 sur le bleu #43A2F2 et 4,01:1 sur le rose #d64c86. Les couleurs de
 * fond n'ont volontairement pas été retouchées (ni voile, ni assombrissement)
 * pour respecter les teintes choisies. Si la conformité AA devient requise,
 * trois pistes : assombrir les deux fonds, revenir à une encre foncée, ou
 * poser un voile sombre derrière le texte.
 *
 * Jaune et orange : encre #111111, car le blanc y est totalement illisible
 * (1,12:1 et 2,30:1).
 */
const SERVICE_CARDS: ServiceCard[] = [
  { title: 'Panier Cadeau', description: 'Des paniers prêts à offrir.', background: '#43A2F2', ink: '#FFFFFF' }, // Bleu
  { title: 'Panier Personnalisé', description: 'Créez votre panier selon vos envies.', background: '#d64c86', ink: '#FFFFFF' }, // Rose
  { title: 'Boîte Mono Saveur', description: 'Une seule gourmandise dans la boîte.', background: '#F9F871', ink: '#111111' }, // Jaune
  { title: 'Boîte Découverte', description: 'Un assortiment de plusieurs gourmandises.', background: '#eb975e', ink: '#111111' }, // Orange
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Titre de section entièrement en #212121 (plus de dégradé). */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#212121]">
            Nos Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des attentions gourmandes préparées sur mesure. Le prix vous est communiqué
            par le vendeur après réception de votre commande.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_CARDS.map((card) => (
            <article
              key={card.title}
              style={{ background: card.background, color: card.ink }}
              className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-strong"
            >
              {/* Halo décoratif. Sur les cartes à texte blanc il est assombri :
                  un halo clair éclaircirait le fond et dégraderait encore le
                  contraste du texte. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl ${
                  card.ink === '#FFFFFF' ? 'bg-black/15' : 'bg-white/25'
                }`}
              />

              {/* Titre et description en haut à gauche */}
              <div className="relative z-10 max-w-[85%]">
                <h3 className="text-xl font-bold leading-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  {card.description}
                </p>
              </div>

              {/* Lien "Commander" en bas à gauche.
                  Pas d'opacité réduite ici : elle ferait encore baisser le
                  contraste du texte sur les cartes bleue et rose. */}
              <button
                type="button"
                className="relative z-10 mt-auto inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 transition-all hover:underline"
              >
                Commander
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
