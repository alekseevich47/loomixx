import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import BlurText from '@/components/BlurText';
import {
  markHeroMediaReady,
  waitForHeroMediaReady,
} from '@/lib/hero-media-ready';

const SPLASH_KEY = 'loomixx-splash';
const EASE = [0.22, 1, 0.36, 1] as const;
export const SPLASH_DONE_EVENT = 'loomixx:splash-done';

function markSplashDone() {
  try {
    sessionStorage.setItem(SPLASH_KEY, '1');
  } catch {
    /* sessionStorage unavailable */
  }
  document.documentElement.dataset.splash = 'done';
  document.documentElement.classList.remove('splash-active');
  document.documentElement.classList.add('splash-reveal');
  window.dispatchEvent(new CustomEvent(SPLASH_DONE_EVENT));
}

function shouldShowSplash() {
  try {
    return sessionStorage.getItem(SPLASH_KEY) !== '1';
  } catch {
    return true;
  }
}

/** Главная с видео: pathname без base (wouter base уже срезан в history). */
function isHomePath() {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const stripped = base && path.startsWith(base) ? path.slice(base.length) || '/' : path;
  return stripped === '/' || stripped === '';
}

/**
 * Splash: slime → BlurText → exit текста → logo последним → reveal главной.
 */
export function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const [enabled] = useState(() => {
    const show = shouldShowSplash();
    if (show) {
      document.documentElement.dataset.splash = 'pending';
      document.documentElement.classList.add('splash-active');
    } else {
      document.documentElement.dataset.splash = 'done';
    }
    return show;
  });
  const [mounted, setMounted] = useState(enabled);
  const [showText, setShowText] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [textDone, setTextDone] = useState(false);
  const [textExiting, setTextExiting] = useState(false);
  const [textExitDone, setTextExitDone] = useState(false);
  const [slimeExiting, setSlimeExiting] = useState(false);

  useEffect(() => {
    if (!enabled) {
      window.dispatchEvent(new CustomEvent(SPLASH_DONE_EVENT));
      return;
    }

    // Не главная — hero-видео нет, не блокируем exit
    if (!isHomePath()) {
      markHeroMediaReady();
      setVideoReady(true);
      return;
    }

    const ac = new AbortController();
    void waitForHeroMediaReady(ac.signal).then(() => {
      if (!ac.signal.aborted) setVideoReady(true);
    });

    return () => {
      ac.abort();
      document.documentElement.classList.remove('splash-active');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(
      () => setShowText(true),
      reduceMotion ? 40 : 720,
    );
    return () => window.clearTimeout(id);
  }, [enabled, reduceMotion]);

  useEffect(() => {
    if (!enabled || !reduceMotion || !showText) return;
    setTextDone(true);
  }, [enabled, reduceMotion, showText]);

  // 1) reverse текста — после BlurText enter И готовности hero-видео
  useEffect(() => {
    if (!enabled || textExiting || !textDone || !videoReady) return;
    const id = window.setTimeout(
      () => setTextExiting(true),
      reduceMotion ? 80 : 420,
    );
    return () => window.clearTimeout(id);
  }, [enabled, textExiting, textDone, videoReady, reduceMotion]);

  // 2) после текста — уход логотипа (последним)
  useEffect(() => {
    if (!textExitDone || slimeExiting) return;
    const id = window.setTimeout(
      () => setSlimeExiting(true),
      reduceMotion ? 40 : 120,
    );
    return () => window.clearTimeout(id);
  }, [textExitDone, slimeExiting, reduceMotion]);

  if (!enabled) return null;

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
                // logo ушёл последним → снимаем оверлей → reveal главной
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
