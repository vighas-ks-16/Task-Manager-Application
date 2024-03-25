const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ToDo = require('./models/todo');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to database");
    app.listen(3001, () => console.log("Server started"));
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the application in case of database connection error
  });

app.get('/todos', async (req, res) => {
  try {
    const todos = await ToDo.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post('/todo/new', async (req, res) => {
  try {
    const todo = new ToDo({
      text: req.body.text,
    });

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.delete('/todo/delete/:id', async (req, res) => {
  try {
    const result = await ToDo.findByIdAndDelete(req.params.id);
    res.json({ result });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.get('/todo/complete/:id', async (req, res) => {
  try {
    const todo = await ToDo.findById(req.params.id);
    if (!todo || todo.matchedCount === 0) {
		return res.status(404).json({ error: "Todo not found" });
	  }
	todo.complete = !todo.complete;
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Error completing todo:", error);
    res.status(500).json({ error: "Failed to complete todo" });
  }
});

app.put('/todo/update/:id', async (req, res) => {
  try {
    const todo = await ToDo.findById(req.params.id);
    todo.text = req.body.text;
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});
