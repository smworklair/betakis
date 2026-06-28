import { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PageHead, Chip } from '../ui';
import { groups, students, subjectsByGroup, gradesFor, scheduleDays, scheduleSlots } from '../data';

function GroupSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select className="select" style={{ maxWidth: 220 }} value={value} onChange={(e) => onChange(e.target.value)}>
      {groups.map((g) => <option key={g.id} value={g.name}>{g.name} — {g.spec}</option>)}
    </select>
  );
}

export function Schedule() {
  const [group, setGroup] = useState(groups[0].name);
  return (
    <div className="fade content-narrow">
      <PageHead title="Расписание" sub={`Группа ${group} · текущая неделя`} actions={<GroupSelect value={group} onChange={setGroup} />} />

      <div className="ai-card" style={{ marginBottom: 16, borderLeftColor: 'var(--success)' }}>
        <div className="ai-head" style={{ color: 'var(--success)' }}><ShieldCheck size={14} /> Проверка расписания</div>
        <div className="ai-body">Конфликтов не найдено: преподаватели и аудитории не пересекаются. Найдено свободное окно — <b>Пн 12:00, ауд. 305</b> — можно перенести «Сети».</div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="tbl jtbl">
            <thead><tr><th>Время</th>{scheduleDays.map((d) => <th key={d}>{d}</th>)}</tr></thead>
            <tbody>
              {scheduleSlots.map((row) => (
                <tr key={row.time}>
                  <td className="mono" style={{ fontWeight: 600 }}>{row.time}</td>
                  {[row.mon, row.tue, row.wed, row.thu, row.fri].map((cell, i) => (
                    <td key={i} style={cell.includes('окно') ? { color: 'var(--text-3)', fontStyle: 'italic' } : undefined}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Journal() {
  const [group, setGroup] = useState(groups[0].name);
  const subs = subjectsByGroup[group] || [];
  const list = students.filter((s) => s.group === group);
  const grades = gradesFor(group);
  const cls = (g: number) => (g === 0 ? '' : g === 5 ? 'g5' : g === 4 ? 'g4' : g === 3 ? 'g3' : 'g2');

  return (
    <div className="fade content-narrow">
      <PageHead title="Журнал" sub={`Группа ${group} · ${subs[0] || ''}`} actions={<GroupSelect value={group} onChange={setGroup} />} />

      <div className="ai-card" style={{ marginBottom: 16 }}>
        <div className="ai-head"><Sparkles size={14} /> Подсказка NEX</div>
        <div className="ai-body">У <b>Сидорова Д.</b> две неудовлетворительные подряд — стоит обратить внимание. Пропуски отмечены как «—».</div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="tbl jtbl">
            <thead>
              <tr><th style={{ textAlign: 'left' }}>Студент</th>{[1, 2, 3, 4, 5, 6].map((n) => <th key={n}>{n}</th>)}<th>Средний</th></tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const row = grades[s.id] || [];
                const marks = row.filter((g) => g > 0);
                const avg = marks.length ? (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1) : '—';
                return (
                  <tr key={s.id}>
                    <td style={{ textAlign: 'left', fontWeight: 600 }}>{s.lastname} {s.firstname[0]}.</td>
                    {row.map((g, i) => <td key={i} className={cls(g)}>{g === 0 ? '—' : g}</td>)}
                    <td style={{ fontWeight: 700 }}>{avg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Attendance() {
  const [group, setGroup] = useState(groups[0].name);
  const list = students.filter((s) => s.group === group);
  const rate = (id: number) => 100 - ((id * 13) % 35);

  return (
    <div className="fade content-narrow">
      <PageHead title="Посещаемость" sub={`Группа ${group} · текущий месяц`} actions={<GroupSelect value={group} onChange={setGroup} />} />

      <div className="ai-card" style={{ marginBottom: 16, borderLeftColor: 'var(--warn)' }}>
        <div className="ai-head" style={{ color: 'var(--warn)' }}><AlertTriangle size={14} /> Раннее предупреждение</div>
        <div className="ai-body">У 2 студентов посещаемость опустилась ниже 70% — высокий риск задолженности. Они помечены ниже.</div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Студент</th><th style={{ width: '45%' }}>Посещаемость</th><th className="right">%</th><th>Статус</th></tr></thead>
            <tbody>
              {list.map((s) => {
                const r = rate(s.id);
                const tone = r >= 85 ? 'var(--success)' : r >= 70 ? 'var(--warn)' : 'var(--danger)';
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.lastname} {s.firstname[0]}.</td>
                    <td><div className="meter"><i style={{ width: `${r}%`, background: tone }} /></div></td>
                    <td className="right mono" style={{ color: tone, fontWeight: 600 }}>{r}%</td>
                    <td>{r < 70 ? <Chip tone="chip-danger">риск</Chip> : r < 85 ? <Chip tone="chip-warn">внимание</Chip> : <Chip tone="chip-success">норма</Chip>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
