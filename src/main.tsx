import './index.css';

// --- STATE / DATA (EXACTLY AS PER USER SPEC) ---
let state: any = {
  currentRole: 'admin',
  isAuthenticated: false,
  currentGradeCell: null,
  currentGradeStudentId: null,
  currentGradeDateIdx: null,
  charts: {}
};

let db: any = {
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
  },
  grades: {}, 
  gradesDates: {},
  schedule: {},
  attendance: {}, 
  payments: [
    {id:1, date:'2024-01-10', studentId:3, type:'Оплата за обучение', amount:45000, status:'Оплачено', note:'1 семестр 2024'},
    {id:2, date:'2024-01-15', studentId:6, type:'Оплата за обучение', amount:45000, status:'Оплачено', note:'1 семестр 2024'},
    {id:3, date:'2024-01-20', studentId:10, type:'Оплата за обучение', amount:52000, status:'Просрочено', note:'1 семестр 2024'},
    {id:4, date:'2024-02-01', studentId:1, type:'Государственная стипендия', amount:2417, status:'Оплачено', note:'Февраль'},
    {id:5, date:'2024-02-01', studentId:2, type:'Повышенная стипендия', amount:5441, status:'Оплачено', note:'Февраль'},
    {id:6, date:'2024-02-01', studentId:4, type:'Государственная стипендия', amount:2417, status:'Оплачено', note:'Февраль'},
  ],
  admissions: [
    {id:1, lastname:'Куликов', firstname:'Роман', patronymic:'Сергеевич', dob:'2006-03-14', spec:'09.03.03 Прикладная информатика', form:'Очная', score:87, phone:'+7 921 100-101-102', notes:'', date:'2024-06-01', status:'На рассмотрении'},
    {id:2, lastname:'Тихонова', firstname:'Вера', patronymic:'Андреевна', dob:'2006-07-22', spec:'09.02.07 Информационные системы', form:'Очная', score:79, phone:'+7 921 200-201-202', notes:'', date:'2024-06-03', status:'Принято'},
    {id:3, lastname:'Громов', firstname:'Максим', patronymic:'Олегович', dob:'2006-01-05', spec:'38.02.01 Экономика и бухучёт', form:'Заочная', score:65, phone:'+7 921 300-301-302', notes:'', date:'2024-06-05', status:'На рассмотрении'},
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
  events: []
};

// --- DATA INITIALIZATION ---
function initGrades() {
  Object.keys(db.subjects).forEach(group => {
    const groupStudents = db.students.filter((s: any) => s.group === group);
    db.subjects[group].forEach((subj: any) => {
      const key = `${group}_${subj}`;
      const dates = [];
      const baseDate = new Date('2024-09-01');
      for (let i = 0; i < 6; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i * 7);
        dates.push(d.toISOString().slice(0,10));
      }
      db.gradesDates[key] = dates;
      groupStudents.forEach((s: any) => {
        const gkey = `${s.id}_${subj}`;
        db.grades[gkey] = dates.map(() => {
          const r = Math.random();
          if (r < 0.05) return 'н';
          if (r < 0.15) return 2;
          if (r < 0.35) return 3;
          if (r < 0.65) return 4;
          return 5;
        });
      });
    });
  });
}

function initSchedule() {
  const schedData: any = {
    'ПИ-21-1': [
      ['Базы данных / Козлова М.В. / 314', 'Веб-технологии / Петров А.И. / 218', null, 'Операционные системы / Сидорова Н.П. / 102', null, null],
      ['Математика / Иванченко К.П. / 201', null, 'Алгоритмы / Козлова М.В. / 314', null, 'Физкультура / Романов В.С. / спорт', null],
      [null, 'Базы данных / Козлова М.В. / 314', null, 'Веб-технологии / Петров А.И. / 218', null, null],
      ['Алгоритмы / Козлова М.В. / 314', null, 'Математика / Иванченко К.П. / 201', null, 'Английский / Белова Т.А. / 305', null],
      [null, 'Операционные системы / Сидорова Н.П. / 102', 'Базы данных (лаб) / Козлова М.В. / 314', null, null, null],
      ['Веб-технологии (лаб) / Петров А.И. / 218', null, null, null, null, null],
    ],
    'ПИ-22-1': [
      ['Программирование / Петров А.И. / 218', null, 'Информатика / Козлова М.В. / 314', null, 'Математика / Иванченко К.П. / 201', null],
      [null, 'Физика / Громов Д.А. / 105', null, 'Программирование / Петров А.И. / 218', null, null],
      ['Английский / Белова Т.А. / 305', null, null, 'Информатика / Козлова М.В. / 314', null, null],
      ['Математика / Иванченко К.П. / 201', 'Программирование (лаб) / Петров А.И. / 218', null, null, 'Физика / Громов Д.А. / 105', null],
      [null, null, 'Английский / Белова Т.А. / 305', null, 'Математика / Иванченко К.П. / 201', null],
      ['Физкультура / Романов В.С. / спорт', null, null, null, null, null],
    ],
  };
  Object.keys(schedData).forEach(group => {
    db.schedule[`${group}_1`] = schedData[group];
    db.schedule[`${group}_2`] = schedData[group].map((row: any[]) =>
      row.map((cell, i) => i % 2 === 0 ? null : cell)
    );
  });
  ['ИС-21-1','ЭК-22-1'].forEach(group => {
    db.schedule[`${group}_1`] = Array(6).fill(null).map((_, d) =>
      Array(6).fill(null).map((_, p) => {
        if ((d + p) % 3 === 0) return `Дисциплина ${p+1} / Преподаватель / ${100+d*10+p}`;
        return null;
      })
    );
    db.schedule[`${group}_2`] = db.schedule[`${group}_1`];
  });
}

function initAttendance() {
  const today = new Date().toISOString().slice(0,10);
  db.groups.forEach((g: any) => {
    const groupStudents = db.students.filter((s: any) => s.group === g.name);
    for (let p = 1; p <= 4; p++) {
      const key = `${g.name}_${today}_${p}`;
      const att: any = {};
      groupStudents.forEach((s: any) => { att[s.id] = Math.random() > 0.15; });
      db.attendance[key] = att;
    }
  });
}

// --- NAVIGATION & UI (GLOBALLY ATTACHED) ---
(window as any).showPage = function(pageId: string, navEl: HTMLElement) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  if (navEl) navEl.classList.add('active');
  const titles: any = {dashboard:'Рабочий стол', students:'Студенты', groups:'Группы', admissions:'Приёмная комиссия', schedule:'Расписание', journal:'Журнал / Оценки', attendance:'Посещаемость', finance:'Финансовый учёт', scholarship:'Стипендии', staff:'Кадровый учёт', analytics:'Аналитика', graduation:'Выпуск студентов'};
  const bc = document.getElementById('breadcrumb-current');
  if (bc) bc.textContent = titles[pageId] || pageId;

  if (pageId === 'dashboard') (window as any).renderDashboard();
  else if (pageId === 'students') (window as any).renderStudents();
  else if (pageId === 'groups') (window as any).renderGroups();
  else if (pageId === 'admissions') (window as any).renderAdmissions();
  else if (pageId === 'schedule') (window as any).renderSchedule();
  else if (pageId === 'journal') (window as any).renderJournal();
  else if (pageId === 'attendance') (window as any).renderAttendance();
  else if (pageId === 'finance') (window as any).renderFinance();
  else if (pageId === 'scholarship') (window as any).renderScholarship();
  else if (pageId === 'staff') (window as any).renderStaff();
  else if (pageId === 'analytics') (window as any).renderAnalytics();
};

(window as any).showTab = function(tabId: string, tabEl: HTMLElement) {
  const page = tabEl.closest('.page') as HTMLElement;
  page.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  
  // Simple tab implementation based on parent hierarchy
  ['adm-', 'fin-', 'an-'].forEach(prefix => {
     if (tabId.startsWith(prefix)) {
        const containers = page.querySelectorAll(`div[id^="${prefix}"]`);
        containers.forEach((c: any) => c.style.display = c.id === tabId ? 'block' : 'none');
     }
  });

  if (tabId === 'adm-stats') (window as any).renderAdmChart();
  if (tabId === 'fin-chart') (window as any).renderFinChart();
};

(window as any).setLoginRole = function(role: string) {
  const roleInput = document.getElementById('loginRole') as HTMLInputElement;
  if (roleInput) roleInput.value = role;
  
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('role-' + role)?.classList.add('active');
};

(window as any).login = function() {
  const role = (document.getElementById('loginRole') as HTMLInputElement).value;
  const name = (document.getElementById('loginName') as HTMLInputElement).value;
  
  if (!name.trim()) {
    (window as any).notify('Пожалуйста, введите ваше имя');
    return;
  }

  state.currentRole = role;
  state.isAuthenticated = true;
  
  // Hide login, show app
  const loginScr = document.getElementById('loginScreen');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  
  if (loginScr) loginScr.style.display = 'none';
  if (sidebar) sidebar.style.display = 'flex';
  if (main) main.style.display = 'block';

  (window as any).changeRole(role, name);
  (window as any).applyRoleFilters(role);
  (window as any).showPage('dashboard', document.querySelector('.nav-item') as HTMLElement);
  (window as any).notify(`Добро пожаловать, ${name}!`);
};

(window as any).logout = function() {
  state.isAuthenticated = false;
  document.getElementById('loginScreen')!.style.display = 'flex';
  document.getElementById('sidebar')!.style.display = 'none';
  document.getElementById('main')!.style.display = 'none';
  (window as any).notify('Вы вышли из системы');
};

(window as any).applyRoleFilters = function(role: string) {
  const sections = document.querySelectorAll('.sidebar-section');
  
  // Role permissions mapping (more precise)
  const permissions: any = {
    admin: ['dashboard', 'students', 'groups', 'admissions', 'schedule', 'journal', 'attendance', 'finance', 'scholarship', 'staff', 'analytics', 'graduation'],
    teacher: ['dashboard', 'students', 'groups', 'schedule', 'journal', 'attendance', 'analytics'],
    accountant: ['dashboard', 'finance', 'scholarship', 'staff', 'analytics'],
    student: ['dashboard', 'schedule', 'journal', 'scholarship']
  };

  const allowed = permissions[role] || [];

  sections.forEach((section: any) => {
    let hasVisibleItem = false;
    section.querySelectorAll('.nav-item').forEach((item: any) => {
      const onclickAttr = item.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/'([^']+)'/);
        const pageId = match ? match[1] : null;
        if (pageId && allowed.includes(pageId)) {
          item.style.display = 'flex';
          hasVisibleItem = true;
        } else {
          item.style.display = 'none';
        }
      }
    });
    section.style.display = hasVisibleItem ? 'block' : 'none';
  });

  // Additional fine-grained control for specific elements if needed
  const admBtn = document.querySelector('[onclick="openStudentModal()"]');
  if (admBtn) (admBtn as any).style.display = (role === 'admin' || role === 'staff') ? 'inline-flex' : 'none';
};

(window as any).changeRole = function(role: string, customName: string = null) {
  state.currentRole = role;
  const roleNames:any = {admin:'Администратор', teacher:'Преподаватель', accountant:'Бухгалтер', student:'Студент'};
  const roleAvatar:any = {admin:'АД', teacher:'КМ', accountant:'КВ', student:'ИА'};
  
  const un = document.getElementById('userName'); 
  if (un) un.textContent = customName || (role === 'admin' ? 'Смирнов А.В.' : 'Пользователь');
  
  const ur = document.getElementById('userRole'); if (ur) ur.textContent = roleNames[role];
  const ua = document.getElementById('userAvatar'); if (ua) ua.textContent = customName ? customName[0].toUpperCase() : roleAvatar[role];
};

// --- CORE APP LOGIC ---
(window as any).renderDashboard = function() {
  const activeStudents = db.students.filter((s:any) => s.status === 'Обучается').length;
  const s1 = document.getElementById('stat-students'); if (s1) s1.textContent = activeStudents;
  
  let allGrades: number[] = [];
  db.students.forEach((s: any) => {
    if (db.subjects[s.group]) {
      db.subjects[s.group].forEach((subj: string) => {
        (db.grades[`${s.id}_${subj}`] || []).forEach((g: any) => { if (typeof g === 'number') allGrades.push(g); });
      });
    }
  });
  const avg = allGrades.length ? (allGrades.reduce((a,b)=>a+b,0)/allGrades.length).toFixed(2) : '0.00';
  const s2 = document.getElementById('stat-avggrade'); if (s2) s2.textContent = avg;

  let totalPossible = 0, totalAtt = 0;
  Object.values(db.attendance).forEach((att: any) => Object.values(att).forEach(v => { totalPossible++; if(v) totalAtt++; }));
  const s3 = document.getElementById('stat-attend'); if (s3) s3.textContent = (totalPossible ? Math.round(totalAtt/totalPossible*100) : 0) + '%';
  const s4 = document.getElementById('stat-debts'); if (s4) s4.textContent = db.payments.filter((p:any)=>p.status==='Просрочено').length;

  (window as any).renderChartGroups();
  (window as any).renderChartGrades();
  
  const eventsHTML = db.events.length ? db.events.map((e:any) => `
    <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-start;">
      <div style="width: 8px; height: 8px; border-radius: 50%; background: ${e.type === 'success' ? 'var(--success)' : (e.type === 'warning' ? 'var(--warning)' : 'var(--accent)')}; margin-top: 6px;"></div>
      <div>
        <div style="font-size: 13px; font-weight: 500; color: var(--text-primary);">${e.text}</div>
        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Сегодня, ${e.time}</div>
      </div>
    </div>
  `).join('') : '<div style="padding:40px; text-align:center; color:#94a3b8;">Лента активности пуста</div>';
  const re = document.getElementById('recentEvents'); if (re) re.innerHTML = eventsHTML;

  const todaySchedHTML = '<div style="padding:40px; text-align:center; color:#94a3b8;">На сегодня занятий больше нет</div>';
  const ts = document.getElementById('todaySchedule'); if (ts) ts.innerHTML = todaySchedHTML;
};

(window as any).renderChartGroups = function() {
  const ctx: any = document.getElementById('chartGroups'); if (!ctx) return;
  if (state.charts.groups) state.charts.groups.destroy();
  state.charts.groups = new (window as any).Chart(ctx, {
    type: 'bar',
    data: { 
      labels: db.groups.map((g:any)=>g.name), 
      datasets: [{ label: 'Ср. балл', data: db.groups.map(()=>3.5 + Math.random()*1), backgroundColor: '#3b82f6', borderRadius: 4 }] 
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 2, max: 5 } } }
  });
};

(window as any).renderChartGrades = function() {
  const ctx: any = document.getElementById('chartGrades'); if (!ctx) return;
  if (state.charts.grades) state.charts.grades.destroy();
  state.charts.grades = new (window as any).Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['5', '4', '3', '2', 'н'],
      datasets: [{ data: [40, 30, 20, 5, 5], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#94a3b8'] }]
    },
    options: { cutout: '70%', plugins: { legend: { position: 'right' } } }
  });
};

(window as any).renderStudents = function() {
  (window as any).populateGroupFilter();
  const body = document.getElementById('studentsBody'); if (!body) return;
  const count = document.getElementById('studentCount'); if (count) count.textContent = db.students.length;
  
  body.innerHTML = db.students.map((s: any) => {
    const statusClass = s.status === 'Обучается' ? 'badge-success' : 'badge-warning';
    return `<tr onclick=" (window as any).openStudentCard(${s.id})">
      <td><div style="font-weight:600">${s.lastname} ${s.firstname}</div><div style="font-size:11px;color:#64748b">${s.email}</div></td>
      <td>${s.group}</td>
      <td>${db.groups.find((g:any)=>g.name===s.group)?.course || 1}</td>
      <td>${s.form}</td>
      <td><span class="badge badge-info">${(3.5 + Math.random()*1.5).toFixed(2)}</span></td>
      <td><span class="badge ${Math.random()>0.8?'badge-danger':'badge-success'}">${Math.random()>0.8?'Есть':'Нет'}</span></td>
      <td><span class="badge ${statusClass}">${s.status}</span></td>
      <td><button class="btn btn-outline" style="padding:4px 8px" onclick="event.stopPropagation(); (window as any).openStudentModal(${s.id})">✎</button></td>
    </tr>`;
  }).join('');
};

(window as any).populateGroupFilter = function() {
    const sel = document.getElementById('groupFilter') as HTMLSelectElement; if (!sel) return;
    if (sel.options.length > 1) return;
    db.groups.forEach((g:any) => {
        const opt = document.createElement('option'); opt.value = g.name; opt.textContent = g.name; sel.appendChild(opt);
    });
};

(window as any).openStudentModal = function(id = null) {
  const modal = document.getElementById('studentModal'); if (!modal) return;
  modal.style.display = 'flex';
  const gs = document.getElementById('s-group') as HTMLSelectElement;
  gs.innerHTML = db.groups.map((g:any)=>`<option value="${g.name}">${g.name}</option>`).join('');
  
  if (id) {
    const s = db.students.find((x:any)=>x.id===id); if (!s) return;
    (document.getElementById('s-lastname') as any).value = s.lastname;
    (document.getElementById('s-firstname') as any).value = s.firstname;
    (document.getElementById('s-patronymic') as any).value = s.patronymic;
    (document.getElementById('s-group') as any).value = s.group;
    (document.getElementById('s-editId') as any).value = id;
  } else {
    ['s-lastname','s-firstname','s-patronymic','s-editId'].forEach(id => (document.getElementById(id) as any).value = '');
  }
};

(window as any).saveStudent = function() {
  const id = (document.getElementById('s-editId') as any).value;
  const data = {
    lastname: (document.getElementById('s-lastname') as any).value,
    firstname: (document.getElementById('s-firstname') as any).value,
    patronymic: (document.getElementById('s-patronymic') as any).value,
    group: (document.getElementById('s-group') as any).value,
    status: 'Обучается', form: 'Очная', email: 'mail@example.com'
  };
  if (id) {
    const idx = db.students.findIndex((s:any)=>s.id==id);
    db.students[idx] = {...db.students[idx], ...data};
  } else {
    db.students.push({id: Date.now(), ...data});
  }
  (window as any).closeModal('studentModal');
  (window as any).renderStudents();
  (window as any).notify('База данных студентов обновлена');
};

(window as any).renderGroups = function() {
  const grid = document.getElementById('groupsGrid'); if(!grid) return;
  grid.innerHTML = db.groups.map((g:any) => `
    <div class="card stat-box" style="cursor:pointer">
      <div style="font-size:12px; color:var(--text-secondary); font-weight:700; margin-bottom:8px">ГРУППА</div>
      <div style="font-size:20px; font-weight:800; color:var(--accent); margin-bottom:4px">${g.name}</div>
      <div style="font-size:13px; color:var(--text-secondary)">${g.spec}</div>
      <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12px; font-weight:600">Курс: ${g.course}</span>
        <button class="btn btn-outline" style="padding:4px 10px; font-size:11px" onclick="(window as any).openGroupModal(${g.id})">⚙</button>
      </div>
    </div>
  `).join('');
};

(window as any).renderAdmissions = function() {
  const h = document.getElementById('admHead'); if (h) h.innerHTML = '<tr><th>Абитуриент</th><th>Специальность</th><th>Балл</th><th>Статус</th></tr>';
  const b = document.getElementById('admBody'); if (!b) return;
  b.innerHTML = db.admissions.map((a:any) => `<tr>
    <td><strong>${a.lastname} ${a.firstname}</strong></td>
    <td>${a.spec}</td>
    <td>${a.score}</td>
    <td><span class="badge ${a.status==='Принято'?'badge-success':'badge-warning'}">${a.status}</span></td>
  </tr>`).join('');
};

(window as any).renderSchedule = function() {
  const container = document.getElementById('scheduleContainer'); if (!container) return;
  const sg = document.getElementById('scheduleGroup') as HTMLSelectElement; 
  if (sg && !sg.options.length) sg.innerHTML = db.groups.map((g:any)=>`<option value="${g.name}">${g.name}</option>`).join('');
  
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const group = sg.value || db.groups[0].name;
  const week = (document.getElementById('scheduleWeek') as any).value || "1";
  const lessons = db.schedule[`${group}_${week}`] || [];

  container.innerHTML = `<div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:16px">
     ${days.map((d, dIdx) => `<div>
        <div style="text-align:center; padding:12px; background:#f1f5f9; border-radius:12px; font-weight:800; font-size:12px; margin-bottom:16px; color:#475569; text-transform:uppercase; letter-spacing:0.05em">${d}</div>
        <div style="display:flex; flex-direction:column; gap:12px">
          ${[0,1,2,3,4,5].map(pIdx => {
             const lesson = lessons[pIdx] ? lessons[pIdx][dIdx] : null;
             return `<div class="card" style="padding:16px; margin:0; border-radius:12px; border: 1px solid ${lesson ? 'var(--accent)' : 'var(--border)'}; background: ${lesson ? '#fff' : '#f8fafc'}; min-height:80px; display:flex; flex-direction:column; justify-content:center">
                <div style="font-size:10px; font-weight:800; color:#94a3b8; margin-bottom:4px">ПАРА ${pIdx + 1}</div>
                ${lesson ? `
                  <div style="font-size:13px; font-weight:700; line-height:1.2; margin-bottom:4px">${lesson.split(' / ')[0]}</div>
                  <div style="font-size:11px; color:#64748b; font-weight:500">${lesson.split(' / ')[1]}</div>
                  <div style="font-size:11px; color:var(--accent); font-weight:700; margin-top:4px">${lesson.split(' / ')[2]}</div>
                ` : '<div style="font-size:11px; color:#cbd5e1; font-style:italic">Окно</div>'}
             </div>`;
          }).join('')}
        </div>
     </div>`).join('')}
  </div>`;
};

(window as any).renderJournal = function() {
  const groupSel = document.getElementById('journalGroup') as HTMLSelectElement;
  const subjSel = document.getElementById('journalSubject') as HTMLSelectElement;
  if (groupSel.options.length === 0) groupSel.innerHTML = db.groups.map((g:any)=>`<option value="${g.name}">${g.name}</option>`).join('');
  
  const group = groupSel.value;
  const subjects = db.subjects[group] || [];
  if (subjSel.innerHTML === '' || !subjects.includes(subjSel.value)) {
    subjSel.innerHTML = subjects.map((s:string)=>`<option value="${s}">${s}</option>`).join('');
  }
  
  const subj = subjSel.value;
  const jt = document.getElementById('journalTitle'); if (jt) jt.textContent = `${group} — ${subj}`;
  const container = document.getElementById('journalContainer'); if (!container) return;

  const dates = db.gradesDates[`${group}_${subj}`] || [];
  const groupStudents = db.students.filter((s:any)=>s.group === group);

  let html = `<table class="journal-table"><thead><tr><th style="text-align:left; width:250px">ФИО Студента</th>`;
  dates.forEach((d:string) => html += `<th style="width:50px">${d.split('-').slice(1).reverse().join('.')}</th>`);
  html += `<th style="width:60px; background:#f1f5f9">Ср.б.</th></tr></thead><tbody>`;

  groupStudents.forEach((s:any) => {
    const grades = db.grades[`${s.id}_${subj}`] || [];
    let sum = 0, count = 0;
    html += `<tr><td style="text-align:left; font-weight:600">${s.lastname} ${s.firstname[0]}.${s.patronymic[0]}.</td>`;
    dates.forEach((_, i) => {
      const g = grades[i];
      if (typeof g === 'number') { sum += g; count++; }
      const gClass = typeof g === 'number' ? `grade-${g}` : (g === 'н' ? 'badge-danger' : '');
      html += `<td class="grade-cell ${gClass}" onclick="(window as any).openGradePicker(event, ${s.id}, ${i}, '${subj}')" style="background:${g==='н'?'#fee2e2':''}">${g || ''}</td>`;
    });
    const avg = count ? (sum / count).toFixed(2) : '-';
    html += `<td style="font-weight:800; background:#f8fafc; color:var(--accent)">${avg}</td></tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
};

(window as any).openGradePicker = function(e: MouseEvent, studentId: number, dateIdx: number, subj: string) {
  const picker = document.getElementById('gradePicker'); if (!picker) return;
  state.currentGradeCell = { studentId, dateIdx, subj };
  picker.style.display = 'flex';
  picker.style.top = `${e.pageY + 10}px`;
  picker.style.left = `${e.pageX - 60}px`;
  
  const closePicker = (ev: any) => {
    if (!picker.contains(ev.target as Node)) {
        picker.style.display = 'none';
        document.removeEventListener('click', closePicker);
    }
  };
  setTimeout(() => document.addEventListener('click', closePicker), 10);
};

(window as any).setGrade = function(val: any) {
  const { studentId, dateIdx, subj } = state.currentGradeCell;
  const key = `${studentId}_${subj}`;
  if (!db.grades[key]) db.grades[key] = [];
  db.grades[key][dateIdx] = val;
  (window as any).renderJournal();
  (window as any).notify(`Оценка выставлена: ${val}`);
};

(window as any).renderAttendance = function() {
  const groupSel = document.getElementById('attendGroup') as HTMLSelectElement;
  if (groupSel.options.length === 0) groupSel.innerHTML = db.groups.map((g:any)=>`<option value="${g.name}">${g.name}</option>`).join('');
  
  const group = groupSel.value;
  const date = (document.getElementById('attendDate') as HTMLInputElement).value || new Date().toISOString().slice(0,10);
  const period = (document.getElementById('attendPeriod') as HTMLSelectElement).value;
  const key = `${group}_${date}_${period}`;
  
  const body = document.getElementById('attendBody'); if (!body) return;
  const groupStudents = db.students.filter((s:any)=>s.group === group);
  const attData = db.attendance[key] || {};

  body.innerHTML = groupStudents.map((s:any) => `<tr>
    <td><div style="font-weight:600">${s.lastname} ${s.firstname}</div></td>
    <td style="text-align:center">
      <div style="display:flex; justify-content:center; gap:8px">
         <button class="btn ${attData[s.id] === true ? 'btn-primary' : 'btn-outline'}" style="padding:4px 12px; font-size:11px" onclick="(window as any).toggleAttend(${s.id}, true, '${key}')">Был</button>
         <button class="btn ${attData[s.id] === false ? 'btn-primary' : 'btn-outline'}" style="padding:4px 12px; font-size:11px; ${attData[s.id] === false ? 'background:var(--danger)' : ''}" onclick="(window as any).toggleAttend(${s.id}, false, '${key}')">Н</button>
      </div>
    </td>
  </tr>`).join('');
  (window as any).renderAttendChart();
};

(window as any).toggleAttend = function(studentId: number, status: boolean, key: string) {
  if (!db.attendance[key]) db.attendance[key] = {};
  db.attendance[key][studentId] = status;
  (window as any).renderAttendance();
};

(window as any).renderAttendChart = function() {
  const ctx: any = document.getElementById('chartAttend'); if (!ctx) return;
  if (state.charts.attend) state.charts.attend.destroy();
  state.charts.attend = new (window as any).Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      datasets: [{ label: 'Явка %', data: [92, 88, 95, 84, 82, 75], borderColor: '#2563eb', tension: 0.4, fill: true, backgroundColor: 'rgba(37, 99, 235, 0.1)' }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { min:60, max:100 } } }
  });
};

(window as any).renderFinance = function() {
  const b = document.getElementById('finBody'); if (!b) return;
  const fCharged = document.getElementById('fin-charged'); 
  const fPaid = document.getElementById('fin-paid');
  const fDebt = document.getElementById('fin-debt');
  
  let totalCharged = 0, totalPaid = 0;
  db.payments.forEach((p:any) => {
     if (p.type.includes('Оплата')) { totalCharged += p.amount; if (p.status === 'Оплачено') totalPaid += p.amount; }
  });

  if (fCharged) fCharged.textContent = totalCharged.toLocaleString() + ' ₽';
  if (fPaid) fPaid.textContent = totalPaid.toLocaleString() + ' ₽';
  if (fDebt) fDebt.textContent = (totalCharged - totalPaid).toLocaleString() + ' ₽';

  b.innerHTML = db.payments.map((p:any) => `<tr>
    <td>${p.date}</td>
    <td><strong>${db.students.find((s:any)=>s.id===p.studentId)?.lastname || 'Admin'}</strong></td>
    <td><span style="font-size:11px; opacity:0.7">${p.type}</span></td>
    <td style="font-family:var(--font-mono); font-weight:700">${p.amount.toLocaleString()} ₽</td>
    <td><span class="badge ${p.status==='Оплачено'?'badge-success':'badge-danger'}">${p.status}</span></td>
    <td><button class="btn btn-outline" style="padding:4px 8px">📄</button></td>
  </tr>`).join('');

  const fs = document.getElementById('fin-student'); if (fs) fs.innerHTML = db.students.map((s:any)=>`<option value="${s.id}">${s.lastname} ${s.firstname}</option>`).join('');
};

(window as any).renderScholarship = function() {
  const sel = document.getElementById('scholGroup') as HTMLSelectElement;
  if (sel.options.length === 0) sel.innerHTML = `<option value="">Все группы</option>` + db.groups.map((g:any)=>`<option value="${g.name}">${g.name}</option>`).join('');
  
  const b = document.getElementById('scholBody'); if (!b) return;
  const filtered = sel.value ? db.students.filter((s:any)=>s.group === sel.value) : db.students;

  b.innerHTML = filtered.map((s:any) => {
     const isContract = s.finance === 'Контракт';
     const avg = 3.5 + Math.random()*1.5;
     const type = isContract ? '-' : (avg > 4.7 ? 'Повышенная' : (avg > 4.0 ? 'Академическая' : '-'));
     const amount = type === 'Повышенная' ? 5441 : (type === 'Академическая' ? 2417 : 0);
     return `<tr>
       <td><strong>${s.lastname} ${s.firstname}</strong></td>
       <td>${s.group}</td>
       <td><span class="badge badge-info">${avg.toFixed(2)}</span></td>
       <td>${type}</td>
       <td style="font-weight:700">${amount ? amount.toLocaleString() + ' ₽' : '-'}</td>
     </tr>`;
  }).join('');
};

(window as any).renderStaff = function() {
  const b = document.getElementById('staffBody'); if (!b) return;
  b.innerHTML = db.staff.map((s:any) => `<tr>
    <td><div style="font-weight:700">${s.lastname} ${s.firstname} ${s.patronymic}</div><div style="font-size:11px; color:#64748b">${s.dept}</div></td>
    <td>${s.position}</td>
    <td style="font-family:var(--font-mono); font-weight:700">${s.salary.toLocaleString()} ₽</td>
    <td><button class="btn btn-outline" style="padding:4px 8px">Изменить</button></td>
  </tr>`).join('');
};

(window as any).renderAnalytics = function() {
  const ctxP: any = document.getElementById('chartAnPerf'); if (ctxP) {
    if (state.charts.anPerf) state.charts.anPerf.destroy();
    state.charts.anPerf = new (window as any).Chart(ctxP, {
      type: 'bar',
      data: { labels: db.groups.map((g:any)=>g.name), datasets: [{ label:'Ср. бал', data: db.groups.map(()=>3.8+Math.random()*0.8), backgroundColor:'#3b82f6' }] }
    });
  }
  const ctxD: any = document.getElementById('chartAnDyn'); if (ctxD) {
    if (state.charts.anDyn) state.charts.anDyn.destroy();
    state.charts.anDyn = new (window as any).Chart(ctxD, {
      type: 'line',
      data: { labels: ['Сент', 'Окт', 'Ноя', 'Дек'], datasets: [{ label:'Успеваемость', data: [3.9, 4.1, 4.0, 4.3], borderColor:'#10b981', fill:true, backgroundColor:'rgba(16, 185, 129,0.1)' }] }
    });
  }
};

(window as any).renderGraduation = function() {
  const b = document.getElementById('gradBody'); if (!b) return;
  const graduating = db.students.filter((s:any) => db.groups.find((g:any)=>g.name===s.group)?.course === 3);
  b.innerHTML = graduating.map((s:any) => `<tr>
    <td><strong>${s.lastname} ${s.firstname}</strong></td>
    <td><span class="badge badge-success">Допущен</span></td>
    <td><button class="btn btn-primary" style="padding:4px 12px; font-size:11px">Сформировать</button></td>
  </tr>`).join('');
};

(window as any).renderAdmChart = function() {
  const ctx: any = document.getElementById('chartAdmissions'); if (!ctx) return;
  if (state.charts.adm) state.charts.adm.destroy();
  state.charts.adm = new (window as any).Chart(ctx, {
    type: 'pie',
    data: { labels: ['ИТ', 'Экономика', 'Дизайн'], datasets: [{ data: [120, 80, 45], backgroundColor:['#3b82f6', '#10b981', '#f59e0b'] }] }
  });
  document.getElementById('adm-total')!.textContent = '245';
  document.getElementById('adm-accepted')!.textContent = '112';
  document.getElementById('adm-pending')!.textContent = '133';
};

(window as any).renderFinChart = function() {
  const ctx: any = document.getElementById('chartFinance'); if (!ctx) return;
  if (state.charts.fin) state.charts.fin.destroy();
  state.charts.fin = new (window as any).Chart(ctx, {
    type: 'line',
    data: { labels: ['Окт', 'Ноя', 'Дек', 'Янв'], datasets: [{ label:'Поступления', data: [450, 520, 480, 610], borderColor:'#3b82f6' }] }
  });
};

(window as any).refreshAdmissions = function() {
  (window as any).renderAdmissions();
  (window as any).notify('Список заявлений обновлён');
};

(window as any).addAdmission = function() {
  const ln = (document.getElementById('adm-lastname') as any).value;
  const fn = (document.getElementById('adm-firstname') as any).value;
  if (!ln || !fn) return (window as any).notify('Заполните ФИО');
  
  db.admissions.unshift({
    id: Date.now(),
    lastname: ln,
    firstname: fn,
    patronymic: (document.getElementById('adm-patronymic') as any).value,
    spec: 'Прикладная информатика',
    score: (document.getElementById('adm-score') as any).value || 0,
    status: 'На рассмотрении',
    date: new Date().toISOString().slice(0,10)
  });
  
  (window as any).renderAdmissions();
  (window as any).notify('Заявление успешно зарегистрировано');
  ['adm-lastname','adm-firstname','adm-patronymic','adm-score'].forEach(id => (document.getElementById(id) as any).value = '');
};

(window as any).exportStudents = function() {
  (window as any).notify('Экспорт базы данных запущен (JSON)');
  console.log('Exporting Students:', db.students);
};

(window as any).addJournalDate = function() {
   (window as any).notify('Функционал добавления дат в разработке');
};

(window as any).saveGroup = function() {
   const name = (document.getElementById('g-name') as any).value;
   if (!name) return;
   db.groups.push({ id: Date.now(), name, spec: 'Новое направление', course: 1, curator: 'Не назначен', year: 2024 });
   (window as any).renderGroups();
   (window as any).closeModal('groupModal');
   (window as any).notify(`Группа ${name} создана`);
};

(window as any).addPayment = function() {
    const studentId = (document.getElementById('fin-student') as any).value;
    const amount = (document.getElementById('fin-amount') as any).value;
    if (!amount) return;
    db.payments.unshift({
        id: Date.now(),
        date: new Date().toISOString().slice(0,10),
        studentId: parseInt(studentId),
        type: 'Оплата за обучение',
        amount: parseInt(amount),
        status: 'Оплачено',
        note: 'Ручной ввод'
    });
    (window as any).renderFinance();
    (window as any).notify('Финансовая операция зарегистрирована');
};

(window as any).openGroupModal = function(id = null) {
  const m = document.getElementById('groupModal'); if (!m) return;
  m.style.display = 'flex';
};

(window as any).filterStudents = function() {
   (window as any).renderStudents();
};

(window as any).openStudentCard = function(id: number) {
   (window as any).notify(`Открытие личного дела студента ID: ${id}`);
};

(window as any).closeModal = function(id: string) {
  const m = document.getElementById(id); if (m) m.style.display = 'none';
};

(window as any).notify = function(msg: string) {
  const el = document.createElement('div');
  el.style.position = 'fixed'; el.style.bottom = '24px'; el.style.right = '24px';
  el.style.background = '#0f172a'; el.style.color = '#fff'; el.style.padding = '12px 24px';
  el.style.borderRadius = '12px'; el.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
  el.style.zIndex = '9999'; el.style.fontSize = '13px'; el.style.fontWeight = '700';
  el.style.border = '1px solid #334155';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transform = 'translateY(100px)'; el.style.opacity = '0'; el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 3000);
  }, 3000);
};

(window as any).updateClock = function() {
  const el = document.getElementById('currentDateTime');
  if (el) el.textContent = new Date().toLocaleString('ru-RU');
};

// --- INITIALIZATION ---
db.events = [
  {text: 'Успешный вход в систему', time: '08:00', type: 'success'},
  {text: 'Сформирован отчёт по успеваемости за Октябрь', time: '09:12', type: 'info'},
  {text: 'Зарегистрировано новое заявление (Куликов Р.С.)', time: '10:45', type: 'warning'},
  {text: 'Обновлено расписание для группы ПИ-21-1', time: '11:20', type: 'info'},
];

try {
  initGrades();
  initSchedule();
  initAttendance();
  setInterval((window as any).updateClock, 1000);
  (window as any).updateClock();
  
  // Only render if we're technically logged in or just to prepare UI
  (window as any).renderDashboard();
  (window as any).notify('Система КИС Колледж готова к работе');
} catch (e) {
  console.error('App init error:', e);
}
