import { useState, useEffect, useMemo, useRef, type ReactNode, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  LayoutDashboard, Users, School, ClipboardList, Calendar, BookOpen, CheckSquare,
  Wallet, Award, Briefcase, BarChart3, GraduationCap, ShieldCheck, Settings as SettingsIcon,
  Bell, Sparkles, Lock, User as UserIcon, ArrowRight, Menu, X, LogOut,
  MessageSquare, FileText, Rss, Compass,
  type LucideIcon,
} from 'lucide-react';
import { useApp, Beta, useIsMobile, type User } from './ui';
import { roleLabel, type Role } from './data';
import { ContextDrawer } from './blocks';
import { AiLayer, ProactiveStrip } from './ai';

import Chat from './pages/Chat';
import { Messenger, NotificationsPage, Documents, Feed, Campus } from './pages/beta';
import CommandCenter from './pages/CommandCenter';
import { SecurityConsole } from './pages/Dashboard';
import { Students, Groups, Staff } from './pages/people';
import { Schedule, Journal, Attendance } from './pages/academic';
import { Admissions, Finance, Scholarship } from './pages/operations';
import { Analytics, Graduation } from './pages/insights';
import Settings from './pages/Settings';

interface Meta { label: string; icon: LucideIcon; roles: Role[]; beta?: boolean; }
const ALL: Role[] = ['admin', 'teacher', 'accountant', 'student'];

const META: Record<string, Meta> = {
  chat: { label: 'NEX · Чат', icon: Sparkles, roles: ALL },
  dashboard: { label: 'Командный центр', icon: LayoutDashboard, roles: ALL },
  students: { label: 'Студенты', icon: Users, roles: ['admin', 'teacher', 'accountant'] },
  groups: { label: 'Группы', icon: School, roles: ['admin', 'teacher'] },
  admissions: { label: 'Приём', icon: ClipboardList, roles: ['admin'] },
  schedule: { label: 'Расписание', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
  journal: { label: 'Журнал', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
  attendance: { label: 'Посещаемость', icon: CheckSquare, roles: ['admin', 'teacher', 'student'] },
  finance: { label: 'Финансы', icon: Wallet, roles: ['admin', 'accountant', 'student'] },
  scholarship: { label: 'Стипендии', icon: Award, roles: ['admin', 'accountant'] },
  staff: { label: 'Сотрудники', icon: Briefcase, roles: ['admin'] },
  analytics: { label: 'Аналитика', icon: BarChart3, roles: ['admin', 'teacher', 'accountant'] },
  graduation: { label: 'Выпуск', icon: GraduationCap, roles: ['admin', 'teacher'] },
  security: { label: 'Безопасность', icon: ShieldCheck, roles: ['admin'] },
  messenger: { label: 'Мессенджер', icon: MessageSquare, roles: ['admin'], beta: true },
  notifications: { label: 'Уведомления', icon: Bell, roles: ['admin'], beta: true },
  documents: { label: 'Документы', icon: FileText, roles: ['admin'], beta: true },
  feed: { label: 'Лента', icon: Rss, roles: ['admin'], beta: true },
  campus: { label: 'Кампус', icon: Compass, roles: ['admin'], beta: true },
  settings: { label: 'Настройки', icon: SettingsIcon, roles: ALL },
};

const NAV: { title: string; items: string[] }[] = [
  { title: 'Обзор', items: ['dashboard'] },
  { title: 'Обучающиеся', items: ['students', 'groups', 'admissions'] },
  { title: 'Учебный процесс', items: ['schedule', 'journal', 'attendance'] },
  { title: 'Финансы', items: ['finance', 'scholarship'] },
  { title: 'Персонал', items: ['staff'] },
  { title: 'Аналитика', items: ['analytics', 'graduation'] },
  { title: 'Безопасность', items: ['security'] },
  { title: 'Бета', items: ['messenger', 'notifications', 'documents', 'feed', 'campus'] },
];

function renderPage(id: string): ReactNode {
  switch (id) {
    case 'chat': return <Chat />;
    case 'dashboard': return <CommandCenter />;
    case 'security': return <SecurityConsole />;
    case 'students': return <Students />;
    case 'groups': return <Groups />;
    case 'admissions': return <Admissions />;
    case 'schedule': return <Schedule />;
    case 'journal': return <Journal />;
    case 'attendance': return <Attendance />;
    case 'finance': return <Finance />;
    case 'scholarship': return <Scholarship />;
    case 'staff': return <Staff />;
    case 'analytics': return <Analytics />;
    case 'graduation': return <Graduation />;
    case 'messenger': return <Messenger />;
    case 'notifications': return <NotificationsPage />;
    case 'documents': return <Documents />;
    case 'feed': return <Feed />;
    case 'campus': return <Campus />;
    case 'settings': return <Settings />;
    default: return <CommandCenter />;
  }
}

/* ===================== Login ===================== */
const ROLE_OPTS: { role: Role; icon: LucideIcon; hint: string }[] = [
  { role: 'admin', icon: ShieldCheck, hint: 'Полный доступ и безопасность' },
  { role: 'teacher', icon: BookOpen, hint: 'Журнал, расписание, группы' },
  { role: 'accountant', icon: Wallet, hint: 'Финансы и стипендии' },
  { role: 'student', icon: GraduationCap, hint: 'Учёба и платежи' },
];

function Login() {
  const { setUser, setPage } = useApp();
  const [role, setRole] = useState<Role>('admin');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Введите имя'); return; }
    if (pass !== '0000') { setErr('Неверный пароль (для демо: 0000)'); return; }
    setPage('dashboard');
    setUser({ name: name.trim(), role } as User);
  };

  return (
    <div className="login">
      <aside className="login-aside">
        <div className="brand-mark" style={{ width: 36, height: 36, fontSize: 18 }}>N</div>
        <div>
          <div className="lead">Корпоративная платформа, рождённая в эпоху ИИ.</div>
          <div className="sub">Обычный, предсказуемый интерфейс — но интеллект встроен в каждый процесс: следит за контекстом, ловит аномалии, берёт на себя рутину и подсказывает действия. Невидимый интеллект, а не видимый ИИ.</div>
          <div style={{ marginTop: 26 }}>
            <div className="login-feat"><span className="ico"><Sparkles size={15} /></span>Помощь появляется только когда есть реальная польза</div>
            <div className="login-feat"><span className="ico"><ShieldCheck size={15} /></span>Аудит, сессии и контроль доступа из коробки</div>
          </div>
        </div>
        <div className="sub" style={{ fontSize: 12 }}>NEX · Foundation</div>
      </aside>

      <main className="login-main">
        <form className="login-card" onSubmit={submit}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Вход в NEX</h1>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 4, marginBottom: 20 }}>Выберите роль и войдите. Демо-пароль: <b className="mono">0000</b></p>

          <label className="field-label">Тип учётной записи</label>
          <div className="role-grid" style={{ marginBottom: 18 }}>
            {ROLE_OPTS.map((o) => {
              const Icon = o.icon;
              return (
                <button type="button" key={o.role} className={`role-btn ${role === o.role ? 'active' : ''}`} onClick={() => setRole(o.role)}>
                  <Icon className="ico" size={18} /><b>{roleLabel[o.role]}</b><span>{o.hint}</span>
                </button>
              );
            })}
          </div>

          <label className="field-label">Имя</label>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <UserIcon size={15} style={{ position: 'absolute', left: 11, top: 10, color: 'var(--text-3)' }} />
            <input className="input" style={{ paddingLeft: 34 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Любое имя" />
          </div>

          <label className="field-label">Пароль</label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Lock size={15} style={{ position: 'absolute', left: 11, top: 10, color: 'var(--text-3)' }} />
            <input className="input" style={{ paddingLeft: 34 }} type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="0000" />
          </div>

          {err && <div className="chip chip-danger" style={{ marginBottom: 14 }}>{err}</div>}

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 40 }} type="submit">
            Войти как {roleLabel[role]} <ArrowRight size={16} />
          </button>
        </form>
      </main>
    </div>
  );
}

/* ===================== Topbar NEX mini-window (search + ask, in one) ===================== */
function NexOmni() {
  const { setPage, openChat, user } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const sections = useMemo(() => {
    const ids = Object.keys(META).filter((id) => id !== 'chat' && user && META[id].roles.includes(user.role));
    return ids.map((id) => ({ id, label: META[id].label })).filter((x) => x.label.toLowerCase().includes(q.toLowerCase()));
  }, [q, user]);

  const suggestions = [
    'Что сегодня важно?',
    'Студенты в зоне риска и почему',
    'Что с финансами и задолженностью?',
    'Состояние безопасности',
  ];

  const close = () => { setOpen(false); setQ(''); };
  const go = (id: string) => { setPage(id); close(); };
  const ask = (text?: string) => { openChat((text ?? q).trim() || undefined); close(); };
  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (sections.length > 0) go(sections[0].id); else ask();
  };

  const hasQuery = q.trim().length > 0;

  return (
    <div className="omni" ref={wrapRef}>
      <div className={`ask-bar ${open ? 'on' : ''}`} onClick={() => setOpen(true)}>
        <Sparkles size={15} className="spark" />
        <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey} placeholder="Спросить NEX — что угодно об организации…" />
      </div>

      {open && (
        <div className="omni-pop">
          {/* NEX as a native option in the same surface */}
          <div className="cmd-ask" onClick={() => ask()}>
            <span className="ic"><Sparkles size={17} /></span>
            <span className="tx">
              <b>{hasQuery ? `Спросить NEX: «${q.trim()}»` : 'Открыть чат NEX'}</b>
              <span>{hasQuery ? 'ответит по данным и откроет нужный экран' : 'опишите задачу своими словами'}</span>
            </span>
          </div>

          {!hasQuery && (
            <>
              <div className="cmd-section">Подсказки</div>
              {suggestions.map((s) => (
                <div className="cmd-item" key={s} onClick={() => ask(s)}><Sparkles size={15} style={{ color: 'var(--ai)' }} />{s}</div>
              ))}
            </>
          )}

          <div className="cmd-section">Разделы</div>
          {sections.slice(0, hasQuery ? 8 : 5).map((it) => {
            const Icon = META[it.id].icon;
            return <div className="cmd-item" key={it.id} onClick={() => go(it.id)}><Icon size={16} />{it.label}</div>;
          })}
          {sections.length === 0 && <div className="cmd-item dim">Раздел не найден — Enter, чтобы спросить NEX</div>}
        </div>
      )}
    </div>
  );
}

/* ===================== Shell ===================== */
function Shell() {
  const { user, page, setPage, sidebarEnabled, navOpen, setNavOpen } = useApp();

  if (!user) return null;
  const title = META[page]?.label || 'NEX';
  const nav = (id: string) => { setPage(id); setNavOpen(false); };

  return (
    <div className={`shell ${sidebarEnabled ? '' : 'no-sidebar'} ${navOpen ? 'nav-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">N</div>
          <div className="brand-text"><b>NEX</b><span>КИС Колледж</span></div>
          <button className="icon-btn nav-close" onClick={() => setNavOpen(false)} aria-label="Закрыть меню"><X size={18} /></button>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((grp) => {
            const items = grp.items.filter((id) => META[id].roles.includes(user.role));
            if (items.length === 0) return null;
            return (
              <div className="nav-group" key={grp.title}>
                <div className="nav-group-title">{grp.title}</div>
                {items.map((id) => {
                  const Icon = META[id].icon;
                  return (
                    <div key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => nav(id)} title={META[id].label}>
                      <Icon size={17} /><span>{META[id].label}</span>
                      {META[id].beta && <Beta />}
                      {id === 'security' && user.role === 'admin' && <span className="nav-badge">2</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div className={`nav-item ${page === 'settings' ? 'active' : ''}`} onClick={() => nav('settings')}>
            <SettingsIcon size={17} /><span>Настройки</span>
          </div>
        </div>
      </aside>

      {navOpen && <div className="nav-backdrop" onClick={() => setNavOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn nav-toggle" onClick={() => setNavOpen(true)} aria-label="Меню"><Menu size={18} /></button>
          <strong className="topbar-title" style={{ fontSize: 14, fontWeight: 600 }}>{title}</strong>
          <NexOmni />
          <button className="icon-btn topbar-bell" onClick={() => nav('notifications')} aria-label="Уведомления"><Bell size={18} /><span className="dot-alert" /></button>
          <div className="avatar" title={`${user.name} · ${roleLabel[user.role]}`}>{(user.name[0] || 'U').toUpperCase()}</div>
        </header>
        <div className={`content ${page === 'chat' ? 'content-flush' : ''}`}>
          <ProactiveStrip />
          {renderPage(page)}
        </div>
      </div>

      <ContextDrawer />
      <AiLayer />
    </div>
  );
}

/* ===================== Mobile shell (X / Twitter-style architecture) ===================== */
function MobileShell() {
  const { user, page, setPage, openChat, setUser } = useApp();
  const [drawer, setDrawer] = useState(false);
  if (!user) return null;

  const go = (id: string) => { setPage(id); setDrawer(false); };
  const avail = Object.keys(META).filter((id) => id !== 'chat' && META[id].roles.includes(user.role));
  const tabs = ['dashboard', 'students', 'notifications', 'messenger', 'finance', 'schedule', 'analytics', 'security']
    .filter((id) => avail.includes(id)).slice(0, 4);
  const isChat = page === 'chat';
  const initials = (user.name[0] || 'U').toUpperCase();

  return (
    <div className="m-shell">
      <header className="m-top x">
        <button className="m-avatar-btn" onClick={() => setDrawer(true)} aria-label="Меню"><span className="avatar">{initials}</span></button>
        <div className="m-brand-c"><div className="brand-mark" style={{ width: 24, height: 24, fontSize: 12 }}>N</div><b>NEX</b></div>
        <button className="icon-btn" onClick={() => go('notifications')} aria-label="Уведомления"><Bell size={20} /><span className="dot-alert" /></button>
      </header>

      <div className={`m-content ${isChat ? 'flush' : ''}`}>
        <ProactiveStrip />
        {renderPage(page)}
      </div>

      {!isChat && (
        <button className="m-fab" onClick={() => openChat()} aria-label="Спросить NEX"><Sparkles size={24} /></button>
      )}

      <nav className="m-tabs x">
        {tabs.map((id) => {
          const Icon = META[id].icon;
          return <button key={id} className={`m-tab ${page === id ? 'active' : ''}`} onClick={() => go(id)} aria-label={META[id].label}><Icon size={24} /></button>;
        })}
        <button className={`m-tab ${isChat ? 'active' : ''}`} onClick={() => openChat()} aria-label="NEX"><Sparkles size={24} /></button>
      </nav>

      {drawer && (
        <div className="m-drawer-veil" onClick={() => setDrawer(false)}>
          <div className="m-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="m-drawer-head">
              <span className="avatar lg">{initials}</span>
              <div className="m-drawer-id"><b>{user.name}</b><span className="dim">{roleLabel[user.role]}</span></div>
            </div>
            <div className="m-drawer-nav">
              {NAV.map((grp) => {
                const items = grp.items.filter((id) => META[id].roles.includes(user.role));
                if (items.length === 0) return null;
                return (
                  <div key={grp.title}>
                    <div className="m-drawer-group">{grp.title}</div>
                    {items.map((id) => {
                      const Icon = META[id].icon;
                      return (
                        <button key={id} className={`m-drawer-item ${page === id ? 'active' : ''}`} onClick={() => go(id)}>
                          <Icon size={20} /><span>{META[id].label}</span>{META[id].beta && <Beta />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              <div className="m-drawer-sep" />
              <button className={`m-drawer-item ${page === 'settings' ? 'active' : ''}`} onClick={() => go('settings')}><SettingsIcon size={20} /><span>Настройки</span></button>
              <button className="m-drawer-item" onClick={() => setUser(null)}><LogOut size={20} /><span>Выйти</span></button>
            </div>
          </div>
        </div>
      )}

      <ContextDrawer />
      <AiLayer />
    </div>
  );
}

export default function App() {
  const { user } = useApp();
  const isMobile = useIsMobile();
  if (!user) return <Login />;
  return isMobile ? <MobileShell /> : <Shell />;
}
