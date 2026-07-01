import { useState, useEffect } from 'react';
import {
  Sparkles, Bot, Check, X, ArrowUp, Pause, Play, ShieldAlert, ScrollText, Send,
} from 'lucide-react';
import { PageHead, Chip, Beta, useApp } from '../ui';
import { planFor } from '../nexbrain';
import {
  AGENTS, QUEUE, AGENT_LOG, AUTONOMY_LEVELS, agentById,
  type Agent, type Autonomy, type PendingAction,
} from '../agents';

/* ============================================================
   АГЕНТЫ — экспериментальный центр агентности NEX (только админ).
   Человек управляет не кнопками, а ПОЛИТИКОЙ: выставляет уровень
   автономии; агенты работают фоном; спорное — в очередь;
   сделанное — в журнал. Задачу можно поручить словами.
   ============================================================ */

const riskTone = { low: 'chip-success', medium: 'chip-warn', high: 'chip-danger' } as const;
const riskLabel = { low: 'низкий риск', medium: 'средний риск', high: 'высокий риск' } as const;

/* ---- видимое исполнение: план тикает по шагам (BACKEND: стрим статуса воркера) ---- */
function StepsRun({ label, onDone }: { label: string; onDone: () => void }) {
  const steps = planFor(label);
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= steps.length) { const t = setTimeout(onDone, 900); return () => clearTimeout(t); }
    const t = setTimeout(() => setDone((d) => d + 1), 550);
    return () => clearTimeout(t);
  }, [done, steps.length, onDone]);
  return (
    <div className="agent-run" style={{ marginTop: 10 }}>
      <div className="agent-run-head"><Sparkles size={13} />Выполняю: {label}</div>
      <div className="agent-steps">
        {steps.map((s, i) => (
          <div key={i} className={`agent-step ${i < done ? 'done' : i === done ? 'active' : ''}`}>
            <span className="dot">{i < done ? <Check size={11} /> : <span className="spin" />}</span>{s}
          </div>
        ))}
      </div>
      {done >= steps.length && <div className="agent-done"><Check size={13} /> Готово · записано в аудит</div>}
    </div>
  );
}

/* ---- поручить задачу своими словами: план → утверждение → исполнение ---- */
function Delegate() {
  const { toast } = useApp();
  const [text, setText] = useState('');
  const [plan, setPlan] = useState<string | null>(null);   // задача, на которую составлен план
  const [running, setRunning] = useState(false);

  const propose = () => { if (text.trim()) { setPlan(text.trim()); setRunning(false); } };
  const reset = () => { setPlan(null); setText(''); setRunning(false); };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head"><div className="card-title"><Send size={15} /> Поручить NEX</div><span className="dim" style={{ fontSize: 12 }}>задача словами → план → утверждение → исполнение</span></div>
      <div className="card-body">
        {!plan && (
          <form className="chat-input" onSubmit={(e) => { e.preventDefault(); propose(); }}>
            <Sparkles size={16} className="lead" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Например: подготовь справки всем отличникам ПИ-21-1…" />
            <button className="ask-send" type="submit" aria-label="Составить план"><ArrowUp size={17} /></button>
          </form>
        )}
        {plan && !running && (
          <div className="agent-run">
            <div className="agent-run-head"><Sparkles size={13} />План: {plan}</div>
            <div className="agent-steps">
              {planFor(plan).map((s, i) => (
                <div key={i} className="agent-step done"><span className="dot"><Check size={11} /></span>{s}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn btn-sm btn-primary" onClick={() => setRunning(true)}><Check size={14} />Утвердить и выполнить</button>
              <button className="btn btn-sm btn-ghost" onClick={reset}><X size={14} />Отменить</button>
            </div>
          </div>
        )}
        {plan && running && <StepsRun label={plan} onDone={() => { toast('Задача выполнена, отчёт в журнале'); reset(); }} />}
      </div>
    </div>
  );
}

/* ---- очередь подтверждений: агенты подготовили, человек решает ---- */
function Queue() {
  const { toast } = useApp();
  const [items, setItems] = useState<PendingAction[]>(QUEUE);
  const [runningId, setRunningId] = useState<number | null>(null);

  const decline = (id: number) => { setItems((xs) => xs.filter((x) => x.id !== id)); toast('Отклонено — агент учтёт'); };
  const finish = (id: number) => { setItems((xs) => xs.filter((x) => x.id !== id)); setRunningId(null); };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head">
        <div className="card-title"><ShieldAlert size={15} /> Ждут подтверждения</div>
        <Chip tone={items.length ? 'chip-warn' : 'chip-success'}>{items.length ? `${items.length} действий` : 'пусто'}</Chip>
      </div>
      <div className="row-list">
        {items.length === 0 && <div className="feed-row"><div className="feed-main"><div className="m">Очередь пуста — агенты работают в рамках своих уровней автономии.</div></div></div>}
        {items.map((q) => (
          <div className="feed-row" key={q.id} style={{ flexWrap: 'wrap' }}>
            <div className="feed-ico ai"><Bot size={14} /></div>
            <div className="feed-main">
              <div className="t"><b>{agentById(q.agentId).name}</b> — {q.action}</div>
              <div className="m">{q.why}</div>
              {runningId === q.id && <StepsRun label={q.action} onDone={() => finish(q.id)} />}
            </div>
            {runningId !== q.id && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                <Chip tone={riskTone[q.risk]}>{riskLabel[q.risk]}</Chip>
                <button className="btn btn-sm btn-primary" onClick={() => setRunningId(q.id)}>Подтвердить</button>
                <button className="btn btn-sm btn-ghost" onClick={() => decline(q.id)}>Отклонить</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- карточка агента: пауза + уровень автономии (политика, а не кнопки) ---- */
function AgentCard({ a }: { a: Agent }) {
  const { toast } = useApp();
  const [autonomy, setAutonomy] = useState<Autonomy>(a.autonomy);
  const [paused, setPaused] = useState(a.paused);
  return (
    <div className={`agent-card ${paused ? 'paused' : ''}`}>
      <div className="agent-card-head">
        <div className="feed-ico ai"><Bot size={15} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="agent-name">{a.name} <span className="dim" style={{ fontWeight: 500 }}>· {a.domain}</span></div>
          <div className="agent-desc">{a.desc}</div>
        </div>
        <button className="icon-btn" title={paused ? 'Возобновить' : 'Пауза'} onClick={() => { setPaused(!paused); toast(paused ? `${a.name} возобновлён` : `${a.name} на паузе`); }}>
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>

      <div className="auto-seg">
        {AUTONOMY_LEVELS.map((l) => (
          <button key={l.level} className={autonomy === l.level ? 'on' : ''} title={l.desc}
            onClick={() => { setAutonomy(l.level as Autonomy); toast(`${a.name}: уровень «${l.name}»`); }}>
            {l.name}
          </button>
        ))}
      </div>

      <div className="agent-foot">
        <span className="dim">{a.lastAction}</span>
        <Chip tone="chip-ai">{a.actionsToday} сегодня</Chip>
      </div>
    </div>
  );
}

export default function Agents() {
  return (
    <div className="fade content-narrow">
      <PageHead title="Агенты" sub="Штат фоновых агентов NEX — вы управляете политикой, а не кнопками" actions={<Beta />} />

      <div className="ai-card" style={{ marginBottom: 16 }}>
        <div className="ai-head"><Sparkles size={14} /> Как это работает</div>
        <div className="ai-body">
          Каждому агенту вы выставляете уровень автономии: <b>Наблюдает → Советует → Готовит → Автономен</b>.
          Всё, что выше уровня, попадает в очередь на подтверждение; всё сделанное — в журнал аудита.
        </div>
      </div>

      <Delegate />
      <Queue />

      <div className="agent-grid" style={{ marginBottom: 16 }}>
        {AGENTS.map((a) => <div key={a.id} style={{ display: 'contents' }}><AgentCard a={a} /></div>)}
      </div>

      <div className="card">
        <div className="card-head"><div className="card-title"><ScrollText size={15} /> Журнал агентов</div><span className="dim" style={{ fontSize: 12 }}>сделано автономно</span></div>
        <div className="row-list">
          {AGENT_LOG.map((e) => (
            <div className="feed-row" key={e.id}>
              <div className="feed-ico ai"><Sparkles size={13} /></div>
              <div className="feed-main"><div className="t"><b>{agentById(e.agentId).name}</b> — {e.text}</div></div>
              <span className="dim" style={{ fontSize: 11 }}>{e.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
