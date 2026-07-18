# Vidéos servies en statique

Ce dossier est servi tel quel par Vite : un fichier `x.mp4` placé ici est
accessible à l'URL `/videos/x.mp4`.

## Vidéo de fond du hero

Fichier attendu : **`hero-yaourt.mp4`**

Référencé par la constante `HERO_VIDEO` dans
`src/components/Home/HeroSection.tsx`.

Tant que le fichier est absent, la section hero reste fonctionnelle :
l'image `poster` (la bannière configurée dans le back-office, ou la
bannière locale par défaut) s'affiche à la place.

### Comment l'ajouter

1. Télécharger la vidéo depuis la banque de médias avec un compte disposant
   de la licence adéquate, puis vérifier les conditions d'utilisation et
   l'attribution éventuellement requise.
2. Renommer le fichier en `hero-yaourt.mp4` et le déposer dans ce dossier.

### Recommandations techniques

- **Format** : MP4 (H.264 + AAC) pour la compatibilité la plus large.
  Ajouter une source WebM si l'on veut réduire le poids.
- **Poids** : viser moins de 5 Mo. Une vidéo de fond est chargée sur la page
  d'accueil : au-delà, le temps d'affichage se dégrade nettement sur mobile.
- **Durée** : 10 à 20 secondes, avec un raccord propre entre la fin et le
  début (la lecture est en boucle).
- **Résolution** : 1920×1080 suffit. Le rendu est en `object-cover`, donc
  l'image est recadrée selon la taille de l'écran : garder le sujet centré.
- **Audio** : inutile, la vidéo est muette (`muted`, requis par les
  navigateurs pour autoriser la lecture automatique). Supprimer la piste
  audio allège le fichier.

### Accessibilité

La lecture automatique est désactivée pour les personnes ayant activé
« réduire les animations » dans leur système (WCAG 2.2.2) ; l'image poster
est alors affichée à la place.
