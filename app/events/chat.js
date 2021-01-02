let redis = null;

exports.init = (redisClient) => {
    redis = redisClient
}

// Chat Update Message

exports.handler = (socket, request) => {
    if (socket) {

        socket.send('error-code', '200');
    } else {
        socket.send('error-code', '400');
    }
}
