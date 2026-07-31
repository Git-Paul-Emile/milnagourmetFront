import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),

    /* ================================================================
       PROGRESSIVE WEB APP
       ================================================================
       Une PWA est un site que le navigateur sait installer sur l'écran
       d'accueil et lancer sans barre d'adresse. Deux pièces suffisent :

         1. le MANIFESTE  — une fiche d'identité JSON (nom, icônes,
            couleurs) que le navigateur lit pour proposer l'installation ;
         2. le SERVICE WORKER — un script qui s'exécute en arrière-plan,
            entre l'application et le réseau, et qui peut répondre depuis
            un cache. C'est lui qui rend l'app rapide et utilisable hors
            connexion.

       `vite-plugin-pwa` génère les deux au build via Workbox. On ne
       écrit pas le service worker à la main : un cache mal invalidé
       sert des versions périmées pendant des semaines, et c'est
       l'erreur la plus fréquente sur les PWA artisanales.
       ================================================================ */
    VitePWA({
      /* `prompt` (et non `autoUpdate`) : le nouveau service worker
         attend l'accord de l'utilisateur avant de prendre la main.
         Sans cela, un rechargement forcé pourrait survenir en plein
         tunnel de commande et vider le panier en cours. */
      registerType: "prompt",

      /* L'enregistrement du service worker est fait par le composant
         `UpdatePrompt` via `useRegisterSW`. On désactive donc
         l'injection automatique du script par le plugin : sans cela le
         worker serait enregistré deux fois, et l'invite de mise à jour
         pourrait ne jamais se déclencher (le premier enregistrement
         appliquerait la nouvelle version avant que le hook ne la voie). */
      injectRegister: null,

      /* Active la PWA en `npm run dev` pour pouvoir la tester sans
         build. `type: module` est requis par les navigateurs pour un
         service worker servi en mode développement. */
      devOptions: {
        enabled: true,
        type: "module",
      },

      /* Fichiers du dossier public à précacher en plus du build. */
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "icon.png",
        "robots.txt",
      ],

      // ------------------------------------------------------------
      // Manifeste
      // ------------------------------------------------------------
      manifest: {
        name: "Milna Gourmet — Le Salon du Yaourt",
        // Affiché sous l'icône : 12 caractères maximum sur Android,
        // au-delà le nom est tronqué avec des points de suspension.
        short_name: "Milna",
        description:
          "Yaourts gourmets, créations personnalisées et livraison à Libreville. Paiement à la livraison.",
        lang: "fr",
        dir: "ltr",
        // L'app démarre à la racine. `?source=pwa` permet de distinguer
        // les lancements depuis l'icône dans vos statistiques.
        start_url: "/?source=pwa",
        // Limite la navigation dans la fenêtre installée au site.
        scope: "/",
        // `standalone` masque la barre d'adresse : l'app ressemble à une
        // application native.
        display: "standalone",
        orientation: "portrait",
        // Couleur de la barre système Android une fois installée.
        theme_color: "#0D7F87",
        // Couleur de l'écran de démarrage, avant le premier rendu.
        background_color: "#FFFFFF",
        categories: ["food", "shopping", "lifestyle"],
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          /* Icônes « maskable » : Android impose sa propre forme
             (cercle, carré arrondi, goutte…) selon le lanceur et rogne
             l'image. Ces variantes gardent le logo dans la zone sûre
             centrale pour n'être jamais amputées. */
          {
            src: "/icons/icon-maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        /* Raccourcis accessibles par appui long sur l'icône installée. */
        shortcuts: [
          {
            name: "Voir le catalogue",
            short_name: "Catalogue",
            url: "/?source=pwa-shortcut#produits",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Mon compte",
            short_name: "Compte",
            url: "/profile?source=pwa-shortcut",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
        ],
      },

      // ------------------------------------------------------------
      // Stratégies de cache (Workbox)
      // ------------------------------------------------------------
      workbox: {
        /* Précache : fichiers téléchargés dès l'installation, ce qui
           permet à l'app de s'ouvrir instantanément et hors connexion. */
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

        /* La vidéo du hero pèse ~7,5 Mo. La précacher imposerait ce
           téléchargement à chaque visiteur dès la première seconde, sur
           des connexions mobiles souvent limitées. Elle reste servie
           normalement par le réseau. */
        globIgnores: ["**/videos/**", "**/*.mp4"],

        /* Plafond par fichier précaché. 3 Mo laisse passer les gros
           chunks JS sans absorber un média volumineux par accident. */
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,

        /* Toute navigation (/, /profile, /mentions-legales…) est servie
           depuis index.html : c'est le pendant du `historyApiFallback`
           d'une SPA, indispensable pour que l'app s'ouvre hors ligne sur
           n'importe quelle URL. */
        navigateFallback: "/index.html",
        /* …sauf les appels API et la documentation, qui doivent aller au
           réseau et non recevoir du HTML. */
        navigateFallbackDenylist: [/^\/api\//, /^\/api-docs/],

        /* Le service worker prend la main immédiatement après l'accord
           de l'utilisateur, sans attendre la fermeture de tous les
           onglets. */
        clientsClaim: true,
        skipWaiting: false,

        runtimeCaching: [
          {
            /* CATALOGUE ET CONTENUS DE SITE — lecture seule.
               `StaleWhileRevalidate` : on répond immédiatement avec la
               version en cache (affichage instantané) tout en allant
               chercher la version fraîche en arrière-plan pour la
               prochaine fois. Compromis idéal pour des données qui
               changent peu et dont une seconde de retard est sans
               conséquence. */
            /* Motif ANCRÉ sur le début de l'URL (`^https?://…`).
               Workbox ignore délibérément toute expression régulière
               qui ne matche pas depuis le premier caractère lorsqu'il
               s'agit d'une requête vers un AUTRE domaine — garde-fou
               contre les motifs trop larges. Or le front appelle
               `https://…onrender.com/api/…` : un motif commençant par
               `/api/` ne s'appliquerait donc jamais en production.
               `[^/]+` couvre indifféremment le domaine de production et
               `localhost` en développement. */
            urlPattern: /^https?:\/\/[^/]+\/api\/(products|categories|creation|site|config|services|delivery-zones)(\/|$|\?)/,
            method: "GET",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "milna-catalogue",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 h
              },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            /* IMAGES CLOUDINARY.
               `CacheFirst` : une image est immuable (son URL contient un
               identifiant de version). Inutile d'interroger le réseau,
               on sert directement le cache. Gain le plus visible sur
               connexion lente. */
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "milna-images",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            /* POLICES GOOGLE — immuables et volumineuses. */
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "milna-polices",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            /* DONNÉES PERSONNELLES ET ÉCRITURES — jamais de cache.
               Panier, commandes, authentification, fidélité, comptes :
               servir une version périmée afficherait un mauvais total ou
               les données d'une session précédente. `NetworkOnly` est
               ici un choix de correction, pas de performance. */
            urlPattern: /^https?:\/\/[^/]+\/api\/(auth|cart|orders|loyalty|users|upload)(\/|$|\?)/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          /* IMPORTANT : ne JAMAIS séparer React des librairies qui en dépendent au
             niveau module (@radix-ui, lucide-react, recharts, react-router,
             @tanstack, react-hook-form…). L'ancien découpage faisait s'exécuter
             vendor-radix avant l'initialisation de React en production :
             "TypeError: Cannot read properties of undefined (reading 'useLayoutEffect')"
             → page blanche. On ne sépare que des librairies 100 % indépendantes de React. */
          if (id.includes("xlsx")) return "vendor-xlsx";
          if (id.includes("@fortawesome") && !id.includes("react-fontawesome")) return "vendor-fontawesome";
          if (id.includes("date-fns")) return "vendor-date";
          if (id.includes("zod")) return "vendor-zod";
          // React + tout l'écosystème React dans un seul chunk : ordre d'exécution garanti
          return "vendor";
        },
      },
    },
  },
}));
