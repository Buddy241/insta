# Low-Level Design (LLD) - InsDow

This document explains how the **InsDow** application works, breaking down the code line-by-line in simple terms.

## 1. High-Level Concept
Think of this application like a **Restaurant**:
1.  **Frontend (The Waiter)**: You give it your order (the video link).
2.  **Backend (The Kitchen)**: It receives the order and tells the chef what to do.
3.  **yt-dlp (The Chef)**: It goes out, gets the ingredients (video data), cooks it (processes it), and gives it back to the kitchen.
4.  **Backend**: Hands the finished meal (video file) back to the waiter.
5.  **Frontend**: Serves it to you (starts the download).

---

## 2. Code Walkthrough (Line by Line)

### Backend: `server.js` (The Brains)

This file runs on the server. It listens for requests and manages the downloading.

**Setup lines:**
- `const express = ...`: Importing the web server framework (Express) to handle requests.
- `const app = express();`: Creating the actual server application.
- `const PORT = 3000;`: Deciding to open the "restaurant" on port 3000.
- `app.use(express.static(...));`: Telling the server to share the files in the `public` folder (HTML, CSS) with anyone who visits.

**The Download Handler (`/api/download`):**
This is the specific instruction for "I want to download a video".

```javascript
app.post('/api/download', async (req, res) => {
    // 1. Get the URL from the user's request
    const { url } = req.body; 

    // 2. Check if the user actually sent a URL. If not, complain.
    if (!url) { return res.status(400)... }

    try {
        // 3. Get Video Info
        // asking the tool "What is the title of this video?"
        const metadata = await ytDlpWrap.getVideoInfo(url);
        
        // 4. Create a Filename
        // "Funny Cat.mp4" (replacing spaces/bad characters with underscores)
        const filename = `${metadata.title}.mp4`;
        const safeFilename = filename.replace(/[^a-z0-9.]/gi, '_');

        // 5. Prepare the Headers
        // "Content-Disposition" tells the browser: "The file is named X, treat it as a download."
        res.setHeader('Content-Disposition', contentDisposition(safeFilename));
        res.setHeader('Content-Type', 'video/mp4');

        // 6. Start the Download Stream
        // We connect a pipe from the download tool directly to the user.
        // As soon as the server gets a piece of the video, it sends it to the user.
        // We don't save the whole file to disk first (this saves space and time).
        const readableStream = ytDlpWrap.execStream([
            url, 
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' // Get the best quality
        ]);
        
        readableStream.pipe(res); // Connect the pipe!

    } catch (error) {
        // If something breaks, tell the user "Sorry, we failed".
        res.status(500).json({ error: 'Failed' });
    }
});
```

---

### Frontend: `public/app.js` (The Interface)

This file runs in your browser. It handles button clicks and showing messages.

```javascript
document.getElementById('downloadBtn').addEventListener('click', async () => {
    // 1. Get the text you typed in the input box
    const url = document.getElementById('urlInput').value;

    // 2. Send it to our Backend (The Server)
    const response = await fetch('/api/download', {
        method: 'POST',
        body: JSON.stringify({ url })
    });

    // 3. Handle the Response (The File)
    // We get the raw data (blob) and create a fake temporary link in the browser
    const blob = await response.blob(); 
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // 4. Trigger the Download
    // We secretly verify the filename, create an invisible link, click it, and remove it.
    const a = document.createElement('a'); 
    a.href = downloadUrl;
    a.download = 'video.mp4'; // (We try to get the real name from headers)
    a.click();
});
```

---

## 3. Why is it "Slow"?

Currently, you might be experiencing slowness because:
1.  **FFmpeg is missing**: Without this helper tool, `yt-dlp` cannot merge the best video and audio streams efficiently. It might be falling back to a slower, single-file format which is hosted on a slower server.
2.  **Streaming**: The server downloads the file *while* sending it to you. If the source website (like Instagram) is slow, your download will be slow.
3.  **Network**: We are downloading a large `ffmpeg` file in the background right now to fix issue #1. Once that finishes, downloads should be much faster and higher quality.
