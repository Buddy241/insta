# How to Deploy on DigitalOcean using Docker Compose

This guide will take you from "Zero" to "Live" on DigitalOcean.

## Phase 1: Create the Server (Droplet)

1.  Log in to your **DigitalOcean Dashboard**.
2.  Click **Create** -> **Droplets**.
3.  **Choose Region**: Pick the one closest to you (e.g., New York, Bangalore, London).
4.  **Choose Image**:
    *   Click the tab **"Marketplace"**.
    *   Search for **"Docker"**.
    *   Select **"Docker on Ubuntu 22.04"**.
    *   *Why? This comes with Docker & Docker Compose already installed. Huge time saver.*
5.  **Choose Size**: The **$6/month** (Basic Droplet) is fine for starting.
6.  **Authentication**:
    *   Choose **Password** (easier) or **SSH Key** (more secure).
7.  Click **Create Droplet**.

---

## Phase 2: Connect to the Server

1.  Wait for the IP address to appear (e.g., `164.90.123.45`).
2.  Open your computer's terminal (Command Prompt).
3.  Type this command (replace with your IP):
    ```bash
    ssh root@164.90.123.45
    ```
4.  Type "yes" to accept the fingerprint.
5.  Enter the password you created in Phase 1.
    *   *Note: You won't see the characters while typing. Just type and hit Enter.*

---

## Phase 3: Get Your Code on the Server

You have two ways to do this.

### Method A: Git (Recommended)
If your code is on GitHub:
1.  Run inside the server:
    ```bash
    git clone https://github.com/YOUR_USERNAME/insdow.git
    cd insdow
    ```

### Method B: Upload Manually (SCP)
If you don't use Git, run this *from your computer* (not the server) to upload the whole folder:
```bash
scp -r /Users/rishikesavan/insdow root@164.90.123.45:/root/insdow
```
Then go back to the server terminal:
```bash
cd insdow
```

---

## Phase 4: Launch! (The "Compose" Part)

Now you are inside the `insdow` folder on the server.

1.  **Build and Run**:
    ```bash
    docker compose up -d --build
    ```
    *   `up`: Start the app.
    *   `-d`: Detached mode (Runs in background so it stays on when you close the window).
    *   `--build`: Forces it to build your Dockerfile.

2.  **Verify**:
    Type:
    ```bash
    docker compose ps
    ```
    You should see status **"Up"**.

3.  **Visit your site**:
    Open your browser and go to:
    `http://164.90.123.45:3000`

---

## Phase 5: Troubleshooting
If you can't access port 3000, the firewall might be blocking it. Run this command on the server:
```bash
ufw allow 3000
```
Then try again.
