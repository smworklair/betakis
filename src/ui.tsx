import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import type { Role, Severity } from './data';

export type Theme = 'light' | 'dark';
export interface User { name: string; role: Role; }

interface AppCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  /** Conventional, predictable navigation: the current module/page id. */
  page: string;
  setPage: (p: string) => void;
  /** Focused object (student) for the context drawer. */
  objStudent: number | null;
  openStudent: (id: number) => void;
  closeObject: () => void;
  cmdOpen: boolean;
  setCmdOpen: (v: boolean) => void;
  /** Ambient, on-demand AI layer (Cmd+E) — secondary, surfaces only when useful. */
  aiOpen: boolean;
  aiSeed: string | null;
  openAi: (seed?: string) => void;
  closeAi: () => void;
  toast: (msg: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);
export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used within AppProvider');
  return c;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('nex-theme') as Theme) || 'light');
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState('dashboard');
  const [objStudent, setObjStudent] = useState<number | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiSeed, setAiSeed] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nex-theme', theme);
  }, [theme]);

  const openStudent = (id: number) => setObjStudent(id);
  const closeObject = () => setObjStudent(null);
  const openAi = (seed?: string) => { setAiSeed(seed ?? null); setAiOpen(true); };
  const closeAi = () => setAiOpen(false);

  const toast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 2600);
  };

  return (
    <Ctx.Provider value={{ theme, setTheme, user, setUser, page, setPage, objStudent, openStudent, closeObject, cmdOpen, setCmdOpen, aiOpen, aiSeed, openAi, closeAi, toast }}>
      {children}
      {toastMsg && <div className="toast fade"><Sparkles size={15} style={{ color: 'var(--ai)' }} />{toastMsg}</div>}
    </Ctx.Provider>
  );
}

/* ---------- small presentational helpers ---------- */

export const severityTone: Record<Severity, string> = {
  low: 'chip-neutral', medium: 'chip-info', high: 'chip-warn', critical: 'chip-danger',
};
export const severityLabel: Record<Severity, string> = {
  low: 'Инфо', medium: 'Средне', high: 'Важно', critical: 'Критично',
};

export function Chip({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`chip ${tone}`}><i className="ico" style={{ background: 'currentColor' }} />{children}</span>;
}

export function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return <span className="avatar">{initials || '—'}</span>;
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <div className="page-sub">{sub}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}

export function Sparkline({ data, color = 'var(--accent)', width = 96, height = 28 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data, 1);
  const step = width / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => `${i * step},${height - (v / max) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AiInsightCard({ title, desc, confidence, onAct }: { title: string; desc: string; confidence: number; onAct?: () => void }) {
  return (
    <div className="ai-card">
      <div className="ai-head"><Sparkles size={14} /> Подсказка NEX · уверенность {Math.round(confidence * 100)}%</div>
      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{title}</div>
      <div className="ai-body muted" style={{ marginTop: 2 }}>{desc}</div>
      <div className="ai-actions">
        <button className="btn btn-sm btn-primary" onClick={onAct}>Открыть</button>
        <button className="btn btn-sm btn-ghost">Почему?</button>
        <button className="btn btn-sm btn-ghost">Скрыть</button>
      </div>
    </div>
  );
}
