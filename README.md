# 🚀 Campus Resource Hub

A full-stack platform for students to upload, share, and access academic resources such as notes, previous-year papers (PYQs), and assignments.

Designed and deployed as a production-ready application with separate frontend and backend services.

## 🎯 Why This Project?

- Implements real-world file upload and management using Multer
- Demonstrates MVC architecture in backend design
- Supports search, filtering, and voting features
- Handles authentication and protected routes using JWT

## 🔗 Live Demo

- 🌐 Frontend: https://campus-resource-hub-five.vercel.app/login

- ⚙️ Backend API: https://campus-resource-hub-7lut.onrender.com


## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express.js (MVC Architecture)
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **File Uploads:** Multer
  

## ✨ Features

- 🔐 User authentication (Signup/Login with JWT)
- 📤 Upload resources (notes, PYQs, assignments)
- 🔍 Search resources by title or subject
- 🎯 Filter by subject, semester, and type
- 📥 View and download uploaded files
- 👍 Voting system (upvote/downvote)
- 📦 Structured backend using MVC pattern
  

## 📁 Project Structure

- `backend/`
  - `src/controllers/`
  - `src/models/`
  - `src/routes/`
  - `src/middleware/`
  - `uploads/`
    
- `frontend/`
  - `src/pages/` (`Login`, `Upload`, `Browse`)
  - `src/lib/`
 
## Screenshots

### Login Page

<img width="1216" height="559" alt="Screenshot 2026-03-27 at 7 28 31 PM" src="https://github.com/user-attachments/assets/083c26ac-bbef-4352-8c1d-d217fe716862" />

### Dashboard

<img width="1263" height="622" alt="Screenshot 2026-03-27 at 7 29 17 PM" src="https://github.com/user-attachments/assets/50e84e3b-6a85-45b3-ad65-15641be3ac5f" />


### Uploads

<img width="1263" height="622" alt="Screenshot 2026-03-27 at 7 29 17 PM" src="https://github.com/user-attachments/assets/f732efbe-635c-4e51-a418-ae993470e5ca" />



### Files

<img width="1215" height="663" alt="Screenshot 2026-03-27 at 7 29 06 PM" src="https://github.com/user-attachments/assets/7761cb82-889b-4c43-8fad-209e755094cc" />


## 🚀 Key Learnings

- Implemented secure file upload handling using Multer
- Designed scalable backend using MVC architecture
- Solved real-world deployment challenges (CORS, environment variables)
- Built efficient filtering and search functionality
  

## 📡 API Endpoints

Base URL: `https://campus-resource-hub-7lut.onrender.com`

- `POST /api/auth/signup` body: `{ email, password }`
- `POST /api/auth/login` body: `{ email, password }`

- `GET /api/resources` (filters: `subject`, `semester`, `type`)
- `GET /api/resources/search?q=...`
- `GET /api/resources/:id`
- `GET /api/resources/:id/view`
- `GET /api/resources/:id/download`
- `POST /api/resources` (auth, multipart form-data with `file`)
- `POST /api/resources/:id/vote` (auth) body: `{ direction: "up" | "down" }`
    

## ⚙️ Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🔐 Environment Variables

Backend:

- MONGO_URI
- JWT_SECRET

Frontend:

- VITE_API_BASE

