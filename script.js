let tasks = [];
let xp = 20;

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
    list.appendChild(li);
  });
}

function startTask() {
  xp += 10;
  if (xp > 100) xp = 100;
  updateXP();
  alert("Tarefa iniciada 🚀");
}

function pauseTask() {
  alert("Tarefa pausada ⏸");
}

setGreeting();
updateXP();
