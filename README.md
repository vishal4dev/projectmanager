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

### Backend Deployment

1. **Create a new project on Railway**
   - Go to Railway and click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

2. **Configure MongoDB**
   - Add a MongoDB service from Railway marketplace
   - Or use MongoDB Atlas and get your connection string
   - Set `MONGO_URI` environment variable in Railway settings

3. **Set Environment Variables**
   In Railway project settings, add:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: 5000 (Railway will auto-assign if not set)

4. **Backend Service**
   - Railway will automatically detect the backend from the `backend/` directory
   - It will use the `Procfile` to start the server

### Frontend Deployment

1. **Add Frontend Service**
   - In your Railway project, click "New Service"
   - Select "GitHub Repo" and choose the same repository
   - Set the root directory to `frontend`

2. **Set Environment Variables**
   - `REACT_APP_API_URL`: Your backend Railway URL (e.g., https://your-backend.railway.app)

3. **Frontend Service**
   - Railway will build the React app using the build script
   - It will serve the static files using serve

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Railway
3. Railway will automatically deploy both services
4. Monitor the deployment logs in Railway dashboard
5. Once deployed, Railway will provide URLs for both services

### Important Notes

- Railway automatically handles SSL/HTTPS
- Both services will have auto-generated URLs
- You can set custom domains in Railway settings
- MongoDB can be added as a Railway service or use MongoDB Atlas
- The frontend `REACT_APP_API_URL` must be updated with the actual backend URL after deployment
