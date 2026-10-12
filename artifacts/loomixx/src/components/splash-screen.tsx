import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import BlurText from '@/components/BlurText';
import { waitForHeroMediaReady } from '@/lib/hero-media-ready';
import { preloadHeroVideo } from '@/lib/hero-video-cache';
import heroOrbitLoop from '@assets/hero-orbit-1007-3-compressed.mp4';

const EASE = [0.22, 1, 0.36, 1] as const;
export const SPLASH_DONE_EVENT = 'loomixx:splash-done';

function markSplashDone() {
  document.documentElement.dataset.splash = 'done';
  document.documentElement.classList.remove('splash-active');
  document.documentElement.classList.add('splash-reveal');
  window.dispatchEvent(new CustomEvent(SPLASH_DONE_EVENT));
}

/** Главная с видео: pathname без base. */
function isHomePath() {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const stripped =
    base && path.startsWith(base) ? path.slice(base.length) || '/' : path;
  return stripped === '/' || stripped === '';
}

/**
 * Splash на каждый hard load документа (SPA-навигация не remount'ит App).
 * `/` — exit после videoReady + BlurText; иначе — только анимация + preload видео.
 */
export function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const [isHome] = useState(() => {
    document.documentElement.dataset.splash = 'pending';
    document.documentElement.classList.add('splash-active');
    return isHomePath();
  });

  const [mounted, setMounted] = useState(true);
  const [showText, setShowText] = useState(false);
  const [videoReady, setVideoReady] = useState(!isHome);
  const [textDone, setTextDone] = useState(false);
  const [textExiting, setTextExiting] = useState(false);
  const [textExitDone, setTextExitDone] = useState(false);
  const [slimeExiting, setSlimeExiting] = useState(false);

  useEffect(() => {
    if (!isHome) {
      preloadHeroVideo(heroOrbitLoop);
      return;
    }

    const ac = new AbortController();
    void waitForHeroMediaReady(ac.signal).then(() => {
      if (!ac.signal.aborted) setVideoReady(true);
    });

    return () => {
      ac.abort();
    };
  }, [isHome]);

  useEffect(() => {
    const id = window.setTimeout(
      () => setShowText(true),
      reduceMotion ? 40 : 720,
    );
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (!reduceMotion || !showText) return;
    setTextDone(true);
  }, [reduceMotion, showText]);

  // reverse: home — textDone + videoReady; не home — только textDone
  useEffect(() => {
    if (textExiting || !textDone) return;
    if (isHome && !videoReady) return;
    const id = window.setTimeout(
      () => setTextExiting(true),
      reduceMotion ? 80 : 420,
    );
    return () => window.clearTimeout(id);
  }, [textExiting, textDone, videoReady, isHome, reduceMotion]);

  useEffect(() => {
    if (!textExitDone || slimeExiting) return;
    const id = window.setTimeout(
      () => setSlimeExiting(true),
      reduceMotion ? 40 : 120,
    );
    return () => window.clearTimeout(id);
  }, [textExitDone, slimeExiting, reduceMotion]);

  return (
    <AnimatePresence onExitComplete={markSplashDone}>
      {mounted ? (
        <motion.div
          key="splash"
          className="splash"
          role="status"
          aria-live="polite"
          aria-label="Загрузка loomixx"
          data-testid="splash-screen"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.55,
            ease: EASE,
          }}
        >
          <div className="splash-inner">
            <motion.div
              className="splash-mark-wrap"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.55, y: 18 }}
              animate={
                slimeExiting
                  ? { opacity: 0, scale: 0.78, y: 10, filter: 'blur(10px)' }
                  : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
              }
              transition={{
                duration: reduceMotion ? 0.16 : slimeExiting ? 0.65 : 0.7,
                ease: EASE,
              }}
              onAnimationComplete={() => {
                if (slimeExiting) setMounted(false);
              }}
            >
              <span
                className={`splash-mark ai-brand-mark ai-brand-mark--slime${slimeExiting ? ' is-exiting' : ''}`}
                aria-hidden="true"
              >
                l
              </span>
            </motion.div>

            <div className="splash-word">
              {showText ? (
                <BlurText
                  text="loomixx"
                  delay={150}
                  animateBy="letters"
                  direction="top"
                  className="text-2xl mb-8"
                  exiting={textExiting}
                  onAnimationComplete={() => setTextDone(true)}
                  onExitComplete={() => setTextExitDone(true)}
                />
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
