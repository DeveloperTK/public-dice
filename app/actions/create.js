let redis;

exports.init = (_redis) => redis = _redis;

// Create a new room

exports.handler = (req, res) => {
    res.json(req.sessionID);
}

function generateRoomId(length) {
    let result = '';
    let keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(let i = 0; i < length; i++)
        result += keys.charAt(Math.floor(Math.random() * 26));
    return result;
}