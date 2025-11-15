# Feedback Form Website

A simple feedback form built with React (frontend) and Express/Node.js (backend). No database required - feedback is stored in a JSON file.

## Features

- Clean and modern UI
- Form validation
- Responsive design
- RESTful API
- JSON file storage (no database needed)

## Project Structure

```
.
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── index.js
│   ├── data/        # JSON file storage
│   └── package.json
└── README.md
```

## Local Development

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm start
```

The app will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

