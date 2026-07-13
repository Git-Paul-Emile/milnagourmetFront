import { useState, useMemo, useEffect } from 'react';

/**
 * Pagination client-side d'une liste déjà filtrée/triée en mémoire.
 * Revient automatiquement à la page 1 dès que le contenu de `items` change
 * (nouvelle recherche, nouveau filtre, nouveau tri) pour éviter d'afficher
 * une page vide ou incohérente.
 */
export function usePagination<T>(items: T[], pageSize: number = 12) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Revenir à la première page quand la liste source change (recherche/filtre/tri)
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Filet de sécurité si la page courante dépasse le nombre de pages disponible
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    setPage,
    totalPages,
    pageSize,
    paginatedItems,
    total: items.length
  };
}
