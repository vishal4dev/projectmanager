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

## Railway Deployment

### Prerequisites
- Railway account (https://railway.app)
- MongoDB Atlas account (for cloud database)

### Deployment Steps

1. **Push your code to GitHub** (if not already done)

2. **Create Railway Project**
   - Go to Railway and click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Deploy Backend Service**
   - Click "New Service" → "GitHub Repo"
   - Select the same repository
   - **Important**: Set "Root Directory" to `backend`
   - Railway will detect Node.js and use the Dockerfile
   - Add MongoDB service from Railway marketplace (or use MongoDB Atlas)
   - Set environment variables in Railway settings:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Generate a secure random string
     - `PORT`: 5000 (Railway will auto-assign if not set)

4. **Deploy Frontend Service**
   - Click "New Service" → "GitHub Repo"
   - Select the same repository
   - **Important**: Set "Root Directory" to `frontend`
   - Set environment variable:
     - `REACT_APP_API_URL`: Your backend Railway URL (e.g., https://your-backend.railway.app)
   - Railway will build the React app and serve it

5. **Monitor Deployment**
   - Watch the deployment logs in Railway dashboard
   - Railway will provide URLs for both services once deployed

### Important Notes

- Railway automatically handles SSL/HTTPS
- Both services will have auto-generated URLs
- You can set custom domains in Railway settings
- The frontend `REACT_APP_API_URL` must be updated with the actual backend URL after deployment
- Each service needs its own Railway service with the correct root directory configured

