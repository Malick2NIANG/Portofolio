# Portfolio — Malick Niang

Site statique en noir, blanc et orange, avec une scène 3D de particules (Three.js) qui se transforme à chaque chapitre : sphère, anneaux, grille, monogramme MN, galaxie.

## Voir le site

- **Le plus simple** : double-clique sur `index.html`. Tout est déjà assemblé dans `main.js`, aucune installation n'est nécessaire.
- **Avec un serveur local** : `npx serve .` puis ouvre http://localhost:3000.

## Modifier le code

Le code source est dans `src/app.js`. Après une modification :

```bash
npm install      # une seule fois
npm run build    # régénère main.js
npm run dev      # ou : régénère main.js à chaque enregistrement
```

- Textes en français : dans `index.html`.
- Textes en anglais : objet `EN` au début de `src/app.js`, mêmes clés que les attributs `data-i18n`.
- Couleurs des deux thèmes : variables en haut de `styles.css`.
- Formes 3D et place de l'objet par chapitre : fonctions `sphere`, `rings`, `lattice`, `monogram`, `galaxy` et tableaux `PLACE_X`, `PLACE_S`, `PLACE_A` dans `src/app.js`.
- Logo : `assets/logo.png` (et `logo.webp`), favicon : `assets/favicon.png`.

## Fonctionnalités

- Thème sombre (noir dominant) et clair (blanc dominant), choix mémorisé, thème du système par défaut.
- Français et anglais, choix mémorisé.
- Écran de démarrage, curseur personnalisé, boutons magnétiques, titres qui se décodent, barre de progression et repère des chapitres.
- Démo de recherche en langage naturel.
- Accessibilité : clavier, réglage « réduire les animations » respecté, polices auto-hébergées.

## Mettre en ligne gratuitement

- **Cloudflare Pages** : dépôt GitHub → Workers & Pages → Create → Pages. Pas de commande de build, dossier de sortie `/`.
- **GitHub Pages** : Settings → Pages → branche `main`, dossier `/ (root)`.
