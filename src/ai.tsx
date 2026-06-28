import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Sparkles, X, ArrowUp, ArrowRight, Quote, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { useApp, Chip } from './ui';
import { students, finance } from './data';
import { nexReply, attendanceRate, avgGrade, PAGE_TITLES } from './nexbrain';

/* The mini-panel (Cmd+E) is deliberately NARROW: it works on the current
   screen or the focused object. For anything broader, it hands off to the
   full conversational page. */

interface Ctx { kind: 'student' | 'view' | 'settings' | 'home'; title: string; facts: string[]; quick: string[]; sid?: number; }

function buildContext(objStudent: number | null, page: string, seed: string | null): Ctx {
  if (seed) return { kind: 'view', title: 'Выделенный фрагмент', facts: [], quick: ['Объясни это', 'Что с этим сделать?'] };
  if (objStudent != null) {
    const s = students.find((x) => x.id === objStudent);
    if (s) {
      const rate = attendanceRate(s.id);
      const avg = avgGrade(s.id, s.group);
      const debt = finance.payments.some((p) => p.student.startsWith(s.lastname) && p.status !== 'Оплачено');
      return {
        kind: 'student', sid: s.id,
        title: `${s.lastname} ${s.firstname} · ${s.group}`,
        facts: [`Ср. балл ${avg.toFixed(1)}`, `Посещ. ${rate}%`, debt ? 'Есть долг' : 'Оплата ок'],
        quick: ['Почему в зоне риска?', 'Сравни с группой', 'Что предпринять?', 'Сформируй справку'],
      };
    }
  }
  if (page === 'settings') return { kind: 'settings', title: 'Настройки', facts: [], quick: ['Как включить 2FA?', 'Зачем тёмная тема?'] };
  if (page === 'dashboard') return { kind: 'home', title: 'Командный центр', facts: [], quick: ['Что на этом экране важно?', 'Покажи риски'] };
  return { kind: 'view', title: `Экран: ${PAGE_TITLES[page] || page}`, facts: [], quick: ['Сделай сводку экрана', 'Какие действия предложишь?'] };
}

/* ---------- Selection mini-action → opens the in-page inline chat ---------- */
function SelectionPopover() {
  const { openInline, inline, aiOpen } = useApp();
  const [pos, setPos] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() || '';
      if (!sel || text.length < 3 || aiOpen || inline) { setPos(null); return; }
      const node = sel.anchorNode as HTMLElement | null;
      const host = node?.parentElement?.closest('.ai-panel, .sel-pop, .inline-chat, input, textarea, .chat-page');
      if (host) { setPos(null); return; }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width) { setPos(null); return; }
      setPos({ x: rect.left + rect.width / 2, y: rect.top, text });
    };
    const onDown = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('.sel-pop')) setPos(null); };
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('mouseup', onUp); document.removeEventListener('mousedown', onDown); };
  }, [aiOpen, inline]);

  if (!pos) return null;
  const open = (explain: boolean) => { openInline({ x: pos.x - 180, y: pos.y + 22, seed: pos.text, explain, title: explain ? 'Объяснение' : 'NEX' }); setPos(null); };
  return (
    <div className="sel-pop" style={{ left: pos.x, top: pos.y }}>
      <button onMouseDown={(e) => { e.preventDefault(); open(false); }}><Sparkles size={13} />Спросить NEX</button>
      <button onMouseDown={(e) => { e.preventDefault(); open(true); }}><Quote size={13} />Объяснить</button>
    </div>
  );
}

/* ---------- In-page inline chat: NEX works right inside the page ---------- */
interface IMsg { who: 'u' | 'n'; text: string; nav?: { label: string; page: string }[]; action?: string }

function InlineChat() {
  const { inline, closeInline, setPage, openChat, toast } = useApp();
  const [msgs, setMsgs] = useState<IMsg[]>([]);
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!inline) return;
    setExpanded(false);
    const seed = inline.seed;
    if (inline.explain) {
      const a = nexReply('объясни это', { seed });
      setMsgs([
        { who: 'u', text: `«${seed.slice(0, 90)}»` },
        { who: 'n', text: a.text, action: a.action },
      ]);
    } else {
      const a = nexReply(seed);
      setMsgs([{ who: 'u', text: seed }, { who: 'n', text: a.text, nav: a.nav, action: a.action }]);
    }
    setInput('');
  }, [inline]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [msgs]);

  if (!inline) return null;

  const ask = (q: string) => {
    if (!q.trim()) return;
    const a = nexReply(q, inline.explain ? { seed: inline.seed } : {});
    setMsgs((m) => [...m, { who: 'u', text: q }, { who: 'n', text: a.text, nav: a.nav, action: a.action }]);
    setInput('');
  };
  const submit = (e: FormEvent) => { e.preventDefault(); ask(input); };
  const goto = (p: string) => { setPage(p); closeInline(); };

  const W = expanded ? 460 : 360;
  const left = Math.max(12, Math.min(inline.x, window.innerWidth - W - 12));
  const top = Math.max(12, Math.min(inline.y, window.innerHeight - 160));
  const quick = inline.explain ? ['Подробнее', 'Что с этим делать?'] : ['Что предпринять?', 'Подробнее'];

  return (
    <>
      <div className="inline-veil" onClick={closeInline} />
      <div className={`inline-chat ${expanded ? 'expanded' : ''}`} style={{ left, top, width: W }} role="dialog" aria-label="NEX">
        <div className="inline-head">
          <Sparkles size={14} className="spark" />
          <b>{inline.title || 'NEX'}</b>
          <span className="inline-badge">на странице</span>
          <button className="icon-btn" title={expanded ? 'Свернуть' : 'Развернуть на странице'} onClick={() => setExpanded((v) => !v)}>{expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
          <button className="icon-btn" title="Открыть в полном чате" onClick={() => { openChat(inline.seed); closeInline(); }}><ExternalLink size={15} /></button>
          <button className="icon-btn" title="Закрыть" onClick={closeInline}><X size={16} /></button>
        </div>

        <div className="inline-body">
          {msgs.map((m, i) => m.who === 'u'
            ? <div className="inline-msg u" key={i}>{m.text}</div>
            : (
              <div className="inline-msg n" key={i}>
                <div className="ic"><Sparkles size={12} /></div>
                <div className="nb">
                  {m.text}
                  {m.nav && m.nav.length > 0 && (
                    <div className="inline-nav">{m.nav.map((n) => <button key={n.page + n.label} className="chip-btn" onClick={() => goto(n.page)}>{n.label} <ArrowRight size={12} className="ic" /></button>)}</div>
                  )}
                  {m.action && <div className="inline-act"><button className="btn btn-sm btn-primary" onClick={() => toast(m.action + ' — выполнено')}>{m.action}</button></div>}
                </div>
              </div>
            ))}
          <div ref={endRef} />
        </div>

        <div className="inline-quick">
          {quick.map((qk) => <button key={qk} className="chip-btn sm" onClick={() => ask(qk)}>{qk}</button>)}
        </div>

        <form className="inline-foot" onSubmit={submit}>
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Спросите здесь…" />
          <button className="ask-send sm" type="submit" aria-label="Отправить"><ArrowUp size={16} /></button>
        </form>
      </div>
    </>
  );
}

/* ---------- Cmd+E contextual panel (narrow) ---------- */
interface Msg { who: 'u' | 'n'; text: string; action?: string }

function AiPanel() {
  const { objStudent, page, aiSeed, closeAi, openChat, toast } = useApp();
  const ctx = buildContext(objStudent, page, aiSeed);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (aiSeed) {
      const a = nexReply('объясни это', { seed: aiSeed });
      setMsgs([{ who: 'u', text: `«${aiSeed.slice(0, 90)}»` }, { who: 'n', text: a.text, action: a.action }]);
    } else {
      setMsgs([{ who: 'n', text: `Помогаю по этому экрану: ${ctx.title}. Для широких вопросов откройте полный чат.` }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objStudent, page, aiSeed]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const a = nexReply(q, { student: ctx.sid ?? null, page, seed: aiSeed });
    setMsgs((m) => [...m, { who: 'u', text: q }, { who: 'n', text: a.text, action: a.action }]);
    setInput('');
  };
  const submit = (e: FormEvent) => { e.preventDefault(); ask(input); };

  return (
    <div className="ai-panel" role="dialog" aria-label="NEX — помощник по экрану">
      <div className="ai-panel-head">
        <Sparkles size={16} className="spark" />
        <b>Пространство NEX</b>
        <button className="icon-btn" style={{ marginLeft: 'auto' }} title="Открыть полный чат" onClick={() => openChat()}><Maximize2 size={16} /></button>
        <button className="icon-btn" onClick={closeAi} aria-label="Закрыть"><X size={18} /></button>
      </div>

      <div className="ai-ctx">
        <div className="lbl"><Sparkles size={12} /> NEX видит текущий экран</div>
        <div className="ttl">{ctx.title}</div>
        {ctx.facts.length > 0 && <div className="facts">{ctx.facts.map((f) => <span key={f}><Chip tone="chip-ai">{f}</Chip></span>)}</div>}
      </div>

      <div className="ai-quick">
        {ctx.quick.map((qk) => <button key={qk} className="chip-btn" onClick={() => ask(qk)}><Sparkles size={12} className="ic" />{qk}</button>)}
      </div>

      <div className="ai-msgs">
        {msgs.map((m, i) => m.who === 'u'
          ? <div className="ai-msg u" key={i}>{m.text}</div>
          : (
            <div className="ai-msg n" key={i}>
              <div className="ic"><Sparkles size={13} /></div>
              <div className="nb">
                {m.text}
                {m.action && <div className="act"><button className="btn btn-sm btn-primary" onClick={() => toast(m.action + ' — выполнено')}>{m.action}</button></div>}
              </div>
            </div>
          ))}
        <div ref={endRef} />
      </div>

      <form className="ai-foot" onSubmit={submit}>
        <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Узкий вопрос по этому экрану…" />
        <button className="ask-send" type="submit" aria-label="Отправить"><ArrowUp size={18} /></button>
      </form>
      <button className="ai-escalate" onClick={() => openChat(input.trim() || undefined)}>
        Открыть полный чат NEX <ArrowRight size={14} />
      </button>
    </div>
  );
}

export function AiLayer() {
  const { aiOpen } = useApp();
  return (
    <>
      <SelectionPopover />
      <InlineChat />
      {aiOpen && <AiPanel />}
    </>
  );
}
