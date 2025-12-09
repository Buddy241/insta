# Backend Explanation (Line by Line)

This document breaks down `server.js`, the brain of our application.

## 1. Imports (Tools we need)
```javascript
const express = require('express'); 
// "Express" is the framework that lets us receive web requests (Input/Output).

const cors = require('cors'); 
// "Cors" (Cross-Origin Resource Sharing) is a security guard. 
// It allows other websites to talk to our server (or blocks them).

const path = require('path'); 
// "Path" helps us work with file directories (e.g., finding where 'server.js' is located).

const app = express(); 
// We create an instance of the server. Let's call it "app".

const PORT = 3000; 
// We decide to run this app on door number 3000.

const YTDlpWrap = require('yt-dlp-wrap').default; 
// We import the wrapper for our downloader tool.

const ytDlpWrap = new YTDlpWrap(path.join(__dirname, 'yt-dlp'));
// CRITICAL: We tell the tool EXACTLY where our 'yt-dlp' program is.
// __dirname means "current folder". 
// So we look for: /Users/rishikesavan/insdow/yt-dlp

const contentDisposition = require('content-disposition');
// A helper to create the "Save As..." filename header correctly.

const fs = require('fs');
// "File System". Allows us to read/write files if needed.
```

## 2. Middleware (The Rules)
```javascript
app.use(cors()); 
// Rule 1: Allow everyone to talk to us (for now).

app.use(express.json()); 
// Rule 2: If someone sends data, assume it's JSON (text format).

app.use(express.static(path.join(__dirname, 'public')));
// Rule 3: If someone asks for "style.css", look in the "public" folder and give it to them.
```

## 3. The Download Handling (The Main Logic)
```javascript
app.post('/api/download', async (req, res) => {
    // Listen for POST requests at the address "/api/download"
    
    const { url } = req.body;
    // Extract the "url" from the message the user sent.

    console.log(`Received download request for: ${url}`);
    // Log it so we can see what's happening in the console.

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
        // If they didn't send a URL, stop (`return`) and send an Error 400 (Bad Request).
    }

    try {
        console.log('Fetching metadata...');
        // STEP 1: Ask yt-dlp: "What video is this?"
        const metadata = await ytDlpWrap.getVideoInfo(url);
        
        const title = metadata.title || 'video';
        // Get the title. If it has no title, call it "video".

        const ext = 'mp4'; 
        // We force the extension to be .mp4.

        const filename = `${title}.${ext}`;
        // Combine them: "My Video.mp4"

        const safeFilename = filename.replace(/[^a-z0-9.]/gi, '_');
        // SECURITY: Replace weird characters ( like / \ : ) with underscores (_)
        // "My/Video" becomes "My_Video".

        res.setHeader('Content-Disposition', contentDisposition(safeFilename));
        // Tell the browser: "Hey, propose saving this file as 'My_Video.mp4'".

        res.setHeader('Content-Type', 'video/mp4');
        // Tell the browser: "The data coming next is a video file."

        // STEP 2: Start the Stream
        // We tell yt-dlp to run with these arguments:
        const readableStream = ytDlpWrap.execStream([
            url, // The link to download
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' 
            // "Get the best video (mp4) and best audio (m4a) and merge them."
            // "If that fails, just get the best single mp4 file."
        ]);

        readableStream.pipe(res);
        // THE PIPELINE: Connect the output of yt-dlp DIRECTLY to the response (res).
        // As yt-dlp downloads, it passes data -> server -> user.
        // We do not wait for the download to finish. It flows like water.

        readableStream.on('error', (error) => {
            // If the pipe bursts (error happens)...
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to download video' });
                // Send a 500 (Server Error) if we haven't started sending data yet.
            }
        });

    } catch (error) {
        // If Step 1 (Metadata) fails...
        console.error('Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process video url' });
        }
    }
});
```

## 4. Starting the Server
```javascript
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    // Open the doors and wait for customers.
});
```
