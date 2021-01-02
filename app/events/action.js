let redis = null;

exports.init = (redisClient) => {
    redis = redisClient;
}

// Action

exports.handler = (socket, request) => {
    if (socket) {

        socket.send('error-code', '200');
    } else {
        socket.send('error-code', '400');
    }
}

function rollDie(size) {
    return Math.floor(Math.random() * size) + 1;
}

function rollDice(config) {
    let dieSize = config.split(':')[0];
    let diceCount = config.split(':')[1];

    let result = [];
    for (let i = 0; i < diceCount; i++) {
        result.push(rollDie(dieSize));
    }
}