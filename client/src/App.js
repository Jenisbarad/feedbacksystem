import React, { useState } from 'react';
import './App.css';
import Dashboard from './Dashboard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Thank you for your feedback! We appreciate it.' 
        });
        setFormData({ name: '', email: '', message: '', rating: 5 });
        // Switch to dashboard after 2 seconds
        setTimeout(() => {
          setActiveTab('dashboard');
        }, 2000);
      } else {
        setStatus({ 
          type: 'error', 
          message: data.error || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Failed to submit feedback. Please check your connection.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="App">
      <div className="container">
        {/* Navigation Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            📝 Submit Feedback
          </button>
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
        </div>

        {/* Form View */}
        {activeTab === 'form' && (
          <div className="form-wrapper">
            <h1>Feedback Form</h1>
            <p className="subtitle">We'd love to hear from you!</p>
            
            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating * (1-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  placeholder="Enter rating (1-5)"
                  className="rating-number-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Enter your feedback or message"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && <Dashboard />}
      </div>
    </div>
  );
}

export default App;
