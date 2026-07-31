import { useEffect, useState } from 'react';

/**
 * Repère la section de la page actuellement à l'écran (« scroll spy »).
 *
 * Sert à colorer la bonne entrée de la barre de navigation quand
 * l'utilisateur fait défiler la page d'accueil, qui contient toutes les
 * sections les unes sous les autres.
 *
 * `IntersectionObserver` est préféré à un écouteur `scroll` : le
 * navigateur fait le calcul lui-même, hors du fil principal. Un
 * écouteur `scroll` se déclenche des dizaines de fois par seconde et
 * force un recalcul de mise en page à chaque appel — cause classique de
 * saccades sur mobile.
 *
 * @param ids      identifiants des sections à surveiller, dans l'ordre
 * @param actif    désactive l'observation quand elle est inutile
 * @returns        l'identifiant de la section visible, ou `null`
 */
export function useSectionActive(ids: readonly string[], actif = true): string | null {
  const [sectionActive, setSectionActive] = useState<string | null>(null);

  useEffect(() => {
    if (!actif || typeof window === 'undefined' || ids.length === 0) {
      setSectionActive(null);
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observateur = new IntersectionObserver(
      (entrees) => {
        /* Plusieurs sections peuvent être visibles simultanément.
           On retient celle qui occupe la plus grande part de l'écran :
           c'est celle que l'utilisateur estime « regarder ». */
        const visible = entrees
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setSectionActive(visible.target.id);
      },
      {
        /* La marge négative en haut et en bas restreint la zone de
           détection au tiers central de l'écran. Sans elle, une section
           à peine entrée par le bas serait déjà considérée active. */
        rootMargin: '-35% 0px -35% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observateur.observe(el));
    return () => observateur.disconnect();
  }, [ids, actif]);

  return sectionActive;
}
