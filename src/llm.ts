/* ============================================================
   LLM-слой NEX — прямое подключение Gemini (прототип).

   Ключ вводится в Настройках и хранится ТОЛЬКО в localStorage
   браузера — в репозиторий и на сервер не попадает.
   BACKEND: в проде этот файл заменяется на вызов /api/nex,
   где ключ лежит в переменной окружения, а не у клиента.
   ============================================================ */

const MODEL = 'gemini-2.5-flash';
const KEY_STORAGE = 'nex-gemini-key';

export const getGeminiKey = () => localStorage.getItem(KEY_STORAGE) || '';
export const setGeminiKey = (k: string) => {
  if (k.trim()) localStorage.setItem(KEY_STORAGE, k.trim());
  else localStorage.removeItem(KEY_STORAGE);
};
export const llmReady = () => getGeminiKey().length > 10;

/** Сводка данных организации — контекст для модели.
    BACKEND: заменяется на RAG по реальной БД. */
export const ORG_CONTEXT = `
Ты — NEX, встроенный ИИ корпоративной информационной системы колледжа. Отвечай по-русски, кратко и по делу (2-5 предложений), без markdown-заголовков.
Данные организации (демо):
- Студентов: 100, средний балл 4.2, посещаемость 91% (−2% за неделю, основной вклад — группа ПИ-21-1).
- В зоне риска 4 студента (посещаемость < 75%): Волкова О. (66%), Новиков, Петрова, Зайцева.
- Финансы: поступления в норме, задолженность ₽248K (−12% за неделю), 8 должников со сроком оплаты до 30.06, 3 аномальных платежа от одного контрагента.
- Безопасность: 12 неудачных входов с IP 45.9.148.3 за ночь (вероятный перебор), ядро и аудит целостны.
- Расписание: конфликтов нет, свободное окно Пн 12:00 ауд. 305.
- Приём: 3 заявления, найден возможный дубликат. Выпуск-2024: не готовы 5 студентов.
- Кампус: дедлайн стажировки VK через 2 дня, грант ₽500K через 5 дней, хакатон по ИИ через 7.
Разделы системы: Командный центр, Студенты, Группы, Приём, Расписание, Журнал, Посещаемость, Финансы, Стипендии, Сотрудники, Аналитика, Выпуск, Безопасность, Кампус, Агенты.`;

export interface LlmTurn { role: 'user' | 'model'; text: string; }

/** Один вызов Gemini generateContent. Бросает исключение при ошибке —
    вызывающий код обязан откатиться на локальный мок (nexbrain). */
export async function geminiAsk(user: string, opts: { system?: string; history?: LlmTurn[] } = {}): Promise<string> {
  const key = getGeminiKey();
  if (!key) throw new Error('no-key');
  const contents = [
    ...(opts.history || []).map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    { role: 'user', parts: [{ text: user }] },
  ];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system || ORG_CONTEXT }] },
        contents,
        /* thinkingBudget: 0 — быстрые ответы без «размышлений» */
        generationConfig: { temperature: 0.4, maxOutputTokens: 2000, thinkingConfig: { thinkingBudget: 0 } },
      }),
    });
    if (!res.ok) throw new Error(`gemini-${res.status}`);
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || '';
    if (!text.trim()) throw new Error('gemini-empty');
    return text.trim();
  } finally {
    clearTimeout(timer);
  }
}

/** Проверка ключа из Настроек: короткий дешёвый запрос. */
export async function testGeminiKey(key: string): Promise<boolean> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key.trim() },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'ok' }] }], generationConfig: { maxOutputTokens: 5 } }),
    });
    return res.ok;
  } catch { return false; }
}

/** План задачи (для «Поручить NEX»): просим модель список шагов. */
export async function geminiPlan(task: string): Promise<string[]> {
  const text = await geminiAsk(
    `Составь план выполнения задачи в системе колледжа: «${task}». Ответь ТОЛЬКО списком из 3-5 коротких шагов, каждый с новой строки, без нумерации и пояснений.`,
  );
  const steps = text.split('\n').map((s) => s.replace(/^[-•*\d.)\s]+/, '').trim()).filter((s) => s.length > 3).slice(0, 5);
  if (steps.length < 2) throw new Error('bad-plan');
  return steps;
}
