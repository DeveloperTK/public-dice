let redis;

exports.init = (_redis) => redis = _redis;

// Create a new room

exports.handler = (req, res, next) => {
    res.redirect(req.get('') + req.get('host') + '/');
}