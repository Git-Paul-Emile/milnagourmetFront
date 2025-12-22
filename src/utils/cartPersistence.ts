import { CartItem, AuthUser } from '@/types';

// Variable pour éviter les appels API simultanés
let isPersisting = false;

// Fonction helper pour persister une action spécifique du panier en backend
export const persistCartActionToBackend = async (
  action: 'add' | 'update' | 'remove' | 'clear',
  item?: CartItem,
  user?: AuthUser | null
) => {
  // Importer httpClient pour vérifier le token
  const { httpClient } = await import('@/services/httpClient');
  if (!user || isPersisting || !httpClient.hasToken()) return; // Ne persiste que si utilisateur connecté, token disponible et éviter les appels simultanés

  isPersisting = true;

  try {
    // Attendre un court instant pour éviter les appels trop fréquents
    await new Promise(resolve => setTimeout(resolve, 300));

    // Vérifier à nouveau que l'utilisateur est toujours connecté
    if (!user) {
      console.warn('Utilisateur déconnecté pendant la persistance, annulation');
      return;
    }

    // Ne pas persister les créations personnalisées pour add/update (elles sont gérées directement via l'API backend dans CustomCreation.tsx)
    // Mais permettre la suppression (remove) pour éviter les bugs
    if (item && item.id.includes('creation') && action !== 'remove') {
      // Les créations personnalisées sont persistées via l'API backend
      // (ex: CustomCreation.tsx appelle cartService.addCustomCreation).
      // On évite de provoquer une double persistance côté frontend.
      // Pour réduire le bruit en console, n'afficher ce message qu'en développement.
      // in Vite: import.meta.env.DEV (non défini dans Node) — on vérifie donc la présence.
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
          console.debug(`Persistance ignorée pour la création personnalisée: ${item.id} (gérée via API backend)`);
        }
      } catch (e) {
        // En cas d'environnement sans import.meta (sécurité), on n'écrit rien.
      }
      return;
    }

    const { cartService } = await import('@/services/cart');

    // Fonction helper pour extraire l'ID réel
    const extractProductId = (itemId: string) => {
      if (itemId.startsWith('creation-')) {
        // Pour les créations: "creation-123" -> "123"
        return itemId.substring(9);
      } else {
        // Pour les produits réguliers: "1-1234567890" -> "1"
        return itemId.split('-')[0];
      }
    };

    switch (action) {
      case 'add':
        if (item) {
          const productId = extractProductId(item.id);
          console.log(`Persistance: ajout de ${item.quantity} x ${productId}`);
          // La quantité est la quantité ajoutée, ce qui est correct pour le backend
          await cartService.addToCart({
            productId: productId,
            quantity: item.quantity
          });
        }
        break;
      case 'update':
        if (item) {
          const productId = extractProductId(item.id);
          console.log(`Persistance: mise à jour de ${productId} à ${item.quantity}`);
          // La quantité est la nouvelle quantité totale, ce qui est correct pour le backend
          await cartService.updateCartItem({
            productId: productId,
            quantity: item.quantity
          });
        }
        break;
      case 'remove':
        if (item) {
          if (item.id.startsWith('creation-')) {
            // Pour les créations personnalisées, utiliser l'endpoint dédié
            const creationId = item.id.substring(9); // "creation-123" -> "123"
            console.log(`Persistance: suppression de la création ${creationId}`);
            await cartService.removeCustomCreation(creationId);
          } else {
            // Pour les produits réguliers
            const productId = extractProductId(item.id);
            console.log(`Persistance: suppression de ${productId}`);
            await cartService.removeFromCart(productId);
          }
        }
        break;
      case 'clear':
        console.log('Persistance: vidage du panier');
        await cartService.clearCart();
        break;
    }
  } catch (error) {
    console.error('Erreur lors de la persistance du panier:', error);
    // En cas d'erreur d'authentification, ne pas bloquer l'UX
    if (error.message?.includes('Token') || error.message?.includes('authentification') || error.message?.includes('manquant')) {
      console.warn('Erreur d\'authentification lors de la persistance du panier, opération ignorée');
    }
  } finally {
    isPersisting = false;
  }
};