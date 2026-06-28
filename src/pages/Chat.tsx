import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  Sparkles, ArrowUp, ArrowRight, ShieldAlert, Wallet, AlertTriangle,
  Activity, GraduationCap, Calendar, Users, RotateCcw,
} from 'lucide-react';
import { useApp, Chip } from '../ui';
import { nexReply, atRisk, type NexData, type NavLink } from '../nexbrain';
import { finance } from '../data';
import { Donut, Legend, type Segment } from '../charts';

/* Suggested entry prompts — grouped so the chat reads as a way to run the whole platform. */
const SUGGEST: { icon: typeof Sparkles; label: string; q: string }[] = [
  { icon: Activity, label: 'Что сегодня важно?', q: 'Что сегодня важно?' },
  { icon: AlertTriangle, label: 'Студенты в зоне риска', q: 'Покажи студентов в зоне риска' },
  { icon: Wallet, label: 'Финансы и долги', q: 'Что с финансами и задолженностью?' },
  { icon: ShieldAlert, label: 'Состояние безопасности', q: 'Состояние безопасности' },
  { icon: GraduationCap, label: 'Готовность к выпуску', q: 'Какая готовность к выпуску?' },
  { icon: Calendar, label: 'Окна в расписании', q: 'Покажи окна в расписании' },
];

function DataBlock({ kind }: { kind: NexData }) {
  const { setPage, openStudent } = useApp();
  if (kind === 'atrisk') {
    const rows = atRisk().slice(0, 5);
    return (
      <div className="chat-data table-wrap"><table className="tbl">
        <thead><tr><th>Студент</th><th>Группа</th><th className="right">Посещ.</th><th className="right">Балл</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => openStudent(r.id)}>
            <td style={{ fontWeight: 600 }}>{r.name}</td>
            <td className="mono">{r.group}</td>
            <td className="right mono" style={{ color: r.rate < 70 ? 'var(--danger)' : 'var(--warn)' }}>{r.rate}%</td>
            <td className="right mono">{r.avg.toFixed(1)}</td>
          </tr>
        ))}</tbody>
      </table></div>
    );
  }
  if (kind === 'finance') {
    const paid = finance.payments.filter((p) => p.status === 'Оплачено').reduce((a, p) => a + p.sum, 0);
    const segs: Segment[] = [
      { label: 'Поступило', value: paid, color: 'var(--success)' },
      { label: 'Задолженность', value: 248000, color: 'var(--danger)' },
    ];
    return <div className="chat-data chart-flex"><Donut segments={segs} size={120} centerTop="₽" centerSub="период" /><Legend segments={segs} withValues /></div>;
  }
  if (kind === 'security') {
    return (
      <div className="chat-data kpi-row">
        <div className="kpi"><div className="kpi-label">Целостность ядра</div><div className="kpi-value" style={{ color: 'var(--success)' }}>OK</div></div>
        <div className="kpi"><div className="kpi-label">Подозрительные входы</div><div className="kpi-value" style={{ color: 'var(--danger)' }}>2</div></div>
        <div className="kpi"><div className="kpi-label">Активные сессии</div><div className="kpi-value">14</div></div>
      </div>
    );
  }
  // kpi
  return (
    <div className="chat-data kpi-row" onClick={() => setPage('analytics')} style={{ cursor: 'pointer' }}>
      <div className="kpi"><div className="kpi-label">Студентов</div><div className="kpi-value">100</div></div>
      <div className="kpi"><div className="kpi-label">Посещаемость</div><div className="kpi-value">91%</div></div>
      <div className="kpi"><div className="kpi-label">Средний балл</div><div className="kpi-value">4.2</div></div>
      <div className="kpi"><div className="kpi-label">Задолженность</div><div className="kpi-value">₽248K</div></div>
    </div>
  );
}

function NavChips({ nav }: { nav: NavLink[] }) {
  const { setPage } = useApp();
  return (
    <div className="chat-nav">
      {nav.map((n) => (
        <button key={n.page + n.label} className="chip-btn" onClick={() => setPage(n.page)}>
          {n.label} <ArrowRight size={13} className="ic" />
        </button>
      ))}
    </div>
  );
}

export default function Chat() {
  const { user, chatLog, setChatLog, pendingAsk, clearPendingAsk, toast } = useApp();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  const send = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const a = nexReply(text);
    setChatLog((m) => [...m, { who: 'u', text }, { who: 'n', ...a }]);
    setInput('');
  };

  // Pick up a question handed over from the topbar / mini-panel.
  useEffect(() => {
    if (pendingAsk) { send(pendingAsk); clearPendingAsk(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAsk]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatLog]);

  const submit = (e: FormEvent) => { e.preventDefault(); send(input); };
  const empty = chatLog.length === 0;

  return (
    <div className="chat-page fade">
      {empty ? (
        <div className="chat-hero">
          <div className="chat-hero-mark"><Sparkles size={26} /></div>
          <h1>Здравствуйте, {user?.name?.split(' ')[0] || 'коллега'}</h1>
          <p>Спросите что угодно об организации — я отвечу по данным и при необходимости открою нужный раздел. Это полноценная альтернатива навигации по NEX.</p>

          <form className="chat-input chat-input-hero" onSubmit={submit}>
            <Sparkles size={18} className="lead" />
            <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Например: что сегодня важно?" />
            <button className="ask-send" type="submit" aria-label="Спросить"><ArrowUp size={18} /></button>
          </form>

          <div className="chat-suggest">
            {SUGGEST.map((s) => { const Icon = s.icon; return (
              <button key={s.label} className="chat-sug" onClick={() => send(s.q)}>
                <Icon size={15} /><span>{s.label}</span>
              </button>
            ); })}
          </div>
        </div>
      ) : (
        <>
          <div className="chat-thread">
            <div className="chat-thread-inner">
              {chatLog.map((m, i) => m.who === 'u' ? (
                <div className="chat-msg u" key={i}>{m.text}</div>
              ) : (
                <div className="chat-msg n" key={i}>
                  <div className="ava"><Sparkles size={15} /></div>
                  <div className="body">
                    <div className="prose">{m.text}</div>
                    {m.data && <DataBlock kind={m.data} />}
                    {m.nav && m.nav.length > 0 && <NavChips nav={m.nav} />}
                    {m.action && (
                      <div className="chat-act">
                        <button className="btn btn-sm btn-primary" onClick={() => toast(m.action + ' — выполнено')}><Sparkles size={13} />{m.action}</button>
                        <span className="dim" style={{ fontSize: 11.5 }}>с подтверждением и аудитом</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <div className="chat-dock">
            <div className="chat-dock-inner">
              <button className="icon-btn" title="Очистить" onClick={() => setChatLog(() => [])}><RotateCcw size={17} /></button>
              <form className="chat-input" onSubmit={submit}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Спросите NEX…" />
                <button className="ask-send" type="submit" aria-label="Спросить"><ArrowUp size={18} /></button>
              </form>
            </div>
            <div className="chat-dock-hint"><Users size={12} /> NEX отвечает по данным организации · действия проходят аудит</div>
          </div>
        </>
      )}
    </div>
  );
}
