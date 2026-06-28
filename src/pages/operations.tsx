import { useState } from 'react';
import { Plus, Sparkles, AlertTriangle, FileText } from 'lucide-react';
import { PageHead, Chip, NexAsk, Soon, useApp } from '../ui';
import { admissions, finance } from '../data';

export function Admissions() {
  const { toast } = useApp();
  const [tab, setTab] = useState<'apps' | 'reg' | 'stats'>('apps');
  return (
    <div className="fade content-narrow">
      <PageHead title="Приём" sub="Приёмная кампания 2024" actions={<><Soon /><button className="btn btn-primary" onClick={() => toast('Функция в разработке')}><Plus size={15} />Заявление</button></>} />

      <div className="seg" style={{ marginBottom: 16 }}>
        <button className={tab === 'apps' ? 'on' : ''} onClick={() => setTab('apps')}>Заявления</button>
        <button className={tab === 'reg' ? 'on' : ''} onClick={() => setTab('reg')}>Регистрация</button>
        <button className={tab === 'stats' ? 'on' : ''} onClick={() => setTab('stats')}>Статистика</button>
      </div>

      {tab === 'apps' && (
        <>
          <div className="ai-card" style={{ marginBottom: 16 }}>
            <div className="ai-head"><Sparkles size={14} /> Обработка документов</div>
            <div className="ai-body">Поля распознаны из загруженных документов автоматически. Найден <b>возможный дубликат</b> — отмечен в списке.</div>
          </div>
          <div className="card">
            <div className="table-wrap">
              <table className="tbl">
                <thead><tr><th>Абитуриент</th><th>Специальность</th><th className="right">Баллы</th><th>Статус</th><th>Заметки ИИ</th></tr></thead>
                <tbody>
                  {admissions.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>{a.name}</td>
                      <td className="muted">{a.spec}</td>
                      <td className="right mono" style={{ fontWeight: 600 }}>{a.score}</td>
                      <td><Chip tone={a.status === 'Рекомендован' ? 'chip-success' : a.status === 'На рассмотрении' ? 'chip-info' : 'chip-warn'}>{a.status}</Chip></td>
                      <td>{a.flag ? <span className="ai-inline"><Sparkles size={12} />{a.flag}</span> : <span className="dim">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {tab === 'reg' && (
        <div className="card"><div className="card-body grid cols-2">
          <div><label className="field-label">ФИО абитуриента</label><input className="input" placeholder="Введите ФИО" /></div>
          <div><label className="field-label">Специальность</label><select className="select"><option>Прикладная информатика</option><option>Информационные системы</option><option>Экономика и бухучёт</option></select></div>
          <div><label className="field-label">Средний балл аттестата</label><input className="input" placeholder="0.00" /></div>
          <div><label className="field-label">Телефон</label><input className="input" placeholder="+7 ___ ___-__-__" /></div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}><button className="btn btn-primary" onClick={() => toast('Функция в разработке')}>Зарегистрировать</button><Soon /></div>
        </div></div>
      )}
      {tab === 'stats' && (
        <div className="grid cols-3">
          <div className="kpi"><div className="kpi-label">Всего заявлений</div><div className="kpi-value">3</div></div>
          <div className="kpi"><div className="kpi-label">Средний балл</div><div className="kpi-value">238</div></div>
          <div className="kpi"><div className="kpi-label">Конкурс</div><div className="kpi-value">2.4</div></div>
        </div>
      )}
    </div>
  );
}

export function Finance() {
  const { toast } = useApp();
  const tone = (s: string) => (s === 'Оплачено' ? 'chip-success' : s === 'Просрочено' ? 'chip-danger' : 'chip-warn');
  const total = finance.payments.reduce((a, p) => a + (p.status === 'Оплачено' ? p.sum : 0), 0);
  return (
    <div className="fade content-narrow">
      <PageHead title="Финансы" sub="Платежи и задолженность" actions={<><Soon /><button className="btn btn-outline" onClick={() => toast('Функция в разработке')}><FileText size={15} />Экспорт</button></>} />

      <div className="grid cols-3" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="kpi-label">Поступило</div><div className="kpi-value">₽ {total.toLocaleString('ru')}</div></div>
        <div className="kpi"><div className="kpi-label">Задолженность</div><div className="kpi-value" style={{ color: 'var(--danger)' }}>₽ 248 000</div></div>
        <div className="kpi"><div className="kpi-label">Должников</div><div className="kpi-value">8</div></div>
      </div>

      <div className="ai-card" style={{ marginBottom: 16, borderLeftColor: 'var(--warn)' }}>
        <div className="ai-head" style={{ color: 'var(--warn)' }}><AlertTriangle size={14} /> Аномалия в платежах</div>
        <div className="ai-body">Три перевода на нетипичную сумму от одного контрагента. Рекомендуется проверка перед закрытием периода.</div>
        <div className="ai-actions"><NexAsk q="Покажи аномальные платежи и объясни, почему они помечены" label="Разобрать аномалию" subtle={false} /></div>
      </div>

      <div className="card">
        <div className="card-head"><div className="card-title">Платежи</div><NexAsk q="Сформируй финансовый отчёт по платежам и задолженности за период" label="Собрать отчёт" /></div>
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Студент</th><th>Группа</th><th className="right">Сумма</th><th>Дата</th><th>Способ</th><th>Статус</th></tr></thead>
            <tbody>
              {finance.payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.student}</td>
                  <td className="mono">{p.group}</td>
                  <td className="right mono">₽ {p.sum.toLocaleString('ru')}</td>
                  <td>{p.date}</td>
                  <td className="muted">{p.method}</td>
                  <td><Chip tone={tone(p.status)}>{p.status}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Scholarship() {
  return (
    <div className="fade content-narrow">
      <PageHead title="Стипендии" sub="Назначения текущего семестра" />
      <div className="ai-card" style={{ marginBottom: 16 }}>
        <div className="ai-head"><Sparkles size={14} /> Подбор кандидатов</div>
        <div className="ai-body">Право на стипендию рассчитано по успеваемости и подтверждающим документам — с указанием основания в каждой строке.</div>
        <div className="ai-actions"><NexAsk q="Кто претендует на повышенную стипендию и почему?" label="Разобрать кандидатов" subtle={false} /></div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Студент</th><th>Группа</th><th>Тип</th><th className="right">Сумма</th><th>Основание</th></tr></thead>
            <tbody>
              {finance.scholarships.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.student}</td>
                  <td className="mono">{s.group}</td>
                  <td><Chip tone="chip-info">{s.type}</Chip></td>
                  <td className="right mono">₽ {s.sum.toLocaleString('ru')}</td>
                  <td className="muted" style={{ fontSize: 12.5 }}>{s.basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
