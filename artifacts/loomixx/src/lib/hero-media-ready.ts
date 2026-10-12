/** Сигнал: hero-медиа на главной готово (видео / static poster). */
export const HERO_MEDIA_READY_EVENT = 'loomixx:hero-media-ready';

export function markHeroMediaReady() {
  if (document.documentElement.dataset.heroMedia === 'ready') return;
  document.documentElement.dataset.heroMedia = 'ready';
  window.dispatchEvent(new CustomEvent(HERO_MEDIA_READY_EVENT));
}

/** Safety timeout на `/` (~15с). Ready ставит только HeroOrbitScene / poster. */
export function waitForHeroMediaReady(
  signal: AbortSignal,
  timeoutMs = 15000,
): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted || document.documentElement.dataset.heroMedia === 'ready') {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener(HERO_MEDIA_READY_EVENT, onReady);
      resolve();
    };

    const onReady = () => finish();
    signal.addEventListener('abort', finish, { once: true });
    window.addEventListener(HERO_MEDIA_READY_EVENT, onReady);
    window.setTimeout(finish, timeoutMs);
  });
}
