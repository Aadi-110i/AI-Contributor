const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;

/**
 * Middleware: verifies Bearer token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Support demo tokens
    if (token.startsWith('demo-token') || token.startsWith('local-token')) {
        req.user = {
            id: token === 'demo-token' ? 'demo-user' : token.replace('local-token-', 'user-'),
            email: 'demo@example.com',
            role: 'authenticated',
        };
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

/**
 * Optional auth: attaches user if token present, continues regardless.
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
    } catch {
        // Token invalid — continue as unauthenticated
    }
    next();
}

module.exports = { authenticate, optionalAuth };
