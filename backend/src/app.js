// Updated app.js to fix the static file serving order and remove duplicate uploads route

const express = require('express');
const path = require('path');

const app = express();

// Serve static files in the correct order
app.use(express.static(path.join(__dirname, 'public')));

// Remove duplicate uploads route
app.post('/uploads', (req, res) => {
    // Handle file uploads
});

// Further routes and middleware

module.exports = app;