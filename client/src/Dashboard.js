import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    positive: 0,
    negative: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortByRating, setSortByRating] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  useEffect(() => {
    fetchData();
    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [feedbacksRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/feedback`),
        fetch(`${API_URL}/api/stats`)
      ]);

      if (!feedbacksRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const feedbacksData = await feedbacksRes.json();
      const statsData = await statsRes.json();

      setFeedbacks(feedbacksData);
      setStats(statsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data. Please check your connection.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleSortByRating = () => {
    if (!sortByRating) {
      setSortByRating(true);
      setSortOrder('desc'); // Start with highest first
    } else {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    }
  };

  const sortedFeedbacks = sortByRating 
    ? [...feedbacks].sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.rating - a.rating; // Highest first
        } else {
          return a.rating - b.rating; // Lowest first
        }
      })
    : feedbacks; // Keep original order (by date) when not sorting by rating

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Feedback Management Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Analytics Cards */}
      <div className="analytics-cards">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Feedbacks</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.avgRating.toFixed(1)}</div>
          <div className="stat-label">Average Rating</div>
        </div>

        <div className="stat-card positive">
          <div className="stat-icon">👍</div>
          <div className="stat-value">{stats.positive}</div>
          <div className="stat-label">Positive (4+)</div>
        </div>

        <div className="stat-card negative">
          <div className="stat-icon">👎</div>
          <div className="stat-value">{stats.negative}</div>
          <div className="stat-label">Negative (&lt;3)</div>
        </div>
      </div>

      {/* Feedbacks Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Feedbacks</h2>
          {feedbacks.length > 0 && (
            <button className="sort-btn" onClick={handleSortByRating}>
              {sortByRating 
                ? `Sort by Rating ${sortOrder === 'desc' ? '↓' : '↑'}`
                : 'Sort by Rating'}
            </button>
          )}
        </div>
        {feedbacks.length === 0 ? (
          <div className="no-data">No feedbacks yet. Submit some feedback to see them here!</div>
        ) : (
          <table className="feedbacks-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {sortedFeedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.name}</td>
                  <td>{feedback.email}</td>
                  <td className="rating-cell">
                    <span className="stars">{renderStars(feedback.rating)}</span>
                    <span className="rating-number">({feedback.rating})</span>
                  </td>
                  <td className="message-cell">{feedback.message}</td>
                  <td>{formatDate(feedback.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

