import { students, finance, gradesFor } from './data';

/* ============================================================
   NEX brain — one shared intelligence used by both the narrow
   contextual panel (Cmd+E) and the full conversational page.
   Pure data in / data out; the UI decides how to render it.
   ============================================================ */

export const attendanceRate = (id: number) => 100 - ((id * 13) % 35);
export const avgGrade = (id: number, group: string) => {
  const m = (gradesFor(group)[id] || []).filter((g) => g > 0);
  return m.length ? m.reduce((a, b) => a + b, 0) / m.length : 0;
};
export const groupAvg = (group: string) => {
  const all = students.filter((s) => s.group === group).map((s) => avgGrade(s.id, group)).filter((x) => x > 0);
  return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
};
const hasDebt = (lastname: string) => finance.payments.some((p) => p.student.startsWith(lastname) && p.status !== 'Оплачено');

export interface RiskRow { id: number; name: string; group: string; rate: number; avg: number; }
export function atRisk(): RiskRow[] {
  return students
    .map((s) => ({ id: s.id, name: `${s.lastname} ${s.firstname}`, group: s.group, rate: attendanceRate(s.id), avg: avgGrade(s.id, s.group) }))
    .filter((x) => x.rate < 78 || x.avg < 3.6)
    .sort((a, b) => a.rate - b.rate);
}

/** A block of structured data the chat can render below the prose answer. */
export type NexData = 'atrisk' | 'finance' | 'kpi' | 'security';

export interface NavLink { label: string; page: string; }
export interface NexReply {
  text: string;
  /** Suggested navigation — turns the chat into a way to reach any screen. */
  nav?: NavLink[];
  /** A single confirmable action (auditable). */
  action?: string;
  /** A rich data block rendered inline. */
  data?: NexData;
}

export interface NexCtx { student?: number | null; page?: string; seed?: string | null; }

export const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Командный центр', students: 'Студенты', groups: 'Группы', admissions: 'Приём',
  schedule: 'Расписание', journal: 'Журнал', attendance: 'Посещаемость', finance: 'Финансы',
  scholarship: 'Стипендии', staff: 'Сотрудники', analytics: 'Аналитика', graduation: 'Выпуск', security: 'Безопасность',
};

export function nexReply(q: string, ctx: NexCtx = {}): NexReply {
  const t = q.toLowerCase();
  const { student, seed } = ctx;

  /* --- selection seed (narrow, from the mini-panel) --- */
  if (seed) {
    if (/объясн|что это/.test(t)) return { text: `«${seed.slice(0, 80)}…» — фрагмент текущего экрана. По контексту относится к учебным/финансовым данным организации. Могу найти связанные записи или подготовить действие.` };
    if (/сдела|действ/.test(t)) return { text: `На основе выделенного «${seed.slice(0, 60)}…» могу создать задачу, черновик документа или уведомление. Что оформить?`, action: 'Создать черновик' };
    return { text: `Беру в работу выделенное: «${seed.slice(0, 80)}». Объяснить, найти связи или оформить действие?` };
  }

  /* --- focused student (narrow) --- */
  if (student != null) {
    const s = students.find((x) => x.id === student);
    if (s) {
      const rate = attendanceRate(s.id);
      const avg = avgGrade(s.id, s.group);
      const gAvg = groupAvg(s.group);
      const debt = hasDebt(s.lastname);
      if (/риск|почему/.test(t)) return { text: `${s.lastname} в зоне риска прежде всего из-за посещаемости ${rate}% (${rate < 70 ? 'критично' : 'ниже нормы 85%'}). Средний балл ${avg.toFixed(1)}${avg < gAvg ? `, ниже среднего по ${s.group} (${gAvg.toFixed(1)})` : ''}. Тренд за 2 недели — снижение.`, nav: [{ label: 'Открыть журнал', page: 'journal' }] };
      if (/сравн|групп/.test(t)) return { text: `${s.lastname}: средний балл ${avg.toFixed(1)} против ${gAvg.toFixed(1)} по ${s.group}. Посещаемость ${rate}% против ~88% по группе. ${avg < gAvg ? 'Отстаёт от группы.' : 'На уровне группы.'}` };
      if (/предприн|делать|что|рекоменд/.test(t)) return { text: `Рекомендую: 1) уведомить куратора (${s.group}); 2) назначить отработку пропусков; 3) контрольная точка через 2 недели.${debt ? ' Также есть незакрытая оплата.' : ''}`, action: 'Поставить задачу куратору' };
      if (/справк|документ/.test(t)) return { text: `Подготовил черновик справки об обучении для ${s.lastname} ${s.firstname} (${s.group}, ${s.form}, ${s.finance}). Проверьте и подпишите — действие попадёт в аудит.`, action: 'Открыть черновик справки' };
      if (/оплат|долг|деньг|финанс/.test(t)) return { text: debt ? `У ${s.lastname} есть незакрытая оплата по контракту.` : `У ${s.lastname} задолженностей нет.`, action: debt ? 'Подготовить уведомление' : undefined, nav: [{ label: 'Финансы', page: 'finance' }] };
      return { text: `${s.lastname} ${s.firstname}, ${s.group}: средний балл ${avg.toFixed(1)}, посещаемость ${rate}%, оплата ${debt ? 'с долгом' : 'в норме'}. Спросите «почему в зоне риска» или «что предпринять».` };
    }
  }

  /* --- general organizational intelligence (the full-chat brain) --- */
  if (/безопас|угроз|вход|атак|ip/.test(t))
    return { text: 'Безопасность: ядро, БД и журнал аудита в норме. Зафиксированы 2 подозрительные серии входов (IP 45.9.148.3, 193.41.22.7) — рекомендую блокировку. 2FA-шлюз с задержкой SMS.', data: 'security', action: 'Заблокировать IP 45.9.148.3', nav: [{ label: 'Консоль безопасности', page: 'security' }] };
  if (/риск|отчисл|посещаем/.test(t))
    return { text: `В зоне риска ${atRisk().length} студентов — основной фактор посещаемость ниже 78%. Самый высокий риск выделен первым.`, data: 'atrisk', nav: [{ label: 'Посещаемость', page: 'attendance' }, { label: 'Студенты', page: 'students' }] };
  if (/финанс|долг|оплат|деньг|задолж|платеж/.test(t))
    return { text: 'Финансы: задолженность ₽248K, за неделю −12%. У 8 студентов истекает срок оплаты до 30.06 — можно разослать уведомления.', data: 'finance', action: 'Разослать уведомления должникам', nav: [{ label: 'Финансы', page: 'finance' }, { label: 'Стипендии', page: 'scholarship' }] };
  if (/аномал/.test(t))
    return { text: 'Нашёл 3 перевода на нетипичную сумму от одного контрагента за период. Рекомендую проверку до закрытия месяца.', action: 'Открыть платежи', nav: [{ label: 'Финансы', page: 'finance' }] };
  if (/сводк|важно|сегодня|день|обзор|статус/.test(t))
    return { text: 'Главное сейчас: 1) подозрительные входы (безопасность); 2) 8 студентов с истекающим сроком оплаты; 3) студенты в зоне риска; 4) свободное окно в расписании (Пн 12:00, ауд. 305).', data: 'kpi', nav: [{ label: 'Командный центр', page: 'dashboard' }, { label: 'Аналитика', page: 'analytics' }] };
  if (/успеваем|оцен|балл|аналит/.test(t))
    return { text: 'Средний балл по организации 4.2. Посещаемость 91% (−2% за неделю, основной вклад — ПИ-21-1). Распределение оценок и динамика — в аналитике.', data: 'kpi', nav: [{ label: 'Аналитика', page: 'analytics' }, { label: 'Журнал', page: 'journal' }] };
  if (/приём|прием|заявлен|абитур|поступ/.test(t))
    return { text: 'Приём идёт в графике: 3 заявления, 1 новое за сутки. Конкурс по ИС-21 выше прошлого года.', nav: [{ label: 'Приём', page: 'admissions' }] };
  if (/расписан|пар|занят|аудитор/.test(t))
    return { text: 'Расписание сформировано, конфликтов нет. Свободное окно: Пн 12:00, ауд. 305 — можно поставить консультацию.', nav: [{ label: 'Расписание', page: 'schedule' }] };
  if (/выпуск|диплом|готовн/.test(t))
    return { text: 'Готовность к выпуску 2024: ПИ-21-1 — 22/24, ИС-21-1 — 19/22. У 5 студентов не закрыты задолженности для допуска.', nav: [{ label: 'Выпуск', page: 'graduation' }] };
  if (/студент|учащ|группа/.test(t))
    return { text: 'В системе 100 студентов в нескольких группах. Откройте список или назовите фамилию — соберу карточку с успеваемостью, посещаемостью и оплатой.', nav: [{ label: 'Студенты', page: 'students' }, { label: 'Группы', page: 'groups' }] };
  if (/действ|предлож|что сделать|рекоменд/.test(t))
    return { text: 'Предлагаю: разослать уведомления должникам, заблокировать подозрительные IP, связаться с кураторами по студентам в зоне риска. Каждое действие проходит подтверждение и аудит.', nav: [{ label: 'Командный центр', page: 'dashboard' }] };
  if (/привет|здравств|hi|hello/.test(t))
    return { text: 'На связи. Я веду организацию целиком — спросите про студентов, финансы, безопасность, расписание или просто «что сегодня важно», и я отвечу и отведу в нужный раздел.' };

  return { text: 'Я понимаю запросы об организации: студенты и группы, успеваемость и посещаемость, финансы и долги, безопасность, расписание, приём и выпуск. Сформулируйте своими словами — отвечу и при необходимости открою нужный экран.', nav: [{ label: 'Командный центр', page: 'dashboard' }] };
}
