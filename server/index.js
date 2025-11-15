const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'feedback.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read feedback
const readFeedback = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write feedback
const writeFeedback = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Routes

// Get all feedback
app.get('/api/feedback', (req, res) => {
  try {
    const feedback = readFeedback();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Submit new feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const feedback = readFeedback();
    const newFeedback = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    feedback.push(newFeedback);
    writeFeedback(feedback);

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback: newFeedback 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

