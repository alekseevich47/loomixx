import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { AiDock } from '@/components/ai-assistant';
import { HeroOrbitScene } from '@/components/hero-orbit-scene';
import { HeroRotatingPhrase } from '@/components/hero-rotating-phrase';
import { SplashScreen } from '@/components/splash-screen';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Blocks, Menu, Moon, Palette,
  Smartphone, Sun, X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { useViewTransitionLocation } from '@/hooks/use-view-transition-location';

const queryClient = new QueryClient();

const projects = [
  { slug: 'forma', title: 'Forma — пространство формы', type: 'Сайт · Айдентика', year: 'Концепт', color: '#e9c8b3', category: 'Сайты', headline: 'Форма, которая говорит за себя', desc: 'Концепция сайта для студии предметного дизайна: тактильная типографика, спокойный ритм и место для самих объектов.' },
  { slug: 'northline', title: 'Northline — новые маршруты', type: 'Веб-приложение', year: 'Концепт', color: '#c4d8d2', category: 'Веб-приложения', headline: 'Планируйте путь, а не вкладки', desc: 'Прототип сервиса для планирования небольших путешествий — от первого сохранённого места до собранного маршрута.' },
  { slug: 'morrow', title: 'Morrow — забота каждый день', type: 'Мобильное приложение', year: 'Концепт', color: '#d3c9eb', category: 'Приложения', headline: 'Небольшие привычки. Большая опора.', desc: 'Мобильный продукт о бережной заботе о себе: дневной ритм, короткие практики и интерфейс без давления.' },
  { slug: 'sreda', title: 'Среда — вещи с историей', type: 'Интернет-магазин', year: 'Концепт', color: '#e7da9f', category: 'Сайты', headline: 'Предметы, которые остаются', desc: 'Цифровая витрина для коллекции винтажных предметов — с характером каталога и ясностью современного магазина.' },
];

const navItems = [
  { href: '/', text: 'Главная' },
  { href: '/services', text: 'Услуги' },
  { href: '/projects', text: 'Проекты' },
  { href: '/about', text: 'Студия' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('loomixx-theme') === 'dark'; } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('loomixx-theme', dark ? 'dark' : 'light'); } catch { /* local storage unavailable */ }
  }, [dark]);
  return <button className="theme-toggle" aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'} data-testid="button-theme-toggle" onClick={() => setDark((value) => !value)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}

function Header() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [location]);
  return (
    <header className="topbar">
      <div className="container-wide topbar-inner">
        <Link href="/" className="brand" data-testid="link-brand"><span className="brand-mark">l</span><span>loomixx</span></Link>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Основная навигация">
          {navItems.map((item) => <Link key={item.href} href={item.href} className={`nav-link ${location === item.href || (item.href === '/projects' && location.startsWith('/projects/')) ? 'active' : ''}`} data-testid={`link-nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}>{item.text}</Link>)}
        </nav>
        <div className="top-actions"><ThemeToggle /><Link href="/contact" className="nav-cta" data-testid="link-contact-header">Обсудить проект <ArrowUpRight size={15} /></Link><button className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} data-testid="button-mobile-menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
      </div>
    </header>
  );
}

function Footer() {
  return <footer className="container-wide footer">
    <div className="footer-top">
      <div><Link href="/" className="brand" data-testid="link-footer-brand"><span className="brand-mark">l</span><span>loomixx</span></Link><p className="footer-blurb">Небольшая продуктовая студия. Превращаем хорошие идеи в понятные цифровые продукты.</p></div>
      <div className="footer-links">
        <div className="footer-col"><strong>Навигация</strong><Link href="/services">Услуги</Link><Link href="/projects">Проекты</Link><Link href="/about">Студия</Link></div>
        <div className="footer-col"><strong>Начать</strong><Link href="/contact">Обсудить задачу</Link><Link href="/contact">Задать вопрос</Link></div>
      </div>
    </div>
    <div className="footer-bottom"><span>© Loomixx · независимая студия</span><span>Сделано с вниманием к деталям</span></div>
  </footer>;
}

function Shell({ children, home = false }: { children: ReactNode; home?: boolean }) {
  return (
    <div className={home ? 'site-shell site-shell--home' : 'site-shell'}>
      <Header />
      {children}
      {home ? null : <Footer />}
      <AiDock />
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow"><span className="status-dot" />{children}</div>; }

function ProjectArtwork({ project, detail = false }: { project: typeof projects[number]; detail?: boolean }) {
  return <div className={`project-cover ${detail ? 'detail-cover' : ''}`} style={{ '--project-bg': project.color } as React.CSSProperties} data-testid={`artwork-${project.slug}`}>
    <div className="project-meta"><span>{project.type}</span><span>{project.year}</span></div><div className="cover-orbit" />
    <div className="project-device device-wide"><div className="device-header" /><div className="device-hero">{project.headline}</div><div className="device-blocks"><i /><i /><i /></div></div>
    <div className="project-device device-phone"><div className="device-header" /><div className="phone-lines"><i /><i /><i /></div></div>
  </div>;
}

function ProjectCard({ project }: { project: typeof projects[number] }) {
  return <Link href={`/projects/${project.slug}`} className="project-card" data-testid={`card-project-${project.slug}`}><ProjectArtwork project={project} /><div className="project-info"><div><h3>{project.title}</h3><p>{project.type}</p></div><span className="round-arrow"><ArrowUpRight size={17} /></span></div></Link>;
}

const serviceItems = [
  { icon: <Palette size={20} />, title: 'Дизайн и сайты', text: 'Продуманный образ и быстрый сайт, который помогает рассказать о продукте и принять решение.', number: '01', details: ['Исследование и структура', 'Визуальная система', 'Дизайн и разработка'] },
  { icon: <Blocks size={20} />, title: 'Веб-приложения', text: 'Инструменты и сервисы, которые убирают лишнее и превращают сложный сценарий в простой.', number: '02', details: ['Прототипирование', 'Интерфейсы и состояния', 'Разработка продукта'] },
  { icon: <Smartphone size={20} />, title: 'Мини-приложения', text: 'Мини-приложения для бизнеса — заказы, записи, каталоги, личные кабинеты и сервисы прямо в мессенджере.', number: '03', details: ['Сценарии взаимодействия', 'Дизайн мини-приложения', 'Интеграции с CRM и сервисами'] },
];

function ServiceCards() {
  return <div className="service-grid">{serviceItems.map((service) => <article className="service-card" key={service.number} data-testid={`card-service-${service.number}`}><span className="service-number">{service.number} / 03</span><span className="service-arrow"><ArrowUpRight size={17} /></span><div className="service-icon">{service.icon}</div><h3>{service.title}</h3><p>{service.text}</p></article>)}</div>;
}

function Home() {
  return (
    <main className="home-main">
      <section className="container-wide hero hero-screen">
        {/* Слот бывшего eyebrow — сохраняет отступ до «Цифровые вещи» */}
        <div className="hero-eyebrow-slot" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-lead reveal"><h1>Цифровые<br />вещи <HeroRotatingPhrase /></h1><p className="hero-copy">От идеи до готового продукта<br />— проектируем и создаём цифровые продукты, которыми действительно удобно пользоваться.</p><Link href="/contact" className="hero-cta" data-testid="link-hero-contact">Расскажите о задаче <ArrowUpRight size={17} /></Link><div className="hero-note">ПОД ВАШУ ЗАДАЧУ · ВНИМАНИЕ К КАЖДОМУ ШАГУ</div></div>
          <div className="hero-art"><HeroOrbitScene /></div>
        </div>
      </section>
    </main>
  );
}

function CallToAction() {
  return <div className="cta-band"><div><h2>Есть мысль, которой пора стать продуктом?</h2><p>Расскажите, что хотите изменить. Начнём с короткого разговора о вашей задаче.</p></div><Link href="/contact" className="hero-cta" data-testid="link-cta-contact">Начать разговор <ArrowUpRight size={16} /></Link></div>;
}

function Services() {
  return <main className="container-wide">
    <section className="page-hero"><Eyebrow>Наши услуги</Eyebrow><h1>Хорошая идея.<br /><em>Цельный продукт.</em></h1><p className="page-lead">Помогаем пройти путь от неясного «а что если?» до работающего цифрового продукта. Выбираем нужный объём, а не продаём лишнее.</p></section>
    <div className="service-detail-list">{serviceItems.map((service) => <article className="service-detail" key={service.number} data-testid={`service-detail-${service.number}`}><div className="service-icon">{service.icon}</div><div><span className="service-number">{service.number} / 03</span><h2>{service.title}</h2><p>{service.text}</p></div><ul className="detail-list">{service.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><ArrowUpRight size={18} /></article>)}</div>
    <div className="value-strip"><div><strong>Начинаем с контекста</strong><span>Не предлагаем готовый шаблон до того, как поняли, для кого и зачем продукт.</span></div><div><strong>Один диалог — вся команда</strong><span>Дизайн и разработка рядом с вами на протяжении всей работы.</span></div><div><strong>Только нужный объём</strong><span>Собираем решение под реальную задачу, а не под красивую смету.</span></div></div><CallToAction />
  </main>;
}

function Projects() {
  const [filter, setFilter] = useState('Все');
  const categories = ['Все', 'Сайты', 'Веб-приложения', 'Приложения'];
  const shown = filter === 'Все' ? projects : projects.filter((project) => project.category === filter);
  return <main className="container-wide"><section className="page-hero"><Eyebrow>Избранные работы</Eyebrow><h1>Идеи обретают<br /><em>форму.</em></h1><p className="page-lead">Здесь собраны продуктовые концепции и примеры направления. Не клиентские кейсы, а честные исследования того, каким может быть хороший цифровой опыт.</p></section>
    <div className="filters" aria-label="Фильтр проектов">{categories.map((category) => <button key={category} className={`filter-button ${filter === category ? 'active' : ''}`} aria-pressed={filter === category} data-testid={`filter-projects-${category.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <div className="projects-layout" data-testid="project-grid">{shown.map((project) => <ProjectCard key={project.slug} project={project} />)}</div><CallToAction />
  </main>;
}

function ProjectDetail({ slug }: { slug?: string }) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFound />;
  return <main className="container-wide"><section className="project-detail-hero"><Link href="/projects" className="back-link" data-testid="link-back-projects"><ArrowLeft size={15} />Все проекты</Link><div className="project-detail-title"><h1>{project.title}</h1><p>{project.desc}</p></div><ProjectArtwork project={project} detail /></section>
    <section className="detail-grid"><aside className="detail-aside"><div><strong>Формат</strong><span>{project.type}</span></div><div><strong>Статус</strong><span>Самостоятельная концепция</span></div><div><strong>Фокус</strong><span>{project.category}</span></div></aside><div className="detail-copy"><h2>О замысле</h2><p>{project.desc}</p><p>В этом концепте мы исследуем, как ясная структура, выразительная визуальная система и внимание к повседневному сценарию могут сделать цифровой продукт живым и понятным.</p><h2 style={{ marginTop: 33 }}>Подход</h2><p>Сначала формулируем главное действие пользователя, затем выстраиваем вокруг него интерфейс. Всё остальное — типографика, детали, переходы — поддерживает этот сценарий, а не спорит с ним.</p></div></section><div style={{ padding: '48px 0 20px' }}><CallToAction /></div>
  </main>;
}

function About() {
  return <main><div className="container-wide"><section className="page-hero"><Eyebrow>Кто мы</Eyebrow><h1>Небольшая команда.<br /><em>Большое внимание.</em></h1><p className="page-lead">Loomixx — независимая продуктовая студия для людей, которым важно не просто выпустить сайт или приложение, а сделать нужную вещь.</p></section>
    <section className="about-top"><div><div className="about-quote">«Хороший продукт не требует инструкции. Он <em>чувствует</em> человека».</div><p className="about-quote-note">Поэтому мы начинаем с вопросов, остаёмся рядом на каждом этапе и не усложняем там, где можно проще.</p></div><div className="about-art"><div className="orbit"><div className="art-core"><span>lxx</span></div></div></div></section>
    </div><section className="manifesto"><div className="container-wide manifesto-inner"><Eyebrow>Как мы думаем</Eyebrow><div><h2>Технологии — это средство.<br /><em>Человек — причина.</em></h2><p>Мы верим в цифровые продукты, которые уважают время, внимание и интеллект людей. В ясные решения, честные ожидания и работу, за которую не стыдно после запуска.</p></div></div></section>
    <div className="container-wide"><div className="section-head"><div><Eyebrow>Наши принципы</Eyebrow><h2 className="section-title">Меньше шума.<br />Больше сути.</h2></div><p className="section-intro">Это не обещание идеального процесса. Это ориентиры, к которым мы возвращаемся в каждом проекте.</p></div><div className="value-strip" style={{ marginTop: 0 }}><div><strong>Ясность — это забота</strong><span>Сложное объясняем простым языком. Показываем промежуточный результат и обозначаем следующий шаг.</span></div><div><strong>Качество в деталях</strong><span>Продумываем состояния, тексты и маленькие переходы — потому что именно из них складывается опыт.</span></div><div><strong>Работаем вместе</strong><span>Вы знаете контекст лучше нас. Мы приносим опыт и задаём вопросы, а не прячемся за процессом.</span></div></div><CallToAction /></div></main>;
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return <main className="container-wide"><section className="page-hero"><Eyebrow>Обсудим вашу задачу</Eyebrow><h1>С чего начнём<br /><em>вместе?</em></h1><p className="page-lead">Пара строк о вашей идее — и мы поймём, чем можем помочь. Никаких обязательств, только предметный разговор.</p></section>
    <section className="contact-layout"><div className="contact-info"><h2>Можно начать просто.</h2><p>Не обязательно приходить с готовым техническим заданием. Достаточно рассказать, что хочется изменить или создать.</p><div className="contact-meta"><span>Что происходит дальше</span><strong>Форма сохранит ваш черновик только в этой вкладке.</strong></div><div className="contact-meta"><span>Честно о форме</span><p>Сайт пока не отправляет сообщения. После отправки появится локальное подтверждение — мы не получим ваши данные.</p></div></div>
      <form className="contact-form" onSubmit={handleSubmit} data-testid="form-contact"><div className="form-row"><div className="field"><label htmlFor="name">Как к вам обращаться</label><input id="name" name="name" required placeholder="Ваше имя" data-testid="input-contact-name" /></div><div className="field"><label htmlFor="email">Электронная почта</label><input id="email" name="email" type="email" required placeholder="name@example.com" data-testid="input-contact-email" /></div></div>
        <div className="field"><label htmlFor="kind">Что хотите создать</label><select id="kind" name="kind" defaultValue="" required data-testid="select-contact-project"><option value="" disabled>Выберите направление</option><option>Сайт</option><option>Веб-приложение</option><option>Мобильное приложение</option><option>Пока не уверен(а)</option></select></div>
        <div className="field"><label htmlFor="message">Коротко о задаче</label><textarea id="message" name="message" required placeholder="Идея, контекст или вопрос — как удобно." data-testid="input-contact-message" /></div>
        <button className="hero-cta" type="submit" data-testid="button-contact-submit">Подготовить сообщение <ArrowUpRight size={16} /></button>
        <p className="form-disclaimer">Нажатие не отправит данные на сервер. Эта форма демонстрационная и работает только на этой странице.</p>
        {submitted && <div role="status" className="form-success" data-testid="status-contact-success"><strong>Черновик готов.</strong><br />Спасибо за интерес к Loomixx. Сейчас форма не отправляет сообщения и введённые данные не покинули ваш браузер.</div>}
      </form></section>
  </main>;
}

function NotFound() {
  return <main className="container-wide notfound"><div><div className="notfound-code">404</div><h1>Эта страница потерялась.</h1><p>Похоже, такой страницы нет. Можно вернуться к проектам или начать сначала.</p><Link href="/" className="hero-cta" data-testid="link-not-found-home">На главную <ArrowRight size={16} /></Link></div></main>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

type SelectionRect = { left: number; top: number; right: number; bottom: number };
type BrushPoint = { x: number; y: number };
type BrushPath = { d: string; kind: 'body' | 'wisp' };

function brushNoise(index: number, n: number) {
  const x = Math.sin((index + 1) * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Catmull–Rom → cubic Bézier polyline (open). */
function smoothOpenPath(pts: BrushPoint[]) {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  if (pts.length === 2) {
    return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} L ${pts[1].x.toFixed(2)} ${pts[1].y.toFixed(2)}`;
  }

  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/** Soft tapered brush hair at a stroke end. */
function makeBrushWisp(
  side: 'left' | 'right',
  anchorX: number,
  y: number,
  length: number,
  rootHalf: number,
  tilt: number,
) {
  const tipX = side === 'left' ? anchorX - length : anchorX + length;
  const pull = length * 0.42;
  const midX = side === 'left' ? anchorX - pull : anchorX + pull;
  return [
    `M ${anchorX.toFixed(2)} ${(y - rootHalf).toFixed(2)}`,
    `Q ${midX.toFixed(2)} ${(y - rootHalf * 0.35 + tilt).toFixed(2)} ${tipX.toFixed(2)} ${(y + tilt).toFixed(2)}`,
    `Q ${midX.toFixed(2)} ${(y + rootHalf * 0.35 + tilt).toFixed(2)} ${anchorX.toFixed(2)} ${(y + rootHalf).toFixed(2)}`,
    'Z',
  ].join(' ');
}

/**
 * Organic highlighter stroke: smooth uneven body + soft brush tips.
 * Deterministic per line index so the shape stays stable while selecting.
 */
function makeBrushPaths(rect: SelectionRect, index: number): BrushPath[] {
  const lineH = rect.bottom - rect.top;
  const rawW = rect.right - rect.left;
  if (rawW < 2 || lineH < 2) return [];

  const top = rect.top + lineH * 0.2;
  const bottom = rect.bottom - lineH * 0.1;
  const strokeH = Math.max(4, bottom - top);
  const padX = Math.min(5, strokeH * 0.32);
  const left = rect.left - padX;
  const right = rect.right + padX;
  const width = right - left;
  const amp = Math.min(1.6, strokeH * 0.05);
  const samples = Math.max(6, Math.min(32, Math.ceil(width / 20)));

  const edgeY = (t: number, edge: 0 | 1) => {
    const n1 = brushNoise(index, t * 11 + edge * 37);
    const n2 = brushNoise(index, t * 23 + edge * 61);
    const wave =
      Math.sin(t * Math.PI * 2.05 + index * 1.55 + edge) * amp * 0.5 +
      Math.sin(t * Math.PI * 4.6 + index * 0.8 + edge * 1.7) * amp * 0.32 +
      (n1 - 0.5) * amp * 0.45 +
      (n2 - 0.5) * amp * 0.22;
    // Softer mid-body undulation; keep ends calmer for clean tip blending.
    const envelope = 0.25 + 0.75 * Math.sin(Math.PI * t);
    const base = edge === 0 ? top : bottom;
    return base + wave * envelope;
  };

  const topPts: BrushPoint[] = [];
  const botPts: BrushPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    topPts.push({ x: left + width * t, y: edgeY(t, 0) });
    botPts.push({ x: left + width * (1 - t), y: edgeY(1 - t, 1) });
  }

  const tipLen = Math.min(12, Math.max(5.5, Math.min(width * 0.07, strokeH * 0.85)));
  const leftMidY = (topPts[0].y + botPts[botPts.length - 1].y) / 2;
  const rightMidY = (topPts[topPts.length - 1].y + botPts[0].y) / 2;
  const leftTip: BrushPoint = { x: left - tipLen * 0.62, y: leftMidY + (brushNoise(index, 3) - 0.5) * amp };
  const rightTip: BrushPoint = { x: right + tipLen * 0.62, y: rightMidY + (brushNoise(index, 5) - 0.5) * amp };

  // Closed silhouette: left tip → top edge → right tip → bottom edge → close.
  const outline: BrushPoint[] = [
    leftTip,
    { x: left + tipLen * 0.15, y: topPts[0].y - amp * 0.15 },
    ...topPts,
    { x: right - tipLen * 0.15, y: topPts[topPts.length - 1].y - amp * 0.1 },
    rightTip,
    { x: right - tipLen * 0.15, y: botPts[0].y + amp * 0.1 },
    ...botPts,
    { x: left + tipLen * 0.15, y: botPts[botPts.length - 1].y + amp * 0.15 },
    leftTip,
  ];

  const body: BrushPath = { d: `${smoothOpenPath(outline)} Z`, kind: 'body' };

  // 3 soft hairs per side — thick at the root, tapering into a brush tip.
  const wispSpecs = [
    { t: 0.22, len: 0.72, root: 0.38 },
    { t: 0.5, len: 1, root: 0.5 },
    { t: 0.78, len: 0.78, root: 0.4 },
  ] as const;
  const maxWisp = Math.min(10, tipLen * 0.95, strokeH * 0.7);
  const rootBase = Math.max(1.1, strokeH * 0.11);

  const wisps: BrushPath[] = wispSpecs.flatMap((spec, i) => {
    const yL = top + strokeH * spec.t + (brushNoise(index, 10 + i) - 0.5) * amp * 0.8;
    const yR = top + strokeH * spec.t + (brushNoise(index, 20 + i) - 0.5) * amp * 0.8;
    const tiltL = (brushNoise(index, 30 + i) - 0.5) * 1.2;
    const tiltR = (brushNoise(index, 40 + i) - 0.5) * 1.2;
    const len = maxWisp * spec.len;
    const root = rootBase * spec.root;
    return [
      { d: makeBrushWisp('left', left + 1.5, yL, len, root, tiltL), kind: 'wisp' as const },
      { d: makeBrushWisp('right', right - 1.5, yR, len, root, tiltR), kind: 'wisp' as const },
    ];
  });

  return [body, ...wisps];
}

function SelectionBrush() {
  const [paths, setPaths] = useState<BrushPath[]>([]);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });

  useEffect(() => {
    let frame = 0;

    const updateBrush = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const selection = document.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
          document.documentElement.classList.remove('selection-brush-active');
          setPaths([]);
          return;
        }

        const rects = Array.from(selection.getRangeAt(0).getClientRects())
          .filter((rect) => rect.width > 1 && rect.height > 1)
          .map((rect) => ({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          }))
          .sort((a, b) => a.top - b.top || a.left - b.left);

        const lines: SelectionRect[] = [];
        for (const rect of rects) {
          const previous = lines.at(-1);
          if (
            previous &&
            Math.abs(previous.top - rect.top) < 3 &&
            rect.left <= previous.right + 8
          ) {
            previous.right = Math.max(previous.right, rect.right);
            previous.bottom = Math.max(previous.bottom, rect.bottom);
          } else {
            lines.push({ ...rect });
          }
        }

        if (lines.length === 0) {
          document.documentElement.classList.remove('selection-brush-active');
          setPaths([]);
          return;
        }

        document.documentElement.classList.add('selection-brush-active');
        setViewport({ width: window.innerWidth, height: window.innerHeight });
        setPaths(lines.flatMap(makeBrushPaths));
      });
    };

    document.addEventListener('selectionchange', updateBrush);
    window.addEventListener('resize', updateBrush);
    window.addEventListener('scroll', updateBrush, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('selectionchange', updateBrush);
      window.removeEventListener('resize', updateBrush);
      window.removeEventListener('scroll', updateBrush, true);
      document.documentElement.classList.remove('selection-brush-active');
    };
  }, []);

  return (
    <svg
      className="selection-brush-layer"
      viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="selection-brush-soft"
          x="-8%"
          y="-35%"
          width="116%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.06"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g filter="url(#selection-brush-soft)">
        {paths.map((path, index) => (
          <path
            className={
              path.kind === 'wisp' ? 'selection-brush-path selection-brush-path--wisp' : 'selection-brush-path'
            }
            d={path.d}
            key={`${index}-${path.kind}-${path.d.slice(0, 48)}`}
          />
        ))}
      </g>
    </svg>
  );
}

function Router() {
  const [location] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <RoutedErrorBoundary>
      <Shell home={isHome}>
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/projects" component={Projects} />
          <Route path="/projects/:slug">{(params) => <ProjectDetail slug={params.slug} />}</Route>
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Shell>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SplashScreen />
        <WouterRouter
          hook={useViewTransitionLocation}
          base={import.meta.env.BASE_URL.replace(/\/$/, '')}
        >
          <Router />
        </WouterRouter>
        <SelectionBrush />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
