import { useState, useEffect, useMemo, type ReactNode, type FormEvent } from 'react';
import {
  Sparkles, ArrowUp, X, Users, School, ClipboardList, Calendar, BookOpen, CheckSquare,
  Wallet, Award, Briefcase, BarChart3, GraduationCap, ShieldCheck, AlertTriangle, LogIn,
  FileText, ArrowRight, Clock, type LucideIcon,
} from 'lucide-react';
import { useApp, Chip } from './ui';
import { students, finance, gradesFor, type Role } from './data';

import { Students, Groups, Staff } from './pages/people';
import { Schedule, Journal, Attendance } from './pages/academic';
import { Admissions, Finance, Scholarship } from './pages/operations';
import { Analytics, Graduation } from './pages/insights';
import { SecurityConsole } from './pages/Dashboard';

const ALL: Role[] = ['admin', 'teacher', 'accountant', 'student'];

export interface Intent { label: string; q: string; icon: LucideIcon; roles: Role[]; }
export const INTENTS: Intent[] = [
  { label: 'Студенты', q: 'студенты', icon: Users, roles: ['admin', 'teacher', 'accountant'] },
  { label: 'Группы', q: 'группы', icon: School, roles: ['admin', 'teacher'] },
  { label: 'Приём', q: 'приём', icon: ClipboardList, roles: ['admin'] },
  { label: 'Расписание', q: 'расписание', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
  { label: 'Журнал', q: 'журнал', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
  { label: 'Посещаемость', q: 'посещаемость', icon: CheckSquare, roles: ['admin', 'teacher', 'student'] },
  { label: 'Финансы', q: 'финансы', icon: Wallet, roles: ['admin', 'accountant', 'student'] },
  { label: 'Стипендии', q: 'стипендии', icon: Award, roles: ['admin', 'accountant'] },
  { label: 'Сотрудники', q: 'сотрудники', icon: Briefcase, roles: ['admin'] },
  { label: 'Аналитика', q: 'аналитика', icon: BarChart3, roles: ['admin', 'teacher', 'accountant'] },
  { label: 'Выпуск', q: 'выпуск', icon: GraduationCap, roles: ['admin', 'teacher'] },
  { label: 'Безопасность', q: 'безопасность', icon: ShieldCheck, roles: ['admin'] },
];

const attendanceRate = (id: number) => 100 - ((id * 13) % 35);
const avgGrade = (id: number, group: string) => {
  const marks = (gradesFor(group)[id] || []).filter((g) => g > 0);
  return marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
};

interface ResolveCtx { role: Role; openStudent: (id: number) => void; toast: (m: string) => void; wide: boolean; }
interface Resolved { title: string; node: ReactNode; follows: string[]; wide?: boolean; }

function Section({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={wide ? 'canvas-wide' : ''}>{children}</div>;
}

/* ---- custom composed result blocks ---- */
function Debtors({ openStudent, toast }: ResolveCtx): ReactNode {
  const debtors = finance.payments.filter((p) => p.status !== 'Оплачено');
  return (
    <div>
      <div className="ai-card" style={{ marginBottom: 16, borderLeftColor: 'var(--warn)' }}>
        <div className="ai-head" style={{ color: 'var(--warn)' }}><AlertTriangle size={14} /> Найдено {debtors.length} с задолженностью</div>
        <div className="ai-body">Отсортированы по риску. Можно сразу сформировать уведомления — действие пройдёт через журнал аудита.</div>
        <div className="ai-actions"><button className="btn btn-sm btn-primary" onClick={() => toast('Уведомления подготовлены к отправке')}>Сформировать уведомления</button></div>
      </div>
      <div className="card"><div className="table-wrap"><table className="tbl">
        <thead><tr><th>Студент</th><th>Группа</th><th className="right">Сумма</th><th>Статус</th></tr></thead>
        <tbody>{debtors.map((p) => {
          const st = students.find((s) => `${s.lastname} ${s.firstname[0]}.` === p.student || p.student.startsWith(s.lastname));
          return (
            <tr key={p.id} style={st ? { cursor: 'pointer' } : undefined} onClick={() => st && openStudent(st.id)}>
              <td style={{ fontWeight: 600 }}>{p.student}</td><td className="mono">{p.group}</td>
              <td className="right mono">₽ {p.sum.toLocaleString('ru')}</td>
              <td><Chip tone={p.status === 'Просрочено' ? 'chip-danger' : 'chip-warn'}>{p.status}</Chip></td>
            </tr>
          );
        })}</tbody>
      </table></div></div>
    </div>
  );
}

function AtRisk({ openStudent }: ResolveCtx): ReactNode {
  const risky = students
    .map((s) => ({ s, rate: attendanceRate(s.id), avg: avgGrade(s.id, s.group) }))
    .filter((x) => x.rate < 78 || x.avg < 3.6)
    .sort((a, b) => a.rate - b.rate);
  return (
    <div>
      <div className="ai-card" style={{ marginBottom: 16 }}>
        <div className="ai-head"><Sparkles size={14} /> {risky.length} студентов в зоне риска</div>
        <div className="ai-body">Объединил посещаемость и средний балл за 2 недели. Нажмите на студента — откроется полная карточка со всеми связями.</div>
      </div>
      <div className="card"><div className="table-wrap"><table className="tbl">
        <thead><tr><th>Студент</th><th>Группа</th><th className="right">Посещаемость</th><th className="right">Ср. балл</th><th>Риск</th></tr></thead>
        <tbody>{risky.map(({ s, rate, avg }) => (
          <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => openStudent(s.id)}>
            <td style={{ fontWeight: 600 }}>{s.lastname} {s.firstname}</td><td className="mono">{s.group}</td>
            <td className="right mono" style={{ color: rate < 70 ? 'var(--danger)' : 'var(--warn)' }}>{rate}%</td>
            <td className="right mono">{avg.toFixed(1)}</td>
            <td><Chip tone={rate < 70 ? 'chip-danger' : 'chip-warn'}>{rate < 70 ? 'высокий' : 'средний'}</Chip></td>
          </tr>
        ))}</tbody>
      </table></div></div>
    </div>
  );
}

function resolveIntent(query: string, ctx: ResolveCtx): Resolved {
  const q = query.toLowerCase().trim();
  const has = (...ws: string[]) => ws.some((w) => q.includes(w));

  if (has('должник', 'задолж', 'долг', 'просроч')) return { title: 'Должники', node: <Debtors {...ctx} />, follows: ['аномалии платежей', 'финансы'] };
  if (has('риск', 'отчисл')) return { title: 'Студенты в зоне риска', node: <AtRisk {...ctx} />, follows: ['посещаемость', 'журнал'] };
  if (has('безопас', 'угроз', 'аудит', 'сесси', 'вход', 'целостн', 'систем', 'мониторинг')) return { title: 'Безопасность и состояние системы', node: <SecurityConsole />, follows: ['неудачные входы', 'активные сессии'], wide: true };
  if (has('расписан', 'конфликт', 'окно', 'аудитор')) return { title: 'Расписание', node: <Schedule />, follows: ['свободные аудитории', 'журнал'] };
  if (has('оцен', 'журнал', 'успеваем', 'балл')) return { title: 'Журнал успеваемости', node: <Journal />, follows: ['в зоне риска', 'посещаемость'] };
  if (has('посещаем', 'пропуск')) return { title: 'Посещаемость', node: <Attendance />, follows: ['в зоне риска'] };
  if (has('стипенд')) return { title: 'Стипендии', node: <Scholarship />, follows: ['финансы'] };
  if (has('приём', 'прием', 'заявл', 'абитур')) return { title: 'Приём', node: <Admissions />, follows: ['дубликаты заявлений'] };
  if (has('финанс', 'платеж', 'оплат', 'деньг')) return { title: 'Финансы', node: <Finance />, follows: ['должники', 'стипендии'] };
  if (has('сотрудник', 'преподават', 'персонал', 'кафедр')) return { title: 'Сотрудники', node: <Staff />, follows: [] };
  if (has('групп')) return { title: 'Группы', node: <Groups />, follows: ['студенты'] };
  if (has('выпуск', 'диплом')) return { title: 'Выпуск', node: <Graduation />, follows: ['аналитика'] };
  if (has('аналит', 'отчёт', 'отчет', 'сводк', 'показател')) return { title: 'Аналитика', node: <Analytics />, follows: ['выпуск', 'финансы'] };

  const st = students.find((s) => q.includes(s.lastname.toLowerCase()));
  if (st) { setTimeout(() => ctx.openStudent(st.id), 0); return { title: `Карточка: ${st.lastname} ${st.firstname}`, node: <Students />, follows: ['в зоне риска'] }; }
  if (has('студент', 'учащ', 'обуч')) return { title: 'Студенты', node: <Students />, follows: ['в зоне риска', 'должники'] };

  return {
    title: 'Не уверен, что именно нужно',
    follows: ['должники', 'в зоне риска', 'расписание', 'безопасность'],
    node: (
      <div className="card"><div className="card-body muted">
        Я не распознал запрос точно. Попробуйте, например: «должники ПИ-21-1», «кто в зоне риска», «конфликты в расписании», «состояние безопасности».
      </div></div>
    ),
  };
}

/* ---- Ask bar ---- */
function AskBar({ big }: { big?: boolean }) {
  const { query, runAsk, goHome } = useApp();
  const [v, setV] = useState(query);
  useEffect(() => setV(query), [query]);
  const submit = (e: FormEvent) => { e.preventDefault(); if (v.trim()) runAsk(v.trim()); };
  return (
    <form className="ask-shell" onSubmit={submit}>
      <div className="ask-bar" style={big ? { height: 60 } : undefined}>
        <Sparkles size={big ? 22 : 20} className="spark" />
        <input id="nex-ask" autoFocus={big} value={v} onChange={(e) => setV(e.target.value)} placeholder="Спросите NEX или дайте команду…" />
        {query ? <button type="button" className="kbd" onClick={goHome}>на главную</button> : <span className="kbd">⌘K</span>}
        <button className="ask-send" type="submit" aria-label="Выполнить"><ArrowUp size={18} /></button>
      </div>
    </form>
  );
}

/* ---- Intent result ---- */
function IntentResult({ query }: { query: string }) {
  const { user, openStudent, toast } = useApp();
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); const t = window.setTimeout(() => setLoading(false), 480); return () => window.clearTimeout(t); }, [query]);

  const res = useMemo(
    () => resolveIntent(query, { role: user?.role || 'admin', openStudent, toast, wide: false }),
    [query, user, openStudent, toast],
  );

  if (loading) return <div className="thinking"><Sparkles size={18} className="spark" /> NEX анализирует: «{query}»…</div>;

  return (
    <Section wide={res.wide}>
      <div className="understood fade"><Sparkles size={15} /> Понял запрос — {res.title}</div>
      <div className="fade">{res.node}</div>
      {res.follows.length > 0 && (
        <div className="follows">
          <div className="sec-label"><ArrowRight size={13} /> Дальше можно спросить</div>
          <Follows items={res.follows} />
        </div>
      )}
    </Section>
  );
}

function Follows({ items }: { items: string[] }) {
  const { runAsk } = useApp();
  return <div className="chips">{items.map((f) => <button key={f} className="chip-btn" onClick={() => runAsk(f)}><Sparkles size={13} className="ic" />{f}</button>)}</div>;
}

/* ---- Proactive home ---- */
interface Attn { tone: 'crit' | 'warn' | 'info'; icon: LucideIcon; t: string; d: string; meta: string; q: string; }
function attentionFor(role: Role): Attn[] {
  if (role === 'admin') return [
    { tone: 'crit', icon: LogIn, t: 'Подозрительные попытки входа', d: '12 неудачных входов с IP 45.9.148.3 (Нидерланды)', meta: '3 ч назад · безопасность', q: 'безопасность' },
    { tone: 'warn', icon: Wallet, t: 'Истекает срок оплаты', d: '8 студентов на контракте — оплата до 30.06', meta: 'финансы', q: 'должники' },
    { tone: 'info', icon: Sparkles, t: '3 студента в зоне риска', d: 'Снижение посещаемости и среднего балла в ПИ-21-1', meta: 'наблюдение ИИ', q: 'в зоне риска' },
    { tone: 'info', icon: Calendar, t: 'Найдено окно в расписании', d: 'Ауд. 305 свободна Пн 12:00 — можно перенести «Сети»', meta: 'наблюдение ИИ', q: 'расписание' },
  ];
  if (role === 'accountant') return [
    { tone: 'warn', icon: Wallet, t: 'Должники требуют внимания', d: '8 студентов с задолженностью, срок истекает', meta: 'финансы', q: 'должники' },
    { tone: 'info', icon: AlertTriangle, t: 'Аномалия в платежах', d: 'Три перевода на нетипичную сумму', meta: 'наблюдение ИИ', q: 'аномалии платежей' },
    { tone: 'info', icon: Award, t: 'Кандидаты на стипендию', d: 'Право рассчитано по успеваемости', meta: 'ИИ', q: 'стипендии' },
  ];
  // teacher / student
  return [
    { tone: 'info', icon: Calendar, t: 'Сегодня 3 пары', d: 'Следующая — Базы данных, ауд. 305 в 12:00', meta: 'расписание', q: 'расписание' },
    { tone: 'warn', icon: Sparkles, t: '2 студента в зоне риска', d: 'Посещаемость ниже 70% в вашей группе', meta: 'наблюдение ИИ', q: 'в зоне риска' },
    { tone: 'info', icon: BookOpen, t: 'Незаполненный журнал', d: 'Вчерашнее занятие без оценок', meta: 'журнал', q: 'журнал' },
  ];
}

function suggestionsFor(role: Role): string[] {
  if (role === 'admin') return ['должники', 'кто в зоне риска', 'состояние безопасности', 'конфликты в расписании', 'аналитика'];
  if (role === 'accountant') return ['должники', 'аномалии платежей', 'стипендии', 'финансы'];
  return ['моё расписание', 'кто в зоне риска', 'журнал', 'посещаемость'];
}

function Home() {
  const { user, runAsk } = useApp();
  const role = user?.role || 'admin';
  const attn = attentionFor(role);
  const sections = INTENTS.filter((i) => i.roles.includes(role));

  return (
    <div className="fade">
      <div className="hero">
        <h1>Здравствуйте, {user?.name?.split(' ')[0]}</h1>
        <p>Опишите, что нужно сделать — NEX сам найдёт данные, действия и подскажет дальше.</p>
      </div>
      <AskBar big />

      <div style={{ marginTop: 16 }}>
        <div className="chips">{suggestionsFor(role).map((s) => (
          <button key={s} className="chip-btn" onClick={() => runAsk(s)}><Sparkles size={13} className="ic" />{s}</button>
        ))}</div>
      </div>

      <div className="sec-label"><AlertTriangle size={13} /> Требует внимания · подобрано ИИ</div>
      <div className="attn-grid">
        {attn.map((a) => {
          const Icon = a.icon;
          return (
            <div className={`attn ${a.tone}`} key={a.t} onClick={() => runAsk(a.q)}>
              <div className="attn-ic"><Icon size={17} /></div>
              <div style={{ flex: 1 }}>
                <div className="t">{a.t}</div>
                <div className="d">{a.d}</div>
                <div className="meta"><Clock size={11} />{a.meta}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-3)' }} />
            </div>
          );
        })}
      </div>

      <div className="sec-label"><FileText size={13} /> Все разделы</div>
      <div className="chips">{sections.map((s) => {
        const Icon = s.icon;
        return <button key={s.q} className="chip-btn" onClick={() => runAsk(s.q)}><Icon size={14} className="ic" />{s.label}</button>;
      })}</div>
    </div>
  );
}

export function Canvas() {
  const { query } = useApp();
  return (
    <div className={`canvas${query ? ' canvas-wide' : ''}`}>
      <div className="canvas-inner">
        {query ? <><AskBar /><div style={{ height: 18 }} /><IntentResult query={query} /></> : <Home />}
      </div>
    </div>
  );
}

/* ---- Context drawer: an object with its stitched graph ---- */
export function ContextDrawer() {
  const { objStudent, closeObject, runAsk, toast } = useApp();
  if (objStudent == null) return null;
  const s = students.find((x) => x.id === objStudent);
  if (!s) return null;

  const rate = attendanceRate(s.id);
  const avg = avgGrade(s.id, s.group);
  const pay = finance.payments.find((p) => p.student.startsWith(s.lastname));
  const debt = pay && pay.status !== 'Оплачено';

  return (
    <div className="drawer-overlay" onClick={closeObject}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div className="avatar" style={{ width: 40, height: 40, fontSize: 14 }}>{(s.lastname[0] + s.firstname[0])}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{s.lastname} {s.firstname} {s.patronymic}</div>
            <div className="muted" style={{ fontSize: 13 }}>{s.group} · {s.form} · {s.finance}</div>
          </div>
          <button className="icon-btn" onClick={closeObject} aria-label="Закрыть"><X size={18} /></button>
        </div>

        <div className="drawer-body">
          <div className="ai-card">
            <div className="ai-head"><Sparkles size={14} /> Сводка NEX</div>
            <div className="ai-body">
              Средний балл <b>{avg.toFixed(1)}</b>, посещаемость <b>{rate}%</b>{rate < 78 ? ' — ниже нормы' : ''}.{' '}
              {debt ? 'Есть незакрытая задолженность по оплате.' : 'Задолженностей по оплате нет.'}{' '}
              {rate < 78 ? 'Рекомендуется связаться с куратором.' : 'Успеваемость стабильная.'}
            </div>
          </div>

          <div className="obj-stats">
            <div className="obj-stat"><div className="l">Ср. балл</div><div className="v">{avg.toFixed(1)}</div></div>
            <div className="obj-stat"><div className="l">Посещ.</div><div className="v" style={{ color: rate < 78 ? 'var(--warn)' : 'var(--success)' }}>{rate}%</div></div>
            <div className="obj-stat"><div className="l">Оплата</div><div className="v" style={{ color: debt ? 'var(--danger)' : 'var(--success)' }}>{debt ? 'долг' : 'ок'}</div></div>
          </div>

          <div>
            <div className="sec-label" style={{ margin: '0 0 10px' }}><Clock size={13} /> История</div>
            <div className="tl">
              <div className="tl-item ai"><div style={{ fontSize: 13 }}>NEX отметил снижение посещаемости</div><div className="dim" style={{ fontSize: 11 }}>2 дня назад</div></div>
              <div className="tl-item"><div style={{ fontSize: 13 }}>Выставлена оценка по «Базы данных»</div><div className="dim" style={{ fontSize: 11 }}>5 дней назад</div></div>
              <div className="tl-item"><div style={{ fontSize: 13 }}>Зачислен в группу {s.group}</div><div className="dim" style={{ fontSize: 11 }}>{s.group.includes('21') ? '2021' : '2022'} г.</div></div>
            </div>
          </div>

          <div className="chips">
            <button className="btn btn-primary btn-sm" onClick={() => toast('Справка сформирована')}><FileText size={14} />Сформировать справку</button>
            <button className="btn btn-outline btn-sm" onClick={() => { closeObject(); runAsk('журнал'); }}>Открыть журнал</button>
          </div>
        </div>
      </div>
    </div>
  );
}
