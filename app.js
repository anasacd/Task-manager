const STORAGE_KEY = "littlesteps_tasks_v1";
const THEME_KEY = "littlesteps_theme";

const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const metrics = document.getElementById("metrics");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const taskTemplate = document.getElementById("taskTemplate");
const themeToggle = document.getElementById("themeToggle");

const state = {
  tasks: loadTasks(),
};

applyTheme();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const task = {
    id: crypto.randomUUID(),
    title: document.getElementById("title").value.trim(),
    campus: document.getElementById("campus").value,
    department: document.getElementById("department").value,
    assignee: document.getElementById("assignee").value.trim(),
    priority: document.getElementById("priority").value,
    dueDate: document.getElementById("dueDate").value,
    description: document.getElementById("description").value.trim(),
    status: "Open",
    createdAt: new Date().toISOString(),
  };

  state.tasks.unshift(task);
  persistTasks();
  form.reset();
  render();
});

statusFilter.addEventListener("change", render);
priorityFilter.addEventListener("change", render);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  return [
    {
      id: crypto.randomUUID(),
      title: "Refresh sensory play station",
      campus: "North Campus",
      department: "Education Team",
      assignee: "Ms. Flores",
      priority: "High",
      dueDate: getDateOffset(2),
      description: "Replace materials and prepare weekly activity cards.",
      status: "In Progress",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Parent orientation reminders",
      campus: "South Campus",
      department: "Parent Relations",
      assignee: "Mr. Khan",
      priority: "Medium",
      dueDate: getDateOffset(5),
      description: "Send consent forms and transportation updates to new families.",
      status: "Open",
      createdAt: new Date().toISOString(),
    },
  ];
}

function persistTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function getFilteredTasks() {
  return state.tasks.filter((task) => {
    const matchesStatus =
      statusFilter.value === "all" || task.status === statusFilter.value;
    const matchesPriority =
      priorityFilter.value === "all" || task.priority === priorityFilter.value;
    return matchesStatus && matchesPriority;
  });
}

function render() {
  const filteredTasks = getFilteredTasks();
  renderMetrics();

  taskList.innerHTML = "";
  if (!filteredTasks.length) {
    taskList.innerHTML = '<div class="empty">No tasks match the selected filters.</div>';
    return;
  }

  for (const task of filteredTasks) {
    const node = taskTemplate.content.cloneNode(true);
    node.querySelector("h3").textContent = task.title;
    node.querySelector(
      ".meta"
    ).textContent = `${task.campus} • ${task.department} • Assigned to ${task.assignee} • Due ${formatDate(
      task.dueDate
    )}`;
    node.querySelector(".desc").textContent = task.description;
    node.querySelector(".priority").textContent = `${task.priority} Priority`;

    const statusSelect = node.querySelector(".status-select");
    statusSelect.value = task.status;
    statusSelect.addEventListener("change", (event) => {
      task.status = event.target.value;
      persistTasks();
      render();
    });

    node.querySelector(".danger").addEventListener("click", () => {
      state.tasks = state.tasks.filter((entry) => entry.id !== task.id);
      persistTasks();
      render();
    });

    taskList.appendChild(node);
  }
}

function renderMetrics() {
  const totals = {
    total: state.tasks.length,
    open: state.tasks.filter((task) => task.status === "Open").length,
    progress: state.tasks.filter((task) => task.status === "In Progress").length,
    completed: state.tasks.filter((task) => task.status === "Completed").length,
  };

  metrics.innerHTML = `
    <div class="metric"><span>Total Tasks</span><b>${totals.total}</b></div>
    <div class="metric"><span>Open</span><b>${totals.open}</b></div>
    <div class="metric"><span>In Progress</span><b>${totals.progress}</b></div>
    <div class="metric"><span>Completed</span><b>${totals.completed}</b></div>
  `;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDateOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

function applyTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
}
