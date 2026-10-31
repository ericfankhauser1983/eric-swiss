# Blog eric.swiss — ligne éditoriale et procédure quotidienne

## Rythme

- **Un article publié par jour.**
- Chaque matin à 8 h (heure de Tbilissi), Claude soumet à Eric **trois sujets**, un par rubrique, en recommandant celui du jour. Le but est d'alterner les rubriques.
- Eric valide un sujet, ou plusieurs, en le modifiant au besoin. L'article est alors rédigé puis programmé pour **le surlendemain** de la soumission (J+2).
- Si plusieurs articles tombent le même jour, les suivants sont décalés aux jours libres d'après.

## Rubriques (champ `category`)

| Valeur | Rubrique | Ligne |
|---|---|---|
| `immobilier` | Immobilier | Marchés immobiliers (Géorgie d'abord, puis EAU et Bali), fiscalité, financement, projets. **Source principale : le blog FFI** (https://www.francefinance.ae/blog, articles sous `/articles-blog/...`). Choisir un article FFI récent, pas encore repris sur eric.swiss, et le **réécrire entièrement** avec la voix et l'angle d'Eric, sans copier de phrases. Lien vers l'article FFI dans le champ `source`. |
| `geopolitique` | Géopolitique | Un regard **qui se distancie de la vision mainstream européenne** : la lecture du Caucase, du Golfe, de l'Asie, de la Turquie ou du Sud global sur l'actualité, vue de Tbilissi. On questionne le consensus européen avec des faits sourcés. On ne donne jamais un fait inventé ou non vérifié comme acquis, pas de propagande, pas d'attaque personnelle. Le lien avec l'investisseur ou l'entrepreneur doit rester concret. |
| `entrepreneuriat` | Entrepreneuriat | Le vécu d'entrepreneur d'Eric : création et revente de Swiss Auto Glass, Carglass, réorganisations, Advisory Board, implantation en Géorgie. Conseils concrets aux dirigeants de PME : stratégie, organisation, développement, performance, mental de compétiteur. |

## Priorité SEO

Le référencement du site vise deux thèmes : **l'investissement immobilier en Géorgie** et **le conseil d'entreprise et l'implantation en Géorgie**.
- Rubrique immobilier : viser des recherches comme « investir en Géorgie », « immobilier Batumi », « acheter un appartement à Tbilissi », « rendement locatif Géorgie », « fiscalité immobilière Géorgie ».
- Rubrique entrepreneuriat : une fois sur deux au moins, un sujet sur la création ou le développement d'une société en Géorgie (« créer une société en Géorgie », « fiscalité des entreprises en Géorgie », « ouvrir un compte bancaire en Géorgie », « s'implanter en Géorgie depuis la Suisse »).
- Mettre l'expression visée dans le titre, la description, le premier paragraphe et un intertitre, de façon naturelle.
- Ajouter au moins un lien interne vers la page Immobilier (`/fr/investissement-immobilier-georgie/`) ou Conseil (`/fr/conseil-entreprise-georgie/`), selon le sujet.

## Style

- Écrit à la première personne (« je ») : Eric, entrepreneur suisse installé à Tbilissi.
- Ton direct, humain et exigeant. Phrases courtes, pas de jargon creux.
- 700 à 1 100 mots, avec 3 à 5 intertitres `##`.
- Chiffres datés et sourcés. Pour l'actualité, rechercher les faits du jour (WebSearch) plutôt que de s'appuyer sur sa mémoire.
- Terminer par une ouverture vers l'action : lien vers le simulateur, la prise de rendez-vous, le conseil stratégique ou l'Advisory Board, selon la rubrique.
- Ne jamais écrire « France Finance » : toujours « FFI ».

## Fichiers

- Trois langues, une version par langue, reliées par la même `translationKey` :
  - `src/content/blog/fr/<slug-fr>.md`
  - `src/content/blog/en/<slug-en>.md`
  - `src/content/blog/de/<slug-de>.md`
- Les slugs sont en minuscules, avec des tirets, dans la langue de l'article.
- En-tête :

```yaml
---
title: "…"
description: "… (150 à 160 caractères, pour Google)"
date: 2026-11-02          # date de publication prévue (J+2)
translationKey: un-identifiant-commun
category: immobilier      # immobilier | geopolitique | entrepreneuriat
tags: ["Géorgie", "…"]
source: "https://www.francefinance.ae/articles-blog/…"   # facultatif
draft: true               # true tant que la date de publication n'est pas arrivée
---
```

- Liens internes FR : `/fr/simulateur-investissement/`, `/fr/rendez-vous/`, `/fr/conseil-entreprise-georgie/`, `/fr/investissement-immobilier-georgie/`, `/fr/advisory-board/`. Pour EN et DE, voir `ROUTES` dans `src/config/site.ts`.

## Publication automatique

Chaque matin, avant de soumettre les sujets, la tâche planifiée passe à `draft: false` tous les articles dont la `date` est aujourd'hui ou déjà passée. Elle fait ensuite un commit et un push sur `main`, et Netlify met le site en ligne.

## Journal des sujets

`blog-journal.md` liste les sujets proposés, validés et publiés, pour éviter les doublons et reprendre chaque article FFI une seule fois.
