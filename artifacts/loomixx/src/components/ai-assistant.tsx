import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { aiChat } from '@workspace/api-client-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'wouter';

export const AI_PLACEHOLDERS = [
  'Здравствуйте, я Ваш AI-ассистент - Люмик.',
  'Помогу с вопросами об услугах, сроках и том, как мы работаем.',
  'Сколько стоит сайт под ключ?',
  'Какие сроки на веб-приложение?',
  'Делаете мобильные приложения?',
  'Можно ли стартовать с небольшого MVP?',
] as const;

export const AI_CONTACT = {
  telegram: '@alekseevich47',
  telegramUrl: 'https://t.me/alekseevich47',
  email: 'loomixx.dev@yandex.ru',
  emailUrl: 'mailto:loomixx.dev@yandex.ru',
} as const;

export const AI_LOADING_PHRASES = [
  'Мегамозг заканчивает взлом «Пентагона» и спешит к Вам на помощь...',
  'Собираем пиксели в очередь — почти готово...',
  'Перехват сигнала от дизайнера-ежа… ещё секунда...',
  'Ищем ответ между Figma и продом...',
  'Варим свежий CSS на медленном огне...',
] as const;

const SUGGESTIONS_HOME = [
  'Сколько стоит сайт?',
  'Какие сроки?',
  'Какие услуги есть?',
  'Как проходит работа?',
  'Нужен MVP — с чего начать?',
] as const;

const SUGGESTIONS_BY_PATH: Record<string, readonly string[]> = {
  '/': SUGGESTIONS_HOME,
  '/services': [
    'Что входит в дизайн сайта?',
    'Чем веб-приложение отличается от сайта?',
    'Делаете мобильные приложения?',
    'Можно заказать только дизайн?',
    'Сколько стоят услуги?',
  ],
  '/projects': [
    'Это клиентские кейсы или концепты?',
    'Можете сделать похожий проект?',
    'В каких нишах работаете?',
    'Сколько длится типовой проект?',
    'Можно посмотреть другие работы?',
  ],
  '/about': [
    'Кто в команде?',
    'Как вы работаете с заказчиком?',
    'Где вы находитесь?',
    'Берёте проекты из других городов?',
    'С чего начать сотрудничество?',
  ],
  '/contact': [
    'Что написать в первом сообщении?',
    'Как быстро отвечаете?',
    'Можно связаться в Telegram?',
    'Нужен бриф перед стартом?',
    'Работаете по договору?',
  ],
};

const TYPE_MS = 42;
const DELETE_MS = 28;
const HOLD_MS = 1600;
const GAP_MS = 420;
const INPUT_MIN_PX = 52;
/** 3 видимые строки: padding 10+10 + 14px * 1.45 * 3 */
const INPUT_MAX_PX = Math.round(20 + 14 * 1.45 * 3);
const LOADING_ROTATE_MS = 2200;
const AUTO_OPEN_MS = 3000;
const NUDGE_EVERY_MS = 5000;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Локальный fallback, если API недоступен. */
export function buildAiFallbackReply(_question?: string): string {
  return (
    `Пока я не могу ответить на этот вопрос подробно. ` +
    `Напишите в Telegram ${AI_CONTACT.telegram} или на почту ${AI_CONTACT.email} — подскажем по услугам, срокам и формату.`
  );
}

function AiReplyText({ text }: { text: string }) {
  const parts = text.split(/(@alekseevich47|loomixx\.dev@yandex\.ru)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part === AI_CONTACT.telegram) {
          return (
            <a key={index} href={AI_CONTACT.telegramUrl} target="_blank" rel="noreferrer">
              {part}
            </a>
          );
        }
        if (part === AI_CONTACT.email) {
          return (
            <a key={index} href={AI_CONTACT.emailUrl}>
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function suggestionsForPath(path: string): readonly string[] {
  if (path.startsWith('/projects')) return SUGGESTIONS_BY_PATH['/projects'] ?? SUGGESTIONS_HOME;
  return SUGGESTIONS_BY_PATH[path] ?? SUGGESTIONS_HOME;
}

function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`ai-brand-mark ${className}`.trim()} aria-hidden="true">
      l
    </span>
  );
}

function useTypewriterPlaceholder(phrases: readonly string[], enabled: boolean) {
  const reduceMotion = useReducedMotion();
  // Старт пустой: полный текст не должен мелькать до первой печати после открытия панели
  const [text, setText] = useState('');

  useEffect(() => {
    if (!enabled) {
      setText('');
      return;
    }
    if (reduceMotion) {
      setText(phrases[0] ?? '');
      return;
    }

    let cancelled = false;
    let timeoutId = 0;
    let index = 0;
    let current = '';
    let deleting = false;

    setText('');

    const tick = () => {
      if (cancelled) return;
      const full = phrases[index] ?? '';

      if (!deleting) {
        current = full.slice(0, current.length + 1);
        setText(current);
        if (current === full) {
          timeoutId = window.setTimeout(() => {
            deleting = true;
            tick();
          }, HOLD_MS);
          return;
        }
        timeoutId = window.setTimeout(tick, TYPE_MS);
        return;
      }

      current = full.slice(0, Math.max(0, current.length - 1));
      setText(current);
      if (current.length === 0) {
        deleting = false;
        index = (index + 1) % phrases.length;
        timeoutId = window.setTimeout(tick, GAP_MS);
        return;
      }
      timeoutId = window.setTimeout(tick, DELETE_MS);
    };

    // Небольшая пауза после mount/open — затем печать с пустой строки
    timeoutId = window.setTimeout(tick, GAP_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [enabled, phrases, reduceMotion]);

  return text;
}

function useLoadingPhrase(active: boolean) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % AI_LOADING_PHRASES.length);
    }, LOADING_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [active, reduceMotion]);

  return AI_LOADING_PHRASES[index] ?? AI_LOADING_PHRASES[0];
}

function readEditableText(el: HTMLElement) {
  return (el.innerText || '').replace(/\u00a0/g, ' ').replace(/\n$/, '');
}

function autosizeEditable(el: HTMLElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(Math.max(el.scrollHeight, INPUT_MIN_PX), INPUT_MAX_PX)}px`;
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as { current: T | null }).current = node;
    }
  };
}

type ScrollThumb = { top: number; height: number; visible: boolean };

/** Кастомный скролл: нативный скрыт (без стрелок Win), тонкая lime-полоска. */
function useAiScrollRail(syncKey: unknown) {
  const viewportRef = useRef<HTMLElement | null>(null);
  const [thumb, setThumb] = useState<ScrollThumb>({ top: 0, height: 0, visible: false });

  const sync = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const overflow = scrollHeight > clientHeight + 1;
    if (!overflow) {
      setThumb((prev) => (prev.visible ? { top: 0, height: 0, visible: false } : prev));
      return;
    }
    const ratio = clientHeight / scrollHeight;
    const height = Math.max(18, clientHeight * ratio);
    const maxTop = clientHeight - height;
    const top = maxTop <= 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setThumb({ top, height, visible: true });
  }, []);

  useLayoutEffect(() => {
    sync();
  }, [sync, syncKey]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => sync();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro?.disconnect();
    };
  }, [sync, syncKey]);

  return { viewportRef, thumb, sync };
}

function AiScrollThumb({ thumb }: { thumb: ScrollThumb }) {
  if (!thumb.visible) return null;
  return (
    <div className="ai-scroll-rail" aria-hidden="true">
      <div
        className="ai-scroll-thumb"
        style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
      />
    </div>
  );
}

function AiScrollBox({
  children,
  className = '',
  viewportClassName = '',
  syncKey,
}: {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
  syncKey?: unknown;
}) {
  const { viewportRef, thumb, sync } = useAiScrollRail(syncKey);

  return (
    <div className={`ai-scroll-host ${className}`.trim()}>
      <div
        ref={viewportRef as Ref<HTMLDivElement>}
        className={`ai-scroll-viewport ${viewportClassName}`.trim()}
        onScroll={sync}
      >
        {children}
      </div>
      <AiScrollThumb thumb={thumb} />
    </div>
  );
}

type AiPanelProps = {
  suggestions: readonly string[];
  path?: string;
  autoFocus?: boolean;
};

function AiPanel({ suggestions, path, autoFocus = false }: AiPanelProps) {
  const [value, setValue] = useState('');
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [bubbling, setBubbling] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const {
    viewportRef: inputScrollRef,
    thumb: inputThumb,
    sync: syncInputScroll,
  } = useAiScrollRail(value);
  const showPlaceholder = value.trim().length === 0;
  const placeholder = useTypewriterPlaceholder(AI_PLACEHOLDERS, showPlaceholder);
  const loadingPhrase = useLoadingPhrase(busy && !reply);
  const showThread = Boolean(userMessage || reply || busy);

  useLayoutEffect(() => {
    autosizeEditable(editableRef.current);
    syncInputScroll();
  }, [value, syncInputScroll]);

  useEffect(() => {
    if (!autoFocus) return;
    const id = window.setTimeout(() => editableRef.current?.focus(), 220);
    return () => window.clearTimeout(id);
  }, [autoFocus]);

  const clearEditable = () => {
    const el = editableRef.current;
    if (el) el.textContent = '';
    setValue('');
    requestAnimationFrame(() => {
      autosizeEditable(editableRef.current);
      syncInputScroll();
    });
  };

  const pulseBubble = () => {
    setBubbling(true);
    window.setTimeout(() => setBubbling(false), 480);
  };

  const submit = (raw: string) => {
    const question = raw.trim();
    if (!question || busy) return;
    pulseBubble();
    setBusy(true);
    setReply(null);
    setUserMessage(question);
    clearEditable();

    void (async () => {
      try {
        const result = await aiChat({ question, path });
        setReply(result.answer || buildAiFallbackReply(question));
      } catch {
        setReply(buildAiFallbackReply(question));
      } finally {
        setBusy(false);
      }
    })();
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit(value);
    }
  };

  return (
    <div className="ai-panel-inner">
      {showThread ? (
        <div className="ai-thread" data-testid="ai-thread">
          {userMessage ? (
            <div className="ai-msg ai-msg-user" data-testid="ai-user-message">
              <AiScrollBox viewportClassName="ai-msg-body" syncKey={userMessage}>
                {userMessage}
              </AiScrollBox>
            </div>
          ) : null}

          {busy && !reply ? (
            <div className="ai-msg ai-msg-loading" role="status" aria-live="polite" data-testid="ai-loading">
              <BrandMark className="ai-brand-mark--thinking" />
              <AiScrollBox viewportClassName="ai-msg-body" syncKey={loadingPhrase}>
                {loadingPhrase}
              </AiScrollBox>
            </div>
          ) : null}

          {reply ? (
            <div className="ai-msg ai-msg-assistant" role="status" aria-live="polite" data-testid="ai-reply">
              <AiScrollBox viewportClassName="ai-msg-body" syncKey={reply}>
                <AiReplyText text={reply} />
              </AiScrollBox>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="ai-chips" role="list" aria-label="Примеры вопросов">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            type="button"
            role="listitem"
            className="ai-chip"
            data-testid={`ai-chip-${index}`}
            onClick={() => submit(suggestion)}
            disabled={busy}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form className="ai-composer" onSubmit={onSubmit}>
        <div className="ai-field">
          <div className="ai-input-shell">
            <div className="ai-scroll-host ai-scroll-host--input">
              {showPlaceholder ? (
                <span className="ai-placeholder" aria-hidden="true">
                  <span className="ai-placeholder-text">{placeholder}</span>
                  <span className="ai-caret" />
                </span>
              ) : null}
              <div
                ref={mergeRefs(editableRef, inputScrollRef as Ref<HTMLDivElement>)}
                className="ai-input ai-scroll-viewport"
                contentEditable={!busy}
                role="textbox"
                aria-multiline="true"
                aria-label="Вопрос ассистенту Люмик"
                data-testid="ai-input"
                suppressContentEditableWarning
                onInput={(event) => {
                  const next = readEditableText(event.currentTarget);
                  setValue(next);
                  autosizeEditable(event.currentTarget);
                  syncInputScroll();
                }}
                onKeyDown={onKeyDown}
                onScroll={syncInputScroll}
                onPaste={(event) => {
                  event.preventDefault();
                  const text = event.clipboardData.getData('text/plain');
                  document.execCommand('insertText', false, text);
                }}
              />
              <AiScrollThumb thumb={inputThumb} />
            </div>
          </div>
          <button
            type="submit"
            className={`ai-send${bubbling ? ' is-bubbling' : ''}`}
            aria-label="Отправить"
            data-testid="ai-send"
            disabled={busy || !value.trim()}
          >
            <BrandMark className="ai-brand-mark--slime" />
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Logo снизу по центру на всех страницах.
 * Авто-раскрытие только на `/` (через 3с).
 * На остальных — каждые 5с «тык-тык» nudge, пока панель закрыта.
 * Клик вне блока — схлапывание в logo.
 */
export function AiDock() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const reduceMotion = useReducedMotion();
  const dockRef = useRef<HTMLDivElement>(null);
  const suggestions = suggestionsForPath(location);
  const isHome = location === '/';

  useEffect(() => {
    setOpen(false);
    setNudge(false);
    if (!isHome) return;

    let cancelled = false;
    let timeoutId = 0;

    const startAutoOpen = () => {
      if (cancelled) return;
      timeoutId = window.setTimeout(() => {
        if (!cancelled) setOpen(true);
      }, AUTO_OPEN_MS);
    };

    if (document.documentElement.dataset.splash === 'pending') {
      const onSplashDone = () => startAutoOpen();
      window.addEventListener('loomixx:splash-done', onSplashDone);
      return () => {
        cancelled = true;
        window.clearTimeout(timeoutId);
        window.removeEventListener('loomixx:splash-done', onSplashDone);
      };
    }

    startAutoOpen();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [location, isHome]);

  useEffect(() => {
    if (isHome || open || reduceMotion) return;
    const id = window.setInterval(() => {
      setNudge(true);
      window.setTimeout(() => setNudge(false), 560);
    }, NUDGE_EVERY_MS);
    return () => window.clearInterval(id);
  }, [isHome, open, reduceMotion, location]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = dockRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div
      ref={dockRef}
      className={`ai-dock ai-dock--center${open ? ' is-open' : ''}${isHome ? ' ai-dock--home' : ''}`}
      data-testid="ai-dock"
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key={`panel-${location}`}
            className="ai-dock-panel"
            data-testid="ai-dock-panel"
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.78 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.88 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
            style={{ transformOrigin: 'bottom center' }}
          >
            <AiPanel key={location} suggestions={suggestions} path={location} autoFocus />
          </motion.div>
        ) : (
          <motion.button
            key={`fab-${location}`}
            type="button"
            className={`ai-fab${nudge ? ' is-nudge' : ''}`}
            aria-label="Открыть ассистента"
            aria-expanded={false}
            data-testid="ai-fab"
            onClick={() => setOpen(true)}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE }}
          >
            <span className="ai-fab-disk">
              <BrandMark className="ai-brand-mark--slime" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
