b64 = open("avatar_b64.txt").read().strip()
img = "data:image/jpeg;base64," + b64

html = r'''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Мирзоев Шохрух Анварович — Резюме</title>
<style>
  :root{
    --ink:#161616;
    --soft:#565e68;
    --faint:#9aa1ab;
    --line:#ececef;
    --accent:#2f6df6;
    --chip:#f4f5f7;
    --bg:#ffffff;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{
    font-family:-apple-system,"Segoe UI",Inter,Roboto,"Helvetica Neue",Arial,sans-serif;
    color:var(--ink);
    background:#eef0f3;
    line-height:1.55;
    font-size:13.5px;
    letter-spacing:.1px;
  }
  .page{
    max-width:840px;
    margin:28px auto;
    background:var(--bg);
    padding:52px 56px 40px;
  }

  /* ---------- Header ---------- */
  header{
    display:flex;
    align-items:center;
    gap:30px;
    padding-bottom:26px;
    border-bottom:1px solid var(--line);
  }
  .avatar{
    width:108px;height:108px;flex:0 0 108px;
    border-radius:50%;
    object-fit:cover;
    filter:grayscale(100%) contrast(1.04);
  }
  .head-text{flex:1;min-width:0}
  h1{
    font-size:31px;
    font-weight:600;
    letter-spacing:-.5px;
    line-height:1.1;
  }
  .role{
    margin-top:6px;
    font-size:14px;
    color:var(--soft);
    font-weight:500;
    letter-spacing:.3px;
  }
  .role b{color:var(--accent);font-weight:600}
  .contacts{
    margin-top:14px;
    display:flex;
    flex-wrap:wrap;
    gap:7px 18px;
    font-size:12px;
    color:var(--soft);
  }
  .contacts a{color:var(--soft);text-decoration:none}
  .contacts a:hover{color:var(--accent)}
  .contacts span{display:inline-flex;align-items:center;gap:6px}
  .contacts svg{width:13px;height:13px;fill:var(--faint);flex:0 0 13px}

  /* ---------- Layout ---------- */
  .body{display:grid;grid-template-columns:1fr 244px;gap:38px;margin-top:30px}
  .side{display:flex;flex-direction:column;gap:26px}

  section{margin-bottom:26px}
  .main section:last-child,.side section:last-child{margin-bottom:0}
  .label{
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:2.2px;
    color:var(--faint);
    font-weight:600;
    margin-bottom:14px;
  }

  .lead{color:var(--soft);font-size:13.5px;line-height:1.7}

  /* items */
  .item{margin-bottom:18px}
  .item:last-child{margin-bottom:0}
  .item .top{display:flex;justify-content:space-between;align-items:baseline;gap:14px}
  .item .title{font-weight:600;font-size:14px;letter-spacing:.1px}
  .item .when{font-size:11.5px;color:var(--faint);white-space:nowrap;font-weight:500}
  .item .sub{color:var(--accent);font-size:12.5px;font-weight:500;margin-top:1px}
  .item p{color:var(--soft);font-size:12.8px;margin-top:5px}
  .item ul{margin:6px 0 0;padding:0;list-style:none}
  .item ul li{color:var(--soft);font-size:12.8px;padding-left:14px;position:relative;margin-bottom:3px}
  .item ul li::before{content:"–";position:absolute;left:0;color:var(--faint)}
  .item .links{margin-top:7px;display:flex;flex-wrap:wrap;gap:5px 16px}
  .item .links a{color:var(--faint);font-size:11.5px;text-decoration:none;border-bottom:1px solid var(--line)}
  .item .links a:hover{color:var(--accent)}

  /* sidebar chips */
  .chips{display:flex;flex-wrap:wrap;gap:6px}
  .chip{
    background:var(--chip);
    color:#3a4049;
    border-radius:7px;
    padding:4px 10px;
    font-size:11.5px;
    font-weight:500;
    white-space:nowrap;
  }
  .chip.key{background:var(--ink);color:#fff}
  .side .lead{font-size:12.3px;line-height:1.6;margin-bottom:10px}
  .rows{display:flex;flex-direction:column;gap:9px}
  .row{font-size:12.5px}
  .row .k{color:var(--ink);font-weight:600}
  .row .v{color:var(--faint);display:block;font-size:11.5px}
  .mini{list-style:none;display:flex;flex-direction:column;gap:7px}
  .mini li{color:var(--soft);font-size:12.3px;padding-left:13px;position:relative}
  .mini li::before{content:"";position:absolute;left:0;top:7px;width:4px;height:4px;border-radius:50%;background:var(--accent)}

  footer{margin-top:34px;padding-top:16px;border-top:1px solid var(--line);text-align:center;font-size:10px;color:var(--faint);letter-spacing:.5px}

  @media print{
    body{background:#fff}
    .page{margin:0;max-width:100%;padding:0}
    @page{margin:14mm}
  }
  @media(max-width:720px){
    .page{padding:32px 22px}
    header{flex-direction:column;text-align:center;gap:16px}
    .contacts{justify-content:center}
    .body{grid-template-columns:1fr;gap:26px}
  }
</style>
</head>
<body>
<div class="page">

  <header>
    <img class="avatar" src="__IMG__" alt="фото">
    <div class="head-text">
      <h1>Мирзоев Шохрух Анварович</h1>
      <div class="role">Junior Software Engineer · <b>Backend Developer (AI)</b></div>
      <div class="contacts">
        <span><svg viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>Санкт-Петербург</span>
        <span><svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z"/></svg>+7 (981) 710-24-06</span>
        <span><svg viewBox="0 0 24 24"><path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm9 7L4 6.8V18h16V6.8L12 12z"/></svg><a href="mailto:frankengnom@gmail.com">frankengnom@gmail.com</a></span>
        <span><svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM12 6.5c-1.8 0-2.9 1.1-2.9 2.6 0 1.3.9 2.2 2.4 2.2.3 0 .5 0 .6-.1 0 .1-.1.3-.1.4 0 .6.3 1 1 1.3l1.7.7c.6.2 1 .5 1 1 0 .6-.5 1-1.5 1-.9 0-1.8-.4-2.4-1l-.7.9c.7.7 1.9 1.2 3.1 1.2 1.8 0 3-1 3-2.4 0-1.1-.7-1.7-1.9-2.2l-1.4-.6c-.5-.2-.7-.4-.7-.7 0-.3.3-.6.8-.6.6 0 1.2.3 1.6.8l.7-.8c-.5-.6-1.3-1-2.2-1.1.2-.3.3-.6.3-1 0-1.1-.9-2-2-2z"/></svg><a href="https://t.me/smworklair">@smworklair</a></span>
        <span><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z"/></svg><a href="https://github.com/smworklair">github.com/smworklair</a></span>
        <span><svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.4 6.7L12 17.5 6 20.3l1.4-6.7L2.3 9l6.8-.7L12 2z"/></svg><a href="https://sm-wresume.vercel.app/">Портфолио</a></span>
      </div>
    </div>
  </header>

  <div class="body">
    <div class="main">
      <section>
        <div class="label">О себе</div>
        <p class="lead">Начинающий разработчик с фокусом на backend-разработке, корпоративных информационных системах (KIS/ERP), архитектуре ПО и интеграции искусственного интеллекта. Более 7 лет самостоятельно изучаю программирование и современные технологии, предпочитая практический опыт через собственные проекты. Сейчас основной фокус — система BetaKIS на Go и применение современных AI-технологий.</p>
      </section>

      <section>
        <div class="label">Опыт</div>
        <div class="item">
          <div class="top"><span class="title">Freelance Developer</span><span class="when">ООО «Рост»</span></div>
          <div class="sub">Веб-разработка</div>
          <ul>
            <li>Корпоративный сайт строительной компании: HTML, CSS, JavaScript;</li>
            <li>Адаптивная вёрстка и публикация проекта.</li>
          </ul>
          <div class="links"><a href="https://rost-2.vercel.app/">rost-2.vercel.app</a></div>
        </div>
        <div class="item">
          <div class="top"><span class="title">Преподаватель программирования</span><span class="when">для школьников</span></div>
          <ul>
            <li>Проведение занятий и объяснение основ программирования;</li>
            <li>Индивидуальная помощь ученикам.</li>
          </ul>
        </div>
      </section>

      <section>
        <div class="label">Проекты</div>
        <div class="item">
          <div class="top"><span class="title">BetaKIS — главный проект</span><span class="when">Go · REST API</span></div>
          <div class="sub">Корпоративная информационная система для образования</div>
          <ul>
            <li>За два месяца — масштабный интерактивный прототип;</li>
            <li>Авторизация, роли пользователей, корпоративные модули;</li>
            <li>Backend на Go (в активной разработке), подготовка REST API;</li>
            <li>Запланирована интеграция AI.</li>
          </ul>
          <div class="links"><a href="https://beta-one-black.vercel.app/">demo</a><a href="https://github.com/smworklair/betakis">github</a></div>
        </div>
        <div class="item">
          <div class="top"><span class="title">AI Assistant</span><span class="when">2023 · OpenAI API</span></div>
          <p>Экспериментальный AI-бот на OpenAI API, созданный, когда массовая интеграция LLM только набирала популярность.</p>
        </div>
        <div class="item">
          <div class="top"><span class="title">Dogi</span><span class="when">C#</span></div>
          <p>Приложение на C# с использованием внешнего API для поиска изображений пород собак.</p>
          <div class="links"><a href="https://github.com/smworklair/dogi">github</a></div>
        </div>
      </section>

      <section>
        <div class="label">Образование</div>
        <div class="item">
          <div class="top"><span class="title">СПбГУПТД — ИИТА</span><span class="when">2026 — н.в.</span></div>
          <div class="sub">Прикладная информатика в экономике</div>
          <p>Институт информационных технологий и автоматизации.</p>
        </div>
        <div class="item">
          <div class="top"><span class="title">Алгоритмы и структуры данных</span><span class="when">доп. курс</span></div>
          <p>Дополнительное образование со 2 курса.</p>
        </div>
      </section>
    </div>

    <aside class="side">
      <section>
        <div class="label">Языки прогр.</div>
        <div class="chips">
          <span class="chip key">Python</span><span class="chip key">Go</span>
          <span class="chip">C#</span><span class="chip">SQL</span><span class="chip">Java</span>
          <span class="chip">JavaScript</span><span class="chip">PHP</span><span class="chip">HTML</span><span class="chip">CSS</span>
        </div>
      </section>
      <section>
        <div class="label">Backend</div>
        <ul class="mini">
          <li>REST API · HTTP · JSON</li>
          <li>Проектирование БД</li>
          <li>Архитектура приложений</li>
          <li>Интеграция LLM</li>
        </ul>
      </section>
      <section>
        <div class="label">Инструменты</div>
        <div class="chips">
          <span class="chip">MySQL</span><span class="chip">Git</span><span class="chip">Docker</span>
          <span class="chip">Linux</span><span class="chip">Bash</span><span class="chip">Postman</span><span class="chip">JetBrains</span>
        </div>
      </section>
      <section>
        <div class="label">AI / LLM</div>
        <p class="lead">Применяю AI в разработке, исследовании и интеграции в проекты.</p>
        <div class="chips">
          <span class="chip">OpenAI</span><span class="chip">Claude</span><span class="chip">Gemini</span>
          <span class="chip">DeepSeek</span><span class="chip">Qwen</span><span class="chip">Grok</span>
          <span class="chip">Mistral</span><span class="chip">Ollama</span><span class="chip">LM Studio</span>
        </div>
      </section>
      <section>
        <div class="label">Языки</div>
        <div class="rows">
          <div class="row"><span class="k">Русский</span><span class="v">свободно</span></div>
          <div class="row"><span class="k">Английский</span><span class="v">тех. документация, B1</span></div>
        </div>
      </section>
      <section>
        <div class="label">Кратко</div>
        <ul class="mini">
          <li>7+ лет в программировании</li>
          <li>Самостоятельное обучение</li>
          <li>Готов к удалёнке и переезду</li>
        </ul>
      </section>
    </aside>
  </div>

  <footer>МИРЗОЕВ ШОХРУХ · РЕЗЮМЕ · 2026</footer>
</div>
</body>
</html>'''

html = html.replace("__IMG__", img)
open("resume.html","w").write(html)
print("written, size", len(html))
