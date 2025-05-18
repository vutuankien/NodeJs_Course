const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('Auth middleware');
    console.log('Request Headers:', req.headers);

    const authHeader = req.headers.token;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Token missing or malformed',
        });
    }

    const access_token = authHeader.split(' ')[1];

    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: Invalid token',
            });
        }

        // ✅ Chỉ cho phép admin
        if (!user.data.isAdmin) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: Admins only',
            });
        }

        req.user = user;
        console.log('Decoded Token:', req.user);
        next();
    });
};

module.exports = authMiddleware;
