import { useState, type FormEvent } from 'react';
import { ShieldCheck, BookOpen, Wallet, GraduationCap, Lock, User as UserIcon, ArrowRight, Sparkles, type LucideIcon } from 'lucide-react';
import { useApp, type User } from './ui';
import { roleLabel, type Role } from './data';
import { Stream } from './stream';

const ROLE_OPTS: { role: Role; icon: LucideIcon; hint: string }[] = [
  { role: 'admin', icon: ShieldCheck, hint: 'Полный доступ и безопасность' },
  { role: 'teacher', icon: BookOpen, hint: 'Журнал, расписание, группы' },
  { role: 'accountant', icon: Wallet, hint: 'Финансы и стипендии' },
  { role: 'student', icon: GraduationCap, hint: 'Учёба и платежи' },
];

function Login() {
  const { setUser } = useApp();
  const [role, setRole] = useState<Role>('admin');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Введите имя'); return; }
    if (pass !== '0000') { setErr('Неверный пароль (для демо: 0000)'); return; }
    setUser({ name: name.trim(), role } as User);
  };

  return (
    <div className="login">
      <aside className="login-aside">
        <div className="brand-mark" style={{ width: 36, height: 36, fontSize: 18 }}>N</div>
        <div>
          <div className="lead">Не приложение с разделами. Операционная система организации, которая думает вместе с вами.</div>
          <div className="sub">NEX не ждёт, пока вы что-то откроете. Он непрерывно анализирует происходящее, замечает аномалии, берёт рутину на себя и приносит вам только то, что важно — и что можно сделать прямо сейчас.</div>
          <div style={{ marginTop: 26 }}>
            <div className="login-feat"><span className="ico"><Sparkles size={15} /></span>Нет меню, страниц и дашбордов — есть поток того, что важно</div>
            <div className="login-feat"><span className="ico"><ShieldCheck size={15} /></span>Аудит, сессии и контроль доступа — в основе системы</div>
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

export default function App() {
  const { user } = useApp();
  return user ? <Stream /> : <Login />;
}
