import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LANGS, ROUTES, absolute, path, type Lang, type RouteKey } from '../config/site';
import { postHref } from '../lib/content';

/** Sitemap multilingue avec annotations hreflang (pages traduites liées entre elles) */
export const GET: APIRoute = async () => {
  const groups: Record<string, string>[] = [];
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    if (key === 'legal' || key === 'privacy') continue;
    groups.push(Object.fromEntries(LANGS.map((l) => [l, absolute(path(key, l))])));
  }
  const all = await getCollection('blog', (p) => !p.data.draft);
  const byKey: Record<string, Record<string, string>> = {};
  for (const p of all) {
    const l = p.id.split('/')[0] as Lang;
    const k = p.data.translationKey ?? p.id;
    (byKey[k] ??= {})[l] = absolute(postHref(l, p.id));
  }
  groups.push(...Object.values(byKey));
  const today = new Date().toISOString().slice(0, 10);
  const urls = groups.flatMap((g) =>
    Object.entries(g).map(([, loc]) => {
      const alts = Object.entries(g).map(([hl, href]) => `<xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`).join('');
      return `<url><loc>${loc}</loc><lastmod>${today}</lastmod>${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${absolute('/')}"/></url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
