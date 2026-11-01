/**
 * Brevo — ajoute automatiquement à la newsletter les visiteurs du simulateur qui l'ont demandé.
 *
 * Netlify appelle cette fonction à chaque envoi du formulaire « simulation » (Netlify Forms).
 * Seuls les visiteurs qui ont coché « newsletter » sont envoyés à Brevo (prénom, nom, e-mail, WhatsApp) — attributs PRENOM, NOM, SMS, WHATSAPP du compte Brevo.
 *
 * Réglages (Netlify > Site configuration > Environment variables) :
 *   BREVO_API_KEY     clé API Brevo (Brevo > SMTP & API > Clés API)          — obligatoire
 *   BREVO_LIST_ID     identifiant numérique de la liste newsletter           — obligatoire
 *   BREVO_LIST_ID_EN  liste pour les visiteurs anglophones                   — facultatif
 *   BREVO_LIST_ID_DE  liste pour les visiteurs germanophones                 — facultatif
 * Sans clé ou sans liste, la fonction ne fait rien (le formulaire fonctionne normalement).
 */
const API = 'https://api.brevo.com/v3/contacts';

export const handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || '{}');
    const d = payload?.data || {};
    const form = payload?.form_name || d['form-name'];
    if (form !== 'simulation' || d.newsletter !== 'oui') return ok('ignored');

    const key = process.env.BREVO_API_KEY;
    const lang = String(d.langue || 'fr').toLowerCase();
    const listId = Number(process.env[`BREVO_LIST_ID_${lang.toUpperCase()}`] || process.env.BREVO_LIST_ID);
    if (!key || !listId) { console.warn('Brevo : BREVO_API_KEY ou BREVO_LIST_ID manquant'); return ok('not configured'); }

    const email = String(d.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ok('invalid email');
    const phone = String(d.whatsapp || '').replace(/[^\d+]/g, '');

    const attributes = { PRENOM: String(d.prenom || '').trim(), NOM: String(d.nom || '').trim() };
    const withPhone = /^\+[1-9]\d{6,14}$/.test(phone) ? { ...attributes, SMS: phone, WHATSAPP: phone } : attributes;

    let r = await send(key, { email, attributes: withPhone, listIds: [listId], updateEnabled: true });
    // Numéro refusé (déjà utilisé par un autre contact, format…) : on enregistre au moins l'e-mail
    if (!r.ok && withPhone !== attributes) {
      console.warn('Brevo : numéro refusé, nouvel essai sans téléphone —', await r.text());
      r = await send(key, { email, attributes, listIds: [listId], updateEnabled: true });
    }
    if (!r.ok) { console.error('Brevo : erreur', r.status, await r.text()); return ok('brevo error'); }
    console.log(`Brevo : ${email} ajouté à la liste ${listId}`);
    return ok('added');
  } catch (e) {
    console.error('Brevo : exception', e);
    return ok('exception');
  }
};

const send = (key, body) => fetch(API, {
  method: 'POST',
  headers: { 'api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(body),
});
const ok = (msg) => ({ statusCode: 200, body: msg });
