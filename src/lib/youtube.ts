/**
 * Récupère les dernières vidéos d'une chaîne YouTube au moment de la construction du site.
 * Le site se reconstruit chaque jour (voir .github/workflows/rebuild.yml) : les nouvelles vidéos
 * apparaissent donc automatiquement, sans clé d'API.
 */
export interface YtVideo { id: string; title: string; published: string; short: boolean }

let cache: Promise<YtVideo[]> | null = null;

async function resolveChannelId(handle: string): Promise<string | null> {
  const r = await fetch(`https://www.youtube.com/@${handle}`, { headers: { 'Accept-Language': 'en' }, signal: AbortSignal.timeout(8000) });
  if (!r.ok) return null;
  const html = await r.text();
  const m = html.match(/"(?:channelId|externalId)":"(UC[\w-]{22})"/) || html.match(/channel\/(UC[\w-]{22})/);
  return m ? m[1] : null;
}

export function latestVideos(handle: string, channelId: string, count = 8): Promise<YtVideo[]> {
  if (cache) return cache;
  cache = (async () => {
    try {
      const id = channelId || (handle ? await resolveChannelId(handle) : null);
      if (!id) return [];
      const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, { signal: AbortSignal.timeout(8000) });
      if (!r.ok) return [];
      const xml = await r.text();
      const entries = xml.split('<entry>').slice(1);
      const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      return entries.slice(0, count).map((e) => ({
        id: (e.match(/<yt:videoId>([^<]+)/) || [])[1] || '',
        title: decode((e.match(/<title>([^<]*)/) || [])[1] || ''),
        published: (e.match(/<published>([^<]+)/) || [])[1] || '',
        short: /\/shorts\//.test(e),
      })).filter((v) => v.id);
    } catch {
      return [];
    }
  })();
  return cache;
}
