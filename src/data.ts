// NEX prototype data. In production this comes from the backend (kernel + modules);
// here it is local seed + mock telemetry that mirrors the future API shapes.

export type Role = 'admin' | 'teacher' | 'accountant' | 'student';

export const roleLabel: Record<Role, string> = {
  admin: 'Администратор',
  teacher: 'Преподаватель',
  accountant: 'Бухгалтер',
  student: 'Студент',
};

export interface Group { id: number; name: string; spec: string; course: number; curator: string; year: number; students: number; }
export interface Student {
  id: number; lastname: string; firstname: string; patronymic: string;
  dob: string; group: string; form: string; finance: string;
  phone: string; email: string; status: string;
}
export interface StaffMember { id: number; name: string; role: string; dept: string; load: number; email: string; status: string; }

export const groups: Group[] = [
  { id: 1, name: 'ПИ-21-1', spec: 'Прикладная информатика', course: 3, curator: 'Козлова М.В.', year: 2021, students: 24 },
  { id: 2, name: 'ПИ-22-1', spec: 'Прикладная информатика', course: 2, curator: 'Петров А.И.', year: 2022, students: 26 },
  { id: 3, name: 'ИС-21-1', spec: 'Информационные системы', course: 3, curator: 'Сидорова Н.П.', year: 2021, students: 22 },
  { id: 4, name: 'ЭК-22-1', spec: 'Экономика и бухучёт', course: 2, curator: 'Фёдорова О.В.', year: 2022, students: 28 },
];

export const students: Student[] = [
  { id: 1, lastname: 'Иванов', firstname: 'Алексей', patronymic: 'Сергеевич', dob: '2003-05-12', group: 'ПИ-21-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 111-22-33', email: 'ivanov@stud.ru', status: 'Обучается' },
  { id: 2, lastname: 'Петрова', firstname: 'Мария', patronymic: 'Александровна', dob: '2003-09-28', group: 'ПИ-21-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 222-33-44', email: 'petrova@stud.ru', status: 'Обучается' },
  { id: 3, lastname: 'Сидоров', firstname: 'Дмитрий', patronymic: 'Николаевич', dob: '2004-01-15', group: 'ПИ-21-1', form: 'Очная', finance: 'Контракт', phone: '+7 921 333-44-55', email: 'sidorov@stud.ru', status: 'Обучается' },
  { id: 4, lastname: 'Козлова', firstname: 'Анна', patronymic: 'Петровна', dob: '2003-07-22', group: 'ПИ-21-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 444-55-66', email: 'kozlova@stud.ru', status: 'Обучается' },
  { id: 5, lastname: 'Новиков', firstname: 'Игорь', patronymic: 'Витальевич', dob: '2003-11-03', group: 'ПИ-22-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 555-66-77', email: 'novikov@stud.ru', status: 'Обучается' },
  { id: 6, lastname: 'Соколова', firstname: 'Елена', patronymic: 'Михайловна', dob: '2004-03-18', group: 'ПИ-22-1', form: 'Очная', finance: 'Контракт', phone: '+7 921 666-77-88', email: 'sokolova@stud.ru', status: 'Обучается' },
  { id: 7, lastname: 'Морозов', firstname: 'Антон', patronymic: 'Дмитриевич', dob: '2004-06-30', group: 'ПИ-22-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 777-88-99', email: 'morozov@stud.ru', status: 'Обучается' },
  { id: 8, lastname: 'Волкова', firstname: 'Ольга', patronymic: 'Ивановна', dob: '2003-08-14', group: 'ИС-21-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 888-99-00', email: 'volkova@stud.ru', status: 'Обучается' },
  { id: 9, lastname: 'Лебедев', firstname: 'Сергей', patronymic: 'Анатольевич', dob: '2003-12-05', group: 'ИС-21-1', form: 'Очная', finance: 'Контракт', phone: '+7 921 999-00-11', email: 'lebedev@stud.ru', status: 'Академический отпуск' },
  { id: 10, lastname: 'Зайцева', firstname: 'Татьяна', patronymic: 'Олеговна', dob: '2004-04-11', group: 'ЭК-22-1', form: 'Заочная', finance: 'Контракт', phone: '+7 921 100-200-300', email: 'zaitseva@stud.ru', status: 'Обучается' },
  { id: 11, lastname: 'Смирнов', firstname: 'Павел', patronymic: 'Романович', dob: '2004-07-08', group: 'ЭК-22-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 200-300-400', email: 'smirnov@stud.ru', status: 'Обучается' },
  { id: 12, lastname: 'Попова', firstname: 'Виктория', patronymic: 'Алексеевна', dob: '2003-10-25', group: 'ПИ-21-1', form: 'Очная', finance: 'Бюджет', phone: '+7 921 300-400-500', email: 'popova@stud.ru', status: 'Обучается' },
];

export const subjectsByGroup: Record<string, string[]> = {
  'ПИ-21-1': ['Базы данных', 'Веб-технологии', 'Операционные системы', 'Математика', 'Алгоритмы'],
  'ПИ-22-1': ['Программирование', 'Информатика', 'Математика', 'Физика', 'Английский'],
  'ИС-21-1': ['Системный анализ', 'Проектирование ИС', 'СУБД', 'Сети', 'Безопасность'],
  'ЭК-22-1': ['Бухучёт', 'Экономика', 'Математика', 'Налоги', 'Менеджмент'],
};

// Deterministic pseudo-grades so the journal is stable between renders.
export function gradesFor(groupName: string): Record<number, number[]> {
  const list = students.filter((s) => s.group === groupName);
  const cols = 6;
  const out: Record<number, number[]> = {};
  for (const s of list) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const seed = (s.id * 31 + c * 17) % 10;
      row.push(seed < 1 ? 0 : seed < 3 ? 3 : seed < 8 ? 4 : 5); // 0 = пропуск
    }
    out[s.id] = row;
  }
  return out;
}

export const staff: StaffMember[] = [
  { id: 1, name: 'Козлова Мария Викторовна', role: 'Преподаватель', dept: 'Кафедра ИТ', load: 720, email: 'kozlova@nex.ru', status: 'Активен' },
  { id: 2, name: 'Петров Андрей Иванович', role: 'Преподаватель', dept: 'Кафедра ИТ', load: 680, email: 'petrov@nex.ru', status: 'Активен' },
  { id: 3, name: 'Сидорова Нина Павловна', role: 'Зав. отделением', dept: 'Информ. системы', load: 540, email: 'sidorova@nex.ru', status: 'Активен' },
  { id: 4, name: 'Фёдорова Ольга Викторовна', role: 'Преподаватель', dept: 'Экономика', load: 700, email: 'fedorova@nex.ru', status: 'Отпуск' },
  { id: 5, name: 'Григорьев Пётр Сергеевич', role: 'Бухгалтер', dept: 'Бухгалтерия', load: 0, email: 'grigoriev@nex.ru', status: 'Активен' },
];

// ---------- Security / operations telemetry (mirrors future audit + sessions API) ----------
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ActorType = 'human' | 'ai';

export interface SessionInfo { id: string; name: string; role: Role; device: string; location: string; ip: string; active: string; current?: boolean; anomaly?: string; }
export interface AuditEvent { id: string; actor: string; actorType: ActorType; action: string; target: string; severity: Severity; time: string; }
export interface FailedLogin { id: string; name: string; ip: string; location: string; time: string; attempts: number; flagged?: boolean; }
export interface AppNotification { id: string; title: string; desc: string; severity: Severity; time: string; }
export interface AiInsight { id: string; title: string; desc: string; confidence: number; page: string; }
export interface ServiceHealth { name: string; status: 'ok' | 'degraded' | 'down'; value: string; }

export const sessions: SessionInfo[] = [
  { id: 's1', name: 'Вы (текущая)', role: 'admin', device: 'Chrome · Windows', location: 'Санкт-Петербург', ip: '95.30.11.4', active: 'сейчас', current: true },
  { id: 's2', name: 'Козлова М.В.', role: 'teacher', device: 'Safari · macOS', location: 'Санкт-Петербург', ip: '95.30.11.78', active: '3 мин назад' },
  { id: 's3', name: 'Григорьев П.С.', role: 'accountant', device: 'Chrome · Windows', location: 'Москва', ip: '178.140.2.9', active: '12 мин назад' },
  { id: 's4', name: 'Сидорова Н.П.', role: 'teacher', device: 'Firefox · Linux', location: 'Казань', ip: '188.43.7.221', active: '40 мин назад', anomaly: 'Новый регион входа' },
];

export const auditEvents: AuditEvent[] = [
  { id: 'a1', actor: 'NEX AI', actorType: 'ai', action: 'Отметил 3 платежа как аномальные', target: 'Финансы', severity: 'medium', time: '2 мин назад' },
  { id: 'a2', actor: 'Григорьев П.С.', actorType: 'human', action: 'Экспорт реестра платежей', target: 'Финансы / Платежи', severity: 'high', time: '14 мин назад' },
  { id: 'a3', actor: 'Вы', actorType: 'human', action: 'Изменена роль пользователя', target: 'Петров А.И. → Зав. кафедрой', severity: 'critical', time: '1 ч назад' },
  { id: 'a4', actor: 'NEX AI', actorType: 'ai', action: 'Предотвращён конфликт в расписании', target: 'Расписание / ауд. 305', severity: 'low', time: '1 ч назад' },
  { id: 'a5', actor: 'Козлова М.В.', actorType: 'human', action: 'Выставлены оценки', target: 'Журнал / ПИ-21-1', severity: 'low', time: '2 ч назад' },
  { id: 'a6', actor: 'Сидорова Н.П.', actorType: 'human', action: 'Вход в систему', target: 'Сессия · Казань', severity: 'medium', time: '40 мин назад' },
];

export const criticalActions: AuditEvent[] = auditEvents.filter((e) => e.severity === 'critical' || e.severity === 'high');

export const failedLogins: FailedLogin[] = [
  { id: 'f1', name: 'admin', ip: '193.41.22.7', location: 'Неизвестно (VPN)', time: '08:42', attempts: 7, flagged: true },
  { id: 'f2', name: 'g.petrov', ip: '95.30.11.78', location: 'Санкт-Петербург', time: '09:15', attempts: 2 },
  { id: 'f3', name: 'root', ip: '45.9.148.3', location: 'Нидерланды', time: '03:20', attempts: 12, flagged: true },
];

export const failedLoginTrend = [1, 0, 2, 0, 5, 12, 3, 1, 2, 7, 4, 2];

export const notifications: AppNotification[] = [
  { id: 'n1', title: 'Подозрительная активность входа', desc: '12 неудачных попыток с IP 45.9.148.3', severity: 'critical', time: '3 ч назад' },
  { id: 'n2', title: 'Срок оплаты истекает', desc: '8 студентов на контракте — оплата до 30.06', severity: 'high', time: '5 ч назад' },
  { id: 'n3', title: 'Резервное копирование выполнено', desc: 'Снимок БД создан успешно', severity: 'low', time: 'сегодня, 04:00' },
  { id: 'n4', title: 'Ожидает подтверждения', desc: '2 приказа об отчислении готовы к подписи', severity: 'medium', time: 'вчера' },
];

export const aiInsights: AiInsight[] = [
  { id: 'i1', title: '3 студента в зоне риска', desc: 'Снижение посещаемости и успеваемости в ПИ-21-1 за 2 недели.', confidence: 0.92, page: 'students' },
  { id: 'i2', title: 'Аномалия в платежах', desc: 'Три перевода на нетипичную сумму от одного контрагента.', confidence: 0.81, page: 'finance' },
  { id: 'i3', title: 'Окно в расписании', desc: 'Ауд. 305 свободна Пн 12:00 — можно перенести «Сети».', confidence: 0.74, page: 'schedule' },
];

export const services: ServiceHealth[] = [
  { name: 'Ядро NEX (API)', status: 'ok', value: '99.98%' },
  { name: 'База данных', status: 'ok', value: 'отклик 4 мс' },
  { name: 'Журнал аудита', status: 'ok', value: 'целостен' },
  { name: 'AI-мониторинг', status: 'ok', value: 'активен' },
  { name: 'Резервные копии', status: 'ok', value: '4 ч назад' },
  { name: 'Шлюз входа (2FA)', status: 'degraded', value: 'задержка SMS' },
];

export const finance = {
  payments: [
    { id: 'p1', student: 'Зайцева Т.О.', group: 'ЭК-22-1', sum: 62000, date: '2024-06-15', method: 'Карта', status: 'Оплачено' },
    { id: 'p2', student: 'Сидоров Д.Н.', group: 'ПИ-21-1', sum: 62000, date: '2024-06-12', method: 'Счёт', status: 'Оплачено' },
    { id: 'p3', student: 'Лебедев С.А.', group: 'ИС-21-1', sum: 62000, date: '—', method: '—', status: 'Просрочено' },
    { id: 'p4', student: 'Соколова Е.М.', group: 'ПИ-22-1', sum: 31000, date: '2024-06-18', method: 'Карта', status: 'Частично' },
  ],
  scholarships: [
    { id: 'sc1', student: 'Иванов А.С.', group: 'ПИ-21-1', type: 'Академическая', sum: 4200, basis: 'Средний балл 4.8' },
    { id: 'sc2', student: 'Петрова М.А.', group: 'ПИ-21-1', type: 'Повышенная', sum: 8600, basis: 'Отличная учёба + НИР' },
    { id: 'sc3', student: 'Козлова А.П.', group: 'ПИ-21-1', type: 'Социальная', sum: 5100, basis: 'Подтверждающие документы' },
  ],
};

export const admissions = [
  { id: 'ap1', name: 'Орлов Кирилл Дмитриевич', spec: 'Прикладная информатика', score: 246, status: 'На рассмотрении', flag: 'Возможный дубликат' },
  { id: 'ap2', name: 'Васильева Дарья Игоревна', spec: 'Информационные системы', score: 271, status: 'Рекомендован', flag: '' },
  { id: 'ap3', name: 'Кузнецов Артём Павлович', spec: 'Экономика и бухучёт', score: 198, status: 'Документы неполные', flag: 'Не хватает аттестата' },
];

export const scheduleDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];
export const scheduleSlots = [
  { time: '08:30', mon: 'Базы данных · 305', tue: 'Алгоритмы · 210', wed: 'Математика · 114', thu: 'Веб · 305', fri: 'ОС · 207' },
  { time: '10:15', mon: 'Веб-технологии · 305', tue: 'Базы данных · 305', wed: 'Алгоритмы · 210', thu: 'Математика · 114', fri: 'Базы данных · 305' },
  { time: '12:00', mon: '— окно —', tue: 'ОС · 207', wed: 'Веб · 305', thu: 'Алгоритмы · 210', fri: 'Математика · 114' },
  { time: '13:45', mon: 'Математика · 114', tue: 'Веб · 305', wed: 'Базы данных · 305', thu: 'ОС · 207', fri: 'Алгоритмы · 210' },
];
