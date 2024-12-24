const session = require('express-session')
const sessionMiddleware = session({
    secret: "fingerprint_user_secret", 
    resave: true, 
    saveUninitialized: true 
});
module.exports = sessionMiddleware;