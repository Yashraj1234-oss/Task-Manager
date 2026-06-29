'use strict';

/* ===================================
   State
=================================== */
const STORAGE_KEY = 'taskManager.tasks';

let tasks = loadTasks();
let currentFilter = 'all';
let currentSearch = '';
let editingTaskId = null;

/* ===================================
   DOM References
=================================== */
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const priorityInput = document.getElementById('priority-input');
const dueDateInput = document.getElementById('due-date-input');
const submitBtn = document.getElementById('submit-btn');
const submitBtnText = document.getElementById('submit-btn-text');

const taskListEl = document.getElementById('task-list');
const emptyStateEl = document.getElementById('empty-state');

const totalCountEl = document.getElementById('total-count');
const pendingCountEl = document.getElementById('pending-count');
const completedCountEl = document.getElementById('completed-count');

const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');

/* ===================================
   Storage helpers
=================================== */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load tasks from storage:', err);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to storage:', err);
  }
}

/* ===================================
   Utilities
=================================== */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(dateStr, completed) {
  if (!dateStr || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  return due < today;
}

const priorityRank = { High: 0, Medium: 1, Low: 2 };

/* ===================================
   Task operations
=================================== */
function addTask(text, priority, dueDate) {
  const newTask = {
    id: generateId(),
    text: text.trim(),
    priority,
    dueDate: dueDate || '',
    completed: false,
    createdAt: Date.now(),
  };
  tasks.push(newTask);
  saveTasks();
  render();
}

function deleteTask(id) {
  const itemEl = taskListEl.querySelector(`[data-id="${id}"]`);
  if (itemEl) {
    itemEl.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      render();
    }, 220);
  } else {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }
}

function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function startEdit(id) {
  editingTaskId = id;
  render();
}

function cancelEdit() {
  editingTaskId = null;
  render();
}

function saveEdit(id, newText, newPriority, newDueDate) {
  const task = tasks.find((t) => t.id === id);
  if (task && newText.trim()) {
    task.text = newText.trim();
    task.priority = newPriority;
    task.dueDate = newDueDate || '';
  }
  editingTaskId = null;
  saveTasks();
  render();
}

/* ===================================
   Filtering / Searching
=================================== */
function getVisibleTasks() {
  let list = [...tasks];

  if (currentFilter === 'completed') {
    list = list.filter((t) => t.completed);
  } else if (currentFilter === 'pending') {
    list = list.filter((t) => !t.completed);
  }

  if (currentSearch.trim()) {
    const q = currentSearch.trim().toLowerCase();
    list = list.filter((t) => t.text.toLowerCase().includes(q));
  }

  // Sort: incomplete first, then by priority, then by due date
  list.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pa = priorityRank[a.priority] ?? 1;
    const pb = priorityRank[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return b.createdAt - a.createdAt;
  });

  return list;
}

/* ===================================
   Rendering
=================================== */
function render() {
  renderStats();
  renderTaskList();
}

function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  totalCountEl.textContent = total;
  completedCountEl.textContent = completed;
  pendingCountEl.textContent = pending;
}

function renderTaskList() {
  const visibleTasks = getVisibleTasks();
  taskListEl.innerHTML = '';

  if (visibleTasks.length === 0) {
    emptyStateEl.classList.add('show');
    emptyStateEl.querySelector('p').textContent =
      tasks.length === 0
        ? '🎉 No tasks here. Add one above to get started!'
        : '🔍 No tasks match your search/filter.';
  } else {
    emptyStateEl.classList.remove('show');
  }

  visibleTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.setAttribute('data-id', task.id);

    if (editingTaskId === task.id) {
      li.appendChild(buildEditView(task));
    } else {
      li.appendChild(buildTaskView(task));
    }

    taskListEl.appendChild(li);
  });
}

function buildTaskView(task) {
  const fragment = document.createDocumentFragment();

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', 'Mark task as completed');
  checkbox.addEventListener('change', () => toggleComplete(task.id));

  const content = document.createElement('div');
  content.className = 'task-content';

  const textEl = document.createElement('p');
  textEl.className = 'task-text';
  textEl.textContent = task.text;

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const badge = document.createElement('span');
  badge.className = `badge badge-${task.priority.toLowerCase()}`;
  badge.textContent = task.priority;
  meta.appendChild(badge);

  if (task.dueDate) {
    const dueEl = document.createElement('span');
    const overdue = isOverdue(task.dueDate, task.completed);
    dueEl.className = 'due-date' + (overdue ? ' overdue' : '');
    dueEl.textContent = (overdue ? '⚠ Overdue: ' : '📅 ') + formatDate(task.dueDate);
    meta.appendChild(dueEl);
  }

  content.appendChild(textEl);
  content.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn edit-btn';
  editBtn.setAttribute('aria-label', 'Edit task');
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', () => startEdit(task.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'icon-btn delete-btn';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.textContent = '🗑️';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  fragment.appendChild(checkbox);
  fragment.appendChild(content);
  fragment.appendChild(actions);

  return fragment;
}

function buildEditView(task) {
  const fragment = document.createDocumentFragment();

  const wrapper = document.createElement('div');
  wrapper.style.flex = '1';

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.className = 'edit-input';
  textInput.value = task.text;

  const row = document.createElement('div');
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '1fr 1fr';
  row.style.gap = '0.5rem';
  row.style.marginBottom = '0.5rem';

  const prioritySelect = document.createElement('select');
  ['High', 'Medium', 'Low'].forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    if (p === task.priority) opt.selected = true;
    prioritySelect.appendChild(opt);
  });

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = task.dueDate || '';

  row.appendChild(prioritySelect);
  row.appendChild(dateInput);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = '0.5rem';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary';
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () =>
    saveEdit(task.id, textInput.value, prioritySelect.value, dateInput.value)
  );

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'icon-btn';
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.color = 'var(--color-text-muted)';
  cancelBtn.addEventListener('click', cancelEdit);

  btnRow.appendChild(saveBtn);
  btnRow.appendChild(cancelBtn);

  wrapper.appendChild(textInput);
  wrapper.appendChild(row);
  wrapper.appendChild(btnRow);

  fragment.appendChild(wrapper);

  // Focus after insertion
  setTimeout(() => textInput.focus(), 0);

  return fragment;
}

/* ===================================
   Event Listeners
=================================== */
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value;
  if (!text.trim()) return;

  addTask(text, priorityInput.value, dueDateInput.value);

  taskInput.value = '';
  dueDateInput.value = '';
  priorityInput.value = 'Medium';
  taskInput.focus();
});

searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  renderTaskList();
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTaskList();
  });
});

/* ===================================
   Init
=================================== */
render();
