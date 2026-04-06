let tasks = [];
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 20;
let history = JSON.parse(localStorage.getItem("history")) || [];
let streak = localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0;

let currentTask = null;
let timer = null;
let seconds = 0;
let lastDate = localStorage.getItem("lastDate") || null;

// =================== SAVE ===================
function saveData() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastDate", lastDate);
}

// =================== XP ===================
function updateXP() {
  document.getElementById("xpFill").style.height = xp + "%";
  saveData();
}

// =================== GREETING ===================
function setGreeting() {
  const hour = new Date().getHours();
  const greeting = document.getElementById("greeting");

  if (hour < 12) greeting.innerText = "Bom dia ☀️";
  else if (hour < 18) greeting.innerText = "Boa tarde 🌤";
  else greeting.innerText = "Boa noite 🌙";
}

// =================== TIMER ===================
function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimer() {
  document.getElementById("timer").innerText = formatTime(seconds);
}

// =================== IA SIMPLES ===================
function getSmartTasks(mood) {
  let usage = JSON.parse(localStorage.getItem("moodUsage")) || {
    leve: 0,
    moderado: 0,
    intenso: 0
  };

  usage[mood]++;
  localStorage.setItem("moodUsage", JSON.stringify(usage));

  if (usage.leve > usage.intenso) {
    return ["Organizar algo leve", "Descansar mente"];
  }

  if (usage.intenso > 5) {
    return ["Desafio avançado", "Projeto complexo"];
  }

  return null;
}

// =================== MOOD ===================
function setMood(mood) {
  let focus = document.getElementById("focusTask");

  let smart = getSmartTasks(mood);

  if (smart) {
    tasks = smart;
    focus.innerText = "Sugestão inteligente 🔥";
  } else {
    if (mood === "leve") {
      focus.innerText = "Organizar algo simples";
      tasks = ["Arrumar mesa", "Responder mensagens"];
    }

    if (mood === "moderado") {
      focus.innerText = "Manter produtividade";
      tasks = ["Estudar 30 min", "Exercício leve"];
    }

    if (mood === "intenso") {
      focus.innerText = "Alta performance";
      tasks = ["Projeto importante", "Estudo profundo"];
    }
  }

  renderTasks();
}

// =================== TASKS ===================
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerText = task;
    li.onclick = () => selectTask(task);
    list.appendChild(li);
  });
}

function selectTask(task) {
  currentTask = task;
  document.getElementById("focusTask").innerText = task;
}

// =================== START ===================
function startTask() {
  if (!currentTask) {
    alert("Selecione uma tarefa primeiro");
    return;
  }

  if (timer) return;

  timer = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

// =================== PAUSE ===================
function pauseTask() {
  clearInterval(timer);
  timer = null;

  let earnedXP = Math.floor(seconds / 5);
  xp += earnedXP;

  if (xp > 100) xp = 100;

  updateXP();

  saveHistory(currentTask, earnedXP);

  alert(`+${earnedXP} XP 🚀`);
  seconds = 0;
  updateTimer();
}

// =================== HISTORY ===================
function saveHistory(task, xpEarned) {
  let today = new Date().toLocaleDateString();

  history.push({
    task,
    xpEarned,
    date: today
  });

  updateStreak(today);
  renderHistory();
  saveData();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  history.slice(-5).reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerText = `${item.task} • +${item.xpEarned} XP`;
    list.appendChild(div);
  });
}
// =================== STREAK ===================
function updateStreak(today) {
  if (!lastDate) {
    streak = 1;
  } else {
    let last = new Date(lastDate);
    let current = new Date(today);

    let diff = (current - last) / (1000 * 60 * 60 * 24);

    if (diff === 1) streak++;
    else if (diff > 1) streak = 1;
  }

  lastDate = today;
  document.getElementById("streak").innerText = `🔥 Streak: ${streak} dias`;
}

// =================== INIT ===================
function init() {
  setGreeting();
  updateXP();
  updateTimer();
  renderHistory();

  document.getElementById("streak").innerText = `🔥 Streak: ${streak} dias`;
}

init();
