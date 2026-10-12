/** Cache Storage для hero-видео: один fetch → blob URL для мгновенного remount. */
const CACHE_NAME = 'loomixx-hero-v1';

let inflight: Promise<string> | null = null;
let cachedBlobUrl: string | null = null;

async function readFromCache(src: string): Promise<string | null> {
  if (typeof caches === 'undefined') return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(src);
    if (!match || !match.ok) return null;
    const blob = await match.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

async function fetchAndStore(src: string): Promise<string> {
  const response = await fetch(src, { mode: 'cors', credentials: 'same-origin' });
  if (!response.ok) throw new Error(`hero video fetch ${response.status}`);

  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(src, response.clone());
    } catch {
      /* cache put failed — всё равно отдадим blob */
    }
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Возвращает blob: URL из Cache Storage или после fetch.
 * При ошибке — исходный `src` (браузерный HTTP-кэш).
 */
export function ensureHeroVideoCached(src: string): Promise<string> {
  if (cachedBlobUrl) return Promise.resolve(cachedBlobUrl);
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const fromCache = await readFromCache(src);
      if (fromCache) {
        cachedBlobUrl = fromCache;
        return fromCache;
      }
      const blobUrl = await fetchAndStore(src);
      cachedBlobUrl = blobUrl;
      return blobUrl;
    } catch {
      return src;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/** Фоновый preload (не-главная / splash). */
export function preloadHeroVideo(src: string): void {
  void ensureHeroVideoCached(src);
}
