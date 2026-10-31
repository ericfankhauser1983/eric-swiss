import type { APIRoute } from 'astro';
import { LANGS, SITE, absolute, path, type Lang } from '../../config/site';
import { t } from '../../i18n/ui';
import { posts, postHref } from '../../lib/content';

export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const list = await posts(lang);
  const items = list.map((p) => `<item><title>${esc(p.data.title)}</title><link>${absolute(postHref(lang, p.id))}</link><guid>${absolute(postHref(lang, p.id))}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.description)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(`${t(lang).blog.title} — ${SITE.name}`)}</title><link>${absolute(path('blog', lang))}</link><description>${esc(t(lang).blog.lead)}</description><language>${lang}</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
