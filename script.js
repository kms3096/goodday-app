let tasks = [];
let xp = 20;
let currentTask = null;
let timer = null;
let seconds = 0;

function updateXP() {
  document.getElementById("xpFill").style.height = xp + "%";
}

function setGreeting() {
  const hour = new Date().getHours();
  const greeting = document.getElementById("greeting");

  if (hour < 12) greeting.innerText = "Bom dia ☀️";
  else if (hour < 18) greeting.innerText = "Boa tarde 🌤";
  else greeting.innerText = "Boa noite 🌙";
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
    console.log("Tempo:", seconds);
  }, 1000);
}

function pauseTask() {
  clearInterval(timer);
  timer = null;

  let earnedXP = Math.floor(seconds / 10);
  xp += earnedXP;

  if (xp > 100) xp = 100;

  updateXP();

  alert(`Você ganhou ${earnedXP} XP`);
  seconds = 0;
}

setGreeting();
updateXP();
