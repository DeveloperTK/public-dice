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
    // password: process.env.REDIS_PASSWORD || '',
};

// express server
const express = require('express');
const app = express();

const path = require('path');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

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

// express session coookie
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Redirect all requests to secure https connection
app.use((req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development")
        return res.redirect('https://' + req.get('host') + req.url);

    next();
});

// Room create endpoint
const createAction = require('./actions/create');
createAction.init(redisClient);
app.get('/create', (req, res) => createAction.handler(req, res));

// Room join endpoint
const joinAction = require('./actions/join');
joinAction.init(redisClient);
app.get('/join', (req, res) => joinAction.handler(req, res));

// expressjs webroot
app.use(express.static(path.join(__dirname, "../webroot")));

// set up socket events
require('./socket').init(io, redisClient);

// listen on http port
http.listen(process.env.HTTP_PORT || 3080, () => {
    console.log('http  listening on *:' + process.env.HTTP_PORT || 3080);
});

//listen on https port
https.listen(process.env.HTTPS_PORT || 3443, () => {
    console.log('https listening on *:' + process.env.HTTPS_PORT || 3443);
});

// catch sigint to close all active connections
process.on('SIGINT', () => {
    process.stdout.write("\nCaught SIGINT, closing all active socket and redis connections...");
    io.close();
    redisClient.quit();
    process.stdout.write("Done\n");
    process.stdout.write("PID is " + process.pid + " in case it won't stop.\n");
    process.stdout.write("\nthank you and goodbye\n");
    process.exit();
});
