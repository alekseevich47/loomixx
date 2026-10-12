import {
  motion,
  useReducedMotion,
  type Easing,
  type Transition,
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
  /** Обратная анимация (выход) — к состоянию from */
  exiting?: boolean;
  onExitComplete?: () => void;
};

function buildKeyframes(
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>,
): Record<string, Array<string | number>> {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);
  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
}

/**
 * React Bits BlurText (TS-TW), адаптирован под framer-motion.
 * @see https://www.reactbits.dev/text-animations/blur-text
 */
export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  exiting = false,
  onExitComplete,
}: BlurTextProps) {
  const reduceMotion = useReducedMotion();
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const enterDoneRef = useRef(false);
  const exitDoneRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    if (reduceMotion) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduceMotion]);

  useEffect(() => {
    if (!reduceMotion || !inView || enterDoneRef.current) return;
    enterDoneRef.current = true;
    onAnimationComplete?.();
  }, [reduceMotion, inView, onAnimationComplete]);

  useEffect(() => {
    if (!exiting) {
      exitDoneRef.current = false;
      return;
    }
    if (!reduceMotion || exitDoneRef.current) return;
    exitDoneRef.current = true;
    onExitComplete?.();
  }, [exiting, reduceMotion, onExitComplete]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  const stepCount = toSnapshots.length + 1;
  const totalDuration = reduceMotion ? 0 : stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );
  const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
  const lastIndex = elements.length - 1;

  return (
    <p ref={ref} className={cn('blur-text', className)} aria-label={text}>
      {elements.map((segment, index) => {
        const enterDelay = reduceMotion ? 0 : (index * delay) / 1000;
        // обратный stagger: последние буквы уходят первыми
        const exitDelay = reduceMotion
          ? 0
          : ((lastIndex - index) * delay) / 1000;

        const spanTransition: Transition = {
          duration: totalDuration,
          times: exiting ? undefined : times,
          delay: exiting ? exitDelay : enterDelay,
          ease: easing,
        };

        const animateState = reduceMotion
          ? exiting
            ? fromSnapshot
            : { filter: 'blur(0px)', opacity: 1, y: 0 }
          : exiting
            ? fromSnapshot
            : inView
              ? animateKeyframes
              : fromSnapshot;

        return (
          <motion.span
            key={index}
            className="blur-text__seg"
            aria-hidden="true"
            initial={reduceMotion ? false : fromSnapshot}
            animate={animateState}
            transition={spanTransition}
            onAnimationComplete={() => {
              if (exiting) {
                if (index === 0 && !exitDoneRef.current) {
                  exitDoneRef.current = true;
                  onExitComplete?.();
                }
                return;
              }
              if (index === lastIndex && inView && !enterDoneRef.current) {
                enterDoneRef.current = true;
                onAnimationComplete?.();
              }
            }}
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity',
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < lastIndex ? '\u00A0' : null}
          </motion.span>
        );
      })}
    </p>
  );
}
