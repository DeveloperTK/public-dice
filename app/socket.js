const connectionHandler = require('./events/connect');
const chatHandler = require('./events/chat');
const actionHandler = require('./events/action');

// When a new client connects to the socket,
// add it to the broadcast list.
exports.init = (io, redis) => {
    connectionHandler.init(redis);
    chatHandler.init(redis);
    actionHandler.init(redis);

    io.on('connection', socket => {
        socket.on('connection-request', (message) => emitLocalEvent(socket, message, connectionHandler.handler));
        socket.on('action', (message) => emitLocalEvent(socket, message, actionHandler.handler));
        socket.on('chat-message', (message) => emitLocalEvent(socket, message, chatHandler.handler));
    });
}

function emitLocalEvent(socket, message, handler) {
    try {
        handler(socket, JSON.parse(message));
    } catch(err) {
        socket.send('error-code', '500');
    }
}

exports.emitLocalEvent = emitLocalEvent;