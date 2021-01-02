let redis;

exports.init = (redisClient) => {
    redis = redisClient;
}

// Connection Request

exports.handler = (socket, request) => {
    if(request.contains('room') && request.contains('nickname')) {
        redis.set();
        socket.send('error-code', '200');
    } else {
        socket.send('error-code', '400');
    }
}