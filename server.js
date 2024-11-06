require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for the requests
    app.listen(process.env.PORT, () => {
      console.log('Connected to Database and listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Import routes
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require("./routes/todoRoutes");


// Use routes
app.use('/api/user/', userRoutes);
app.use("/api/todo", todoRoutes);