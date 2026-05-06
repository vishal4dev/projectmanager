# Team Task Manager

A full-stack web application for managing team tasks with role-based access control.

## Features

- User authentication (Signup/Login)
- Project creation and management
- Task assignment and status tracking
- Dashboard with task overview and overdue alerts
- Role-based access (Admin/Member)

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Axios
- **Authentication**: JWT, bcrypt

## Setup

1. Install dependencies for backend and frontend:

   ```
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. Start MongoDB (ensure it's running on localhost:27017 or update MONGO_URI in .env)

3. Start the backend:

   ```
   cd backend
   npm run dev
   ```

4. Start the frontend:

   ```
   cd frontend
   npm start
   ```

5. Open http://localhost:3000 in your browser.

## API Endpoints

- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/projects - Get user's projects
- POST /api/projects - Create project (Admin)
- GET /api/tasks/project/:id - Get tasks for project
- POST /api/tasks - Create task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

## Environment Variables

Create a .env file in backend directory:

```
MONGO_URI=mongodb://localhost:27017/teamtaskmanager
JWT_SECRET=your_jwt_secret
PORT=5000
```
