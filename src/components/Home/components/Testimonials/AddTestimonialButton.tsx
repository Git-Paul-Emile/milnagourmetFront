import { Plus } from 'lucide-react';

interface AddTestimonialButtonProps {
  onClick: () => void;
}

/**
 * Bouton d'ajout d'un témoignage : icône seule, circulaire, sans bordure.
 *
 * Le libellé ayant disparu de l'écran, il doit être fourni autrement :
 * `aria-label` pour les lecteurs d'écran, `title` pour l'infobulle au
 * survol sur ordinateur. Sans eux, le bouton serait annoncé « bouton »
 * et resterait une énigme pour une partie des visiteurs.
 *
 * 48 px de côté (`h-12 w-12`) : au-dessus des 44 px recommandés comme
 * cible tactile minimale.
 *
 * ⚠️ Icône en blanc à la demande, par cohérence visuelle avec les autres
 * boutons du site (ScrollToTop, modale de connexion) qui font déjà ce
 * choix. À savoir : sur le fond `--button` (#43A2F2), le blanc donne un
 * contraste de 2,73:1, en dessous du seuil de 3:1 que le WCAG demande
 * pour un élément graphique porteur de sens. Le jeton
 * `--button-foreground` atteignait 5,8:1.
 *
 * Si l'accessibilité redevient un critère, la piste la plus simple est
 * d'inverser le bouton : fond `bg-primary` (#0D7F87) et icône blanche,
 * ce qui donne un contraste fort ET conforme.
 */
export function AddTestimonialButton({ onClick }: AddTestimonialButtonProps) {
  return (
    <div className="text-center mt-12">
      <button
        onClick={onClick}
        aria-label="Soumettre un témoignage"
        title="Soumettre un témoignage"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-button text-white shadow-lg transition-all duration-300 hover:bg-button-hover hover:text-white hover:shadow-xl active:scale-95"
      >
        <Plus className="h-6 w-6 text-white" aria-hidden="true" />
      </button>
    </div>
  );
}
