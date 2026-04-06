let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 20;
let history = JSON.parse(localStorage.getItem("history")) || [];
let streak = localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0;
let currentTask = null;
let timer = null;
let seconds = 0;

// ================= SAVE =================
function saveData() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("streak", streak);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("currentTaskId", currentTask ? currentTask.id : null);
}

// ================= UI =================
function updateXP() {
  document.getElementById("xpFill").style.height = xp + "%";
  saveData();
}

function setGreeting() {
  const hour = new Date().getHours();
  const greeting = document.getElementById("greeting");

  if (hour < 12) greeting.innerText = "Bom dia ☀️";
  else if (hour < 18) greeting.innerText = "Boa tarde 🌤";
  else greeting.innerText = "Boa noite 🌙";
}

// ================= TIMER =================
function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimer() {
  document.getElementById("timer").innerText = formatTime(seconds);
}

// ================= MOOD =================
function setMood(mood) {
  const focus = document.getElementById("focusTask");

  if (mood === "leve") {
    focus.innerText = "Organizar algo simples";
    tasks = [
     { id: Date.now(), nome: "Arrumar mesa", status: "pending" },
     { id: Date.now()+1, nome: "Responder mensagens", status: "pending" }
   ];
  }

  if (mood === "moderado") {
    focus.innerText = "Manter produtividade";
    tasks = [
     { id: Date.now(), nome: "Estudar 30 min", status: "pending" },
     { id: Date.now()+1, nome: "Exercício leve", status: "pending" }
   ];
  }

  if (mood === "intenso") {
    focus.innerText = "Alta performance";
    tasks = [
     { id: Date.now(), nome: "Projeto importante", status: "pending" },
     { id: Date.now()+1, nome: "Estudo profundo", status: "pending" }
   ];
  }
  saveData();
  renderTasks();
}

// ================= TASKS =================
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerText = task.nome;

    // 🎯 destaque da tarefa ativa
    if (currentTask && currentTask.id === task.id) {
      li.style.background = "#22c55e";
      li.style.color = "#000";
    }

    li.onclick = () => {
      currentTask = task;

      document.getElementById("focusTask").innerText = task.nome;

      saveData(); // 🔥 IMPORTANTE

      renderTasks();
    };

    list.appendChild(li);
  });
}
// ================= CONTROLES =================
function startTask() {
  if (!currentTask) {
    alert("Selecione uma tarefa primeiro");
    return;
  }

  if (timer) return;

  currentTask.status = "in_progress";

  timer = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);

  renderTasks();
}

function pauseTask() {
  if (!currentTask) return;

  clearInterval(timer);
  timer = null;

  currentTask.status = "paused";

  let earnedXP = Math.floor(seconds / 5);
  xp += earnedXP;

  if (xp > 100) xp = 100;

  updateXP();

  saveHistory(currentTask.nome, earnedXP, "paused");

  seconds = 0;
  updateTimer();
  saveData();

  renderTasks();
}
function completeTask() {
  if (!currentTask) return;

  clearInterval(timer);
  timer = null;

  currentTask.status = "done";

  let earnedXP = Math.floor(seconds / 3) + 10;
  xp += earnedXP;

  if (xp > 100) xp = 100;

  updateXP();

  saveHistory(currentTask.nome, earnedXP, "done");

  seconds = 0;
  updateTimer();
  saveData();
  
  renderTasks();
}
// ================= HISTÓRICO =================
function saveHistory(task, xpEarned, status) {
  const today = new Date().toLocaleDateString();

  history.push({
    task,
    xpEarned,
    status,
    date: today
  });

  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.innerText = `${item.date} - ${item.task} (+${item.xpEarned} XP)`;
    list.appendChild(div);
  });
}

// ================= INIT =================
function init() {
  setGreeting();
  updateXP();
  updateTimer();
  const savedId = localStorage.getItem("currentTaskId");

  if (savedId) {
  currentTask = tasks.find(t => t.id == savedId);
  
  if (currentTask) {
    document.getElementById("focusTask").innerText = currentTask.nome;
  }
}
  renderTasks();
  renderHistory();
  
  document.getElementById("streak").innerText = `🔥 Streak: ${streak} dias`;
}

init();
