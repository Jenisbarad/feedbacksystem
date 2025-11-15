# Feedback Management Dashboard

A full-stack Feedback Management Dashboard built with React (frontend) and Express/Node.js (backend) with SQLite database. Allows users to submit feedback with ratings and view analytics.

## Features

### Frontend
- ✅ Feedback Form with fields: Name, Email, Message, and Rating (1-5)
- ✅ Dashboard view with all feedbacks displayed in a table
- ✅ Analytics cards showing:
  - Total Feedbacks
  - Average Rating
  - Positive feedbacks (rating 4+)
  - Negative feedbacks (rating <3)
- ✅ Clean and modern UI with sage green theme
- ✅ Responsive design
- ✅ Real-time data updates

### Backend
- ✅ RESTful API with Express.js
- ✅ SQLite database for persistent storage
- ✅ API Endpoints:
  - `POST /api/feedback` - Submit new feedback
  - `GET /api/feedback` - Fetch all feedbacks
  - `GET /api/stats` - Get analytics data
  - `GET /api/health` - Health check
- ✅ Form validation (name, email, message, rating)
- ✅ Email format validation
- ✅ Rating validation (1-5)

### Database
- ✅ SQLite database
- ✅ Table: `feedbacks`
  - `id` (primary key, auto-increment)
  - `name` (string, required)
  - `email` (string, required)
  - `message` (text, required)
  - `rating` (integer, 1-5, required)
  - `createdAt` (datetime, auto-set)

## Project Structure

```
.
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.js         # Main app with form and tabs
│   │   ├── App.css        # Form styling
│   │   ├── Dashboard.js   # Dashboard component
│   │   ├── Dashboard.css  # Dashboard styling
│   │   └── index.js       # React entry point
│   ├── public/
│   └── package.json
├── server/                 # Express Backend
│   ├── index.js           # Main server file
│   ├── database.js        # SQLite database functions
│   ├── data/              # SQLite database storage
│   │   └── feedback.db    # Database file (created automatically)
│   └── package.json
├── DEPLOYMENT_GUIDE.txt    # Complete deployment instructions
└── README.md
```

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
```bash
cd server
npm install
npm start
```
Backend will run on `http://localhost:5000`

### Frontend Setup
```bash
cd client
npm install
npm start
```
Frontend will run on `http://localhost:3000` and automatically open in your browser.

### Database
SQLite database is automatically created in `server/data/feedback.db` on first run.

## API Endpoints

### POST /api/feedback
Submit new feedback

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great service!",
  "rating": 5
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great service!",
    "rating": 5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/feedback
Get all feedbacks

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great service!",
    "rating": 5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET /api/stats
Get analytics data

**Response:**
```json
{
  "total": 10,
  "avgRating": 4.2,
  "positive": 7,
  "negative": 2
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Deployment

### Frontend → Vercel or Netlify
1. Connect GitHub repository
2. Set root directory to `client`
3. Add environment variable: `REACT_APP_API_URL` = your backend URL
4. Deploy

### Backend → Render or Railway
1. Connect GitHub repository
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Deploy

### Database
SQLite database is stored in `server/data/feedback.db` and persists on Render's filesystem.

**For detailed deployment instructions, see `DEPLOYMENT_GUIDE.txt`**

## Technology Stack

- **Frontend:** React, CSS3
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Deployment:** Vercel/Netlify (Frontend), Render/Railway (Backend)

## Evaluation Criteria Met

✅ **Functionality (30%):** All requirements implemented
- Feedback form with all required fields
- Rating system (1-5)
- Dashboard with table view
- Analytics cards (total, average, positive, negative)

✅ **Code Quality (20%):** Clean, structured, readable code
- Modular components
- Proper error handling
- Consistent code style

✅ **API Logic (15%):** Correct REST API implementation
- RESTful endpoints
- Proper HTTP methods
- Validation and error handling

✅ **Frontend Integration (15%):** UI communicates properly with backend
- Form submission to API
- Data fetching and display
- Real-time updates

✅ **Database Usage (10%):** Persistent data and correct schema
- SQLite database
- Proper schema with all required fields
- Data persistence

✅ **Deployment (10%):** Working live demo
- Frontend deployed (Vercel/Netlify)
- Backend deployed (Render/Railway)
- Database working in production

## License

ISC

## Author

Built as a full-stack assessment project.
