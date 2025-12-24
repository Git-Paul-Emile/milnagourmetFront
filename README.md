# Frontend Milna Gourmet

Ce projet contient le frontend de l'application Milna Gourmet, une plateforme de restauration en ligne développée avec React et Vite.

## Technologies utilisées

- **React** avec **TypeScript** pour l'interface utilisateur
- **Vite** pour le bundler et le développement rapide
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Axios** pour les appels API

## Installation

1. Assurez-vous d'avoir Node.js et pnpm installés.
2. Installez les dépendances :
   ```
   pnpm install
   ```

## Configuration

- Configurez l'URL de l'API backend dans les fichiers de configuration (ex. : `src/services/api.ts`).

## Lancement

- En mode développement :
  ```
  pnpm run dev
  ```
- Pour construire pour la production :
  ```
  pnpm run build
  ```
- Pour prévisualiser la build :
  ```
  pnpm run preview
  ```

## Structure du projet

- `src/` : Code source principal
  - `components/` : Composants réutilisables
  - `pages/` : Pages de l'application
  - `services/` : Services pour les appels API
  - `contexts/` : Contextes React pour la gestion d'état
  - `hooks/` : Hooks personnalisés
  - `utils/` : Utilitaires
- `public/` : Assets statiques

## Scripts disponibles

- `pnpm run dev` : Lance le serveur de développement
- `pnpm run build` : Construit l'application pour la production
- `pnpm run preview` : Prévisualise la build de production
- `pnpm run lint` : Vérifie le code avec ESLint

## Déploiement

Ce projet est configuré pour le déploiement sur Vercel (voir `vercel.json`).  
