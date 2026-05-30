const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory task storage
let tasks = [
  { id: 1, title: 'Estudar para a prova', completed: false },
  { id: 2, title: 'Fazer o trabalho da Unidade IV', completed: false },
  { id: 3, title: 'Revisar conteúdo de Engenharia de Software', completed: true },
];
let nextId = 4;

// GET /api/tasks - list all tasks
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, data: tasks });
});

// GET /api/tasks/:id - get a single task
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
  res.json({ success: true, data: task });
});

// POST /api/tasks/reset - reset tasks (for testing)
// IMPORTANT: must be declared BEFORE POST /api/tasks to avoid route conflict
app.post('/api/tasks/reset', (req, res) => {
  tasks = [
    { id: 1, title: 'Estudar para a prova', completed: false },
    { id: 2, title: 'Fazer o trabalho da Unidade IV', completed: false },
    { id: 3, title: 'Revisar conteúdo de Engenharia de Software', completed: true },
  ];
  nextId = 4;
  res.json({ success: true, message: 'Tarefas resetadas' });
});

// POST /api/tasks - create a task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Título é obrigatório' });
  }
  const task = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(task);
  res.status(201).json({ success: true, data: task });
});

// PUT /api/tasks/:id - update a task
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });

  const { title, completed } = req.body;
  if (title !== undefined) tasks[idx].title = title.trim();
  if (completed !== undefined) tasks[idx].completed = completed;

  res.json({ success: true, data: tasks[idx] });
});

// DELETE /api/tasks/:id - delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });

  tasks.splice(idx, 1);
  res.json({ success: true, message: 'Tarefa removida com sucesso' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API está funcionando!' });
});

module.exports = app;
