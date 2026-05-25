const STORAGE_KEY = "beg-k-mechte-runs";

const seedRuns = [
  {
    id: 1,
    type: "Темповая",
    date: "2026-05-20",
    startTime: "07:12",
    distance: 10.4,
    duration: "00:52:14",
    pace: "5:01",
    bestPace: "4:43",
    city: "Челябинск",
    elevation: 54,
    notes: "Хороший темп, стабильное дыхание и уверенное ускорение на последних километрах.",
    route: [
      [55.1647, 61.4011],
      [55.1663, 61.4079],
      [55.1681, 61.4148],
      [55.1668, 61.4216],
      [55.1627, 61.4231],
      [55.1592, 61.4184],
      [55.1584, 61.4102],
      [55.1606, 61.4036],
      [55.1647, 61.4011],
    ],
    splits: ["5:09", "5:05", "5:02", "4:58", "5:00", "5:04", "5:01", "4:55", "4:51", "4:47"],
  },
  {
    id: 2,
    type: "Легкая",
    date: "2026-05-21",
    startTime: "19:05",
    distance: 6.2,
    duration: "00:36:18",
    pace: "5:51",
    bestPace: "5:22",
    city: "Челябинск",
    elevation: 22,
    notes: "Спокойный вечерний бег без давления по темпу. Ноги стали легче после третьего километра.",
    route: [
      [55.1841, 61.3253],
      [55.1862, 61.3311],
      [55.1874, 61.3386],
      [55.1848, 61.3442],
      [55.1814, 61.3415],
      [55.1798, 61.3331],
      [55.1841, 61.3253],
    ],
    splits: ["6:02", "5:57", "5:53", "5:47", "5:44", "5:39"],
  },
  {
    id: 3,
    type: "Восстановительная",
    date: "2026-05-22",
    startTime: "08:20",
    distance: 4.8,
    duration: "00:30:44",
    pace: "6:24",
    bestPace: "5:58",
    city: "Каменск-Уральский",
    elevation: 18,
    notes: "Мягкая пробежка после темповой работы. Главная цель выполнена: восстановиться и не торопиться.",
    route: [
      [56.4148, 61.9185],
      [56.4171, 61.9224],
      [56.4185, 61.9295],
      [56.4168, 61.9364],
      [56.4136, 61.9341],
      [56.4118, 61.9262],
      [56.4148, 61.9185],
    ],
    splits: ["6:31", "6:28", "6:19", "6:20", "6:16"],
  },
  {
    id: 4,
    type: "Длинная",
    date: "2026-05-24",
    startTime: "09:30",
    distance: 14.6,
    duration: "01:25:36",
    pace: "5:52",
    bestPace: "5:18",
    city: "Каменск-Уральский",
    elevation: 91,
    notes: "Длинная работа прошла ровно. Хорошо получилось держать питание и не провалиться на финише.",
    route: [
      [56.3978, 61.9304],
      [56.4021, 61.9349],
      [56.4074, 61.9417],
      [56.4116, 61.9511],
      [56.4097, 61.9614],
      [56.4044, 61.9668],
      [56.3989, 61.9589],
      [56.3958, 61.9462],
      [56.3978, 61.9304],
    ],
    splits: ["5:59", "5:57", "5:55", "5:54", "5:53", "5:50", "5:51", "5:49", "5:48", "5:47", "5:48", "5:46", "5:44", "5:39"],
  },
  {
    id: 5,
    type: "Легкая",
    date: "2026-05-25",
    startTime: "06:58",
    distance: 7.1,
    duration: "00:41:02",
    pace: "5:47",
    bestPace: "5:14",
    city: "Челябинск",
    elevation: 36,
    notes: "Бодрое утро и ровный каденс. Отличная пробежка, чтобы начать неделю с движения.",
    route: [
      [55.1507, 61.3869],
      [55.1536, 61.3921],
      [55.1562, 61.3994],
      [55.1548, 61.4067],
      [55.1509, 61.4088],
      [55.1478, 61.4026],
      [55.1486, 61.3937],
      [55.1507, 61.3869],
    ],
    splits: ["5:55", "5:51", "5:46", "5:44", "5:42", "5:40", "5:36"],
  },
];

let state = {
  view: "dashboard",
  selectedRunId: 5,
  filter: "Все",
  sort: "date",
};

const app = document.querySelector("#app");
const maps = new Map();

function loadRuns() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRuns));
    return seedRuns;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return seedRuns;
  }
}

function paceToSeconds(pace) {
  const [m, s] = pace.split(":").map(Number);
  return m * 60 + s;
}

function secondsToPace(total) {
  const minutes = Math.floor(total / 60);
  const seconds = Math.round(total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function durationToSeconds(duration) {
  const [h, m, s] = duration.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function secondsToDuration(total) {
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", weekday: "short" }).format(new Date(date));
}

function currentWeekLabel() {
  return "20-25 мая 2026";
}

function getRuns() {
  return loadRuns().sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getStats(runs) {
  const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
  const totalTime = runs.reduce((sum, run) => sum + durationToSeconds(run.duration), 0);
  const avgPace = secondsToPace(totalTime / totalDistance);
  const bestPace = runs.map((run) => run.bestPace).sort((a, b) => paceToSeconds(a) - paceToSeconds(b))[0];
  const longest = runs.reduce((best, run) => (run.distance > best.distance ? run : best), runs[0]);
  return {
    totalDistance,
    totalTime,
    avgPace,
    bestPace,
    longest,
    count: runs.length,
    streak: 4,
  };
}

function weeklyMileage(runs) {
  const days = [
    ["Пн", "2026-05-19"],
    ["Вт", "2026-05-20"],
    ["Ср", "2026-05-21"],
    ["Чт", "2026-05-22"],
    ["Пт", "2026-05-23"],
    ["Сб", "2026-05-24"],
    ["Вс", "2026-05-25"],
  ];
  return days.map(([label, date]) => ({
    label,
    km: runs.filter((run) => run.date === date).reduce((sum, run) => sum + run.distance, 0),
  }));
}

function icon(name) {
  const icons = {
    dashboard: "⌁",
    runs: "▤",
    profile: "◉",
    arrow: "→",
    back: "←",
    map: "⌖",
    spark: "✦",
  };
  return `<span aria-hidden="true">${icons[name] || ""}</span>`;
}

function setView(view) {
  state.view = view;
  render();
}

function openRun(id) {
  state.selectedRunId = id;
  state.view = "detail";
  render();
}

function nav() {
  const items = [
    ["dashboard", "Главная", "dashboard"],
    ["runs", "Пробежки", "runs"],
    ["profile", "Профиль", "profile"],
  ];
  return items
    .map(
      ([view, label, iconName]) =>
        `<button class="nav-button ${state.view === view ? "active" : ""}" data-view="${view}">${icon(iconName)}${label}</button>`,
    )
    .join("");
}

function bottomNav() {
  const items = [
    ["dashboard", "Главная", "dashboard"],
    ["runs", "Пробежки", "runs"],
    ["profile", "Профиль", "profile"],
  ];
  return `<nav class="bottom-nav" aria-label="Основная навигация">${items
    .map(
      ([view, label, iconName]) =>
        `<button class="bottom-button ${state.view === view ? "active" : ""}" data-view="${view}">${icon(iconName)}${label}</button>`,
    )
    .join("")}</nav>`;
}

function metricCard(label, value, meta) {
  return `<article class="card">
    <p class="metric-label">${label}</p>
    <div class="metric-value">${value}</div>
    <div class="metric-meta">${meta}</div>
  </article>`;
}

function runRow(run, mini = true) {
  return `<article class="run-row" role="button" tabindex="0" data-run="${run.id}" aria-label="Открыть пробежку ${run.type}">
    <div class="run-main">
      <div class="run-top">
        <div>
          <p class="run-title">${run.type} · ${run.city}</p>
          <p class="run-date">${formatDate(run.date)} · старт ${run.startTime}</p>
        </div>
        <span class="type-pill">${run.type}</span>
      </div>
      <div class="run-stats">
        <div class="run-stat"><strong>${run.distance.toFixed(1)} км</strong><span>дистанция</span></div>
        <div class="run-stat"><strong>${run.pace}</strong><span>темп</span></div>
        <div class="run-stat"><strong>${run.duration.slice(1)}</strong><span>время</span></div>
      </div>
    </div>
    ${mini ? `<div class="mini-map" id="mini-map-${run.id}"></div>` : ""}
  </article>`;
}

function chart(runs) {
  const week = weeklyMileage(runs);
  const max = Math.max(...week.map((day) => day.km), 1);
  return `<section class="chart-panel">
    <div class="section-head">
      <div>
        <p class="section-label">Прогресс</p>
        <h2>Километры по дням</h2>
      </div>
      <span class="week-pill">${currentWeekLabel()}</span>
    </div>
    <div class="bars">
      ${week
        .map(
          (day) => `<div class="bar-item">
            <div class="bar-value">${day.km ? day.km.toFixed(1) : "0"}</div>
            <div class="bar" style="height:${Math.max(8, (day.km / max) * 150)}px"></div>
            <div class="bar-label">${day.label}</div>
          </div>`,
        )
        .join("")}
    </div>
  </section>`;
}

function progressPanel(stats) {
  const weeklyGoal = 42;
  const monthGoal = 160;
  const weekPercent = Math.min(100, (stats.totalDistance / weeklyGoal) * 100);
  const monthPercent = Math.min(100, ((stats.totalDistance + 86) / monthGoal) * 100);
  return `<section class="chart-panel">
    <div class="section-head">
      <div>
        <p class="section-label">Серия</p>
        <h2>Движение вперед</h2>
      </div>
    </div>
    <div class="progress-list">
      <div class="progress-row">
        <div class="progress-top"><span>Недельная цель</span><span>${Math.round(weekPercent)}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${weekPercent}%"></div></div>
      </div>
      <div class="progress-row">
        <div class="progress-top"><span>Месячный объем</span><span>${Math.round(monthPercent)}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${monthPercent}%"></div></div>
      </div>
      <div class="progress-row">
        <div class="progress-top"><span>Серия тренировок</span><span>${stats.streak} дня</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${stats.streak * 18}%"></div></div>
      </div>
    </div>
  </section>`;
}

function dashboard(runs) {
  const stats = getStats(runs);
  const recent = runs.slice(0, 3);
  return `<div class="page">
    <section class="hero">
      <div class="hero-main">
        <div class="hero-header">
          <div>
            <p class="section-label">Бег к мечте</p>
            <h1>Привет, Ирина 👋</h1>
            <p class="hero-copy">Неделя выглядит сильной: уже ${stats.totalDistance.toFixed(1)} км, ${stats.count} пробежек и спокойный рост без перегруза.</p>
          </div>
          <span class="week-pill">${currentWeekLabel()}</span>
        </div>
        <div class="hero-actions">
          <button class="primary-button" data-view="runs">${icon("runs")}Все пробежки</button>
          <button class="ghost-button" data-run="${recent[0].id}">${icon("map")}Последний маршрут</button>
        </div>
      </div>
      <aside class="hero-side">
        <div class="streak-ring" style="--progress:${stats.streak * 18}">
          <div class="streak-inner">
            <div>
              <div class="streak-value">${stats.streak}</div>
              <div class="streak-text">дня подряд</div>
            </div>
          </div>
        </div>
      </aside>
    </section>
    <section class="grid metrics">
      ${metricCard("Км за неделю", `${stats.totalDistance.toFixed(1)}`, "цель 42 км")}
      ${metricCard("Пробежки", stats.count, "4 типа тренировок")}
      ${metricCard("Общее время", secondsToDuration(stats.totalTime).slice(0, 5), "часы и минуты")}
      ${metricCard("Средний темп", stats.avgPace, "мин/км")}
      ${metricCard("Лучший темп", stats.bestPace, "мин/км")}
      ${metricCard("Самая длинная", `${stats.longest.distance.toFixed(1)} км`, stats.longest.city)}
    </section>
    <section class="grid dashboard-grid">
      <div>
        <div class="section-head">
          <div>
            <p class="section-label">История</p>
            <h2>Последние пробежки</h2>
          </div>
          <button class="ghost-button" data-view="runs">${icon("arrow")}Смотреть все</button>
        </div>
        <div class="run-stack">${recent.map((run) => runRow(run)).join("")}</div>
      </div>
      <div class="grid">
        ${chart(runs)}
        ${progressPanel(stats)}
      </div>
    </section>
  </div>`;
}

function runsPage(runs) {
  const types = ["Все", "Легкая", "Темповая", "Длинная", "Восстановительная"];
  const sortLabels = [
    ["date", "По дате"],
    ["distance", "По дистанции"],
    ["pace", "По темпу"],
  ];
  const filtered = runs
    .filter((run) => state.filter === "Все" || run.type === state.filter)
    .sort((a, b) => {
      if (state.sort === "distance") return b.distance - a.distance;
      if (state.sort === "pace") return paceToSeconds(a.pace) - paceToSeconds(b.pace);
      return new Date(b.date) - new Date(a.date);
    });

  return `<div class="page">
    <section class="hero-main">
      <div>
        <p class="section-label">Все тренировки</p>
        <h1>Пробежки</h1>
        <p class="hero-copy">Фильтруй по типу тренировки, сравнивай дистанции и открывай маршрут каждой пробежки.</p>
      </div>
    </section>
    <section class="filter-panel runs-toolbar">
      <div class="chips">
        ${types.map((type) => `<button class="chip ${state.filter === type ? "active" : ""}" data-filter="${type}">${type}</button>`).join("")}
      </div>
      <div class="sorts">
        ${sortLabels.map(([key, label]) => `<button class="sort-button ${state.sort === key ? "active" : ""}" data-sort="${key}">${label}</button>`).join("")}
      </div>
    </section>
    <section class="run-stack">${filtered.map((run) => runRow(run)).join("")}</section>
  </div>`;
}

function detailPage(runs) {
  const run = runs.find((item) => item.id === state.selectedRunId) || runs[0];
  const splitSeconds = run.splits.map(paceToSeconds);
  const slowest = Math.max(...splitSeconds);
  const fastest = Math.min(...splitSeconds);

  return `<div class="page">
    <div class="detail-header">
      <button class="back-button" data-view="runs">${icon("back")}К списку</button>
      <button class="ghost-button" data-view="dashboard">${icon("dashboard")}На главную</button>
    </div>
    <section class="detail-layout">
      <main class="detail-panel">
        <div class="detail-title">
          <p class="section-label">${formatDate(run.date)} · ${run.city}</p>
          <h1>${run.type}</h1>
        </div>
        <div class="detail-map" id="detail-map-${run.id}"></div>
        <div class="info-grid">
          <div class="info-cell"><span>Старт</span><strong>${run.startTime}</strong></div>
          <div class="info-cell"><span>Длительность</span><strong>${run.duration}</strong></div>
          <div class="info-cell"><span>Дистанция</span><strong>${run.distance.toFixed(1)} км</strong></div>
          <div class="info-cell"><span>Средний темп</span><strong>${run.pace}</strong></div>
          <div class="info-cell"><span>Тип</span><strong>${run.type}</strong></div>
          <div class="info-cell"><span>Набор высоты</span><strong>${run.elevation} м</strong></div>
        </div>
        <p class="notes">${run.notes}</p>
      </main>
      <aside class="detail-panel">
        <div class="section-head">
          <div>
            <p class="section-label">Сплиты</p>
            <h2>По километрам</h2>
          </div>
        </div>
        <div class="split-list">
          ${run.splits
            .map((split, index) => {
              const seconds = paceToSeconds(split);
              const width = 42 + ((slowest - seconds) / Math.max(1, slowest - fastest)) * 58;
              return `<div class="split-row">
                <span>${index + 1} км</span>
                <div class="split-track"><div class="split-fill" style="width:${width}%"></div></div>
                <span>${split}</span>
              </div>`;
            })
            .join("")}
        </div>
      </aside>
    </section>
  </div>`;
}

function profilePage(runs) {
  const stats = getStats(runs);
  return `<div class="page">
    <section class="hero-main">
      <p class="section-label">Профиль</p>
      <h1>Ирина</h1>
      <p class="hero-copy">Персональное беговое пространство без ленты, шума и сравнения с другими. Только прогресс, маршруты и ощущение движения.</p>
    </section>
    <section class="profile-grid">
      <div class="profile-card">
        <p class="section-label">Бегун</p>
        <div class="profile-name">Ирина</div>
        <p class="brand-copy">Любит спокойный прогресс, утренние старты и чистую статистику.</p>
      </div>
      <div class="goal-card">
        <p class="section-label">Цель недели</p>
        <div class="goal-value">${Math.round((stats.totalDistance / 42) * 100)}%</div>
        <p>До недельной цели осталось ${(42 - stats.totalDistance).toFixed(1)} км.</p>
      </div>
    </section>
  </div>`;
}

function layout(content, runs) {
  const stats = getStats(runs);
  return `<div class="shell">
    <aside class="sidebar">
      <section class="brand-panel">
        <div class="brand-top">
          <div class="brand-mark">Б</div>
          <span>${icon("spark")}</span>
        </div>
        <div>
          <h2 class="brand-title">Бег к мечте</h2>
          <p class="brand-copy">Спокойный спортивный дневник для Ирины.</p>
        </div>
      </section>
      <nav class="nav" aria-label="Основная навигация">${nav()}</nav>
      <section class="sidebar-note">
        <p class="note-label">Эта неделя</p>
        <p class="note-value">${stats.totalDistance.toFixed(1)} км</p>
      </section>
    </aside>
    <main class="main">${content}</main>
    ${bottomNav()}
  </div>`;
}

function initMap(elementId, route, compact = false) {
  const element = document.getElementById(elementId);
  if (!element || !window.L) return;
  if (maps.has(elementId)) {
    maps.get(elementId).remove();
    maps.delete(elementId);
  }
  const map = L.map(element, {
    zoomControl: !compact,
    dragging: !compact,
    scrollWheelZoom: !compact,
    doubleClickZoom: !compact,
    attributionControl: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);
  const line = L.polyline(route, {
    color: "#b7ff00",
    weight: compact ? 4 : 6,
    opacity: 0.95,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(map);
  map.fitBounds(line.getBounds(), { padding: compact ? [16, 16] : [34, 34] });
  if (!compact) {
    L.circleMarker(route[0], { radius: 7, color: "#0b0b0b", fillColor: "#b7ff00", fillOpacity: 1, weight: 3 }).addTo(map);
    L.circleMarker(route[route.length - 1], { radius: 7, color: "#0b0b0b", fillColor: "#ffffff", fillOpacity: 1, weight: 3 }).addTo(map);
  }
  maps.set(elementId, map);
}

function initMaps(runs) {
  requestAnimationFrame(() => {
    runs.forEach((run) => initMap(`mini-map-${run.id}`, run.route, true));
    const selected = runs.find((run) => run.id === state.selectedRunId);
    if (selected) initMap(`detail-map-${selected.id}`, selected.route, false);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  document.querySelectorAll("[data-run]").forEach((button) => {
    button.addEventListener("click", () => openRun(Number(button.dataset.run)));
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRun(Number(button.dataset.run));
      }
    });
  });
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.dataset.sort;
      render();
    });
  });
}

function render() {
  const runs = getRuns();
  let content = "";
  if (state.view === "runs") content = runsPage(runs);
  else if (state.view === "detail") content = detailPage(runs);
  else if (state.view === "profile") content = profilePage(runs);
  else content = dashboard(runs);
  app.innerHTML = layout(content, runs);
  bindEvents();
  initMaps(runs);
}

window.addEventListener("DOMContentLoaded", render);
