const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, 'access', (err, user) => {
            if (!err) {
                req.user = user;
                next(); 
            } else {
                return res.status(403).send("User is not authenticated");
            }
        });
    } else {
        return res.status(401).send("Authorization token is missing");
    }
};

module.exports = auth;
