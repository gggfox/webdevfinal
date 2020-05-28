const { TOKEN } = require('./../config');

function validateToken(req, res, next) {

    let bearerAuth = req.headers.authorization;
    if (bearerAuth) {
        if (bearerAuth !== `Bearer ${TOKEN}`) {
            res.statusMessage = "the bearer token is invalid.";
            return res.status(401).end();
        }
        return next();
    }

    let headerAuth = req.header('bookmark-api-key');
    if (headerAuth) {
        if (headerAuth !== TOKEN) {
            res.statusMessage = "the header token is invalid.";
            return res.status(401).end();
        }
        return next();
    }

    let queryAuth = req.query.TOKEN;
    if (queryAuth) {
        if (queryAuth !== TOKEN) {
            res.statusMessage = "the query parameter token is invalid.";
            return res.status(401).end();
        }
        return next();
    }

    res.statusMessage = "your token is unathorized.";
    return res.status(401).end();
}

module.exports = validateToken;