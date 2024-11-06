const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

// Middleware to extract user from JWT token
const getUserFromToken = (token) => {
    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id; // Assuming 'id' is the field in your JWT payload
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Create a new Todo
const createTodo = async (req, res) => {
    const { title, text, completed } = req.body; // Include completed here
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        // Get user ID from the JWT token
        const userId = getUserFromToken(token);

        // Validate required fields
        if (!title || !text || completed === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const todo = new Todo({
            user: userId,
            title,
            text,
            completed, 
        });

        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ message: 'Error creating todo' });
    }
};

// Get all Todos for a user
const getTodos = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        // Get user ID from the JWT token
        const userId = getUserFromToken(token);

        const todos = await Todo.find({ user: userId });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a Todo
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, text, completed } = req.body; // Include text in the update process
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        // Get user ID from the JWT token
        const userId = getUserFromToken(token);

        // Ensure that at least one field to update is provided
        if (!title && !text && completed === undefined) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const todo = await Todo.findOneAndUpdate(
            { _id: id, user: userId }, // Ensure that the Todo belongs to the current user
            { title, text, completed },
            { new: true } // Return the updated todo
        );
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(400).json({ message: 'Error updating todo' });
    }
};

// Delete a Todo
const deleteTodo = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        // Get user ID from the JWT token
        const userId = getUserFromToken(token);

        const todo = await Todo.findOneAndDelete({ _id: id, user: userId }); // Ensure that the Todo belongs to the current user
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(204).send(); // Successfully deleted
    } catch (error) {
        res.status(400).json({ message: 'Error deleting todo' });
    }
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
