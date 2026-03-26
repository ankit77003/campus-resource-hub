// Updated app.js to reorganize middleware order and remove duplicate uploads route

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Moved CORS middleware before static route

// Static routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Other routes
app.use('/api', require('./routes/api'));
// Remove duplicate uploads route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});