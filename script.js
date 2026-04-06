let tasks = [];
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 20;
let history = JSON.parse(localStorage.getItem("history")) || [];
let streak = localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0;
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
  if (tasks.some(t => t.nome === nome)) {
  alert("Tarefa já existe");
  return;
}
  const novasTasks = [
  { id: Date.now(), nome: "Arrumar mesa", status: "pending" },
  { id: Date.now()+1, nome: "Responder mensagens", status: "pending" }
];
  tasks = [...tasks, ...novasTasks];

  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerText = `${task.nome} ${getStatusText(task.status)}`;

    li.onclick = () => {
      currentTask = task;
      document.getElementById("focusTask").innerText = task.nome;
    };

    list.appendChild(li);
  });
}

function selectTask(task) {
  currentTask = task;
  document.getElementById("focusTask").innerText = task.nome;
}

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

  showXPPopup(earnedXP);

  seconds = 0;
  updateTimer();

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

  function saveHistory(task, xpEarned, status) {
   history.push({
   task,
   xpEarned,
   status,
   date: today
});

  showXPPopup(earnedXP);

  seconds = 0;
  updateTimer();

  renderTasks();
}
  function addTask() {
  const input = document.getElementById("taskInput");
  const nome = input.value.trim();

  if (!nome) {
    alert("Digite uma tarefa");
    return;
  }

  const novaTask = {
    id: Date.now(),
    nome: nome,
    status: "pending"
  };

  tasks.push(novaTask);

  input.value = "";

  renderTasks(); // 🔥 ESSENCIAL
}
  

  const novaTask = {
    id: Date.now(),
    nome: nome,
    status: "pending"
  };

  tasks.push(novaTask);

  input.value = "";

  renderTasks();
}
function init() {
  setGreeting();
  updateXP();
  updateTimer();
  renderTasks();
  renderHistory();

  document.getElementById("streak").innerText = `🔥 Streak: ${streak} dias`;
}

init();
