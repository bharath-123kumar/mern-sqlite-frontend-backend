# mern-sqlite-frontend-backend

# MERN (SQLite) Fullstack Project

Fullstack project with:
- Backend: Node.js + Express + SQLite (JWT auth, bcrypt)
- Frontend: React + Vite
- Roles: admin, student
- Admin can CRUD students, Student can view/update own profile.

## Run locally

### Backend
```bash
cd backend
npm install
# create .env with:
# PORT=5000
# JWT_SECRET=your_secret_here
# JWT_EXPIRES_IN=7d
npm run dev
