const roleAuth = (requiredRole) => {
    return (req, res, next) => {
        if (req.session.authorization && req.session.authorization.role === requiredRole) {
            next();
        } else {
            return res.status(403).send('Access denied. Insufficient permissions.');
        }
    };
};

module.exports = roleAuth;