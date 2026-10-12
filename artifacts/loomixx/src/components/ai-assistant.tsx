import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
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
  'Гоняем баги по кругу, пока не выберут мирную профессию...',
  'Спрашиваем у кота-продакта, что ответить боссу...',
  'Разогреваем нейросеть в микроволновке на средней мощности...',
  'Переводим «сделайте красиво» на язык инженеров...',
  'Чиним капчу от космоса — почти прошли...',
  'Склеиваем JSX скотчем и хорошим настроением...',
  'Договариваемся с сервером, чтобы он не был вредным...',
  'Ищем кнопку «сделать хорошо» — она точно где-то была...',
  'Калибруем чувство вкуса по шкале slime...',
] as const;

function shuffleLoadingOrder(): number[] {
  const order = AI_LOADING_PHRASES.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  return order;
}

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
/** История диалога до закрытия вкладки */
const AI_HISTORY_KEY = 'loomixx-ai-history';
const AI_HISTORY_MAX = 40;

type AiRole = 'user' | 'assistant';
type AiMessage = { id: string; role: AiRole; text: string };

function newAiMessageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readAiHistory(): AiMessage[] {
  try {
    const raw = sessionStorage.getItem(AI_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is AiMessage => {
        if (!item || typeof item !== 'object') return false;
        const row = item as Record<string, unknown>;
        return (
          typeof row.id === 'string' &&
          (row.role === 'user' || row.role === 'assistant') &&
          typeof row.text === 'string' &&
          row.text.length > 0
        );
      })
      .slice(-AI_HISTORY_MAX);
  } catch {
    return [];
  }
}

function writeAiHistory(messages: AiMessage[]) {
  try {
    sessionStorage.setItem(AI_HISTORY_KEY, JSON.stringify(messages.slice(-AI_HISTORY_MAX)));
  } catch {
    /* sessionStorage unavailable / quota */
  }
}

/** Локальный fallback, если API недоступен. */
export function buildAiFallbackReply(_question?: string): string {
  return (
    `Пока я не могу ответить на этот вопрос подробно, босс. ` +
    `Напишите моему боссу в Telegram ${AI_CONTACT.telegram} или на почту ${AI_CONTACT.email} — подскажем по услугам, срокам и формату.`
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
  const orderRef = useRef<number[]>([]);
  const cursorRef = useRef(0);
  const [phrase, setPhrase] = useState(() => AI_LOADING_PHRASES[0]!);

  useEffect(() => {
    if (!active) return;

    orderRef.current = shuffleLoadingOrder();
    cursorRef.current = 0;
    const first = orderRef.current[0] ?? 0;
    setPhrase(AI_LOADING_PHRASES[first] ?? AI_LOADING_PHRASES[0]!);

    if (reduceMotion) return;

    const id = window.setInterval(() => {
      cursorRef.current += 1;
      if (cursorRef.current >= orderRef.current.length) {
        const prevLast = orderRef.current.at(-1);
        let next = shuffleLoadingOrder();
        // не повторяем ту же фразу сразу на стыке колод
        if (next[0] === prevLast && next.length > 1) {
          const swapWith = 1 + Math.floor(Math.random() * (next.length - 1));
          const tmp = next[0]!;
          next[0] = next[swapWith]!;
          next[swapWith] = tmp;
        }
        orderRef.current = next;
        cursorRef.current = 0;
      }
      const idx = orderRef.current[cursorRef.current] ?? 0;
      setPhrase(AI_LOADING_PHRASES[idx] ?? AI_LOADING_PHRASES[0]!);
    }, LOADING_ROTATE_MS);

    return () => window.clearInterval(id);
  }, [active, reduceMotion]);

  return phrase;
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

/** Кастомный скролл: нативный скрыт, proximity-зона + drag без выделения. */
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

function clearDomSelection() {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) selection.removeAllRanges();
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
  const hostRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startY: number; startScroll: number } | null>(null);
  const { viewportRef, thumb, sync } = useAiScrollRail(syncKey);
  const [near, setNear] = useState(false);
  const [dragging, setDragging] = useState(false);

  const scrollFromRailY = useCallback((clientY: number) => {
    const viewport = viewportRef.current;
    const rail = railRef.current;
    if (!viewport || !rail) return;
    const { scrollHeight, clientHeight } = viewport;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;
    const railRect = rail.getBoundingClientRect();
    const thumbH = Math.max(18, (clientHeight / scrollHeight) * railRect.height);
    const y = clientY - railRect.top - thumbH / 2;
    const maxTop = Math.max(1, railRect.height - thumbH);
    viewport.scrollTop = (Math.min(Math.max(y, 0), maxTop) / maxTop) * maxScroll;
  }, [viewportRef]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      const viewport = viewportRef.current;
      const rail = railRef.current;
      if (!drag || !viewport || !rail || event.pointerId !== drag.pointerId) return;
      event.preventDefault();
      clearDomSelection();
      const { scrollHeight, clientHeight } = viewport;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;
      const railH = rail.getBoundingClientRect().height;
      const thumbH = Math.max(18, (clientHeight / scrollHeight) * railH);
      const track = Math.max(1, railH - thumbH);
      const delta = ((event.clientY - drag.startY) / track) * maxScroll;
      viewport.scrollTop = Math.min(Math.max(drag.startScroll + delta, 0), maxScroll);
    };
    const onUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      dragRef.current = null;
      setDragging(false);
      document.body.classList.remove('ai-scroll-dragging');
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.body.classList.remove('ai-scroll-dragging');
    };
  }, [dragging, viewportRef]);

  const onRailPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    clearDomSelection();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const target = event.target as HTMLElement;
    const onThumb = target.classList.contains('ai-scroll-thumb');
    if (!onThumb) scrollFromRailY(event.clientY);
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startScroll: viewport.scrollTop,
    };
    setDragging(true);
    document.body.classList.add('ai-scroll-dragging');
    railRef.current?.setPointerCapture?.(event.pointerId);
  };

  const onHostPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const host = hostRef.current;
    if (!host || !thumb.visible) {
      if (near) setNear(false);
      return;
    }
    const rect = host.getBoundingClientRect();
    const distFromRight = rect.right - event.clientX;
    setNear(distFromRight >= 0 && distFromRight <= 18);
  };

  return (
    <div
      ref={hostRef}
      className={`ai-scroll-host${near || dragging ? ' is-scroll-near' : ''}${dragging ? ' is-scroll-dragging' : ''} ${className}`.trim()}
      onPointerMove={onHostPointerMove}
      onPointerLeave={() => {
        if (!dragging) setNear(false);
      }}
    >
      <div
        ref={viewportRef as Ref<HTMLDivElement>}
        className={`ai-scroll-viewport ${viewportClassName}`.trim()}
        onScroll={sync}
      >
        {children}
      </div>
      {thumb.visible ? (
        <div
          ref={railRef}
          className="ai-scroll-rail"
          aria-hidden="true"
          onPointerDown={onRailPointerDown}
        >
          <div
            className="ai-scroll-thumb"
            style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
          />
        </div>
      ) : null}
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
  const [messages, setMessages] = useState<AiMessage[]>(() => readAiHistory());
  const [busy, setBusy] = useState(false);
  const [bubbling, setBubbling] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const {
    viewportRef: inputScrollRef,
    thumb: inputThumb,
    sync: syncInputScroll,
  } = useAiScrollRail(value);
  const showPlaceholder = value.trim().length === 0;
  const placeholder = useTypewriterPlaceholder(AI_PLACEHOLDERS, showPlaceholder);
  const loadingPhrase = useLoadingPhrase(busy);
  const showThread = messages.length > 0 || busy;
  const threadSyncKey = `${messages.length}:${busy ? loadingPhrase : messages.at(-1)?.id ?? ''}`;

  useLayoutEffect(() => {
    autosizeEditable(editableRef.current);
    syncInputScroll();
  }, [value, syncInputScroll]);

  useEffect(() => {
    if (!autoFocus) return;
    const id = window.setTimeout(() => editableRef.current?.focus(), 220);
    return () => window.clearTimeout(id);
  }, [autoFocus]);

  useLayoutEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: 'end' });
  }, [threadSyncKey]);

  const persistMessages = useCallback((next: AiMessage[]) => {
    const trimmed = next.slice(-AI_HISTORY_MAX);
    setMessages(trimmed);
    writeAiHistory(trimmed);
  }, []);

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
    const userMsg: AiMessage = { id: newAiMessageId(), role: 'user', text: question };
    persistMessages([...messages, userMsg]);
    setBusy(true);
    clearEditable();

    void (async () => {
      let answer = buildAiFallbackReply(question);
      try {
        const result = await aiChat({ question, path });
        answer = result.answer || answer;
      } catch {
        /* fallback already set */
      }
      const assistantMsg: AiMessage = { id: newAiMessageId(), role: 'assistant', text: answer };
      persistMessages([...readAiHistory(), assistantMsg]);
      setBusy(false);
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
      <header className="ai-panel-header" data-testid="ai-panel-header">
        <div className="ai-panel-brand">
          <BrandMark className="ai-brand-mark--slime" />
          <span className="ai-panel-title-wrap">
            <span className="ai-panel-title">Люмик</span>
            <span className="ai-panel-online" title="на связи" aria-label="на связи" />
          </span>
        </div>
      </header>

      {showThread ? (
        <AiScrollBox className="ai-thread-scroll" syncKey={threadSyncKey}>
          <div className="ai-thread" data-testid="ai-thread">
            {messages.map((message) =>
              message.role === 'user' ? (
                <div key={message.id} className="ai-msg ai-msg-user" data-testid="ai-user-message">
                  <div className="ai-msg-body">{message.text}</div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className="ai-msg ai-msg-assistant"
                  role="status"
                  aria-live="polite"
                  data-testid="ai-reply"
                >
                  <div className="ai-msg-body">
                    <AiReplyText text={message.text} />
                  </div>
                </div>
              ),
            )}

            {busy ? (
              <div className="ai-msg ai-msg-loading" role="status" aria-live="polite" data-testid="ai-loading">
                <BrandMark className="ai-brand-mark--thinking" />
                <div className="ai-msg-body">{loadingPhrase}</div>
              </div>
            ) : null}
            <div ref={threadEndRef} className="ai-thread-end" aria-hidden="true" />
          </div>
        </AiScrollBox>
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
              {inputThumb.visible ? (
                <div className="ai-scroll-rail" aria-hidden="true">
                  <div
                    className="ai-scroll-thumb"
                    style={{ height: inputThumb.height, transform: `translateY(${inputThumb.top}px)` }}
                  />
                </div>
              ) : null}
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
            key="panel"
            className="ai-dock-panel"
            data-testid="ai-dock-panel"
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.78 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.88 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
            style={{ transformOrigin: 'bottom center' }}
          >
            <AiPanel suggestions={suggestions} path={location} autoFocus />
          </motion.div>
        ) : (
          <motion.button
            key="fab"
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
