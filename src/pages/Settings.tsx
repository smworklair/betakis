import { useState, type ReactNode } from 'react';
import { Sun, Moon, ShieldCheck, KeyRound, Sparkles, LogOut, PanelLeft, Bot, Palette, Check, X as XIcon } from 'lucide-react';
import { PageHead, Chip, Avatar, Soon, Beta, useApp, type Prefs } from '../ui';
import { roleLabel } from '../data';
import { getGeminiKey, setGeminiKey, testGeminiKey, llmReady } from '../llm';

const ACCENTS: { id: Prefs['accent']; name: string; color: string }[] = [
  { id: 'blue', name: 'Синий', color: '#2f6fed' },
  { id: 'violet', name: 'Фиолетовый', color: '#6d5ae6' },
  { id: 'green', name: 'Зелёный', color: '#0f9d58' },
  { id: 'orange', name: 'Оранжевый', color: '#ea7317' },
  { id: 'rose', name: 'Розовый', color: '#db2777' },
  { id: 'graphite', name: 'Графит', color: '#3f3f46' },
];

/* строка-настройка с сегментом Вкл/Выкл или вариантами */
function Row({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <div className="card-body set-row">
      <div><div style={{ fontWeight: 600 }}>{title}</div><div className="muted" style={{ fontSize: 13 }}>{desc}</div></div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme, user, setUser, sidebarEnabled, setSidebarEnabled, pulseEnabled, setPulseEnabled, prefs, setPref, setPage, openChat, toast } = useApp();
  const [key, setKey] = useState(getGeminiKey());
  const [keyState, setKeyState] = useState<'idle' | 'checking' | 'ok' | 'bad'>(llmReady() ? 'ok' : 'idle');

  const saveKey = async () => {
    if (!key.trim()) { setGeminiKey(''); setKeyState('idle'); toast('Ключ удалён — NEX в демо-режиме'); return; }
    setKeyState('checking');
    const ok = await testGeminiKey(key);
    if (ok) { setGeminiKey(key); setKeyState('ok'); toast('Gemini подключён — NEX отвечает живой моделью'); }
    else { setKeyState('bad'); toast('Ключ не прошёл проверку'); }
  };
  return (
    <div className="fade content-narrow" style={{ maxWidth: 760 }}>
      <PageHead title="Настройки" sub="Профиль, оформление и безопасность" />

      {/* Profile */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><div className="card-title">Профиль</div></div>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={user?.name || ''} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{user?.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>{user ? roleLabel[user.role] : ''}</div>
          </div>
          <button className="btn btn-outline" onClick={() => setUser(null)}><LogOut size={15} />Выйти</button>
        </div>
      </div>

      {/* Appearance — theme toggle lives here, not in the main UI */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><div className="card-title">Оформление</div></div>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Тема интерфейса</div>
            <div className="muted" style={{ fontSize: 13 }}>Светлая по умолчанию, тёмная — для режима мониторинга</div>
          </div>
          <div className="seg">
            <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}><Sun size={14} style={{ marginRight: 6 }} />Светлая</button>
            <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}><Moon size={14} style={{ marginRight: 6 }} />Тёмная</button>
          </div>
        </div>
      </div>

      {/* ---- Персонализация: цвет, плотность, шрифт, углы, полоса NEX ---- */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><div className="card-title"><Palette size={15} /> Персонализация</div></div>
        <Row title="Цвет акцента" desc="Кнопки, ссылки, активные элементы">
          <div className="accent-row">
            {ACCENTS.map((a) => (
              <button key={a.id} className={`accent-swatch ${prefs.accent === a.id ? 'on' : ''}`} style={{ background: a.color }}
                title={a.name} onClick={() => setPref('accent', a.id)}>
                {prefs.accent === a.id && <Check size={13} />}
              </button>
            ))}
          </div>
        </Row>
        <Row title="Плотность" desc="Компактный режим — больше данных на экране">
          <div className="seg">
            <button className={prefs.density === 'normal' ? 'on' : ''} onClick={() => setPref('density', 'normal')}>Обычная</button>
            <button className={prefs.density === 'compact' ? 'on' : ''} onClick={() => setPref('density', 'compact')}>Компактная</button>
          </div>
        </Row>
        <Row title="Размер текста" desc="Крупный — легче читать с расстояния">
          <div className="seg">
            <button className={prefs.font === 'normal' ? 'on' : ''} onClick={() => setPref('font', 'normal')}>Обычный</button>
            <button className={prefs.font === 'large' ? 'on' : ''} onClick={() => setPref('font', 'large')}>Крупный</button>
          </div>
        </Row>
        <Row title="Скругления" desc="Мягкие углы или строгая геометрия">
          <div className="seg">
            <button className={prefs.corners === 'soft' ? 'on' : ''} onClick={() => setPref('corners', 'soft')}>Мягкие</button>
            <button className={prefs.corners === 'sharp' ? 'on' : ''} onClick={() => setPref('corners', 'sharp')}>Строгие</button>
          </div>
        </Row>
        <Row title="Полоса подсказок NEX" desc="Проактивная строка ИИ вверху страниц">
          <div className="seg">
            <button className={prefs.strip ? 'on' : ''} onClick={() => setPref('strip', true)}>Вкл</button>
            <button className={!prefs.strip ? 'on' : ''} onClick={() => setPref('strip', false)}>Выкл</button>
          </div>
        </Row>
      </div>

      {/* ---- Интеллект: живой Gemini. Ключ хранится только в этом браузере ---- */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <div className="card-title"><Sparkles size={15} style={{ color: 'var(--ai)' }} /> Интеллект · Gemini</div>
          {keyState === 'ok' ? <Chip tone="chip-success">подключён</Chip> : <Chip tone="chip-neutral">демо-режим</Chip>}
        </div>
        <div className="card-body">
          <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
            Вставьте ключ Gemini API — чат, инлайн-панели, объяснение выделенного и планировщик задач начнут отвечать живой моделью.
            Ключ хранится <b>только в этом браузере</b> и не попадает на сервер или в код.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" type="password" value={key} onChange={(e) => { setKey(e.target.value); setKeyState('idle'); }} placeholder="Ключ Gemini API…" style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={saveKey} disabled={keyState === 'checking'}>
              {keyState === 'checking' ? 'Проверяю…' : 'Сохранить'}
            </button>
            {getGeminiKey() && <button className="btn btn-ghost" title="Отключить" onClick={() => { setGeminiKey(''); setKey(''); setKeyState('idle'); toast('Gemini отключён'); }}><XIcon size={15} /></button>}
          </div>
          {keyState === 'bad' && <div style={{ color: 'var(--danger)', fontSize: 12.5, marginTop: 8 }}>Ключ не прошёл проверку — проверьте его в Google AI Studio.</div>}
        </div>
      </div>

      {/* ---- Центр агентов живёт здесь, а не в левом меню ---- */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><div className="card-title"><Bot size={15} /> Агенты NEX</div><Beta /></div>
        <Row title="Центр агентов" desc="Штат фоновых агентов: автопилот, уровни автономии, очередь подтверждений, правила и журнал.">
          <button className="btn btn-outline" onClick={() => setPage('agents')}><Bot size={15} />Открыть</button>
        </Row>
      </div>

      {/* Navigation & AI architecture */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><div className="card-title"><PanelLeft size={15} /> Навигация и ИИ</div></div>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ fontWeight: 600 }}>Боковая панель</div>
            <div className="muted" style={{ fontSize: 13 }}>Можно отключить и работать в ИИ-режиме: навигация и задачи — через NEX (строка вверху и пространство NEX).</div>
          </div>
          <div className="seg">
            <button className={sidebarEnabled ? 'on' : ''} onClick={() => setSidebarEnabled(true)}>Вкл</button>
            <button className={!sidebarEnabled ? 'on' : ''} onClick={() => setSidebarEnabled(false)}>Выкл</button>
          </div>
        </div>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Пульс агентов в шапке</div>
            <div className="muted" style={{ fontSize: 13 }}>Строка «кто из агентов что делает сейчас» рядом с поиском. По умолчанию выключена, чтобы не отвлекать.</div>
          </div>
          <div className="seg">
            <button className={pulseEnabled ? 'on' : ''} onClick={() => setPulseEnabled(true)}>Вкл</button>
            <button className={!pulseEnabled ? 'on' : ''} onClick={() => setPulseEnabled(false)}>Выкл</button>
          </div>
        </div>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Как работает NEX в интерфейсе</div>
            <div className="muted" style={{ fontSize: 13 }}>ИИ-функции раскрываются <b>прямо в странице</b> под кнопкой, где вы нажали. Выделите текст — всплывёт лёгкий объяснитель. Кнопка <Sparkles size={12} style={{ color: 'var(--ai)', verticalAlign: 'middle' }} /> вверху открывает полный чат.</div>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => openChat()}><Sparkles size={14} />Открыть чат</button>
        </div>
      </div>

      {/* Security */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><div className="card-title"><ShieldCheck size={15} /> Безопасность</div></div>
        <div className="row-list">
          <div className="feed-row" style={{ alignItems: 'center' }}>
            <div className="feed-ico"><KeyRound size={14} /></div>
            <div className="feed-main"><div className="t">Двухфакторная аутентификация <Soon /></div><div className="m">Дополнительный код при входе</div></div>
            <Chip tone="chip-warn">не настроена</Chip>
            <button className="btn btn-sm btn-outline" onClick={() => toast('Функция в разработке')}>Включить</button>
          </div>
          <div className="feed-row" style={{ alignItems: 'center' }}>
            <div className="feed-ico"><ShieldCheck size={14} /></div>
            <div className="feed-main"><div className="t">Пароль <Soon /></div><div className="m">Последнее изменение: 14 дней назад</div></div>
            <Chip tone="chip-success">надёжный</Chip>
            <button className="btn btn-sm btn-outline" onClick={() => toast('Функция в разработке')}>Сменить</button>
          </div>
        </div>
      </div>

      {/* AI */}
      <div className="card">
        <div className="card-head"><div className="card-title"><Sparkles size={15} style={{ color: 'var(--ai)' }} /> Интеллектуальные функции</div></div>
        <div className="card-body muted" style={{ fontSize: 13 }}>
          NEX встроен в рабочие процессы и помогает без отдельного чат-бота: подсказывает действия, предотвращает ошибки и заранее показывает важное.
          Все действия ИИ проходят через журнал аудита как действия отдельного участника.
        </div>
      </div>
    </div>
  );
}
