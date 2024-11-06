const mongoose = require('mongoose');

// Define the Todo schema
const todoSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
        title: { type: String, required: true }, // Title of the Todo
        text: { type: String, required: true }, // Text description of the Todo
        completed: { type: Boolean, required: true }, // Completion status of the Todo
    },
    { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the Todo model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
