# How to Deploy for FREE (No Domain, No DigitalOcean)

The best way to deploy this `Docker` application for free is sending it to **Render.com**.
They give you a free HTTPS URL (like `https://insdow-app.onrender.com`).

## Prerequisites
1.  Your code must be on **GitHub**. (You already did `git push`!)

## Step-by-Step Guide

### 1. Create a Render Account
1.  Go to [dashboard.render.com/register](https://dashboard.render.com/register).
2.  Sign up using **GitHub** (This makes it easier).

### 2. Create a "Web Service"
1.  Click the blue button **"New +"** and select **"Web Service"**.
2.  Select **"Build and deploy from a Git repository"**.
3.  Find your `insdow` repository in the list and click **"Connect"**.

### 3. Configure the Deployment
Render will detect your Dockerfile automatically, but check these settings:

*   **Name**: `insdow-app` (This will become `insdow-app.onrender.com`).
*   **Region**: Singapore or Frankfurt (Choose closest to you).
*   **Branch**: `main`.
*   **Runtime**: Select **Docker** (Critical Step).
*   **Instance Type**: Select **Free**.

### 4. Environment Variables (Important)
We need to tell the server which port to listen on, although our Docker setup is smart, it's good to be safe.
1.  Scroll down to **"Advanced"**.
2.  Click **"Add Environment Variable"**.
3.  Key: `PORT`
4.  Value: `10000` (Render likes port 10000, our code adapts to `process.env.PORT`).

### 5. Deploy!
1.  Click **"Create Web Service"**.
2.  You will see a terminal window showing log lines like:
    *   `Step 1/8 : FROM node:18-alpine`
    *   `Step 5/8 : RUN npm install`
3.  Wait about 3-5 minutes.
4.  Once it says **"Live"**, click the URL at the top left.

### 🎉 Success!
You now have a running website accessible by anyone in the world, completely free, with no domain setup required.
