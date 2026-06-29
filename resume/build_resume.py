import base64
img = "data:image/jpeg;base64," + base64.b64encode(open("avatar.jpg","rb").read()).decode()

html = r'''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Мирзоев Шохрух Анварович — Резюме</title>
<style>
  :root{
    --ink:#0e0e10;
    --soft:#393f48;
    --faint:#717883;
    --line:#e7e7ea;
    --accent:#2f6df6;
    --chip:#f4f5f7;
    /* brand colors */
    --tg:#229ED9;
    --gh:#1f2328;
    --mail:#EA4335;
    --folio:#7c3aed;
    --geo:#e0533d;
    --phone:#1a9e54;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{
    font-family:-apple-system,"Segoe UI",Inter,Roboto,"Helvetica Neue",Arial,sans-serif;
    color:var(--ink);background:#eef0f3;line-height:1.55;font-size:13.5px;letter-spacing:.1px;
  }
  .page{max-width:840px;margin:28px auto;background:#fff;padding:0 0 40px;overflow:hidden;border-radius:2px}
  .topbar{height:6px;background:linear-gradient(90deg,var(--tg),var(--accent),var(--folio))}
  .pad{padding:42px 56px 0}

  /* ---------- Header ---------- */
  header{display:flex;align-items:center;gap:30px;padding-bottom:24px;border-bottom:1px solid var(--line)}
  .avatar{width:112px;height:112px;flex:0 0 112px;border-radius:50%;object-fit:cover;
    box-shadow:0 0 0 4px #fff,0 0 0 5px var(--line)}
  .head-text{flex:1;min-width:0}
  h1{font-size:31px;font-weight:600;letter-spacing:-.5px;line-height:1.1}
  .role{margin-top:6px;font-size:14px;color:var(--soft);font-weight:500;letter-spacing:.3px}
  .role b{color:var(--accent);font-weight:600}

  /* contact chips (brand colored) */
  .contacts{margin-top:15px;display:flex;flex-wrap:wrap;gap:8px}
  .c{display:inline-flex;align-items:center;gap:7px;padding:5px 11px 5px 9px;border-radius:9px;
    font-size:12px;font-weight:500;text-decoration:none;line-height:1;
    background:var(--bg);color:var(--cl);border:1px solid var(--bd)}
  .c svg{width:14px;height:14px;fill:var(--cl);flex:0 0 14px}
  .c:hover{filter:brightness(.96)}
  .c-tg{--cl:var(--tg);--bg:#e9f6fc;--bd:#cfeaf7}
  .c-gh{--cl:var(--gh);--bg:#f1f1f2;--bd:#e2e3e5}
  .c-mail{--cl:var(--mail);--bg:#fdeceb;--bd:#f8d3d0}
  .c-folio{--cl:var(--folio);--bg:#f2ecfd;--bd:#e2d4fb}
  .c-geo{--cl:var(--geo);--bg:#fcecea;--bd:#f6d6d0}
  .c-phone{--cl:var(--phone);--bg:#e9f8f0;--bd:#cdedda}

  /* ---------- Layout ---------- */
  .body{display:grid;grid-template-columns:1fr 244px;gap:38px;margin-top:28px}
  .side{display:flex;flex-direction:column;gap:24px}
  section{margin-bottom:24px}
  .main section:last-child,.side section:last-child{margin-bottom:0}
  .label{font-size:10.5px;text-transform:uppercase;letter-spacing:2.2px;color:var(--faint);font-weight:600;margin-bottom:13px;display:flex;align-items:center;gap:9px}
  .label::after{content:"";flex:1;height:1px;background:var(--line)}
  .lead{color:var(--soft);font-size:13.3px;line-height:1.7}

  .item{margin-bottom:17px}
  .item:last-child{margin-bottom:0}
  .item .top{display:flex;justify-content:space-between;align-items:baseline;gap:14px}
  .item .title{font-weight:600;font-size:14px}
  .item .when{font-size:11.5px;color:var(--faint);white-space:nowrap;font-weight:500}
  .item .sub{color:var(--accent);font-size:12.5px;font-weight:500;margin-top:1px}
  .item p{color:var(--soft);font-size:12.7px;margin-top:5px}
  .item ul{margin:6px 0 0;padding:0;list-style:none}
  .item ul li{color:var(--soft);font-size:12.7px;padding-left:14px;position:relative;margin-bottom:3px}
  .item ul li::before{content:"–";position:absolute;left:0;color:var(--faint)}
  .item .links{margin-top:8px;display:flex;flex-wrap:wrap;gap:7px}
  .lk{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;text-decoration:none;
    padding:3px 9px;border-radius:7px;background:var(--bg);color:var(--cl);border:1px solid var(--bd)}
  .lk svg{width:12px;height:12px;fill:var(--cl)}
  .lk-gh{--cl:var(--gh);--bg:#f1f1f2;--bd:#e2e3e5}
  .lk-web{--cl:var(--accent);--bg:#eaf1fe;--bd:#d2e2fd}

  /* sidebar */
  .chips{display:flex;flex-wrap:wrap;gap:6px}
  .chip{background:var(--chip);color:#3a4049;border-radius:7px;padding:4px 10px;font-size:11.5px;font-weight:500;white-space:nowrap}
  .chip.key{background:var(--ink);color:#fff}
  .side .lead{font-size:12.2px;line-height:1.6;margin-bottom:9px}
  .rows{display:flex;flex-direction:column;gap:9px}
  .row .k{color:var(--ink);font-weight:600;font-size:12.5px}
  .row .v{color:var(--faint);display:block;font-size:11.5px}
  .mini{list-style:none;display:flex;flex-direction:column;gap:7px}
  .mini li{color:var(--soft);font-size:12.2px;padding-left:13px;position:relative}
  .mini li::before{content:"";position:absolute;left:0;top:7px;width:4px;height:4px;border-radius:50%;background:var(--accent)}

  footer{margin:30px 56px 0;padding-top:15px;border-top:1px solid var(--line);text-align:center;font-size:10px;color:var(--faint);letter-spacing:.5px}

  .item,.label,.row{break-inside:avoid}
  @media print{
    body{background:#fff}
    .page{margin:0;max-width:100%;border-radius:0}
    .pad{padding:30px 40px 0}
    footer{margin:26px 40px 0}
    @page{margin:11mm}
    .proj{break-before:page}
    .proj .label{margin-top:0}
  }
  @media(max-width:720px){
    .pad{padding:30px 22px 0}
    header{flex-direction:column;text-align:center;gap:16px}
    .contacts{justify-content:center}
    .body{grid-template-columns:1fr;gap:24px}
  }
</style>
</head>
<body>
<div class="page">
  <div class="topbar"></div>
  <div class="pad">

  <header>
    <img class="avatar" src="__IMG__" alt="фото">
    <div class="head-text">
      <h1>Мирзоев Шохрух Анварович</h1>
      <div class="role">Junior Software Engineer · <b>Backend Developer (AI)</b></div>
      <div class="contacts">
        <span class="c c-geo"><svg viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>Санкт-Петербург</span>
        <a class="c c-phone" href="tel:+79817102406"><svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z"/></svg>+7 (981) 710-24-06</a>
        <a class="c c-mail" href="mailto:frankengnom@gmail.com"><svg viewBox="0 0 24 24"><path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm9 7L4 6.8V18h16V6.8L12 12z"/></svg>frankengnom@gmail.com</a>
        <a class="c c-mail" href="mailto:smworklair@gmail.com"><svg viewBox="0 0 24 24"><path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm9 7L4 6.8V18h16V6.8L12 12z"/></svg>smworklair@gmail.com</a>
        <a class="c c-tg" href="https://t.me/smworklair"><svg viewBox="0 0 24 24"><path d="M23.1 3.8l-3.5 16.4c-.3 1.2-1 1.5-2 .9l-5.5-4-2.6 2.6c-.3.3-.6.5-1.1.5l.4-5.5L18.6 6c.4-.4-.1-.6-.7-.2L7.5 12.6 2.1 11c-1.2-.4-1.2-1.2.3-1.8L21.6 2.3c1-.4 1.8.2 1.5 1.5z"/></svg>@smworklair</a>
        <a class="c c-gh" href="https://github.com/smworklair"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z"/></svg>github.com/smworklair</a>
        <a class="c c-folio" href="https://sm-wresume.vercel.app/"><svg viewBox="0 0 24 24"><path d="M12 3l10 17H2L12 3z"/></svg>Портфолио</a>
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
          <div class="links"><a class="lk lk-web" href="https://rost-2.vercel.app/"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.5a15 15 0 0 0-1.3-3.3A8 8 0 0 1 18.9 8zM12 4c.8 1 1.4 2.4 1.8 4h-3.6C10.6 6.4 11.2 5 12 4zM4.3 14a8 8 0 0 1 0-4h2.8a17 17 0 0 0 0 4H4.3zm.8 2h2.5c.3 1.2.8 2.3 1.3 3.3A8 8 0 0 1 5.1 16zm2.5-8H5.1a8 8 0 0 1 3.8-3.3C8.4 5.7 7.9 6.8 7.6 8zM12 20c-.8-1-1.4-2.4-1.8-4h3.6c-.4 1.6-1 3-1.8 4zm2.2-6H9.8a15 15 0 0 1 0-4h4.4a15 15 0 0 1 0 4zm.6 5.3c.5-1 1-2.1 1.3-3.3h2.5a8 8 0 0 1-3.8 3.3zM16.9 14a17 17 0 0 0 0-4h2.8a8 8 0 0 1 0 4h-2.8z"/></svg>rost-2.vercel.app</a></div>
        </div>
        <div class="item">
          <div class="top"><span class="title">Преподаватель программирования</span><span class="when">для школьников</span></div>
          <ul>
            <li>Проведение занятий и объяснение основ программирования;</li>
            <li>Индивидуальная помощь ученикам.</li>
          </ul>
        </div>
      </section>

      <section class="proj">
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
          <div class="links">
            <a class="lk lk-web" href="https://beta-one-black.vercel.app/"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.5a15 15 0 0 0-1.3-3.3A8 8 0 0 1 18.9 8zM12 4c.8 1 1.4 2.4 1.8 4h-3.6C10.6 6.4 11.2 5 12 4zM4.3 14a8 8 0 0 1 0-4h2.8a17 17 0 0 0 0 4H4.3zm.8 2h2.5c.3 1.2.8 2.3 1.3 3.3A8 8 0 0 1 5.1 16zm2.5-8H5.1a8 8 0 0 1 3.8-3.3C8.4 5.7 7.9 6.8 7.6 8zM12 20c-.8-1-1.4-2.4-1.8-4h3.6c-.4 1.6-1 3-1.8 4zm2.2-6H9.8a15 15 0 0 1 0-4h4.4a15 15 0 0 1 0 4zm.6 5.3c.5-1 1-2.1 1.3-3.3h2.5a8 8 0 0 1-3.8 3.3zM16.9 14a17 17 0 0 0 0-4h2.8a8 8 0 0 1 0 4h-2.8z"/></svg>demo</a>
            <a class="lk lk-gh" href="https://github.com/smworklair/betakis"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z"/></svg>github</a>
          </div>
        </div>
        <div class="item">
          <div class="top"><span class="title">AI Assistant</span><span class="when">2023 · OpenAI API</span></div>
          <p>Экспериментальный AI-бот на OpenAI API, созданный, когда массовая интеграция LLM только набирала популярность.</p>
        </div>
        <div class="item">
          <div class="top"><span class="title">Dogi</span><span class="when">C#</span></div>
          <p>Приложение на C# с использованием внешнего API для поиска изображений пород собак.</p>
          <div class="links"><a class="lk lk-gh" href="https://github.com/smworklair/dogi"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z"/></svg>github</a></div>
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
  </div>
  <footer>МИРЗОЕВ ШОХРУХ · РЕЗЮМЕ · 2026</footer>
</div>
</body>
</html>'''

open("resume.html","w").write(html.replace("__IMG__", img))
print("written")
