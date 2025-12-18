const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Подключение к MongoDB (адрес берем из переменной окружения или локально)
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/todos';
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Схема данных
const Todo = mongoose.model('Todo', { text: String, done: Boolean });

// 1. GET /todos - Получить все
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 2. POST /todos - Создать
app.post('/todos', async (req, res) => {
  const todo = new Todo({ text: req.body.text, done: false });
  await todo.save();
  res.json(todo);
});

// 3. GET /todos/:id - Получить одно
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
  } catch (e) { res.status(404).send('Not found'); }
});

// 4. PUT /todos/:id - Обновить
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (e) { res.status(500).send(e.message); }
});

// 5. DELETE /todos/:id - Удалить
app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).send(e.message); }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});