import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SocialLink } from '@/lib/contactUtils';
import { cn } from '@/lib/utils';

/**
 * SocialLinksSection
 * -----------------------------------------------------------------------------
 * Pile de cartes « réseaux sociaux ».
 *
 * Deux interactions distinctes, volontairement séparées :
 *
 *   1. Clic sur la CARTE          → elle remonte à la première place de la pile
 *                                    (au-dessus des autres, sans décalage).
 *   2. Clic sur « Voir le fil »   → redirection vers le profil du réseau
 *                                    (nouvel onglet).
 *
 * Principe d'animation retenu
 * ---------------------------
 * L'ordre des éléments dans le DOM ne change JAMAIS : on parcourt toujours
 * `socialLinks` dans son ordre d'origine. Seule une couche de présentation
 * (`transform` + `z-index`) traduit la position visuelle de chaque carte.
 *
 * Pourquoi ? Si on réordonnait le tableau rendu, React démonterait/remonterait
 * les nœuds et le navigateur n'aurait aucune transition à animer : la carte
 * « sauterait » d'un coup. En gardant le DOM stable et en n'animant que le
 * `transform`, on obtient un glissement fluide, calculé par le compositeur du
 * navigateur (aucun recalcul de mise en page).
 *
 * Schéma :
 *
 *   socialLinks (ordre DOM, figé)      order (ordre visuel, état React)
 *   ─────────────────────────────      ────────────────────────────────
 *   [0] Instagram  ──────────────┐     [0] TikTok      → offset (0,0),   z=100
 *   [1] TikTok     ──────────────┼──►  [1] Instagram   → offset (18,26), z=99
 *   [2] Facebook   ──────────────┘     [2] Facebook    → offset (36,52), z=98
 */

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
}

/** Dégradé de repli, utilisé le temps que la photo se charge. */
const NETWORK_BACKGROUND: Record<string, string> = {
  instagram: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
  tiktok: 'bg-gradient-to-br from-[#25f4ee] via-[#111111] to-[#fe2c55]',
  facebook: 'bg-gradient-to-br from-[#1877f2] to-[#0a3d91]',
  twitter: 'bg-gradient-to-br from-[#1da1f2] to-[#0d47a1]',
};

/**
 * Visuels de fond des cartes (Unsplash).
 *
 * Les paramètres de l'URL sont ceux du CDN Imgix utilisé par Unsplash :
 *   - `w` / `h`   : dimensions demandées → on ne télécharge pas un JPEG 3000 px
 *                   pour l'afficher dans une carte de 230 px de large ;
 *   - `fit=crop`  : recadre au lieu de déformer ;
 *   - `auto=format`: sert du WebP/AVIF si le navigateur le supporte ;
 *   - `q=70`      : compromis qualité/poids raisonnable pour une vignette.
 *
 * Le champ `credit` conserve l'auteur : la licence Unsplash n'impose pas
 * l'attribution, mais la tracer ici évite de perdre l'information.
 */
interface CardImage {
  src: string;
  alt: string;
  credit: string;
}

const CARD_IMAGES: CardImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1552320764-9fc870798a3f?w=600&h=800&fit=crop&auto=format&q=70',
    alt: 'Bol de granola et de fruits sur fond clair',
    credit: 'Niclas Illg / Unsplash',
  },
  {
    src: 'https://images.unsplash.com/photo-1593450298197-e6031f033a44?w=600&h=800&fit=crop&auto=format&q=70',
    alt: 'Bol de yaourt aux fraises et kiwis',
    credit: 'Daniel Cabriles / Unsplash',
  },
  {
    // ATTENTION : cette photo relève de la licence Unsplash+ (abonnement payant).
    // Un abonnement actif est nécessaire pour l'exploiter en production.
    src: 'https://plus.unsplash.com/premium_photo-1713551474697-15fe83485bc7?w=600&h=800&fit=crop&auto=format&q=70',
    alt: 'Trois verrines de fruits rouges sur une table',
    credit: 'Olimpia Davies / Unsplash+',
  },
];

/* --- Géométrie de la pile (en pixels) ------------------------------------- */
const CARD_WIDTH = 230;
const CARD_HEIGHT = 300;
const CARD_STEP_X = 18;
const CARD_STEP_Y = 26;

export function SocialLinksSection({ socialLinks }: SocialLinksSectionProps) {
  /**
   * Ordre VISUEL de la pile, exprimé par les noms des réseaux.
   *
   * On stocke des noms (chaînes) plutôt que des index numériques : si l'API
   * renvoie une liste réordonnée, un index deviendrait silencieusement faux,
   * alors qu'un nom reste identifiable.
   */
  const [order, setOrder] = useState<string[]>(() => socialLinks.map((s) => s.name));

  /**
   * Clé stable décrivant la composition de la liste.
   *
   * `socialLinks` est un nouveau tableau à chaque rendu du parent : l'utiliser
   * directement comme dépendance d'un `useEffect` déclencherait une boucle de
   * rendus infinie. On dérive donc une chaîne, comparée par valeur.
   */
  const namesKey = useMemo(() => socialLinks.map((s) => s.name).join('|'), [socialLinks]);

  /** Resynchronise l'ordre visuel quand la liste change réellement. */
  useEffect(() => {
    setOrder(socialLinks.map((s) => s.name));
    // `socialLinks` est volontairement absent des dépendances : `namesKey` en
    // est le résumé stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namesKey]);

  /** Fait remonter une carte au premier plan. */
  const bringToFront = (name: string) => {
    setOrder((previous) => {
      // Déjà en tête : on ne déclenche pas de rendu inutile.
      if (previous[0] === name) return previous;
      return [name, ...previous.filter((item) => item !== name)];
    });
  };

  const stackWidth = CARD_WIDTH + (socialLinks.length - 1) * CARD_STEP_X;
  const stackHeight = CARD_HEIGHT + (socialLinks.length - 1) * CARD_STEP_Y;

  return (
    <div className="lg:col-span-1">
      <h3 className="text-xl font-semibold mb-6 text-[#212121]">Suivez-Nous</h3>

      {/* Pile de cartes façon "réseaux sociaux" */}
      <div className="relative mx-auto mb-8" style={{ width: stackWidth, height: stackHeight }}>
        {socialLinks.map((social, index) => {
          // Position VISUELLE (0 = devant). `indexOf` peut renvoyer -1 pendant
          // le bref instant où l'état n'est pas encore resynchronisé : on
          // retombe alors sur la position d'origine.
          const rawPosition = order.indexOf(social.name);
          const position = rawPosition === -1 ? index : rawPosition;

          const isFront = position === 0;
          const networkKey = social.name.toLowerCase();

          // L'image reste attachée au RÉSEAU (index d'origine), pas à la
          // position : une carte ne change donc pas de photo en se déplaçant.
          // Le modulo permet de recycler les visuels s'il y a plus de réseaux
          // que d'images.
          const image = CARD_IMAGES[index % CARD_IMAGES.length];

          // Léger désalignement décoratif ; la carte de devant est redressée.
          const tilt = isFront ? 0 : (position % 2 === 0 ? 1 : -1) * position * 1.5;

          return (
            <div
              key={social.name}
              className={cn(
                'absolute left-0 top-0 overflow-hidden rounded-2xl shadow-xl',
                // On n'anime que `transform` : propriété peu coûteuse, traitée
                // par le compositeur sans recalcul de mise en page.
                'transition-transform duration-500 ease-out',
                NETWORK_BACKGROUND[networkKey] || 'bg-gradient-primary'
              )}
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transform: `translate(${position * CARD_STEP_X}px, ${position * CARD_STEP_Y}px) rotate(${tilt}deg)`,
                zIndex: socialLinks.length - position,
              }}
            >
              {/* --- Visuel de fond --------------------------------------- */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                // `object-cover` remplit le cadre en préservant les proportions
                // (recadrage), contrairement à `object-fill` qui déformerait.
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Voile sombre : garantit le contraste du texte blanc, quelle
                  que soit la luminosité de la photo (accessibilité WCAG). */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                aria-hidden="true"
              />

              {/* --- Surface de clic : remonte la carte au premier plan -----
                  Un <button> couvrant toute la carte plutôt qu'un onClick sur
                  la <div> : c'est natif au clavier (Tab + Entrée/Espace) et
                  correctement annoncé par les lecteurs d'écran. Il est placé
                  SOUS le contenu (z-0) pour que le lien reste cliquable. */}
              <button
                type="button"
                onClick={() => bringToFront(social.name)}
                aria-label={`Mettre la carte ${social.name} au premier plan`}
                // `cursor-default` quand la carte est déjà devant : le clic
                // n'aurait aucun effet, autant ne pas le suggérer.
                className={cn('absolute inset-0 z-0', isFront ? 'cursor-default' : 'cursor-pointer')}
              />

              {/* --- Contenu : pseudo + accès au profil --------------------
                  `pointer-events-none` sur le conteneur laisse les clics
                  traverser jusqu'au bouton de fond ; on réactive les
                  évènements uniquement sur le lien. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 p-4">
                <div className="flex min-w-0 items-center gap-2">
                  {social.faIcon && (
                    <FontAwesomeIcon
                      icon={social.faIcon}
                      className="h-4 w-4 shrink-0 text-white"
                      aria-hidden="true"
                    />
                  )}
                  {/* `min-w-0` est indispensable : sans lui, un enfant flex
                      refuse de rétrécir sous sa largeur de contenu et
                      `truncate` (ellipsis) reste sans effet. */}
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-white">{social.handle}</div>
                    <div className="truncate text-xs text-white/80">{social.name}</div>
                  </div>
                </div>

                <a
                  href={social.url}
                  target="_blank"
                  // `noopener` empêche la page ouverte d'accéder à `window.opener`
                  // (protection contre le détournement d'onglet) ; `noreferrer`
                  // masque l'URL de provenance.
                  rel="noopener noreferrer"
                  // Sans `stopPropagation`, le clic remonterait et remonterait
                  // aussi la carte : effet visuel parasite pendant la navigation.
                  onClick={(event) => event.stopPropagation()}
                  className="pointer-events-auto shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#212121] transition-colors hover:bg-white/90"
                >
                  Voir le fil
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
