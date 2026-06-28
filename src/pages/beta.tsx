import { useState } from 'react';
import {
  Search, Send, Paperclip, FileText, Download, Upload, Bell, Heart, MessageCircle,
  Share2, BookOpen, GraduationCap, Library, Rss, Star, Megaphone, Sparkles, ChevronLeft,
} from 'lucide-react';
import { PageHead, Chip, Avatar, Beta, NexAsk, useApp, useIsMobile } from '../ui';

function BetaNote({ text }: { text: string }) {
  return (
    <div className="ai-card" style={{ marginBottom: 16, borderLeftColor: 'var(--ai)' }}>
      <div className="ai-head"><Sparkles size={14} /> Бета-функция</div>
      <div className="ai-body">{text} Данные демонстрационные, часть действий пока недоступна.</div>
    </div>
  );
}

/* ===================== Messenger ===================== */
const THREADS = [
  { id: 1, name: 'Петров А.И.', role: 'Зав. кафедрой', last: 'Согласуем расписание на среду?', time: '10:24', unread: 2 },
  { id: 2, name: 'Группа ПИ-21-1', role: '24 участника', last: 'Староста: занятие перенесено', time: '09:50', unread: 0 },
  { id: 3, name: 'Бухгалтерия', role: 'Сидорова Н.П.', last: 'Акт сверки готов', time: 'Вчера', unread: 0 },
  { id: 4, name: 'Волкова О.', role: 'Студент · ПИ-21-1', last: 'Здравствуйте, по поводу пересдачи', time: 'Вчера', unread: 1 },
];
const MSGS = [
  { me: false, t: 'Здравствуйте! Согласуем расписание на среду?', time: '10:20' },
  { me: true, t: 'Да, давайте перенесём «Сети» на 12:00, ауд. 305 — окно свободно.', time: '10:22' },
  { me: false, t: 'Отлично, NEX подсказал то же. Подтверждаю.', time: '10:24' },
];

export function Messenger() {
  const { toast } = useApp();
  const isMobile = useIsMobile();
  const [active, setActive] = useState<number | null>(isMobile ? null : 1);
  const [text, setText] = useState('');
  const thread = THREADS.find((t) => t.id === active) || THREADS[0];

  const List = (
    <div className="msgr-list">
      <div className="msgr-search"><Search size={15} /><input placeholder="Поиск чатов…" /></div>
      {THREADS.map((t) => (
        <div key={t.id} className={`msgr-thread ${t.id === active ? 'active' : ''}`} onClick={() => setActive(t.id)}>
          <Avatar name={t.name} />
          <div className="msgr-thread-main">
            <div className="t"><b>{t.name}</b><span className="dim">{t.time}</span></div>
            <div className="m">{t.last}</div>
          </div>
          {t.unread > 0 && <span className="msgr-badge">{t.unread}</span>}
        </div>
      ))}
    </div>
  );

  const Conv = (
    <div className="msgr-conv">
      <div className="msgr-conv-head">
        {isMobile && <button className="icon-btn" onClick={() => setActive(null)} aria-label="Назад"><ChevronLeft size={20} /></button>}
        <Avatar name={thread.name} />
        <div><b>{thread.name}</b><div className="dim" style={{ fontSize: 12 }}>{thread.role}</div></div>
      </div>
      <div className="msgr-msgs">
        {MSGS.map((m, i) => <div key={i} className={`msgr-bubble ${m.me ? 'me' : ''}`}>{m.t}<span className="msgr-time">{m.time}</span></div>)}
      </div>
      <form className="msgr-input" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { toast('Отправка — бета'); setText(''); } }}>
        <button type="button" className="ci-tool" title="Файл · бета" onClick={() => toast('Файлы — бета')}><Paperclip size={16} /></button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение…" />
        <button className="ask-send sm" type="submit" aria-label="Отправить"><Send size={15} /></button>
      </form>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fade content-narrow">
        <PageHead title="Мессенджер" sub="Внутренние переписки" actions={<Beta />} />
        {active === null ? (
          <>
            <BetaNote text="Общение между сотрудниками, группами и студентами в одном месте." />
            <div className="card msgr-mobile">{List}</div>
          </>
        ) : (
          <div className="card msgr-mobile conv">{Conv}</div>
        )}
      </div>
    );
  }

  return (
    <div className="fade content-narrow">
      <PageHead title="Мессенджер" sub="Внутренние переписки" actions={<Beta />} />
      <BetaNote text="Общение между сотрудниками, группами и студентами в одном месте." />
      <div className="card msgr">{List}{Conv}</div>
    </div>
  );
}

/* ===================== Notifications ===================== */
const NOTES = [
  { id: 1, icon: Megaphone, tone: 'chip-danger', title: 'Подозрительные входы', desc: '12 неудачных попыток с одного IP за ночь', time: '2 мин', unread: true },
  { id: 2, icon: Bell, tone: 'chip-warn', title: 'Срок оплаты', desc: 'У 8 студентов оплата истекает 30.06', time: '1 ч', unread: true },
  { id: 3, icon: Sparkles, tone: 'chip-ai', title: 'NEX: 4 студента в зоне риска', desc: 'Сформирован список и план действий', time: '3 ч', unread: false },
  { id: 4, icon: FileText, tone: 'chip-info', title: 'Новое заявление в приём', desc: 'ИС-21 · средний балл 248', time: 'Вчера', unread: false },
];
export function NotificationsPage() {
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const list = tab === 'unread' ? NOTES.filter((n) => n.unread) : NOTES;
  return (
    <div className="fade content-narrow">
      <PageHead title="Уведомления" sub="Всё важное в одном потоке" actions={<Beta />} />
      <BetaNote text="Единый центр уведомлений с приоритетами от NEX." />
      <div className="seg" style={{ marginBottom: 16 }}>
        <button className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>Все</button>
        <button className={tab === 'unread' ? 'on' : ''} onClick={() => setTab('unread')}>Непрочитанные</button>
      </div>
      <div className="card"><div className="row-list">
        {list.map((n) => { const Icon = n.icon; return (
          <div className="feed-row" key={n.id} style={{ background: n.unread ? 'var(--ai-weak)' : undefined }}>
            <div className="feed-ico"><Icon size={14} /></div>
            <div className="feed-main"><div className="t">{n.title}</div><div className="m">{n.desc} · {n.time}</div></div>
            <Chip tone={n.tone}>{n.unread ? 'новое' : 'прочитано'}</Chip>
          </div>
        ); })}
      </div></div>
    </div>
  );
}

/* ===================== Documents ===================== */
const DOCS = [
  { id: 1, name: 'Приказ о зачислении 2024.pdf', kind: 'Приказ', size: '240 КБ', date: '12.06', by: 'NEX (черновик)' },
  { id: 2, name: 'Справка об обучении — Волкова.docx', kind: 'Справка', size: '52 КБ', date: '11.06', by: 'Петров А.И.' },
  { id: 3, name: 'Учебный план ПИ-21.xlsx', kind: 'План', size: '1.1 МБ', date: '03.06', by: 'Уч. часть' },
  { id: 4, name: 'Акт сверки — июнь.pdf', kind: 'Финансы', size: '180 КБ', date: '01.06', by: 'Бухгалтерия' },
];
export function Documents() {
  const { toast } = useApp();
  return (
    <div className="fade content-narrow">
      <PageHead title="Документы" sub="Хранилище и шаблоны" actions={<><Beta /><NexAsk q="Подготовь черновик документа по шаблону" label="Собрать документ" /><button className="btn btn-primary" onClick={() => toast('Загрузка — бета')}><Upload size={15} />Загрузить</button></>} />
      <BetaNote text="Документы и шаблоны; NEX готовит черновики и подставляет данные." />
      <div className="card"><div className="table-wrap"><table className="tbl">
        <thead><tr><th>Документ</th><th>Тип</th><th>Размер</th><th>Изменён</th><th>Автор</th><th></th></tr></thead>
        <tbody>{DOCS.map((d) => (
          <tr key={d.id}>
            <td style={{ fontWeight: 600 }}><FileText size={14} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--ai)' }} />{d.name}</td>
            <td><Chip tone="chip-info">{d.kind}</Chip></td>
            <td className="muted">{d.size}</td>
            <td className="muted">{d.date}</td>
            <td className="muted">{d.by}</td>
            <td className="right"><button className="icon-btn" title="Скачать · бета" onClick={() => toast('Скачивание — бета')}><Download size={16} /></button></td>
          </tr>
        ))}</tbody>
      </table></div></div>
    </div>
  );
}

/* ===================== Student feed ===================== */
const POSTS = [
  { id: 1, who: 'Студсовет', time: '1 ч', text: 'В пятницу — день открытых дверей кафедры ИТ. Приходите, будет разбор проектов!', likes: 24, comments: 5, tag: 'Событие' },
  { id: 2, who: 'Кафедра ПИ', time: '3 ч', text: 'Опубликованы материалы лекции по базам данных. Доступны в разделе «Кампус».', likes: 12, comments: 2, tag: 'Учёба' },
  { id: 3, who: 'NEX', time: '5 ч', text: 'Напоминание: 8 студентов с истекающим сроком оплаты. Проверьте раздел «Финансы».', likes: 3, comments: 0, tag: 'NEX' },
];
export function Feed() {
  const { toast } = useApp();
  return (
    <div className="fade content-narrow" style={{ maxWidth: 720 }}>
      <PageHead title="Лента" sub="Студенческая жизнь и объявления" actions={<Beta />} />
      <BetaNote text="Общая лента: объявления, события, материалы и подсказки NEX." />
      <div className="grid" style={{ gap: 14 }}>
        {POSTS.map((p) => (
          <div className="card" key={p.id}><div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Avatar name={p.who} />
              <div style={{ flex: 1 }}><b>{p.who}</b><div className="dim" style={{ fontSize: 12 }}>{p.time} назад</div></div>
              <Chip tone={p.tag === 'NEX' ? 'chip-ai' : 'chip-info'}>{p.tag}</Chip>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{p.text}</div>
            <div className="feed-actions">
              <button onClick={() => toast('Лайк — бета')}><Heart size={15} />{p.likes}</button>
              <button onClick={() => toast('Комментарии — бета')}><MessageCircle size={15} />{p.comments}</button>
              <button onClick={() => toast('Поделиться — бета')}><Share2 size={15} />Поделиться</button>
            </div>
          </div></div>
        ))}
      </div>
    </div>
  );
}

/* ===================== Campus (student hub) ===================== */
const SUBS = ['Прикладная информатика', 'Базы данных', 'Студсовет', 'Карьерный центр'];
const LECTURES = [
  { t: 'Нормализация БД', by: 'Петров А.И.', dur: '48 мин' },
  { t: 'Основы сетей', by: 'Иванова М.С.', dur: '35 мин' },
  { t: 'Алгоритмы сортировки', by: 'NEX-конспект', dur: '12 мин' },
];
export function Campus() {
  const { toast } = useApp();
  const tile = (Icon: typeof BookOpen, title: string, desc: string) => (
    <div className="card campus-tile" onClick={() => toast(`${title} — бета`)}>
      <div className="campus-ic"><Icon size={20} /></div>
      <div><div style={{ fontWeight: 700 }}>{title}</div><div className="muted" style={{ fontSize: 12.5 }}>{desc}</div></div>
    </div>
  );
  return (
    <div className="fade content-narrow">
      <PageHead title="Кампус" sub="Всё для студента в одном месте" actions={<><Beta /><NexAsk q="Что мне сегодня учить и какие дедлайны?" label="Спросить про учёбу" /></>} />
      <BetaNote text="Подписки, лекции, документация и энциклопедии — личное пространство студента." />

      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        {tile(BookOpen, 'Лекции', 'Видео и конспекты')}
        {tile(Library, 'Энциклопедия', 'Справочники и термины')}
        {tile(FileText, 'Документация', 'Методички и регламенты')}
        {tile(GraduationCap, 'Мой прогресс', 'Курсы и достижения')}
      </div>

      <div className="grid cols-2">
        <div className="card">
          <div className="card-head"><div className="card-title"><BookOpen size={15} /> Последние лекции</div></div>
          <div className="row-list">
            {LECTURES.map((l) => (
              <div className="feed-row" key={l.t}>
                <div className="feed-ico" style={{ background: 'var(--ai-weak)', color: 'var(--ai)' }}><BookOpen size={14} /></div>
                <div className="feed-main"><div className="t">{l.t}</div><div className="m">{l.by} · {l.dur}</div></div>
                <button className="btn btn-sm btn-ghost" onClick={() => toast('Просмотр — бета')}>Открыть</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title"><Rss size={15} /> Мои подписки</div></div>
          <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUBS.map((s) => <span key={s}><Chip tone="chip-ai">{s}</Chip></span>)}
            <button className="chip-btn sm" onClick={() => toast('Подписки — бета')}><Star size={12} />Управлять</button>
          </div>
        </div>
      </div>
    </div>
  );
}
