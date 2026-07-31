import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/useApp';
import { useAuth } from '@/hooks/useAuth';
import { useShellUi } from '@/contexts/useShellUi';
import { useIsStandalone } from '@/hooks/useIsStandalone';
import { useSectionActive } from '@/hooks/useSectionActive';

/**
 * Barre de navigation basse, affichée uniquement en mode installé (PWA).
 *
 * POURQUOI SEULEMENT EN PWA
 * -------------------------
 * Dans un navigateur, l'utilisateur dispose déjà des boutons Précédent /
 * Suivant et de la barre d'adresse. Une barre fixe en bas y ajouterait
 * une seconde couche de navigation, en concurrence avec l'en-tête, et
 * mangerait de la hauteur d'écran. Une fois l'application installée, ces
 * repères disparaissent : la barre devient le principal moyen de
 * circuler, comme dans une application native.
 *
 * CHOIX DES CINQ ENTRÉES
 * ----------------------
 * Accueil, Panier et Profil ont été demandés. Les deux autres sont
 * « Catalogue » (le point d'entrée de l'achat) et « Créer » (la création
 * personnalisée, fonctionnalité signature du produit, autrement enterrée
 * au milieu de la page d'accueil).
 *
 * Le panier occupe la position centrale surélevée : c'est le geste le
 * plus fréquent et la cible la plus facile à atteindre au pouce.
 */

/** Sections de la page d'accueil surveillées pour l'état actif. */
const SECTIONS = ['home', 'catalog'] as const;

interface EntreeNav {
  cle: string;
  libelle: string;
  Icone: typeof Home;
  /** Ancre sur la page d'accueil. */
  ancre?: string;
  /** Route dédiée. */
  route?: string;
  /**
   * Ouvre directement une fenêtre plutôt que de naviguer.
   * « Créer » n'amène pas à une section : elle ouvre le configurateur,
   * ce qui économise un défilement puis un second appui.
   */
  ouvre?: 'creation';
}

const ENTREES_GAUCHE: EntreeNav[] = [
  { cle: 'home', libelle: 'Accueil', Icone: Home, ancre: 'home' },
  { cle: 'catalog', libelle: 'Catalogue', Icone: LayoutGrid, ancre: 'catalog' },
];

const ENTREES_DROITE: EntreeNav[] = [
  { cle: 'creation', libelle: 'Créer', Icone: Sparkles, ouvre: 'creation' },
  { cle: 'profil', libelle: 'Profil', Icone: User, route: '/profile' },
];

export function BottomNav() {
  const estInstallee = useIsStandalone();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { state } = useApp();
  const { isAuthenticated } = useAuth();
  const { ouvrirPanier, ouvrirAuth, ouvrirCreation, creationOuverte } = useShellUi();

  const surAccueil = pathname === '/';
  const sectionActive = useSectionActive(SECTIONS, estInstallee && surAccueil);

  /* Réserve la hauteur de la barre en bas de page. Sans cela, le dernier
     élément de chaque page (bouton de commande, pied de page) resterait
     masqué derrière elle. La classe est posée sur `body` pour bénéficier
     à toutes les pages sans les modifier une à une. */
  useEffect(() => {
    if (!estInstallee) return;
    document.body.classList.add('has-bottom-nav');
    return () => document.body.classList.remove('has-bottom-nav');
  }, [estInstallee]);

  /**
   * Rejoint une section de la page d'accueil.
   * Si l'on se trouve sur une autre page, on y navigue d'abord : le
   * défilement est alors différé au rendu suivant, sinon la section
   * n'existe pas encore dans le DOM.
   */
  const allerVersAncre = useCallback(
    (ancre: string) => {
      const defiler = () => {
        document.getElementById(ancre)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      if (surAccueil) {
        defiler();
      } else {
        navigate('/');
        requestAnimationFrame(defiler);
      }
    },
    [navigate, surAccueil]
  );

  const activer = useCallback(
    (entree: EntreeNav) => {
      if (entree.ouvre === 'creation') {
        /* Le configurateur est monté par la section « Création » de la
           page d'accueil. Depuis une autre page il faut donc y revenir
           d'abord ; l'état vivant dans le contexte (au-dessus du
           routeur), il survit à la navigation. */
        if (!surAccueil) navigate('/');
        ouvrirCreation();
        return;
      }

      if (entree.route) {
        // Le profil n'a de sens qu'une fois connecté : on propose la
        // connexion plutôt que de rediriger vers une page vide.
        if (entree.route === '/profile' && !isAuthenticated) {
          ouvrirAuth('login');
          return;
        }
        navigate(entree.route);
        return;
      }
      if (entree.ancre) allerVersAncre(entree.ancre);
    },
    [allerVersAncre, isAuthenticated, navigate, ouvrirAuth, ouvrirCreation, surAccueil]
  );

  const estActive = useCallback(
    (entree: EntreeNav) => {
      if (entree.ouvre === 'creation') return creationOuverte;
      if (entree.route) return pathname === entree.route;
      return surAccueil && sectionActive === entree.ancre;
    },
    [creationOuverte, pathname, sectionActive, surAccueil]
  );

  if (!estInstallee) return null;

  const nombreArticles = state.cart.itemCount;

  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40',
        // Pleine largeur, coins supérieurs arrondis comme sur la maquette.
        'rounded-t-3xl border-t border-border bg-card/95 backdrop-blur-md',
        'shadow-[0_-4px_24px_-8px_hsl(var(--primary)/0.25)]',
        /* Indispensable : le bouton panier déborde au-dessus de la barre.
           Le moindre `overflow: hidden` sur ce conteneur le rognerait. */
        'overflow-visible',
        /* `env(safe-area-inset-bottom)` réserve la place de la barre
           gestuelle des iPhone récents. Sans elle, les libellés passent
           sous le trait blanc du bas de l'écran. */
        'pb-[env(safe-area-inset-bottom)]'
      )}
    >
      {/* La colonne centrale est dimensionnée sur le cercle (64 px) au lieu
          de prendre un cinquième de la largeur. Comme elle ne porte plus de
          libellé, la place ainsi libérée profite aux quatre textes, qui
          gagnent chacun quelques pixels de respiration. */}
      <div className="grid h-16 grid-cols-[1fr_1fr_4rem_1fr_1fr] items-end overflow-visible">
        {ENTREES_GAUCHE.map((entree) => (
          <BoutonNav key={entree.cle} entree={entree} actif={estActive(entree)} onClick={activer} />
        ))}

        {/* Panier — bouton central surélevé */}
        <button
          type="button"
          onClick={ouvrirPanier}
          aria-label={
            nombreArticles > 0
              ? `Ouvrir le panier, ${nombreArticles} article${nombreArticles > 1 ? 's' : ''}`
              : 'Ouvrir le panier'
          }
          className="relative flex h-full min-w-0 flex-col items-center justify-end outline-none"
        >
          <span
            className={cn(
              /* Cercle CENTRÉ sur la bordure supérieure : `-top-7` vaut la
                 moitié du diamètre (`h-14` = 56 px), donc 28 px au-dessus
                 et 28 px en dessous du trait.
                 Règle à conserver si le diamètre évolue : l'offset doit
                 toujours valoir la moitié de la hauteur. */
              'absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full',
              'bg-primary text-primary-foreground',
              'shadow-lg shadow-primary/40',
              /* L'anneau à la couleur du fond détache le bouton de la
                 barre, comme le liseré blanc de la maquette. */
              'ring-4 ring-background',
              'transition-transform duration-200 active:scale-95'
            )}
          >
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />

            {nombreArticles > 0 && (
              <span
                className={cn(
                  'absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center',
                  'rounded-full border-2 border-background bg-destructive px-1',
                  'text-[10px] font-bold leading-none text-destructive-foreground'
                )}
              >
                {nombreArticles > 99 ? '99+' : nombreArticles}
              </span>
            )}
          </span>

          {/* Pas de libellé sous le cercle : l'icône du sac est
              universellement comprise, et l'espace ainsi rendu profite aux
              quatre autres textes. L'intitulé reste porté par `aria-label`
              pour les lecteurs d'écran. */}
        </button>

        {ENTREES_DROITE.map((entree) => (
          <BoutonNav key={entree.cle} entree={entree} actif={estActive(entree)} onClick={activer} />
        ))}
      </div>
    </nav>
  );
}

/** Entrée latérale : icône au-dessus, libellé aligné avec celui du panier. */
function BoutonNav({
  entree,
  actif,
  onClick,
}: {
  entree: EntreeNav;
  actif: boolean;
  onClick: (entree: EntreeNav) => void;
}) {
  const { Icone, libelle } = entree;

  return (
    <button
      type="button"
      onClick={() => onClick(entree)}
      aria-current={actif ? 'page' : undefined}
      className={cn(
        /* `min-w-0` : sans lui une colonne de grille refuse de descendre
           sous la largeur de son contenu et pousse ses voisines — c'est
           ainsi qu'un libellé long finissait sous le bouton panier. */
        /* `px-1.5` garantit une gouttière de 12 px entre deux libellés
           voisins : « Accueil » et « Catalogue » ne peuvent plus se
           frôler, même avec une police au rendu plus large que prévu. */
        'flex h-full min-w-0 flex-col items-center justify-end gap-1 px-1.5 pb-2 outline-none',
        'transition-colors duration-200',
        actif ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      <Icone
        className={cn('h-5 w-5 shrink-0 transition-transform', actif && 'scale-110')}
        aria-hidden="true"
      />
      <span
        className={cn(
          /* Dimensionnement calé sur le libellé le plus long,
             « Catalogue » (9 caractères). Le seuil de bascule est à
             400 px et non 360 : entre les deux, 11 px suffisait à
             rapprocher « Accueil » et « Catalogue » jusqu'au contact.

             `whitespace-nowrap` interdit le retour à la ligne, qui
             désalignerait ce libellé des autres ; `truncate` n'est qu'un
             dernier recours si une traduction future allongeait le texte. */
          'max-w-full truncate whitespace-nowrap leading-none tracking-tight',
          'text-[10px] min-[400px]:text-[11px]',
          actif ? 'font-semibold' : 'font-medium'
        )}
      >
        {libelle}
      </span>
    </button>
  );
}
