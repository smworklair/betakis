import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
  Home as HomeIcon, Command as CommandIcon, Settings as SettingsIcon, LogOut,
  Sparkles, ShieldCheck, BookOpen, Wallet, GraduationCap, Lock, User as UserIcon, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useApp, type User } from './ui';
import { roleLabel, type Role } from './data';
import { Canvas, ContextDrawer, INTENTS } from './canvas';
import Settings from './pages/Settings';

/* ===================== Login ===================== */
const ROLE_OPTS: { role: Role; icon: LucideIcon; hint: string }[] = [
  { role: 'admin', icon: ShieldCheck, hint: 'Полный доступ и безопасность' },
  { role: 'teacher', icon: BookOpen, hint: 'Журнал, расписание, группы' },
  { role: 'accountant', icon: Wallet, hint: 'Финансы и стипендии' },
  { role: 'student', icon: GraduationCap, hint: 'Учёба и платежи' },
];

function Login() {
  const { setUser, goHome } = useApp();
  const [role, setRole] = useState<Role>('admin');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Введите имя'); return; }
    if (pass !== '0000') { setErr('Неверный пароль (для демо: 0000)'); return; }
    goHome();
    setUser({ name: name.trim(), role } as User);
  };

  return (
    <div className="login">
      <aside className="login-aside">
        <div className="brand-mark" style={{ width: 36, height: 36, fontSize: 18 }}>N</div>
        <div>
          <div className="lead">Корпоративная платформа, рождённая в эпоху ИИ.</div>
          <div className="sub">Здесь нет меню модулей и чат-бота. Вы описываете задачу — NEX сам находит данные, действия и подсказывает следующий шаг.</div>
          <div style={{ marginTop: 26 }}>
            <div className="login-feat"><span className="ico"><Sparkles size={15} /></span>Интерфейс собирается вокруг вашего намерения</div>
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

/* ===================== Command palette (secondary discoverability map) ===================== */
function CommandPalette() {
  const { cmdOpen, setCmdOpen, runAsk, user } = useApp();
  const [q, setQ] = useState('');
  const items = useMemo(() => {
    const list = INTENTS.filter((i) => user && i.roles.includes(user.role));
    return list.filter((x) => x.label.toLowerCase().includes(q.toLowerCase()) || x.q.includes(q.toLowerCase()));
  }, [q, user]);

  useEffect(() => { if (!cmdOpen) setQ(''); }, [cmdOpen]);
  if (!cmdOpen) return null;

  const submit = (e: FormEvent) => { e.preventDefault(); if (q.trim()) runAsk(q.trim()); };

  return (
    <div className="cmd-overlay" onClick={() => setCmdOpen(false)}>
      <form className="cmd-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <input className="cmd-input" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Спросите или дайте команду…" />
        <div className="cmd-list">
          <div className="cmd-section">Разделы и интенты</div>
          {items.map((it) => {
            const Icon = it.icon;
            return <div className="cmd-item" key={it.q} onClick={() => runAsk(it.q)}><Icon size={16} />{it.label}<span className="hint">↵</span></div>;
          })}
          {q.trim() && <div className="cmd-item" onClick={() => runAsk(q.trim())}><Sparkles size={16} style={{ color: 'var(--ai)' }} />Спросить NEX: «{q.trim()}»</div>}
        </div>
      </form>
    </div>
  );
}

/* ===================== Rail + Shell ===================== */
function Rail() {
  const { user, page, query, goHome, setPage, setCmdOpen, setUser } = useApp();
  if (!user) return null;
  const onHome = page === 'home' && !query;
  return (
    <div className="rail">
      <div className="brand-mark" onClick={goHome} style={{ cursor: 'pointer' }}>N</div>
      <button className={`rail-item ${onHome ? 'active' : ''}`} title="Главная" onClick={goHome}><HomeIcon size={19} /></button>
      <button className="rail-item" title="Команды (⌘K)" onClick={() => setCmdOpen(true)}><CommandIcon size={19} /></button>
      <div className="rail-spacer" />
      <button className={`rail-item ${page === 'settings' ? 'active' : ''}`} title="Настройки" onClick={() => setPage('settings')}><SettingsIcon size={19} /></button>
      <button className="rail-item" title={`${user.name} · выйти`} onClick={() => setUser(null)}><LogOut size={18} /></button>
    </div>
  );
}

function Shell() {
  const { user, page, setCmdOpen } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(true); }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCmdOpen]);

  if (!user) return null;

  return (
    <div className="appwrap">
      <Rail />
      {page === 'settings'
        ? <div className="canvas"><div className="canvas-inner"><Settings /></div></div>
        : <Canvas />}
      <ContextDrawer />
      <CommandPalette />
    </div>
  );
}

export default function App() {
  const { user } = useApp();
  return user ? <Shell /> : <Login />;
}
