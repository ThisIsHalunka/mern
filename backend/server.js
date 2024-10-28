const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

// Define a schema and model
const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
});
const Todo = mongoose.model('Todo', todoSchema);

// CRUD routes
app.post('/api/todos', async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        completed: false,
    });
    await newTodo.save();
    res.json(newTodo);
});

app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.put('/api/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
    );
    res.json(updatedTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
