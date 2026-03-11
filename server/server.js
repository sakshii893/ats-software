const express = require('express');
const cors = require('cors');
const path = require('path');
const resumeRoutes = require('./routes/resume');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from generated directory
app.use('/generated', express.static(path.join(__dirname, 'generated')));

// Routes
app.use('/api', resumeRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});