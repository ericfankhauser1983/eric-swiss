/**
 * Dernières vidéos YouTube de la chaîne, en direct (flux RSS public, sans clé d'API).
 * Appelée par le bloc « Mes dernières vidéos » du site : /.netlify/functions/videos?count=3
 * Réponse mise en cache 30 minutes sur le CDN Netlify : une nouvelle vidéo apparaît sur le site
 * au plus tard une demi-heure après sa publication sur YouTube, sans reconstruire le site.
 */
const CHANNEL_ID = 'UCr9wh-LZuJoP5lJOPkYCXEQ'; // @ericfankh

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export const handler = async (event) => {
  const count = Math.min(12, Math.max(1, parseInt(event.queryStringParameters?.count || '3', 10) || 3));
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(String(r.status));
    const xml = await r.text();
    const videos = xml.split('<entry>').slice(1, count + 1).map((e) => ({
      id: (e.match(/<yt:videoId>([^<]+)/) || [])[1] || '',
      title: decode((e.match(/<title>([^<]*)/) || [])[1] || ''),
      published: (e.match(/<published>([^<]+)/) || [])[1] || '',
    })).filter((v) => v.id);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
      body: JSON.stringify({ videos }),
    };
  } catch {
    return { statusCode: 502, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ videos: [] }) };
  }
};
