# 🏛️ AI-Based Smart Complaint Management System

A full-stack MERN application with AI-powered complaint analysis using OpenRouter API.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| AI | OpenRouter API (Mistral-7B free model) |
| Auth | JWT + bcrypt |
| Deployment | Render.com |

---

## 📁 Project Structure

```
complaint-management/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Business logic (auth, complaint, AI)
│   ├── middleware/     # JWT auth, error handler
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── .env.example    # Environment variable template
│   ├── package.json
│   └── server.js       # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Reusable components (Navbar)
        ├── context/    # Auth context
        ├── pages/      # All page components
        ├── services/   # Axios API service
        ├── App.js
        └── index.js
```

---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/complaint-management.git
cd complaint-management
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Copy env template and fill in your values
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<any random secret string>
OPENROUTER_API_KEY=<your OpenRouter API key>
NODE_ENV=development
```

Start the backend:
```bash
npm run dev       # development (nodemon)
npm start         # production
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

Start the frontend:
```bash
npm start
```

App runs at: **http://localhost:3000**

---

## 🌐 API Endpoints

### Auth
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | /api/auth/signup | Register user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Private |

### Complaints
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | /api/complaints | Add complaint | Public |
| GET | /api/complaints | Get all complaints | Private |
| GET | /api/complaints/:id | Get one complaint | Private |
| PUT | /api/complaints/:id | Update status | Admin |
| DELETE | /api/complaints/:id | Delete complaint | Admin |
| GET | /api/complaints/search?location=Ghaziabad | Search by location | Private |

### AI
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | /api/ai/analyze | Analyze complaint with AI | Private |

---

## 🍃 MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free account → New Project → Build a Database (Free M0)
3. Choose a region → Create
4. Set username & password → Add your IP (or 0.0.0.0/0 for all)
5. Click **Connect** → **Connect your application**
6. Copy the connection string, replace `<password>` with your password
7. Paste it as `MONGO_URI` in your `.env`

---

## 🤖 OpenRouter API Setup

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Sign up with Google/GitHub
3. Go to **Keys** → **Create Key**
4. Copy the key → paste as `OPENROUTER_API_KEY` in your `.env`
5. Free models available: `mistralai/mistral-7b-instruct:free`

---

## 🚢 Deployment on Render

### Backend Deployment
1. Go to [https://render.com](https://render.com) → Sign up
2. New → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: complaint-management-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables (same as .env):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENROUTER_API_KEY`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your frontend URL (after deploying frontend)
6. Click **Create Web Service**
7. Copy the backend URL (e.g. `https://complaint-backend.onrender.com`)

### Frontend Deployment
1. New → **Static Site**
2. Connect your GitHub repo
3. Configure:
   - **Name**: complaint-management-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://complaint-backend.onrender.com/api`
5. Click **Create Static Site**

---

## 🔐 Git & GitHub

```bash
# Initialize git in the project root
git init
git add .
git commit -m "feat: initial MERN complaint management system with AI"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/complaint-management.git
git branch -M main
git push -u origin main
```

### Commit Convention
```bash
git commit -m "feat: add complaint registration form"
git commit -m "fix: resolve JWT token expiry issue"
git commit -m "docs: update README with deployment steps"
git commit -m "style: improve dashboard UI"
```

---

## ✅ Test Cases

### Backend (use Postman or Thunder Client)

**Add Complaint:**
```json
POST /api/complaints
{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "title": "Water Leakage Issue",
  "description": "Water pipeline damaged near market area.",
  "category": "Water Supply",
  "location": "Ghaziabad"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Frontend Test Cases
| Action | Expected Result |
|--------|----------------|
| Submit complaint form | Complaint saved, redirected to detail page |
| Filter by category | Filtered complaints shown |
| Search by location | Matching complaints displayed |
| Run AI Analysis | Priority, department, summary, response shown |
| Admin update status | Status changed and reflected |
| Delete complaint (admin) | Complaint removed from list |

---

## 👨‍💻 Author

Built as part of MERN Stack Case Study - AI-Based Smart Complaint Management System.
