import { Sun, Moon, ShieldCheck, KeyRound, Sparkles, LogOut, PanelLeft } from 'lucide-react';
import { PageHead, Chip, Avatar, Soon, useApp } from '../ui';
import { roleLabel } from '../data';

export default function Settings() {
  const { theme, setTheme, user, setUser, sidebarEnabled, setSidebarEnabled, pulseEnabled, setPulseEnabled, openChat, toast } = useApp();
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
