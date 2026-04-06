let tasks = [];

function setMood(mood) {
  let focus = document.getElementById("focusTask");

  if (mood === "leve") {
    focus.innerText = "Tarefa leve recomendada";
    tasks = ["Organizar mesa", "Responder mensagens"];
  }

  if (mood === "moderado") {
    focus.innerText = "Tarefa moderada recomendada";
    tasks = ["Estudar 30 min", "Treinar"];
  }

  if (mood === "intenso") {
    focus.innerText = "Tarefa intensa recomendada";
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
  alert("Tarefa iniciada 🚀");
}
