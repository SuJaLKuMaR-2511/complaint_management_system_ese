# AI-Based Smart Complaint Management System

Full-stack MERN project for complaint registration, tracking, and AI-based complaint analysis.

## Live Links

- Frontend: https://complaint-management-system-ese-1.onrender.com
- Backend API: https://complaint-management-system-ese.onrender.com/api
- GitHub Repo: https://github.com/SuJaLKuMaR-2511/complaint_management_system_ese

Note: Replace the GitHub link above with your actual repository URL before final submission.

## Project Overview

This system allows citizens to submit civic complaints (water, electricity, sanitation, roads, etc.), and allows admins to manage status updates.  
AI analysis (via OpenRouter) provides:

- Priority (`Low`, `Medium`, `High`, `Critical`)
- Responsible department
- Complaint summary
- Suggested auto-response

## Tech Stack

- Frontend: React 18, React Router v6, Axios, Context API
- Backend: Node.js, Express.js
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT + bcryptjs
- AI: OpenRouter API
- Deployment: Render

## Project Structure

```text
complaint-management/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── README.md
└── README_.md
```

## API Endpoints

### Auth (`/api/auth`)

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Current logged-in user (private)

### Complaints (`/api/complaints`)

- `POST /api/complaints` - Register complaint (public)
- `GET /api/complaints` - Get all complaints (private)
- `GET /api/complaints/search?location=<text>` - Search by location (private)
- `GET /api/complaints/:id` - Get single complaint (private)
- `PUT /api/complaints/:id` - Update status (admin)
- `DELETE /api/complaints/:id` - Delete complaint (admin)

### AI (`/api/ai`)

- `POST /api/ai/analyze` - Run AI analysis (private)

Request body:

```json
{
  "complaintId": "YOUR_COMPLAINT_ID"
}
```

## Local Setup (Development)

These localhost links are only for running on your machine during development:

- Frontend local: `http://localhost:3000`
- Backend local: `http://localhost:5000`

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_AUTO_MODELS=true
OPENROUTER_MODELS=openai/gpt-oss-20b:free,meta-llama/llama-3.3-8b-instruct:free,deepseek/deepseek-chat-v3-0324:free
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm start
```

## Deployment (Render)

### Backend Web Service

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `OPENROUTER_API_KEY`
- `OPENROUTER_AUTO_MODELS=true`
- `OPENROUTER_MODELS` (optional fallback)
- `FRONTEND_URL=https://complaint-management-system-ese-1.onrender.com`
- `NODE_ENV=production`

### Frontend Static Site

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

Environment variable:

- `REACT_APP_API_URL=https://complaint-management-system-ese.onrender.com/api`

## Test Cases

- Submit valid complaint -> complaint saved
- Missing required field -> validation error
- Invalid login -> authentication error
- Search by location -> filtered complaint list
- AI analyze complaint -> priority, department, summary, auto-response
- Admin updates status -> status reflected in UI and API

## Exam Submission Note

License file is typically not mandatory for end-semester submissions unless explicitly required by your faculty rubric.
