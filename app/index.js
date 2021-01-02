// Get environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Get ssl keys for https
const fs = require('fs');
const privateKey  = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};

// socket.io configuration
const socketConfig = {
    // path: '/test',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
};

// redis connection configuration
const redisConfig = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
    password: process.env.REDIS_PASSWORD || 'your password'
};

// express server
const express = require('express');
const app = express();

// http and https endpoints
const http = require('http').createServer(app);
const https = require('https').createServer(credentials, app);

// socket.io instance
const io = require('socket.io')(http, socketConfig);

// redis conenction instance
const redisClient = require('redis').createClient(redisConfig);
redisClient.on('connect', (err) => {
    if (err) throw err;
    redisClient.set("control_check_connection", "Redis Connection OK!");
    redisClient.get("control_check_connection", (err, value) => {
        if (err) {
            console.error(err);
        } else {
            console.log(value);
        }
    });
});

// expressjs webroot
app.use('/', express.static(__dirname + '/webroot'));
app.get('/', (req, res) => res.send("it works"));

// set up socket events
require('./socket').init(io, redisClient);

http.listen(process.env.HTTP_PORT || 3080, () => {
    console.log('http  listening on *:' + process.env.HTTP_PORT || 3080);
});

https.listen(process.env.HTTPS_PORT || 3443, () => {
    console.log('https listening on *:' + process.env.HTTPS_PORT || 3443);
});

process.on('SIGINT', () => {
    console.log("\nCaught SIGINT, closing all active connections.");
    console.log("PID is " + process.pid + " in case it won't stop.");
    console.log("\nthank you and goodbye");
    process.exit();
});
