# 3W Full Stack Internship Assignment - Mini Social Post App

A full-stack social feed inspired by the TaskPlanet social experience. Users can create accounts, log in, share text or image posts, like posts, comment, and browse a public feed.

## Tech Stack

- Frontend: React.js + Vite + Basic CSS
- Backend: Node.js + Express
- Database: MongoDB with exactly two collections: `users` and `posts`
- Auth: JWT + bcrypt password hashing

## Folder Structure

```text
backend/
  src/
    middleware/
    models/
    routes/
frontend/
  src/
```

## Features

- Signup and login with email/password
- Public feed with all users' posts
- Create posts with text, image, or both
- Like/unlike posts with liker usernames stored
- Add comments with commenter usernames stored
- Instant UI updates after likes and comments
- Responsive mobile-first layout
- Basic pagination on the feed API and UI

## Local Setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` if your backend is not running on `http://localhost:5000`.

## Deployment Notes

- Deploy `frontend` to Vercel or Netlify.
- Deploy `backend` to Render.
- Use MongoDB Atlas for `MONGODB_URI`.
- Set `CLIENT_URL` on Render to the deployed frontend URL.
- Set `VITE_API_URL` on Vercel/Netlify to the deployed Render backend URL.
