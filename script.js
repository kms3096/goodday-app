/* ================= ESTADO ================= */

let tasks = [];
let history = [];

/* ================= CRIAR TAREFA ================= */

function addTask() {
  const input = document.getElementById("taskInput");
  const difficulty = document.getElementById("difficulty");

  if (!input.value) return;

  const task = {
    id: Date.now(),
    task: input.value,
    difficulty: difficulty.value,
    status: "created",
    startTime: null,
    totalTime: 0,
    date: new Date().toISOString()
  };

  tasks.push(task);

  input.value = "";

  renderTasks();
}

/* ================= RENDER TASKS ================= */

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-card";

    div.innerHTML = `
      <div class="task-title">${task.task}</div>

      <div class="task-actions">
        <button onclick="startTask(${task.id})">▶</button>
        <button onclick="pauseTask(${task.id})">⏸</button>
        <button onclick="finishTask(${task.id})">✅</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* ================= AÇÕES ================= */

function startTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.status = "in_progress";
  task.startTime = Date.now();

  vibrate();
  renderTasks();
}

function pauseTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task || task.status !== "in_progress") return;

  task.status = "paused";
  task.totalTime += Date.now() - task.startTime;
  task.startTime = null;

  vibrate();
  renderTasks();
}

function finishTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (task.startTime) {
    task.totalTime += Date.now() - task.startTime;
  }

  task.status = "done";

  const earnedXP = calculateXP(task);

  history.push({
    task: task.task,
    xpEarned: earnedXP,
    date: new Date().toISOString(),
    status: "done"
  });

  showXPAnimation(earnedXP);
  vibrate();

  tasks = tasks.filter(t => t.id !== id);

  renderTasks();
  renderHistory();
}

/* ================= XP ================= */

function calculateXP(task) {
  let base = {
    facil: 10,
    media: 20,
    dificil: 40
  }[task.difficulty] || 10;

  const timeBonus = Math.floor(task.totalTime / 60000);

  return base + timeBonus;
}

/* ================= TIMELINE ================= */

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  history.slice(-7).reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";

    div.innerHTML = `
      <div class="timeline-top">
        <span>${formatDate(item.date)}</span>
        <span class="timeline-xp">+${item.xpEarned} XP</span>
      </div>

      <div class="timeline-title">${item.task}</div>

      <div class="timeline-status">
        ${getStatusText(item.status)}
      </div>
    `;

    list.appendChild(div);
  });
}

/* ================= HELPERS ================= */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  });
}

function getStatusText(status) {
  if (status === "done") return "✅ Concluído";
  if (status === "paused") return "⏸️ Pausado";
  if (status === "in_progress") return "🚀 Em andamento";
  return "📌 Criado";
}

/* ================= ANIMAÇÃO XP ================= */

function showXPAnimation(xp) {
  const popup = document.getElementById("xpPopup");
  popup.innerText = `+${xp} XP 🚀`;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

/* ================= FEEDBACK ================= */

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

/* ================= INIT ================= */

function init() {
  renderTasks();
  renderHistory();
}

init();
