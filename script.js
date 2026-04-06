let tasks = [];
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 20;
let currentTask = null;
let timer = null;
let seconds = 0;

function saveData() {
  localStorage.setItem("xp", xp);
}

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

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimer() {
  document.getElementById("timer").innerText = formatTime(seconds);
}

function setMood(mood) {
  let focus = document.getElementById("focusTask");

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

  renderTasks();
}

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

function pauseTask() {
  clearInterval(timer);
  timer = null;

  let earnedXP = Math.floor(seconds / 5);
  xp += earnedXP;

  if (xp > 100) xp = 100;

  updateXP();

  alert(`+${earnedXP} XP ganho 🚀`);
  seconds = 0;
  updateTimer();
}

setGreeting();
updateXP();
updateTimer();
