const API_URL = 'http://localhost:3001/api';

let allTasks = [];
let currentFilter = 'all';

// ===== API FUNCTIONS =====

async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`);
    const json = await res.json();
    setApiStatus(json.success);
  } catch {
    setApiStatus(false);
  }
}

async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    const json = await res.json();
    if (json.success) {
      allTasks = json.data;
      renderTasks();
      updateStats();
    }
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
  } finally {
    document.getElementById('loading').classList.add('hidden');
  }
}

async function createTask(title) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

async function updateTask(id, data) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  return res.json();
}

// ===== UI FUNCTIONS =====

function setApiStatus(online) {
  const badge = document.getElementById('api-status');
  badge.className = `api-badge ${online ? 'online' : 'offline'}`;
  badge.querySelector('.label').textContent = online ? 'API Online' : 'API Offline';
}

function updateStats() {
  const total = allTasks.length;
  const done = allTasks.filter(t => t.completed).length;
  const pending = total - done;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-done').textContent = done;
}

function getFilteredTasks() {
  if (currentFilter === 'pending') return allTasks.filter(t => !t.completed);
  if (currentFilter === 'done') return allTasks.filter(t => t.completed);
  return allTasks;
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const empty = document.getElementById('empty-state');
  const filtered = getFilteredTasks();

  list.innerHTML = '';

  if (filtered.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;
    li.dataset.testid = `task-item-${task.id}`;

    li.innerHTML = `
      <button class="task-check" data-testid="check-${task.id}" aria-label="Marcar como concluída"></button>
      <span class="task-title" data-testid="task-title-${task.id}">${escapeHtml(task.title)}</span>
      <div class="task-actions">
        <button class="btn-edit" data-testid="edit-${task.id}" title="Editar">✎</button>
        <button class="btn-delete" data-testid="delete-${task.id}" title="Excluir">✕</button>
      </div>
    `;

    // Toggle complete
    li.querySelector('.task-check').addEventListener('click', () => toggleComplete(task.id, !task.completed));

    // Edit
    li.querySelector('.btn-edit').addEventListener('click', () => startEdit(li, task));

    // Delete
    li.querySelector('.btn-delete').addEventListener('click', () => handleDelete(task.id));

    list.appendChild(li);
  });
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

async function toggleComplete(id, completed) {
  const json = await updateTask(id, { completed });
  if (json.success) {
    const task = allTasks.find(t => t.id === id);
    if (task) task.completed = completed;
    renderTasks();
    updateStats();
  }
}

function startEdit(li, task) {
  const titleSpan = li.querySelector('.task-title');
  const actions = li.querySelector('.task-actions');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = task.title;
  input.dataset.testid = `edit-input-${task.id}`;

  titleSpan.replaceWith(input);
  actions.innerHTML = `
    <button class="btn-edit" data-testid="save-edit-${task.id}" title="Salvar" style="background:var(--success);color:#fff">✓</button>
    <button class="btn-delete" data-testid="cancel-edit-${task.id}" title="Cancelar">✕</button>
  `;

  input.focus();

  const save = async () => {
    const newTitle = input.value.trim();
    if (!newTitle) return;
    const json = await updateTask(task.id, { title: newTitle });
    if (json.success) {
      const t = allTasks.find(t => t.id === task.id);
      if (t) t.title = newTitle;
      renderTasks();
    }
  };

  actions.querySelector(`[data-testid="save-edit-${task.id}"]`).addEventListener('click', save);
  actions.querySelector(`[data-testid="cancel-edit-${task.id}"]`).addEventListener('click', renderTasks);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') renderTasks(); });
}

async function handleDelete(id) {
  const json = await deleteTask(id);
  if (json.success) {
    allTasks = allTasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
  }
}

// ===== FORM =====

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('task-input');
  const errorEl = document.getElementById('form-error');
  const title = input.value.trim();

  errorEl.textContent = '';

  if (!title) {
    errorEl.textContent = 'Digite um título para a tarefa.';
    input.focus();
    return;
  }

  const json = await createTask(title);
  if (json.success) {
    allTasks.push(json.data);
    input.value = '';
    renderTasks();
    updateStats();
  } else {
    errorEl.textContent = json.message || 'Erro ao criar tarefa.';
  }
});

// ===== FILTERS =====

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ===== INIT =====

checkHealth();
fetchTasks();
