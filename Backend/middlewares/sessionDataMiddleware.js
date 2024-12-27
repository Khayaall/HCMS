const sessionDataMiddleware = (req, res, next) => {
    const userId = req.headers['user-id'];
    const userRole = req.headers['user-role'];
    // console.log('userId', userId);

    if (userId && userRole) {
        console.log('userId', userId);
        console.log('userRole', userRole);
        req.session.authorization = {
            id: userId,
            role: userRole
        };
    }

    next();
};

module.exports = sessionDataMiddleware;