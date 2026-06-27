import { useState, useEffect, useMemo, type ReactNode, type FormEvent } from 'react';
import {
  LayoutDashboard, Users, School, ClipboardList, Calendar, BookOpen, CheckSquare,
  Wallet, Award, Briefcase, BarChart3, GraduationCap, Settings as SettingsIcon,
  Search, Bell, PanelLeft, Sparkles, ShieldCheck, Lock, User as UserIcon, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useApp, type User } from './ui';
import { roleLabel, type Role } from './data';

import Dashboard from './pages/Dashboard';
import { Students, Groups, Staff } from './pages/people';
import { Schedule, Journal, Attendance } from './pages/academic';
import { Admissions, Finance, Scholarship } from './pages/operations';
import { Analytics, Graduation } from './pages/insights';
import Settings from './pages/Settings';

interface Meta { label: string; icon: LucideIcon; roles: Role[]; }
const ALL: Role[] = ['admin', 'teacher', 'accountant', 'student'];

const META: Record<string, Meta> = {
  dashboard: { label: 'Рабочий стол', icon: LayoutDashboard, roles: ALL },
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
  settings: { label: 'Настройки', icon: SettingsIcon, roles: ALL },
};

const NAV: { title: string; items: string[] }[] = [
  { title: 'Обзор', items: ['dashboard'] },
  { title: 'Обучающиеся', items: ['students', 'groups', 'admissions'] },
  { title: 'Учебный процесс', items: ['schedule', 'journal', 'attendance'] },
  { title: 'Финансы', items: ['finance', 'scholarship'] },
  { title: 'Персонал', items: ['staff'] },
  { title: 'Аналитика', items: ['analytics', 'graduation'] },
];

function renderPage(id: string): ReactNode {
  switch (id) {
    case 'dashboard': return <Dashboard />;
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
    default: return <Dashboard />;
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
          <div className="sub">NEX встроил интеллект в каждый процесс — без отдельного чат-бота. Подсказки, предотвращение ошибок и безопасность работают сами.</div>
          <div style={{ marginTop: 26 }}>
            <div className="login-feat"><span className="ico"><Sparkles size={15} /></span>Помощь в нужный момент, а не отдельной кнопкой</div>
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
                  <Icon className="ico" size={18} />
                  <b>{roleLabel[o.role]}</b>
                  <span>{o.hint}</span>
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

/* ===================== Command palette ===================== */
function CommandPalette() {
  const { cmdOpen, setCmdOpen, setPage, user } = useApp();
  const [q, setQ] = useState('');
  const items = useMemo(() => {
    const ids = Object.keys(META).filter((id) => user && META[id].roles.includes(user.role));
    return ids
      .map((id) => ({ id, label: META[id].label }))
      .filter((x) => x.label.toLowerCase().includes(q.toLowerCase()));
  }, [q, user]);

  useEffect(() => { if (!cmdOpen) setQ(''); }, [cmdOpen]);
  if (!cmdOpen) return null;

  const go = (id: string) => { setPage(id); setCmdOpen(false); };

  return (
    <div className="cmd-overlay" onClick={() => setCmdOpen(false)}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <input className="cmd-input" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Что нужно сделать? Введите команду или вопрос…" />
        <div className="cmd-list">
          <div className="cmd-section">Переход</div>
          {items.map((it) => {
            const Icon = META[it.id].icon;
            return (
              <div className="cmd-item" key={it.id} onClick={() => go(it.id)}>
                <Icon size={16} />{it.label}<span className="hint">↵</span>
              </div>
            );
          })}
          {items.length === 0 && <div className="cmd-item" style={{ color: 'var(--text-3)' }}>Ничего не найдено</div>}
        </div>
      </div>
    </div>
  );
}

/* ===================== Shell ===================== */
function Shell() {
  const { user, page, setPage, collapsed, setCollapsed, cmdOpen, setCmdOpen, setUser } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(!cmdOpen); }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdOpen, setCmdOpen]);

  if (!user) return null;
  const title = META[page]?.label || 'NEX';

  return (
    <div className={`shell ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">N</div>
          <div className="brand-text"><b>NEX</b><span>КИС Колледж</span></div>
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
                    <div key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => setPage(id)} title={META[id].label}>
                      <Icon size={17} /><span>{META[id].label}</span>
                      {id === 'dashboard' && user.role === 'admin' && <span className="nav-badge">3</span>}
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
          <div className="nav-item" onClick={() => setUser(null)}>
            <div className="avatar">{(user.name[0] || 'U').toUpperCase()}</div>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name} · {roleLabel[user.role]}</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Свернуть меню"><PanelLeft size={18} /></button>
          <strong style={{ fontSize: 14, fontWeight: 600 }}>{title}</strong>
          <div className="cmd-trigger" style={{ margin: '0 auto' }} onClick={() => setCmdOpen(true)}>
            <Search size={15} />Поиск и команды…<span className="kbd">⌘K</span>
          </div>
          <button className="icon-btn" onClick={() => setPage('dashboard')} aria-label="Уведомления"><Bell size={18} /><span className="dot-alert" /></button>
        </header>
        <div className="content">{renderPage(page)}</div>
      </div>

      <CommandPalette />
    </div>
  );
}

export default function App() {
  const { user } = useApp();
  return user ? <Shell /> : <Login />;
}
