const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'yourSecretKey'); // Use your secret key here
        req.user = decoded; // Attach the decoded user info to the request
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};
