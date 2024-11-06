const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers/todoController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Protect routes with authentication
router.use(auth);

// CRUD operations for Todos
router.post('/', createTodo); // Create a new Todo
router.get('/', getTodos); // Get all Todos for the authenticated user
router.put('/:id', updateTodo); // Update a specific Todo by ID
router.delete('/:id', deleteTodo); // Delete a specific Todo by ID

module.exports = router;
