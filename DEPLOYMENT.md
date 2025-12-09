# Deployment Guide for InsDow

Since we have "Dockerized" the application, deploying it is very easy. You have 3 main options depending on your budget and technical skills.

## Option 1: The Easy Way (Render / Railway) - Free Tier Available
These services automatically detect your `Dockerfile` and build it for you.

### Instructions:
1.  **Push your code to GitHub**. (Create a repo and push this folder).
2.  **Sign up** for [Render.com](https://render.com) or [Railway.app](https://railway.app).
3.  Click **"New Web Service"**.
4.  Connect your GitHub repo.
5.  **Render/Railway** will see the `Dockerfile`.
6.  Click **Deploy**.
7.  **Done!** They give you a URL like `https://insdow.onrender.com`.

*Note: The free tiers might be slow for video processing, but it will work.*

---

## Option 2: The Professional Way (VPS - AWS/DigitalOcean) - ~$5/mo
This gives you full control and is better for "scaling".

### Prerequisites:
-   A server (Ubuntu 22.04) from AWS EC2, DigitalOcean Droplet, or Linode.
-   Docker installed on that server.

### Instructions:
1.  **SSH into your server**:
    ```bash
    ssh root@your-server-ip
    ```
2.  **Clone your code**:
    ```bash
    git clone https://github.com/your-username/insdow.git
    cd insdow
    ```
3.  **Run with Docker Compose**:
    ```bash
    docker compose up -d --build
    ```
4.  **Done!** Your app is running at `http://your-server-ip:3000`.

---

## Option 3: The "Serverless" Way (Not Recommended yet)
Services like **Vercel** or **AWS Lambda** are great for websites, but **BAD** for this specific app.
*   **Why?** This app requires `ffmpeg` (a heavy binary) + long-running processing (streaming video). Serverless functions have time limits (10-30 seconds) and file size limits that will break your downloads.

**Stick to Option 1 or 2 for Video Downloaders.**
