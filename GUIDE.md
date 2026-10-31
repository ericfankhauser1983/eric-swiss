# eric.swiss — Guide du site

Site en ligne : https://eric-swiss.netlify.app (projet Netlify « eric-swiss », déployé automatiquement à chaque modification de la branche main).

Site statique (Astro), trilingue FR / EN / DE, prêt à être hébergé sur Netlify.

## 1. Mise en ligne (≈ 20 minutes)

1. Créer un compte gratuit sur **github.com** et y déposer ce dossier (nouveau dépôt « eric-swiss »).
2. Créer un compte gratuit sur **netlify.com** → *Add new site* → *Import from GitHub* → choisir le dépôt.
   Les réglages sont lus automatiquement (`netlify.toml`) : commande `npm run build`, dossier `dist`.
3. Netlify → *Domain management* → *Add domain* → `eric.swiss`. Chez le registraire du domaine,
   faire pointer les DNS vers Netlify (Netlify affiche les valeurs exactes). HTTPS est automatique.
4. **Recevoir les simulations par e-mail** : Netlify → *Forms* → activer la détection des formulaires,
   puis *Form notifications* → *Email notification* → formulaire `simulation` → votre adresse.
   (Alternative hors Netlify : clé gratuite sur web3forms.com à coller dans `src/config/site.ts`, `FORM`.)
5. **Google** : ajouter le site dans Google Search Console et y soumettre `https://eric.swiss/sitemap.xml`.

## 2. Où modifier quoi

| Je veux modifier…                                   | Fichier                                         |
|-----------------------------------------------------|-------------------------------------------------|
| E-mail, téléphone, Calendly, réseaux, photos       | `src/config/site.ts`                            |
| Textes d'une page (par langue)                      | `src/content/pages/<fr|en|de>/<page>.yaml`      |
| Menus, boutons, libellés du simulateur              | `src/i18n/ui.ts`                                |
| Valeurs par défaut du simulateur                    | `src/components/Simulator.astro` (`DEFAULTS`)   |
| Formules de calcul du simulateur                    | `src/scripts/sim-core.ts`                       |
| Adresses (URL) des pages                            | `src/config/site.ts` (`ROUTES`)                 |
| Couleurs, typographies                              | `src/styles/global.css`                         |
| Logos                                               | `public/images/`                                |

Fichiers de pages : `home`, `invest` (immobilier), `consulting`, `board`, `about` (parcours),
`team` (équipe), `misc` (simulateur, rendez-vous, blog, mentions légales, confidentialité).

**Photos** : déposer les fichiers dans `public/images/photos/`, puis indiquer leur chemin dans
`PHOTOS` (`src/config/site.ts`). Photos de l'équipe : champ `photo` de chaque membre dans
`src/content/pages/<langue>/team.yaml`. Tant qu'une photo manque, un emplacement aux couleurs de la charte s'affiche.

**Équipe** : `src/content/pages/<langue>/team.yaml` (nom, rôle, activité, présentation, photo).

**Réseaux sociaux** : URLs dans `SOCIAL` (`src/config/site.ts`) — les icônes apparaissent automatiquement.

**Vidéos automatiques** : `VIDEOS` (`src/config/site.ts`, chaîne @ericfankh déjà configurée).
- YouTube : les dernières vidéos/shorts sont récupérées à chaque mise à jour du site. Pour une mise à jour
  quotidienne automatique : Netlify > Build & deploy > Build hooks > créer un hook, puis dans GitHub >
  Settings > Secrets > Actions, ajouter `NETLIFY_BUILD_HOOK` avec l'URL du hook (le fichier
  `.github/workflows/rebuild.yml` s'occupe du reste).
- Instagram : créer un flux gratuit sur behold.so et coller son identifiant → les derniers Reels s'affichent seuls.

**Vidéos en fond d'écran** : déposer des .mp4 courts et légers dans `public/videos/` puis renseigner
`HERO_VIDEOS` (`src/config/site.ts`), par ex. la skyline de Batumi de nuit pour la page Immobilier.

**Simulateur** : bornes et valeurs par défaut des curseurs dans `src/components/Simulator.astro` (`D`),
taux du crédit (7,5 %) et impôt sur la plus-value (5 % avant 24 mois) dans `src/scripts/sim-core.ts`.

## 3. Écrire un article de blog

Créer un fichier Markdown dans `src/content/blog/<langue>/mon-article.md` :

```markdown
---
title: "Titre de l'article"
description: "Résumé de 150 à 160 caractères pour Google."
date: 2026-11-15
translationKey: mon-article      # identique dans les 3 langues → les traductions sont reliées
tags: ["Géorgie", "Immobilier"]
---

Texte de l'article, ## Intertitres, listes, [liens](/fr/simulateur-investissement/)…
```

Le nom du fichier devient l'adresse : `eric.swiss/fr/blog/mon-article/`.
L'article apparaît automatiquement sur l'accueil, la page Blog, le flux RSS et le sitemap.

### Administration du blog sans code (optionnel)

Une interface d'édition est prête sur `eric.swiss/admin/` (Decap CMS).
Pour l'activer : dans `public/admin/config.yml`, remplacer `VOTRE-COMPTE-GITHUB/eric-swiss`,
puis Netlify → *Site configuration* → *Access & security* → *OAuth* → installer le fournisseur GitHub.

## 4. Référencement (SEO) intégré

- URLs traduites et optimisées par langue (ex. `/de/immobilien-investment-georgien/`)
- Balises `hreflang` sur chaque page + `x-default`, sitemap multilingue `sitemap.xml`
- Titres et descriptions uniques par page et par langue (dans les fichiers YAML, bloc `seo`)
- Données structurées schema.org : Person, WebSite, Service, Offer, BlogPosting, BreadcrumbList
- Open Graph / Twitter (aperçu lors des partages), `robots.txt`, flux RSS par langue
- Polices auto-hébergées, aucun cookie publicitaire, pages légères

## 5. Langue à l'ouverture

`eric.swiss/` redirige vers : la langue déjà choisie par le visiteur → sinon la langue de son
navigateur (FR / EN / DE) → sinon l'anglais.

## 6. Travailler en local (facultatif)

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère le site dans dist/
```
