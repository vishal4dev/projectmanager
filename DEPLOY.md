# Deploy to Render - Complete Guide

## What You Need Before Starting

- **MongoDB URI** — your database connection string. If you don't have one, see Step 0 below.
- **Your code pushed to GitHub** — Render deploys from a Git repo.

---

## Step 0: Get Your MongoDB URI (Skip if you already have one)

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a new cluster (choose the free `M0` tier).
3. In the left sidebar, click **Database Access** → **Add New Database User**.
   - Choose **Password** authentication.
   - Set a username and password. **Save these somewhere**.
   - Click **Add User**.
4. In the left sidebar, click **Network Access** → **Add IP Address**.
   - Click **Allow Access from Anywhere** (button on the top right).
   - Click **Confirm**.
5. In the left sidebar, click **Database** → click **Connect** on your cluster.
   - Choose **Drivers**.
   - Select **Node.js** and copy the connection string.
   - It looks like this:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the credentials you created in step 3.
   - **Save this final string.** This is your `MONGO_URI`.

---

## Step 1: Push This Code to GitHub

Make sure all changes (including `render.yaml`, `package.json`, `DEPLOY.md`, and the code changes) are committed and pushed to your GitHub repo.

```bash
git add .
git commit -m "Setup for Render deployment"
git push origin main
```

---

## Step 2: Create Your Render Account

1. Go to [https://render.com](https://render.com) and sign up (you can use GitHub login).
2. Verify your email if asked.

---

## Step 3: Deploy Using the Blueprint (Easiest Way)

1. On your Render dashboard, click the **New +** button (top right).
2. Select **Blueprint**.
3. Connect your **GitHub** account if you haven't already.
4. Find and select your repo (`akashproj` or whatever you named it).
5. Render will read the `render.yaml` file and show you the service it will create.
6. Click **Apply** or **Create Blueprint**.

---

## Step 4: Add the ONLY Required Environment Variable

After the Blueprint creates your service, Render will show a yellow warning that `MONGO_URI` needs a value.

1. Click the service name (`team-task-manager`) to open its page.
2. Click **Environment** on the left sidebar.
3. Find the row for `MONGO_URI`. It will be empty.
4. Paste your MongoDB connection string from **Step 0** into the value field.
5. Click **Save Changes**.

### What Each Environment Variable Means

| Variable | Value | Who Sets It | Do You Need to Change It? |
|---|---|---|---|
| `NODE_ENV` | `production` | Render (auto) | **No** |
| `JWT_SECRET` | Auto-generated random string | Render (auto) | **No** |
| `MONGO_URI` | Your MongoDB connection string | **You** | **Yes — paste yours here** |

**That's it. You only need to add `MONGO_URI`.** The other two are already handled.

---

## Step 5: Deploy

1. Go back to your service page.
2. Click **Manual Deploy** → **Deploy latest commit**.
3. Wait for the build to finish (you can watch the logs).
4. Once you see `Your service is live`, click the URL at the top (looks like `https://team-task-manager-xxxx.onrender.com`).

Both your frontend and backend are now live on that **single URL**.

---

## How It Works

- When you visit your Render URL, the **backend Express server** serves the built React frontend.
- All API calls (`/api/auth`, `/api/projects`, `/api/tasks`) go to the same server.
- You do **not** need two separate Render services or two URLs.

---

## Troubleshooting

### "MongoDB connection error"
- Double-check your `MONGO_URI` in Render Environment settings.
- Make sure you replaced `<username>` and `<password>` with actual values.
- Make sure you whitelisted all IPs in MongoDB Atlas Network Access.

### "Page not found" when refreshing a page
- This should not happen with the current setup, but if it does, make sure the `app.get('*', ...)` line exists in `backend/server.js` after the API routes.

### Build fails
- Check the Render logs. Common issues are:
  - `node_modules` not found → the build command should have installed them.
  - Syntax error → make sure your code is pushed correctly.

---

## Updating Your App Later

Just push changes to GitHub and click **Manual Deploy → Deploy latest commit** on Render, or enable **Auto-Deploy** in your service settings so Render redeploys on every push.
