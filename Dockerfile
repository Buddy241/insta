# Use an official lightweight Node.js image as the base
# "Alpine" is a very small Linux version (5MB) which makes our container fast to download.
FROM node:18-alpine

# Update the package manager (apk) in the Linux container
# & install Python 3 and FFmpeg.
# We join commands with "&&" to save space (layers).
RUN apk update && \
    apk add --no-cache python3 py3-pip ffmpeg

# Create a directory inside the container called "/app"
# This is where our project code will live.
WORKDIR /app

# Copy the file "package.json" from your computer to the container
# We copy this FIRST so Docker can cache the "npm install" step if code changes but dependencies don't.
COPY package.json ./

# Run "npm install" inside the container to download express, yt-dlp-wrap, etc.
RUN npm install

# Copy ALL the rest of your files (server.js, public/, etc.) into the container
COPY . .

# Download the yt-dlp binary specifically for Linux (since Docker runs Linux)
# We put it in the /app folder and make it executable (+x).
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /app/yt-dlp && \
    chmod +x /app/yt-dlp

# Tell Docker that this app listens on port 3000
# This is just for documentation; you still need to map the port when running.
EXPOSE 3000

# The command to start the application when the container launches
# "node server.js"
CMD ["node", "server.js"]
