/**
 * ============================================================
 *  CONFIGURATION GÉNÉRALE DU SITE — eric.swiss
 *  Tout ce qui est « réglage » se trouve ici : liens, e-mails,
 *  Calendly, langues, adresses des pages (slugs) et formulaire.
 * ============================================================
 */

export const SITE = {
  url: 'https://eric.swiss',
  name: 'Eric Fankhauser',
  tagline: '',
  email: 'eric.fankhauser@francefinance.ae',
  phone: '+971 58 536 2157',
  whatsapp: '971585362157', // sans + ni espaces, pour le lien wa.me
  partners: {
    ffi: 'https://francefinance.ae',
    advisoryBoard: 'https://www.advisoryboard.ch',
  },
};

/**
 * PHOTOS — déposer les fichiers dans public/images/photos/ puis indiquer leur chemin.
 * Tant qu'un chemin est vide, un emplacement aux couleurs de la charte s'affiche.
 */
export const PHOTOS = {
  heroPortrait: '/images/photos/eric-portrait.jpg', // portrait principal (accueil), format vertical
  aboutPortrait: '/images/photos/eric-geneve.jpg', // portrait page Parcours, format vertical
  invest: '/images/photos/invest-conference.jpg', // illustration Investissement immobilier
  consulting: '/images/photos/conseil-echange.jpg', // illustration Conseil stratégique
  board: '/images/photos/board-session.jpg', // illustration Advisory Board
  rugby: '/images/photos/rugby-iran.jpg', // passion sport / rugby (page Parcours)
  travel: '', // passion voyages (page Parcours) — laisser vide pour ne pas afficher de photo
  team: '/images/photos/equipe-ffi.jpg', // photo de groupe FFI
  /** Galerie « En images » de la page Parcours */
  gallery: [
    '/images/photos/g-conference.jpg',
    '/images/photos/g-scene.jpg',
    '/images/photos/g-orateur.jpg',
    '/images/photos/g-evenement.jpg',
    '/images/photos/g-gala.jpg',
    '/images/photos/g-networking.jpg',
    '/images/photos/g-discours.jpg',
    '/images/photos/g-sourire.jpg',
    '/images/photos/g-questions.jpg',
  ],
};

/**
 * RÉSEAUX SOCIAUX — coller l'URL complète de chaque profil (laisser vide pour masquer l'icône).
 */
export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/eric-fankhauser/',
  instagram: 'https://www.instagram.com/eric_fankh/',
  tiktok: 'https://www.tiktok.com/@eric.invest.immo',
  youtube: 'https://www.youtube.com/@ericfankh',
};

/**
 * VIDÉOS PUBLIÉES AUTOMATIQUEMENT SUR LE SITE
 *  - YouTube : indiquer l'identifiant de la chaîne (commence par « UC… », visible dans
 *    YouTube Studio > Paramètres > Chaîne > Paramètres avancés). Les dernières vidéos
 *    s'affichent alors automatiquement, sans autre manipulation.
 *  - Instagram (Reels) : créer un flux gratuit sur behold.so, puis coller ici l'identifiant
 *    du flux. Les dernières publications s'affichent automatiquement.
 */
export const VIDEOS = {
  youtubeHandle: 'ericfankh', // les dernières vidéos/shorts de la chaîne sont récupérées à chaque mise à jour du site
  youtubeChannelId: 'UCr9wh-LZuJoP5lJOPkYCXEQ',
  count: 3,
  /** Vidéos affichées si la récupération automatique échoue (identifiants YouTube) */
  fallback: ['X4EAmer2u0k', 'TmkByvxpV2A', 'JCC9DzLlmKA'],
  beholdFeedId: '',
};

/**
 * VIDÉOS EN FOND D'ÉCRAN (haut de page). Déposer des fichiers .mp4 courts (10–20 s, sans son, < 8 Mo)
 * dans public/videos/ et indiquer leur chemin. Laisser vide pour un fond animé aux couleurs de la charte.
 */
export const HERO_VIDEOS = {
  home: '', // ex. '/videos/tbilissi.mp4'
  invest: '', // ex. '/videos/batumi-nuit.mp4'
  consulting: '',
  board: '',
  about: '',
};

/** Langues du site. La première langue de repli est l'anglais. */
export const LANGS = ['fr', 'en', 'de'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LOCALES: Record<Lang, { label: string; short: string; og: string }> = {
  fr: { label: 'Français', short: 'FR', og: 'fr_CH' },
  en: { label: 'English', short: 'EN', og: 'en_GB' },
  de: { label: 'Deutsch', short: 'DE', og: 'de_CH' },
};

/** Liens de prise de rendez-vous Calendly */
export const CALENDLY = {
  /** Investissement immobilier : FR → /rdv, EN & DE → /meet */
  invest: {
    fr: 'https://calendly.com/eric_fankh/rdv',
    en: 'https://calendly.com/eric_fankh/meet',
    de: 'https://calendly.com/eric_fankh/meet',
  } as Record<Lang, string>,
  /** Conseil stratégique & Advisory Board */
  advisory: 'https://calendly.com/eric_fankh/echangeons-ensemble',
};

/**
 * Envoi des simulations par e-mail.
 *  - 'netlify'   : Netlify Forms (aucune clé requise si le site est hébergé sur Netlify ;
 *                  activer la notification e-mail dans Netlify > Forms > Notifications)
 *  - 'web3forms' : n'importe quel hébergeur ; renseigner la clé gratuite web3forms.com
 */
export const FORM = {
  provider: 'netlify' as 'netlify' | 'web3forms',
  web3formsKey: '', // ex. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  recipient: 'eric.fankhauser@francefinance.ae',
};

/**
 * Adresses (slugs) des pages, par langue — optimisées pour le référencement.
 * Modifier un slug ici le change partout (menus, sitemap, hreflang).
 */
export const ROUTES = {
  home: { fr: '', en: '', de: '' },
  invest: {
    fr: 'investissement-immobilier-georgie',
    en: 'real-estate-investment-georgia',
    de: 'immobilien-investment-georgien',
  },
  simulator: {
    fr: 'simulateur-investissement',
    en: 'investment-simulator',
    de: 'investitionsrechner',
  },
  consulting: {
    fr: 'conseil-strategique',
    en: 'strategic-consulting',
    de: 'strategieberatung',
  },
  board: { fr: 'advisory-board', en: 'advisory-board', de: 'advisory-board' },
  about: { fr: 'parcours', en: 'about', de: 'ueber-mich' },
  contact: { fr: 'rendez-vous', en: 'book-a-meeting', de: 'termin' },
  blog: { fr: 'blog', en: 'blog', de: 'blog' },
  legal: { fr: 'mentions-legales', en: 'legal-notice', de: 'impressum' },
  privacy: { fr: 'confidentialite', en: 'privacy', de: 'datenschutz' },
} satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof ROUTES;

export function path(key: RouteKey, lang: Lang): string {
  const slug = ROUTES[key][lang];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

export function absolute(p: string): string {
  return new URL(p, SITE.url).toString();
}

/** Page d'atterrissage « Investir en Géorgie » (lien à mettre dans les bios des réseaux sociaux) */
export const LANDING: Partial<Record<Lang, string>> = { fr: '/fr/georgie/', en: '/en/georgia/' };
