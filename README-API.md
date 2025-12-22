# Milna Gourmet - API avec JSON Server

## 🚀 Démarrage rapide

### Installation des dépendances
```bash
cd front
npm install
```

### Lancement des serveurs (recommandé)
```bash
npm run dev:full
```
Cette commande lance simultanément :
- **JSON Server** sur `http://localhost:3001` (API)
- **Vite Dev Server** sur `http://localhost:8080` (Application)

### Lancement séparé (optionnel)
```bash
# Terminal 1 - API
npm run server

# Terminal 2 - Application
npm run dev
```

## 📊 Structure des données

Le fichier `data.json` contient toutes les données de l'application :

### Endpoints disponibles

| Endpoint | Description | Méthodes |
|----------|-------------|----------|
| `/products` | Produits (yaourts crémeux et liquides) | GET, POST, PUT, PATCH, DELETE |
| `/creationSizes` | Tailles pour les créations personnalisées | GET |
| `/creationOptions` | Options de création (fruits, sauces, céréales) | GET |
| `/about` | Informations "À propos" | GET, PATCH |
| `/testimonials` | Témoignages clients | GET, POST, PUT, PATCH, DELETE |
| `/contact` | Informations de contact | GET, PATCH |
| `/socialMedia` | Liens réseaux sociaux | GET, PATCH |
| `/branding` | Informations de marque (logo, slogan) | GET, PATCH |
| `/users` | Utilisateurs | GET, POST, PUT, PATCH, DELETE |
| `/orders` | Commandes | GET, POST, PUT, PATCH, DELETE |

### Exemples d'utilisation

#### Récupérer tous les produits
```bash
GET http://localhost:3001/products
```

#### Ajouter un nouveau produit
```bash
POST http://localhost:3001/products
Content-Type: application/json

{
  "id": "nouveau-produit",
  "name": "Nouveau Yaourt",
  "category": "cremeux",
  "price": 500,
  "description": "Description du produit",
  "image": "/src/assets/yogurt-nature.jpg",
  "available": true
}
```

#### Modifier un produit existant
```bash
PATCH http://localhost:3001/products/existing-id
Content-Type: application/json

{
  "price": 600,
  "available": false
}
```

## 🔧 Fonctionnalités de l'API

### Produits
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Filtrage par catégorie
- ✅ Gestion des stocks (available/disponible)

### Créations personnalisées
- ✅ Tailles prédéfinies (moyen: 2500F, maxi: 3500F)
- ✅ Options dynamiques (fruits, sauces, céréales)
- ✅ Calcul automatique des prix

### Utilisateurs et authentification
- ✅ Inscription/connexion simulée
- ✅ Gestion des profils utilisateur
- ✅ Historique des commandes par utilisateur

### Commandes
- ✅ Création de commandes
- ✅ Suivi des statuts (pending, confirmed, preparing, ready, delivered)
- ✅ Liaison avec les utilisateurs

### Contenu dynamique
- ✅ Section "À propos" modifiable
- ✅ Témoignages clients
- ✅ Informations de contact
- ✅ Liens réseaux sociaux
- ✅ Branding (logo, slogan)

## 🛠️ Développement

### Architecture
```
front/
├── data.json          # Base de données JSON
├── src/
│   ├── services/
│   │   └── api.ts     # Service API centralisé
│   ├── types/
│   │   └── index.ts   # Types TypeScript
│   └── components/    # Composants utilisant l'API
```

### Service API
Le fichier `src/services/api.ts` fournit une interface TypeScript complète pour interagir avec l'API :

```typescript
import { api } from '@/services/api';

// Exemples d'utilisation
const products = await api.getProducts();
const user = await api.createUser(userData);
const order = await api.createOrder(orderData);
```

### Gestion des erreurs
L'API inclut une gestion d'erreur robuste avec fallback vers les données statiques en cas de problème de connexion.

## 📱 Interface utilisateur

L'application React utilise les données de l'API pour :
- ✅ Afficher le catalogue de produits
- ✅ Gérer les créations personnalisées
- ✅ Afficher les informations "À propos"
- ✅ Montrer les témoignages clients
- ✅ Gérer les utilisateurs et commandes
- ✅ Afficher les informations de contact

## 🔄 Synchronisation

Toutes les modifications via l'API sont automatiquement sauvegardées dans `data.json` et persistent entre les redémarrages du serveur.

## 🚀 Déploiement

Pour la production, remplacez l'URL de l'API dans `src/services/api.ts` :

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://votre-api-production.com'
  : 'http://localhost:3001';
```

---

**Note**: Cette configuration utilise JSON Server pour le développement. En production, remplacez par une vraie API REST ou GraphQL.