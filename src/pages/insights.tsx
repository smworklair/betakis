import { Sparkles, GraduationCap } from 'lucide-react';
import { PageHead, Chip, NexAsk } from '../ui';
import { groups, gradesFor, finance } from '../data';
import { Donut, Line, Legend, type Segment } from '../charts';

export function Analytics() {
  const byGroup = groups.map((g) => {
    const gr = gradesFor(g.name);
    const all = Object.values(gr).flat().filter((x) => x > 0);
    const avg = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
    return { name: g.name, avg };
  });
  const max = Math.max(...byGroup.map((b) => b.avg), 5);

  return (
    <div className="fade content-narrow">
      <PageHead title="Аналитика" sub="Сводные показатели по организации" />
      <div className="ai-card" style={{ marginBottom: 16 }}>
        <div className="ai-head"><Sparkles size={14} /> Сводка за неделю</div>
        <div className="ai-body">Посещаемость снизилась на 2%, основной вклад — ПИ-21-1. Финансовая задолженность сократилась на 12%. Приём идёт в графике.</div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="kpi-label">Студентов</div><div className="kpi-value">100</div></div>
        <div className="kpi"><div className="kpi-label">Средний балл</div><div className="kpi-value">4.2</div></div>
        <div className="kpi"><div className="kpi-label">Посещаемость</div><div className="kpi-value">91%</div></div>
        <div className="kpi"><div className="kpi-label">Выпуск 2024</div><div className="kpi-value">46</div></div>
      </div>

      {(() => {
        const dist: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0 };
        groups.forEach((g) => Object.values(gradesFor(g.name)).forEach((row) => row.forEach((v) => { if (v >= 2 && v <= 5) dist[v]++; })));
        const gradeSegs: Segment[] = [
          { label: 'Отлично (5)', value: dist[5], color: 'var(--success)' },
          { label: 'Хорошо (4)', value: dist[4], color: 'var(--accent)' },
          { label: 'Удовл. (3)', value: dist[3], color: 'var(--warn)' },
          { label: 'Неуд. (2)', value: dist[2], color: 'var(--danger)' },
        ];
        const paid = finance.payments.filter((p) => p.status === 'Оплачено').reduce((a, p) => a + p.sum, 0);
        const finSegs: Segment[] = [
          { label: 'Поступило', value: paid, color: 'var(--success)' },
          { label: 'Задолженность', value: 248000, color: 'var(--danger)' },
        ];
        return (
          <div className="grid cols-3" style={{ marginBottom: 16 }}>
            <div className="card">
              <div className="card-head"><div className="card-title">Распределение оценок</div><NexAsk q="Разбери распределение оценок и где успеваемость проседает" label="Разобрать" /></div>
              <div className="card-body chart-flex"><Donut segments={gradeSegs} centerTop={gradeSegs.reduce((a, s) => a + s.value, 0)} centerSub="оценок" /><Legend segments={gradeSegs} withValues /></div>
            </div>
            <div className="card">
              <div className="card-head"><div className="card-title">Посещаемость · динамика</div><NexAsk q="Объясни динамику посещаемости и спрогнозируй риск" label="Объяснить" /></div>
              <div className="card-body"><Line data={[88, 90, 91, 89, 92, 90, 91, 93, 92, 90, 89, 91]} min={80} max={100} /></div>
            </div>
            <div className="card">
              <div className="card-head"><div className="card-title">Финансы</div><NexAsk q="Сформируй финансовую сводку: поступления, задолженность, риски" label="Сводка" /></div>
              <div className="card-body chart-flex"><Donut segments={finSegs} centerTop="₽" centerSub="период" /><Legend segments={finSegs} /></div>
            </div>
          </div>
        );
      })()}

      <div className="card">
        <div className="card-head"><div className="card-title">Средний балл по группам</div><NexAsk q="Какие группы отстают по среднему баллу и почему?" label="Найти отстающих" /></div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {byGroup.map((b) => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="mono" style={{ width: 72, fontSize: 13 }}>{b.name}</span>
              <div className="meter" style={{ flex: 1, height: 10 }}><i style={{ width: `${(b.avg / max) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--ai))' }} /></div>
              <span className="mono" style={{ width: 36, fontWeight: 600, textAlign: 'right' }}>{b.avg.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Graduation() {
  const readiness = [
    { group: 'ПИ-21-1', ready: 22, total: 24 },
    { group: 'ИС-21-1', ready: 19, total: 22 },
  ];
  return (
    <div className="fade content-narrow">
      <PageHead title="Выпуск" sub="Готовность к выпуску 2024" />
      <div className="ai-card" style={{ marginBottom: 16 }}>
        <div className="ai-head"><GraduationCap size={14} /> Готовность документов</div>
        <div className="ai-body">У 5 студентов не хватает закрытых задолженностей для допуска. Список сформирован автоматически.</div>
      </div>
      <div className="grid cols-2">
        {readiness.map((r) => (
          <div className="card" key={r.group}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{r.group}</span>
                <Chip tone={r.ready === r.total ? 'chip-success' : 'chip-warn'}>{r.ready}/{r.total} готовы</Chip>
              </div>
              <div className="meter" style={{ height: 10 }}><i style={{ width: `${(r.ready / r.total) * 100}%`, background: 'var(--success)' }} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
