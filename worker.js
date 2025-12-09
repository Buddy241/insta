const { Kafka } = require('kafkajs');
const YTDlpWrap = require('yt-dlp-wrap').default;
const path = require('path');
const fs = require('fs');

// 1. Initialize Kafka Connection
const kafka = new Kafka({
    clientId: 'insdow-worker',
    brokers: ['localhost:9092'] // This assumes you have Kafka running locally
});

const consumer = kafka.consumer({ groupId: 'video-download-group' });
const ytDlpWrap = new YTDlpWrap(path.join(__dirname, 'yt-dlp'));

async function startWorker() {
    await consumer.connect();
    // 2. Subscribe to the 'video-downloads' topic
    await consumer.subscribe({ topic: 'video-downloads', fromBeginning: true });

    console.log('Worker is running and listening for jobs...');

    // 3. Process jobs as they arrive
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const jobData = JSON.parse(message.value.toString());
            console.log(`Received Job: ${jobData.url} (Request ID: ${jobData.requestId})`);

            try {
                // Perform the download (The heavy lifting)
                await downloadVideo(jobData.url, jobData.requestId);
            } catch (err) {
                console.error(`Failed to process job ${jobData.requestId}:`, err);
            }
        },
    });
}

async function downloadVideo(url, requestId) {
    console.log(`Starting download for ${requestId}...`);
    // In a real scaled app, we would upload to S3 here, not local disk
    const filename = `downloads/${requestId}.mp4`;

    await ytDlpWrap.execPromise([
        url,
        '-f', 'best[ext=mp4]',
        '-o', filename
    ]);

    console.log(`Download complete: ${filename}`);
    // Here you would publish a message to a 'completed-jobs' topic
    // or update a database status to 'COMPLETED'
}

startWorker().catch(console.error);
