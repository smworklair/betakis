import { useState, useEffect, useMemo, type ReactNode, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  LayoutDashboard, Users, School, ClipboardList, Calendar, BookOpen, CheckSquare,
  Wallet, Award, Briefcase, BarChart3, GraduationCap, ShieldCheck, Settings as SettingsIcon,
  Search, Bell, PanelLeft, Sparkles, Lock, User as UserIcon, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useApp, type User } from './ui';
import { roleLabel, type Role } from './data';
import { ContextDrawer } from './blocks';
import { AiLayer } from './ai';

import Chat from './pages/Chat';
import CommandCenter from './pages/CommandCenter';
import { SecurityConsole } from './pages/Dashboard';
import { Students, Groups, Staff } from './pages/people';
import { Schedule, Journal, Attendance } from './pages/academic';
import { Admissions, Finance, Scholarship } from './pages/operations';
import { Analytics, Graduation } from './pages/insights';
import Settings from './pages/Settings';

interface Meta { label: string; icon: LucideIcon; roles: Role[]; }
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

/* ===================== Command palette (quick, predictable navigation) ===================== */
function CommandPalette() {
  const { cmdOpen, setCmdOpen, setPage, openChat, user } = useApp();
  const [q, setQ] = useState('');
  const items = useMemo(() => {
    const ids = Object.keys(META).filter((id) => id !== 'chat' && user && META[id].roles.includes(user.role));
    return ids.map((id) => ({ id, label: META[id].label })).filter((x) => x.label.toLowerCase().includes(q.toLowerCase()));
  }, [q, user]);

  useEffect(() => { if (!cmdOpen) setQ(''); }, [cmdOpen]);
  if (!cmdOpen) return null;
  const go = (id: string) => { setPage(id); setCmdOpen(false); };
  const ask = () => { openChat(q.trim() || undefined); setCmdOpen(false); };

  // Enter: if a section matches, jump to it; otherwise hand the query to NEX.
  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (items.length > 0) go(items[0].id); else ask();
  };

  const hasQuery = q.trim().length > 0;

  return (
    <div className="cmd-overlay" onClick={() => setCmdOpen(false)}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <input className="cmd-input" autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Перейти к разделу или спросить NEX…" />
        <div className="cmd-list">
          {/* NEX is a native option in the same surface — not a separate place */}
          <div className="cmd-ask" onClick={ask}>
            <span className="ic"><Sparkles size={17} /></span>
            <span className="tx">
              <b>{hasQuery ? `Спросить NEX: «${q.trim()}»` : 'Открыть чат NEX'}</b>
              <span>{hasQuery ? 'ответит по данным и откроет нужный раздел' : 'полноценная альтернатива навигации'}</span>
            </span>
            <span className="hint">↵</span>
          </div>

          <div className="cmd-section">Разделы</div>
          {items.map((it) => {
            const Icon = META[it.id].icon;
            return <div className="cmd-item" key={it.id} onClick={() => go(it.id)}><Icon size={16} />{it.label}<span className="hint">↵</span></div>;
          })}
          {items.length === 0 && hasQuery && <div className="cmd-item dim">Раздел не найден — нажмите Enter, чтобы спросить NEX</div>}
        </div>
      </div>
    </div>
  );
}

/* ===================== Shell ===================== */
function Shell() {
  const { user, page, setPage, cmdOpen, setCmdOpen, aiOpen, openAi, closeAi, openChat } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') { e.preventDefault(); openChat(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') { e.preventDefault(); aiOpen ? closeAi() : openAi(); }
      if (e.key === 'Escape') { setCmdOpen(false); closeAi(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCmdOpen, aiOpen, openAi, closeAi, openChat]);

  if (!user) return null;
  const title = META[page]?.label || 'NEX';

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">N</div>
          <div className="brand-text"><b>NEX</b><span>КИС Колледж</span></div>
        </div>
        <button className={`nex-ask ${page === 'chat' ? 'active' : ''}`} onClick={() => openChat()}>
          <Sparkles size={16} /><span>Спросить NEX</span><span className="kbd">⌘J</span>
        </button>
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
                    <div key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => setPage(id)} title={META[id].label}>
                      <Icon size={17} /><span>{META[id].label}</span>
                      {id === 'security' && user.role === 'admin' && <span className="nav-badge">2</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div className={`nav-item ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}>
            <SettingsIcon size={17} /><span>Настройки</span>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <strong style={{ fontSize: 14, fontWeight: 600 }}>{title}</strong>
          <button className="ask-bar" onClick={() => openChat()}>
            <Sparkles size={15} className="spark" /><span>Спросить NEX — что угодно об организации…</span><span className="kbd">⌘J</span>
          </button>
          <button className="icon-btn" onClick={() => setCmdOpen(true)} title="Перейти к разделу (⌘K)" aria-label="Поиск раздела"><Search size={18} /></button>
          <button className="icon-btn" onClick={() => setPage('dashboard')} aria-label="Уведомления"><Bell size={18} /><span className="dot-alert" /></button>
          <div className="avatar" title={`${user.name} · ${roleLabel[user.role]}`}>{(user.name[0] || 'U').toUpperCase()}</div>
        </header>
        <div className={`content ${page === 'chat' ? 'content-flush' : ''}`}>{renderPage(page)}</div>
      </div>

      <ContextDrawer />
      <CommandPalette />
      <AiLayer />
    </div>
  );
}

export default function App() {
  const { user } = useApp();
  return user ? <Shell /> : <Login />;
}
