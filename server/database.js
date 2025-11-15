const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'feedback.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    // Create table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
};

// Get database instance
let dbInstance = null;

const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
};

// Helper functions
const getAllFeedbacks = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      db.all('SELECT * FROM feedbacks ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const addFeedback = (name, email, message, rating) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      db.run(
        'INSERT INTO feedbacks (name, email, message, rating) VALUES (?, ?, ?, ?)',
        [name, email, message, rating],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, email, message, rating });
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

const getStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      db.all(`
        SELECT 
          COUNT(*) as total,
          AVG(rating) as avgRating,
          SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as positive,
          SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) as negative
        FROM feedbacks
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const stats = rows[0];
          resolve({
            total: stats.total || 0,
            avgRating: stats.avgRating ? parseFloat(stats.avgRating.toFixed(2)) : 0,
            positive: stats.positive || 0,
            negative: stats.negative || 0
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getDatabase,
  getAllFeedbacks,
  addFeedback,
  getStats
};

