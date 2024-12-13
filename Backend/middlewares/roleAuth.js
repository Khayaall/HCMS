function roleAuth(requiredRole) {
    return function (req, res, next) {
        if (!req.session.authorization) {
            return res.status(403).send("Access denied: No session found.");
        }

        const userRole = req.session.authorization.role;
        if (userRole !== requiredRole) {
            return res.status(403).send("Access denied: You do not have the required role.");
        }

        next();
    };
}

module.exports = roleAuth;
