import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/** Фразы с предлогом: меняется хвост после «Цифровые вещи». */
export const HERO_ROTATING_PHRASES = [
  'со смыслом',
  'с душой',
  'для бизнеса',
  'с характером',
  'без лишнего',
] as const;

const INTERVAL_MS = 2800;
const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroRotatingPhrase() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const phrase = HERO_ROTATING_PHRASES[index];

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_ROTATING_PHRASES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <span className="hero-rotate" aria-live="polite" aria-atomic="true">
      {/* Ширина слота = longest phrase → без сдвига соседних слов/переносов */}
      <span className="hero-rotate-measure" aria-hidden="true">
        {HERO_ROTATING_PHRASES.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.em
          key={phrase}
          className="hero-rotate-active"
          initial={reduceMotion ? false : { opacity: 0, y: '0.28em' }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: '-0.22em' }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: EASE }}
        >
          {phrase}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}
