<p align="center">
  <img src="img/logo.png" alt="ChromaPalette Logo">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg">
  <img src="https://img.shields.io/badge/built%20with-React-61dafb">
  <img src="https://img.shields.io/badge/Vite-powered-blueviolet">
</p>

ChromaPalette est une application minimaliste et rapide permettant de créer, organiser et exporter des palettes de couleurs.  
Elle a été conçue comme un outil simple, efficace et agréable à utiliser pour les développeurs, designers, artistes, ou toute personne manipulant régulièrement des couleurs.
Il est possible d'exporter ses palettes en *.png, mais aussi dans un format pratique pour le pixel-art (8 pixels de hauteur et 8 pixels de largeur par couleur).

## ✨ Fonctionnalités

<p align="center">
  <img src="img/screenshot.png" alt="ChromaPalette Screenshot">
</p>

- Création de palettes personnalisées
- Sauvegarde des palettes dans une bibliothèque locale
- Ajout, édition et suppression de couleurs  
- Copie rapide des valeurs hexadécimales
- Aperçu visuel instantané des teintes
- Export de palettes (normal + format pixel-art)
- Interface moderne basée sur React + Vite

## 📁 Structure du projet

```bash
ChromaPalette/
├─ components/
├─ services/
├─ img/
├─ App/
├─ types/
├─ metadata/
├─ node_modules/
├─ index.html
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

## 🚀 Installation

### Prérequis

- Node.js ≥ 18  
- npm ou yarn  

### Installation et lancement en développement

```bash
git clone https://github.com/a-langlais/ChromaPalette.git
cd ChromaPalette
npm install
npm run dev
```

L’application sera accessible via l’URL affichée par Vite (généralement http://localhost:3000)

## 🏗️ Build de production

```bash
npm run build
npm run preview
```

## 📄 Licence

Ce projet est sous licence MIT.
Vous êtes libre de l’utiliser, modifier et redistribuer dans les conditions prévues par la licence.
