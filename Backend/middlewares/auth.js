const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('authHeader', authHeader);
    if (!authHeader) {
        console.log('here is the error auth 1', err);
        return res.status(401).send("Authorization token is missing");
    }

    const token = authHeader.split(' ')[1]; // Get the token from the Authorization header
    console.log('token', token);
    if (!token) {
        console.log('here is the error auth 2', err);
        return res.status(401).send("Authorization token is missing");
    }

    jwt.verify(token, 'access', (err, user) => {
        if (!err) {
            req.user = user;
            console.log('user', user);
            next(); 
        } else {
            console.log('here is the error auth', err);
            return res.status(403).send("User is not authenticated");
        }
    });
};

module.exports = auth;