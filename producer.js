const { Kafka } = require('kafkajs');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const kafka = new Kafka({
    clientId: 'insdow-api',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function init() {
    await producer.connect();

    app.post('/api/queue-download', async (req, res) => {
        const { url } = req.body;
        const requestId = uuidv4();

        // Instead of downloading, we just send a message
        await producer.send({
            topic: 'video-downloads',
            messages: [
                { value: JSON.stringify({ url, requestId, timestamp: Date.now() }) }
            ],
        });

        // Respond immediately!
        res.json({
            status: 'queued',
            message: 'Your download has been queued.',
            requestId: requestId
        });
    });

    app.listen(3001, () => console.log('Producer API running on port 3001'));
}

init().catch(console.error);
