import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Sparkles, X, ArrowUp, Quote } from 'lucide-react';
import { useApp, Chip } from './ui';
import { students, finance, gradesFor } from './data';

const attendanceRate = (id: number) => 100 - ((id * 13) % 35);
const avgGrade = (id: number, group: string) => {
  const m = (gradesFor(group)[id] || []).filter((g) => g > 0);
  return m.length ? m.reduce((a, b) => a + b, 0) / m.length : 0;
};
const groupAvg = (group: string) => {
  const all = students.filter((s) => s.group === group).map((s) => avgGrade(s.id, group)).filter((x) => x > 0);
  return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
};

interface Ctx { kind: 'student' | 'view' | 'settings' | 'home'; title: string; facts: string[]; quick: string[]; sid?: number; }

function buildContext(objStudent: number | null, query: string, page: string, seed: string | null): Ctx {
  if (seed) return { kind: 'view', title: `Выделенный фрагмент`, facts: [], quick: ['Объясни это', 'Что с этим сделать?', 'Найди связанные данные'] };
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
  if (query) return { kind: 'view', title: `Открыто: «${query}»`, facts: [], quick: ['Сделай сводку', 'Какие действия предложишь?', 'Найди аномалии'] };
  if (page === 'settings') return { kind: 'settings', title: 'Настройки', facts: [], quick: ['Как включить 2FA?', 'Зачем тёмная тема?'] };
  return { kind: 'home', title: 'Главная · сводка дня', facts: [], quick: ['Что сегодня важно?', 'Покажи риски', 'Состояние безопасности'] };
}

interface Answer { text: string; action?: string; }

function respond(ctx: Ctx, q: string, seed: string | null): Answer {
  const t = q.toLowerCase();

  if (seed) {
    if (/объясн|что это/.test(t)) return { text: `«${seed.slice(0, 80)}…» — это фрагмент из текущего экрана. По контексту это относится к учебным/финансовым данным организации. Могу найти связанные записи или подготовить действие.` };
    if (/сдела|действ/.test(t)) return { text: `На основе выделенного «${seed.slice(0, 60)}…» могу создать задачу, черновик документа или уведомление. Что именно оформить?`, action: 'Создать черновик' };
    return { text: `Беру в работу выделенное: «${seed.slice(0, 80)}». Уточните — объяснить, найти связи или оформить действие?` };
  }

  if (ctx.kind === 'student' && ctx.sid != null) {
    const s = students.find((x) => x.id === ctx.sid)!;
    const rate = attendanceRate(s.id);
    const avg = avgGrade(s.id, s.group);
    const gAvg = groupAvg(s.group);
    const debt = finance.payments.some((p) => p.student.startsWith(s.lastname) && p.status !== 'Оплачено');
    if (/риск|почему/.test(t)) return { text: `${s.lastname} в зоне риска прежде всего из-за посещаемости ${rate}% (${rate < 70 ? 'критично' : 'ниже нормы 85%'}). Средний балл ${avg.toFixed(1)}${avg < gAvg ? `, что ниже среднего по ${s.group} (${gAvg.toFixed(1)})` : ''}. Тренд за 2 недели — снижение.` };
    if (/сравн|групп/.test(t)) return { text: `${s.lastname}: средний балл ${avg.toFixed(1)} против ${gAvg.toFixed(1)} по группе ${s.group}. Посещаемость ${rate}% против ~88% по группе. ${avg < gAvg ? 'Отстаёт от группы.' : 'На уровне группы.'}` };
    if (/предприн|делать|что|рекоменд/.test(t)) return { text: `Рекомендую: 1) уведомить куратора (${s.group}); 2) назначить отработку пропусков; 3) поставить контрольную точку через 2 недели. ${debt ? 'Также есть незакрытая оплата — стоит решить параллельно.' : ''}`, action: 'Поставить задачу куратору' };
    if (/справк|документ/.test(t)) return { text: `Подготовил черновик справки об обучении для ${s.lastname} ${s.firstname} (${s.group}, ${s.form}, ${s.finance}). Данные взяты из карточки. Проверьте и подпишите — действие попадёт в журнал аудита.`, action: 'Открыть черновик справки' };
    if (/оплат|долг|деньг|финанс/.test(t)) return { text: debt ? `У ${s.lastname} есть незакрытая оплата по контракту. Могу подготовить уведомление о задолженности.` : `У ${s.lastname} задолженностей по оплате нет.`, action: debt ? 'Подготовить уведомление' : undefined };
    return { text: `${s.lastname} ${s.firstname}, ${s.group}: средний балл ${avg.toFixed(1)}, посещаемость ${rate}%, оплата ${debt ? 'с долгом' : 'в норме'}. Спросите «почему в зоне риска» или «что предпринять».` };
  }

  // generic, reads current view/home
  if (/безопас|угроз|вход/.test(t)) return { text: 'По безопасности: целостность ядра, БД и журнала аудита в норме. Зафиксированы 2 подозрительные серии входов (IP 45.9.148.3, 193.41.22.7) — рекомендую блокировку. 2FA-шлюз с задержкой SMS.', action: 'Открыть консоль безопасности' };
  if (/риск/.test(t)) return { text: 'В зоне риска 4 студента — основной фактор посещаемость ниже 75% (Волкова, Новиков, Петрова, Зайцева). Самый высокий риск — Волкова О. (66%).', action: 'Показать список' };
  if (/аномал|платеж/.test(t)) return { text: 'Нашёл 3 перевода на нетипичную сумму от одного контрагента за период. Рекомендую проверку до закрытия месяца.', action: 'Открыть платежи' };
  if (/сводк|важно|сегодня|день/.test(t)) return { text: 'Главное сейчас: 1) подозрительные входы (безопасность); 2) 8 студентов с истекающим сроком оплаты; 3) 4 студента в зоне риска; 4) свободное окно в расписании (Пн 12:00, ауд. 305).' };
  if (/действ|предлож/.test(t)) return { text: 'Предлагаю: разослать уведомления должникам, заблокировать подозрительные IP, связаться с кураторами по студентам в зоне риска. Каждое действие пройдёт через подтверждение и аудит.' };
  return { text: `Вижу текущий контекст: ${ctx.title}. Могу сделать сводку, найти риски/аномалии или подготовить действие — спросите своими словами.` };
}

/* ---------- Selection mini-action ---------- */
function SelectionPopover() {
  const { openAi, aiOpen } = useApp();
  const [pos, setPos] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() || '';
      if (!sel || text.length < 3 || aiOpen) { setPos(null); return; }
      const node = sel.anchorNode as HTMLElement | null;
      const host = node?.parentElement?.closest('.ai-panel, .sel-pop, input, textarea, .ask-bar');
      if (host) { setPos(null); return; }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width) { setPos(null); return; }
      setPos({ x: rect.left + rect.width / 2, y: rect.top, text });
    };
    const onDown = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('.sel-pop')) setPos(null); };
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('mouseup', onUp); document.removeEventListener('mousedown', onDown); };
  }, [aiOpen]);

  if (!pos) return null;
  return (
    <div className="sel-pop" style={{ left: pos.x, top: pos.y }}>
      <button onMouseDown={(e) => { e.preventDefault(); openAi(pos.text); setPos(null); }}><Sparkles size={13} />Спросить NEX</button>
      <button onMouseDown={(e) => { e.preventDefault(); openAi(pos.text + '\n— объясни это'); setPos(null); }}><Quote size={13} />Объяснить</button>
    </div>
  );
}

/* ---------- Cmd+E contextual panel ---------- */
interface Msg { who: 'u' | 'n'; text: string; action?: string }

function AiPanel() {
  const { objStudent, query, page, aiSeed, closeAi, toast } = useApp();
  const ctx = buildContext(objStudent, query, page, aiSeed);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  // Greet / auto-answer for the current context (resets when context or seed changes).
  useEffect(() => {
    if (aiSeed) {
      const a = respond(ctx, 'объясни это', aiSeed);
      setMsgs([{ who: 'u', text: `«${aiSeed.slice(0, 90)}»` }, { who: 'n', text: a.text, action: a.action }]);
    } else {
      setMsgs([{ who: 'n', text: `Вижу контекст: ${ctx.title}. Чем помочь?` }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objStudent, query, page, aiSeed]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const a = respond(ctx, q, aiSeed);
    setMsgs((m) => [...m, { who: 'u', text: q }, { who: 'n', text: a.text, action: a.action }]);
    setInput('');
  };
  const submit = (e: FormEvent) => { e.preventDefault(); ask(input); };

  return (
    <div className="ai-panel" role="dialog" aria-label="NEX — контекстный помощник">
      <div className="ai-panel-head">
        <Sparkles size={17} className="spark" />
        <b>NEX</b>
        <span className="kbd" style={{ marginLeft: 4 }}>Cmd+E</span>
        <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={closeAi} aria-label="Закрыть"><X size={18} /></button>
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
                {m.action && <div className="act"><button className="btn btn-sm btn-primary" onClick={() => { toast(m.action + ' — выполнено'); }}>{m.action}</button></div>}
              </div>
            </div>
          ))}
        <div ref={endRef} />
      </div>

      <form className="ai-foot" onSubmit={submit}>
        <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Спросите об этом экране…" />
        <button className="ask-send" type="submit" aria-label="Отправить"><ArrowUp size={18} /></button>
      </form>
    </div>
  );
}

function AiHint() {
  const { openAi, aiOpen } = useApp();
  if (aiOpen) return null;
  return (
    <button className="ai-hint" onClick={() => openAi()} title="Контекстный помощник">
      <Sparkles size={16} /> NEX <span className="kbd2">⌘E</span>
    </button>
  );
}

export function AiLayer() {
  const { aiOpen } = useApp();
  return (
    <>
      <SelectionPopover />
      <AiHint />
      {aiOpen && <AiPanel />}
    </>
  );
}
