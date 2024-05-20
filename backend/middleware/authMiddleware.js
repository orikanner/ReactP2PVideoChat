const jwt = require('jsonwebtoken');
const JWTSECRET = require("../JWTSecret");
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
        const decoded = jwt.verify(token, JWTSECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

const vetCheck = (req, res, next) => {
    if (!req.user.isVet) {
        return res.status(403).json({ message: 'Only veterinarians can perform this action' });
    }
    next();
};

module.exports = { verifyToken, vetCheck };
