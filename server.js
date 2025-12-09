const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap(path.join(__dirname, 'yt-dlp'));
const contentDisposition = require('content-disposition');
const fs = require('fs');

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    console.log(`Received download request for: ${url}`);

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Get video metadata first to determine filename
        console.log('Fetching metadata...');
        const metadata = await ytDlpWrap.getVideoInfo(url);
        const title = metadata.title || 'video';
        const ext = 'mp4'; // We'll force mp4 or best compatibility
        const filename = `${title}.${ext}`;

        // Sanitize filename
        const safeFilename = filename.replace(/[^a-z0-9.]/gi, '_');

        console.log(`Starting download stream for: ${safeFilename}`);

        res.setHeader('Content-Disposition', contentDisposition(safeFilename));
        res.setHeader('Content-Type', 'video/mp4');

        // Stream the download directly to the response
        // -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" ensures we get mp4 if possible
        const readableStream = ytDlpWrap.execStream([
            url,
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        ]);

        readableStream.pipe(res);

        readableStream.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to download video' });
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process video url' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
