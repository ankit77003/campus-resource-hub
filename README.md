# Campus Resource Hub

Platform for students to upload and access notes, previous-year papers (PYQ), and assignments.

## Tech

- Frontend: React (minimal UI)
- Backend: Node.js + Express (MVC)
- Database: MongoDB (Mongoose)
- Auth: JWT
- Uploads: Multer (stored locally in `backend/uploads/`)

## Features

- **Authentication**: Signup/Login (JWT)
- **Upload resource**: title, subject, semester, type + file upload
- **Browse + filters**: subject/semester/type
- **Search**: by title or subject
- **View/Download**: open in browser or download
- **Rating**: upvote/downvote per resource

## Folder structure

- `backend/`
  - `src/controllers/`
  - `src/models/`
  - `src/routes/`
  - `src/middleware/`
  - `uploads/`
- `frontend/`
  - `src/pages/` (`Login`, `Upload`, `Browse`)
  - `src/lib/` (api + auth helpers)

## Setup

### 1) MongoDB

Run MongoDB locally (example):

- `mongodb://127.0.0.1:27017/campus_resource_hub`

### 2) Backend

```bash
cd CampusResourceHub/backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:4001`.

### 3) Frontend

```bash
cd CampusResourceHub/frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API overview

Base URL: `http://localhost:4001`

- `POST /api/auth/signup` body: `{ email, password }`
- `POST /api/auth/login` body: `{ email, password }`

- `GET /api/resources` (filters: `subject`, `semester`, `type`)
- `GET /api/resources/search?q=...`
- `GET /api/resources/:id`
- `GET /api/resources/:id/view`
- `GET /api/resources/:id/download`
- `POST /api/resources` (auth, multipart form-data with `file`)
- `POST /api/resources/:id/vote` (auth) body: `{ direction: "up" | "down" }`

## Development (step-by-step)

You asked for step-by-step generation:

1. Folder structure ✅
2. Backend (Express + MongoDB + JWT + Multer) ✅
3. Frontend (React pages: Login, Upload, Browse) ✅

