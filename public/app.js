// Paste Button Logic
document.getElementById('pasteBtn').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('urlInput').value = text;
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        alert('Please allow clipboard access or paste manually.');
    }
});

document.getElementById('downloadBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('urlInput');
    const statusMessage = document.getElementById('statusMessage');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const url = urlInput.value.trim();

    if (!url) {
        statusMessage.textContent = 'Please enter a valid URL';
        statusMessage.style.color = '#ef4444';
        return;
    }

    // Reset UI
    statusMessage.textContent = 'Processing...';
    statusMessage.style.color = '#94a3b8';
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    // Simulate Progress (Simulated because fetch doesn't give precise progress for one-shot streams easily without complex streams)
    let progress = 0;
    const interval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 10;
            if (progress > 90) progress = 90;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }
    }, 500);

    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        clearInterval(interval); // Stop simulated progress

        if (!response.ok) {
            throw new Error('Download failed');
        }

        // Complete the progress bar
        progressFill.style.width = '100%';
        progressText.textContent = '100%';

        // Get the filename from the Content-Disposition header if possible
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'video.mp4';
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);

        statusMessage.textContent = 'Download started!';
        statusMessage.style.color = '#22c55e'; // Green success color

        // Hide progress after a delay
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 3000);

    } catch (error) {
        clearInterval(interval);
        progressContainer.style.display = 'none';
        statusMessage.textContent = 'An error occurred. Please try again.';
        statusMessage.style.color = '#ef4444';
        console.error(error);
    }
});
