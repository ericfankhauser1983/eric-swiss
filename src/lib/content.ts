import { getEntry, getCollection } from 'astro:content';
import { marked } from 'marked';
import { LANGS, path, type Lang, type RouteKey } from '../config/site';

export async function page(lang: Lang, name: string): Promise<any> {
  const e = await getEntry('pages', `${lang}/${name}`);
  if (!e) throw new Error(`Contenu manquant : src/content/pages/${lang}/${name}.yaml`);
  return e.data;
}

export function alternates(key: RouteKey): Record<Lang, string> {
  return Object.fromEntries(LANGS.map((l) => [l, path(key, l)])) as Record<Lang, string>;
}

export function md(s: string = ''): string {
  return marked.parse(s, { async: false }) as string;
}

export async function posts(lang: Lang) {
  const all = await getCollection('blog', (p) => p.id.startsWith(`${lang}/`) && !p.data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postSlug(id: string) {
  return id.split('/').slice(1).join('/');
}

export function postHref(lang: Lang, id: string) {
  return `${path('blog', lang)}${postSlug(id)}/`;
}

export function readingTime(body: string = '') {
  return Math.max(1, Math.round(body.split(/\s+/).length / 220));
}
