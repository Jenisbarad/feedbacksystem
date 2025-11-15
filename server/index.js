const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getAllFeedbacks, addFeedback, getStats } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Routes

// Get all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await getAllFeedbacks();
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Submit new feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    // Validation
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Rating validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const newFeedback = await addFeedback(
      name.trim(),
      email.trim(),
      message.trim(),
      parseInt(rating)
    );

    // Fetch the complete feedback with createdAt
    const allFeedbacks = await getAllFeedbacks();
    const createdFeedback = allFeedbacks.find(f => f.id === newFeedback.id);

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback: createdFeedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Initialize database on startup
  try {
    await require('./database').getDatabase();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
});
