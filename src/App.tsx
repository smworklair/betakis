/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  School, 
  ClipboardList, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Wallet, 
  GraduationCap, 
  Briefcase, 
  BarChart3, 
  Search, 
  Bell, 
  ChevronRight, 
  Plus, 
  Download, 
  MoreHorizontal, 
  X, 
  LogOut,
  Palette,
  Settings,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// --- TYPES ---
interface Group {
  id: number;
  name: string;
  spec: string;
  course: number;
  curator: string;
  year: number;
}

interface Student {
  id: number;
  lastname: string;
  firstname: string;
  patronymic: string;
  dob: string;
  group: string;
  form: string;
  finance: string;
  phone: string;
  email: string;
  status: string;
}

interface Admission {
  id: number;
  lastname: string;
  firstname: string;
  patronymic: string;
  dob: string;
  spec: string;
  form: string;
  score: number;
  phone: string;
  notes: string;
  date: string;
  status: string;
}

interface Payment {
  id: number;
  date: string;
  studentId: number;
  type: string;
  amount: number;
  status: string;
  note: string;
}

interface Staff {
  id: number;
  lastname: string;
  firstname: string;
  patronymic: string;
  position: string;
  dept: string;
  hours: number;
  rate: number;
  salary: number;
}

interface AppEvent {
  text: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// --- INITIAL DB ---
const INITIAL_DB = {
  groups: [
    {id:1, name:'ПИ-21-1', spec:'Прикладная информатика', course:3, curator:'Козлова М.В.', year:2021},
    {id:2, name:'ПИ-22-1', spec:'Прикладная информатика', course:2, curator:'Петров А.И.', year:2022},
    {id:3, name:'ИС-21-1', spec:'Информационные системы', course:3, curator:'Сидорова Н.П.', year:2021},
    {id:4, name:'ЭК-22-1', spec:'Экономика и бухучёт', course:2, curator:'Фёдорова О.В.', year:2022},
  ],
  students: [
    {id:1, lastname:'Иванов', firstname:'Алексей', patronymic:'Сергеевич', dob:'2003-05-12', group:'ПИ-21-1', form:'Очная', finance:'Бюджет', phone:'+7 921 111-22-33', email:'ivanov@stud.ru', status:'Обучается'},
    {id:2, lastname:'Петрова', firstname:'Мария', patronymic:'Александровна', dob:'2003-09-28', group:'ПИ-21-1', form:'Очная', finance:'Бюджет', phone:'+7 921 222-33-44', email:'petrova@stud.ru', status:'Обучается'},
    {id:3, lastname:'Сидоров', firstname:'Дмитрий', patronymic:'Николаевич', dob:'2004-01-15', group:'ПИ-21-1', form:'Очная', finance:'Контракт', phone:'+7 921 333-44-55', email:'sidorov@stud.ru', status:'Обучается'},
    {id:4, lastname:'Козлова', firstname:'Анна', patronymic:'Петровна', dob:'2003-07-22', group:'ПИ-21-1', form:'Очная', finance:'Бюджет', phone:'+7 921 444-55-66', email:'kozlova@stud.ru', status:'Обучается'},
    {id:5, lastname:'Новиков', firstname:'Игорь', patronymic:'Витальевич', dob:'2003-11-03', group:'ПИ-22-1', form:'Очная', finance:'Бюджет', phone:'+7 921 555-66-77', email:'novikov@stud.ru', status:'Обучается'},
    {id:6, lastname:'Соколова', firstname:'Елена', patronymic:'Михайловна', dob:'2004-03-18', group:'ПИ-22-1', form:'Очная', finance:'Контракт', phone:'+7 921 666-77-88', email:'sokolova@stud.ru', status:'Обучается'},
    {id:7, lastname:'Морозов', firstname:'Антон', patronymic:'Дмитриевич', dob:'2004-06-30', group:'ПИ-22-1', form:'Очная', finance:'Бюджет', phone:'+7 921 777-88-99', email:'morozov@stud.ru', status:'Обучается'},
    {id:8, lastname:'Волкова', firstname:'Ольга', patronymic:'Ивановна', dob:'2003-08-14', group:'ИС-21-1', form:'Очная', finance:'Бюджет', phone:'+7 921 888-99-00', email:'volkova@stud.ru', status:'Обучается'},
    {id:9, lastname:'Лебедев', firstname:'Сергей', patronymic:'Анатольевич', dob:'2003-12-05', group:'ИС-21-1', form:'Очная', finance:'Контракт', phone:'+7 921 999-00-11', email:'lebedev@stud.ru', status:'Академический отпуск'},
    {id:10, lastname:'Зайцева', firstname:'Татьяна', patronymic:'Олеговна', dob:'2004-04-11', group:'ЭК-22-1', form:'Заочная', finance:'Контракт', phone:'+7 921 100-200-300', email:'zaitseva@stud.ru', status:'Обучается'},
    {id:11, lastname:'Смирнов', firstname:'Павел', patronymic:'Романович', dob:'2004-07-08', group:'ЭК-22-1', form:'Очная', finance:'Бюджет', phone:'+7 921 200-300-400', email:'smirnov@stud.ru', status:'Обучается'},
    {id:12, lastname:'Попова', firstname:'Виктория', patronymic:'Алексеевна', dob:'2003-10-25', group:'ПИ-21-1', form:'Очная', finance:'Бюджет', phone:'+7 921 300-400-500', email:'popova@stud.ru', status:'Обучается'},
  ],
  subjects: {
    'ПИ-21-1': ['Базы данных', 'Веб-технологии', 'Операционные системы', 'Математика', 'Алгоритмы'],
    'ПИ-22-1': ['Программирование', 'Информатика', 'Математика', 'Физика', 'Английский'],
    'ИС-21-1': ['Системный анализ', 'Проектирование ИС', 'СУБД', 'Сети', 'Безопасность'],
    'ЭК-22-1': ['Бухучёт', 'Экономика', 'Математика', 'Налоги', 'Менеджмент'],
  } as Record<string, string[]>,
  admissions: [
    {id:1, lastname:'Куликов', firstname:'Роман', patronymic:'Сергеевич', dob:'2006-03-14', spec:'09.03.03 Прикладная информатика', form:'Очная', score:87, phone:'+7 921 100-101-102', notes:'', date:'2024-06-01', status:'На рассмотрении'},
    {id:2, lastname:'Тихонова', firstname:'Вера', patronymic:'Андреевна', dob:'2006-07-22', spec:'09.02.07 Информационные системы', form:'Очная', score:79, phone:'+7 921 200-201-202', notes:'', date:'2024-06-03', status:'Принято'},
    {id:3, lastname:'Громов', firstname:'Максим', patronymic:'Олегович', dob:'2006-01-05', spec:'38.02.01 Экономика и бухучёт', form:'Заочная', score:65, phone:'+7 921 300-301-302', notes:'', date:'2024-06-05', status:'На рассмотрении'},
  ],
  payments: [
    {id:1, date:'2024-01-10', studentId:3, type:'Оплата за обучение', amount:45000, status:'Оплачено', note:'1 семестр 2024'},
    {id:2, date:'2024-01-15', studentId:6, type:'Оплата за обучение', amount:45000, status:'Оплачено', note:'1 семестр 2024'},
    {id:3, date:'2024-01-20', studentId:10, type:'Оплата за обучение', amount:52000, status:'Просрочено', note:'1 семестр 2024'},
    {id:4, date:'2024-02-01', studentId:1, type:'Государственная стипендия', amount:2417, status:'Оплачено', note:'Февраль'},
    {id:5, date:'2024-02-01', studentId:2, type:'Повышенная стипендия', amount:5441, status:'Оплачено', note:'Февраль'},
    {id:6, date:'2024-02-01', studentId:4, type:'Государственная стипендия', amount:2417, status:'Оплачено', note:'Февраль'},
  ],
  staff: [
    {id:1, lastname:'Козлова', firstname:'Марина', patronymic:'Владимировна', position:'Доцент', dept:'Кафедра ИТ', hours:20, rate:1.0, salary:62000},
    {id:2, lastname:'Петров', firstname:'Андрей', patronymic:'Игоревич', position:'Старший преподаватель', dept:'Кафедра ИТ', hours:18, rate:1.0, salary:55000},
    {id:3, lastname:'Сидорова', firstname:'Наталья', patronymic:'Павловна', position:'Доцент', dept:'Кафедра ИТ', hours:16, rate:0.75, salary:48000},
    {id:4, lastname:'Фёдорова', firstname:'Ольга', patronymic:'Викторовна', position:'Старший преподаватель', dept:'Кафедра ИТ', hours:18, rate:1.0, salary:52000},
    {id:5, lastname:'Карпов', firstname:'Виктор', patronymic:'Алексеевич', position:'Главный бухгалтер', dept:'Бухгалтерия', hours:40, rate:1.0, salary:75000},
    {id:6, lastname:'Орлова', firstname:'Светлана', patronymic:'Ивановна', position:'Бухгалтер', dept:'Бухгалтерия', hours:40, rate:1.0, salary:48000},
    {id:7, lastname:'Соколов', firstname:'Игорь', patronymic:'Петрович', position:'Начальник учебного отдела', dept:'Учебный отдел', hours:40, rate:1.0, salary:65000},
  ],
  events: [
    {text: 'Зачислен студент Куликов Р.С. в группу ПИ-21-1', time: '09:15', type: 'success'},
    {text: 'Выставлены оценки по дисциплине "Базы данных" (ПИ-21-1)', time: '10:32', type: 'info'},
    {text: 'Зарегистрирован платёж: Сидоров Д.Н. — 45 000 ₽', time: '11:05', type: 'success'},
    {text: 'Задолженность по оплате: Зайцева Т.О.', time: '12:20', type: 'warning'},
    {text: 'Обновлено расписание группы ПИ-22-1', time: '14:10', type: 'info'},
  ] as AppEvent[]
};

// --- HELPERS ---
const calculateAvg = (grades: (number | string)[]) => {
  const nums = grades.filter(g => typeof g === 'number') as number[];
  return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : '—';
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('admin');
  const [db, setDb] = useState(INITIAL_DB);
  const [notifications, setNotifications] = useState<{id: number, msg: string, type: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState({ primary: '#2563eb', font: 'Inter' });
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Modal states
  const [modals, setModals] = useState({
    student: null as number | null | 'new',
    group: null as number | null | 'new',
    staff: null as number | null | 'new',
    payment: false,
    admission: false,
    settings: false,
  });

  // Derived data
  const stats = useMemo(() => {
    const activeStudents = db.students.filter(s => s.status === 'Обучается').length;
    const debts = db.payments.filter(p => p.status === 'Просрочено').length;
    const paid = db.payments.filter(p => p.status === 'Оплачено').reduce((a, p) => a + p.amount, 0);
    return { activeStudents, debts, paid };
  }, [db]);

  // Notify helper
  const notify = (msg: string, type: string = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // --- PAGE RENDERING ---
  const renderDashboard = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Рабочий стол</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md shadow-sm border-slate-200 hover:bg-slate-50">
              <Download size={16} /> Экспорт отчёта
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors border rounded-md shadow-sm border-blue-600 bg-blue-600 hover:bg-blue-700">
              <Plus size={16} /> Новое событие
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Студентов всего" value={stats.activeStudents.toString()} sub="активных обучающихся" icon={<Users className="text-blue-500" />} color="blue" />
          <StatCard label="Средний балл" value="4.2" sub="по всем группам" icon={<BarChart3 className="text-emerald-500" />} color="emerald" />
          <StatCard label="Посещаемость" value="88%" sub="за текущий месяц" icon={<CheckSquare className="text-amber-500" />} color="amber" />
          <StatCard label="Задолженности" value={stats.debts.toString()} sub="студентов" icon={<Wallet className="text-rose-500" />} color="rose" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Успеваемость по группам</h3>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {db.groups.map(g => (
                <div key={g.id} className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-blue-50 rounded-t-lg relative" style={{ height: `${(Math.random() * 60) + 40}%` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-blue-500 rounded-t-lg transition-all duration-1000" style={{ height: '70%', opacity: 0.8 }}></div>
                  </div>
                  <span className="text-xs font-medium text-slate-600">{g.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Последние события</h3>
            <div className="space-y-4">
              {db.events.map((e, i) => (
                <div key={i} className="flex gap-4 p-3 transition-colors rounded-lg hover:bg-slate-50">
                   <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${e.type === 'success' ? 'bg-emerald-500' : e.type === 'info' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                   <div className="flex-1">
                     <p className="text-sm text-slate-700">{e.text}</p>
                     <p className="text-xs text-slate-400 mt-1">{e.time}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStudents = () => {
    const filtered = db.students.filter(s => 
      `${s.lastname} ${s.firstname} ${s.group}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">База студентов</h2>
          <button 
            onClick={() => setModals({...modals, student: 'new'})}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus size={16} /> Добавить студента
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по ФИО, группе..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md">
            <option>Все группы</option>
            {db.groups.map(g => <option key={g.id}>{g.name}</option>)}
          </select>
        </div>

        <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-bottom border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">ФИО</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Группа</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Курс</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Ср.балл</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Статус</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                        {s.lastname[0]}{s.firstname[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{s.lastname} {s.firstname} {s.patronymic}</p>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{s.group}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{db.groups.find(g => g.name === s.group)?.course || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      4.2
                    </span>
                  </td>
                  <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      s.status === 'Обучается' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    } border`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const renderSchedule = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Расписание занятий</h2>
          <div className="flex gap-2">
             <select className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-md">
               {db.groups.map(g => <option key={g.id}>{g.name}</option>)}
             </select>
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-md hover:bg-slate-50">
               <Calendar size={16} /> Октябрь 2024
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, idx) => (
            <div key={idx} className="space-y-4">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider text-center py-2 bg-slate-50 rounded-lg">{day}</div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(p => (
                   <div key={p} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                     <p className="text-[10px] font-bold text-slate-400 uppercase">{p}-я пара</p>
                     <p className="text-sm font-bold text-blue-600 mt-1 uppercase leading-tight">Базы данных</p>
                     <p className="text-xs text-slate-600 mt-1 font-medium italic opacity-70">Козлова М.В.</p>
                     <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400">АУД. 314</span>
                        <span className="text-[10px] font-bold text-slate-400">08:00</span>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderJournal = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Электронный журнал</h2>
          <div className="flex gap-2">
             <select className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-md">
               {db.groups.map(g => <option key={g.id}>{g.name}</option>)}
             </select>
             <select className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-md">
               <option>Все дисциплины</option>
               <option>Базы данных</option>
               <option>Веб-технологии</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider sticky left-0 bg-slate-50 z-10 w-64 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-center">Студент</th>
                {[...Array(12)].map((_, i) => (
                  <th key={i} className="px-3 py-4 text-[10px] font-bold uppercase text-slate-400 text-center border-l border-slate-100 min-w-[40px]">
                    {i+1}.09
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-center border-l border-slate-100">Итог</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {db.students.slice(0, 10).map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-100">
                    {s.lastname} {s.firstname[0]}.
                  </td>
                  {[...Array(12)].map((_, i) => {
                    const grade = Math.floor(Math.random() * 4) + 2;
                    const colorClass = grade === 5 ? 'text-emerald-600' : grade === 4 ? 'text-blue-600' : grade === 3 ? 'text-amber-600' : 'text-rose-600';
                    return (
                      <td key={i} className={`px-3 py-4 text-sm font-bold text-center border-l border-slate-100 hover:bg-slate-100/50 cursor-pointer ${colorClass}`}>
                        {Math.random() > 0.2 ? grade : ''}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-center border-l border-slate-100 bg-slate-50/30">
                    4.1
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const renderGroups = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Группы</h2>
          <button 
            onClick={() => setModals({...modals, group: 'new'})}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus size={16} /> Создать группу
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {db.groups.map(g => {
            const count = db.students.filter(s => s.group === g.name).length;
            const avg = (Math.random() * 1.5 + 3.5).toFixed(1);
            return (
              <div key={g.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="p-6">
                   <div className="flex justify-between items-start mb-2">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                        {g.name[0]}
                      </div>
                      <div className="text-right">
                         <p className="text-xl font-bold text-slate-900">{g.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{g.year} год набора</p>
                      </div>
                   </div>
                   <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Специальность</p>
                        <p className="text-sm font-medium text-slate-600">{g.spec}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Студентов</p>
                          <p className="text-sm font-bold text-slate-900">{count}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Средний балл</p>
                          <p className="text-sm font-bold text-blue-600">{avg}</p>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-slate-100/50 transition-colors">
                   <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200" />
                      <span className="text-xs font-medium text-slate-500">{g.curator}</span>
                   </div>
                   <button className="text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline">Подробнее</button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderAdmissions = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Приёмная комиссия</h2>
          <div className="flex gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg">
               <button className="px-4 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-md shadow-sm">Заявления</button>
               <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Статистика</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-slate-900 rounded-md hover:bg-slate-800">
               <Plus size={16} /> Новое заявление
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="p-6 bg-slate-900 rounded-2xl text-white">
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">Всего заявлений</p>
              <h4 className="text-4xl font-black">{db.admissions.length}</h4>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400">
                 <span>Посмотреть все</span> <ChevronRight size={14} />
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Принято</p>
              <h4 className="text-4xl font-black">{db.admissions.filter(a => a.status === 'Принято').length}</h4>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500">
                 <span>+12 за неделю</span>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">На рассмотрении</p>
              <h4 className="text-4xl font-black">{db.admissions.filter(a => a.status === 'На рассмотрении').length}</h4>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-500">
                 <span>Требует внимания</span>
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Абитуриент</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Специальность</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-center">Балл</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Статус</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-right">Действия</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {db.admissions.map(a => (
                   <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                         <p className="text-sm font-bold text-slate-900">{a.lastname} {a.firstname} {a.patronymic}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{a.date}</p>
                      </td>
                      <td className="px-6 py-4">
                         <div className="max-w-[240px] truncate">
                           <p className="text-xs font-medium text-slate-600">{a.spec}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{a.form}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{a.score}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          a.status === 'Принято' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-[10px] font-bold uppercase hover:bg-blue-700 transition-colors">Оформить</button>
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><MoreHorizontal size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </motion.div>
    );
  };

  // --- RENDERING MAIN ---

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 selection:bg-blue-100 selection:text-blue-700" style={{ fontFamily: theme.font }}>
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="flex flex-col h-full bg-slate-900 text-slate-400 border-r border-slate-800 z-50 shrink-0 relative"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand */}
          <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800/50">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <School className="text-white" size={20} />
            </div>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white tracking-tight truncate">КИС Колледж</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest truncate">Enterprise ERP</span>
              </motion.div>
            )}
          </div>

          {/* User Profile */}
          {isSidebarOpen ? (
             <div className="p-4 mx-4 my-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold ring-2 ring-slate-800">АД</div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white truncate">Смирнов А.В.</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Администратор</span>
                   </div>
                </div>
             </div>
          ) : (
            <div className="flex justify-center my-4">
              <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 ring-blue-500 transition-all">АД</div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar space-y-1">
            <NavItem active={activePage === 'dashboard'} icon={<LayoutDashboard size={20} />} label="Рабочий стол" onClick={() => setActivePage('dashboard')} collapsed={!isSidebarOpen} />
            
            <SidebarSection label="Организация" collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'students'} icon={<Users size={20} />} label="Студенты" onClick={() => setActivePage('students')} collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'groups'} icon={<School size={20} />} label="Группы" onClick={() => setActivePage('groups')} collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'admissions'} icon={<ClipboardList size={20} />} label="Приёмная комиссия" onClick={() => setActivePage('admissions')} collapsed={!isSidebarOpen} />

            <SidebarSection label="Учебный процесс" collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'schedule'} icon={<Calendar size={20} />} label="Расписание" onClick={() => setActivePage('schedule')} collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'journal'} icon={<BookOpen size={20} />} label="Электронный журнал" onClick={() => setActivePage('journal')} collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'attendance'} icon={<CheckSquare size={20} />} label="Посещаемость" onClick={() => setActivePage('attendance')} collapsed={!isSidebarOpen} />

            <SidebarSection label="Администрирование" collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'finance'} icon={<Wallet size={20} />} label="Финансы" onClick={() => setActivePage('finance')} collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'staff'} icon={<Briefcase size={20} />} label="Кадры" onClick={() => setActivePage('staff')} collapsed={!isSidebarOpen} />
            <NavItem active={activePage === 'analytics'} icon={<BarChart3 size={20} />} label="Аналитика" onClick={() => setActivePage('analytics')} collapsed={!isSidebarOpen} />
          </nav>

          {/* Bottom logout */}
          <div className="p-3 border-t border-slate-800">
            <NavItem icon={<LogOut size={20} />} label="Выход" onClick={() => {}} collapsed={!isSidebarOpen} className="hover:text-rose-400 hover:bg-rose-400/5" />
          </div>
        </div>

        {/* Toggle button */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 h-6 w-6 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors z-50 shadow-md"
        >
          <ChevronRight size={14} className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 h-full relative">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-40 sticky top-0">
          <div className="flex items-center gap-4">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
               Колледж ERP <span className="mx-2 text-slate-200">/</span> <span className="text-slate-600">{activePage}</span>
             </div>
          </div>
          <div className="flex items-center gap-5">
             <div className="relative group">
               <Bell size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors cursor-pointer" />
               <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
             </div>
             <div className="h-8 w-px bg-slate-200 mx-1" />
             <button 
               onClick={() => setModals({...modals, settings: true})}
               className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
             >
               <Settings size={20} />
             </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activePage === 'dashboard' && <div key="dash">{renderDashboard()}</div>}
            {activePage === 'students' && <div key="stud">{renderStudents()}</div>}
            {activePage === 'groups' && <div key="group">{renderGroups()}</div>}
            {activePage === 'admissions' && <div key="adm">{renderAdmissions()}</div>}
            {activePage === 'schedule' && <div key="sched">{renderSchedule()}</div>}
            {activePage === 'journal' && <div key="jour">{renderJournal()}</div>}
            {/* ... other page implementations would go here ... */}
            {activePage !== 'dashboard' && activePage !== 'students' && activePage !== 'schedule' && activePage !== 'journal' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                 <div className="p-6 bg-white rounded-full border border-slate-100 shadow-sm">
                   <LayoutDashboard size={48} className="opacity-20" />
                 </div>
                 <div className="text-center">
                    <h3 className="text-slate-900 font-bold">Страница в разработке</h3>
                    <p className="text-sm">Модуль "{activePage}" находится на этапе редизайна.</p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="px-8 py-3 bg-white border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
          <div>© 2024 КИС Колледж — Unified Educational Platform</div>
          <div>Версия 2.0 (Build 542)</div>
        </footer>
      </main>

      {/* NOTIFICATIONS */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-3 z-[100]">
        {notifications.map(n => (
          <motion.div 
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border ${
              n.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${n.type === 'error' ? 'bg-white' : 'bg-blue-400'}`} />
            <span className="text-sm font-medium">{n.msg}</span>
          </motion.div>
        ))}
      </div>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {modals.settings && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModals({...modals, settings: false})}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Palette size={20} /></div>
                  <h3 className="text-lg font-bold">Персонализация</h3>
                </div>
                <button onClick={() => setModals({...modals, settings: false})} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Цветовая схема</label>
                   <div className="grid grid-cols-4 gap-3">
                     {['#2563eb', '#10b981', '#f59e0b', '#7c3aed'].map(c => (
                        <button 
                          key={c} 
                          onClick={() => {setTheme({...theme, primary: c}); notify(`Цвет изменен`, 'info')}}
                          className={`h-10 rounded-lg transition-transform hover:scale-105 active:scale-95 border-2 ${theme.primary === c ? 'border-slate-900' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                     ))}
                   </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Шрифт интерфейса</label>
                    <div className="space-y-2">
                       {['Inter', 'Roboto', 'SF Pro Text', 'System Serif'].map(f => (
                          <button 
                            key={f} 
                            onClick={() => setTheme({...theme, font: f})}
                            className={`w-full px-4 py-3 text-sm font-medium text-left rounded-lg transition-colors border ${
                              theme.font === f ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {f}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setModals({...modals, settings: false})}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
                  >
                    Готово
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ active, icon, label, onClick, collapsed, className = "" }: { active?: boolean, icon: React.ReactNode, label: string, onClick: () => void, collapsed?: boolean, className?: string }) {
  return (
    <button 
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`relative w-full flex items-center transition-all duration-200 h-10 group overflow-hidden ${
        active 
          ? 'bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 px-4' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg px-4'
      } ${className}`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <span className="ml-3 text-sm font-semibold truncate whitespace-nowrap">{label}</span>
      )}
      {active && !collapsed && (
        <div className="ml-auto">
          <ChevronRight size={14} className="opacity-50" />
        </div>
      )}
      {collapsed && active && (
        <div className="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]" />
      )}
    </button>
  );
}

function SidebarSection({ label, collapsed }: { label: string, collapsed?: boolean }) {
  if (collapsed) return <div className="h-px bg-slate-800 my-4 mx-4" />;
  return (
    <div className="pt-8 pb-3 px-4">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function StatCard({ label, value, sub, icon, color }: { label: string, value: string, sub: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
       {/* Background accent */}
       <div className={`absolute top-0 right-0 p-2 opacity-5 scale-[2] group-hover:scale-[2.5] transition-transform duration-500`}>
         {icon}
       </div>
       
       <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl bg-${color}-50 text-${color}-500 shrink-0`}>
            {icon}
          </div>
       </div>
       <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</h4>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
             <span className="text-emerald-500 bg-emerald-50 px-1 rounded truncate">+12%</span>
             <span className="truncate">{sub}</span>
          </div>
       </div>
    </div>
  );
}
