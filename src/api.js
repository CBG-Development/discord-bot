const startApi = () => {
    const express = require('express');
    const app = express();

    app.get('/api/v1/status', (req, res) => {
        res.status(200).send(
            {
                status: global.botStatus,
                service: process.env.npm_package_name,
                message: global.botStatus ? "Service is available" : "Service is unavailable"
            }
        );
    });

    app.get('/', (req, res) => {
        res.status(400).send(
            {
                code: 400,
                message: "Invalid request"
            }
        );
    });

    app.listen(3000, '0.0.0.0', () => {
        console.log(`API is ready!`)
    });
}

module.exports = startApi;