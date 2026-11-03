const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../lib/supabase');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || 'wii_build_jwt_secret_dev_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'wii_build_jwt_refresh_dev_2026';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

function generateTokens(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        username: user.username || user.email.split('@')[0],
        role: 'authenticated'
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    return { accessToken, refreshToken };
}

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', normalizedEmail)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = 'usr_' + Math.random().toString(36).substring(2, 10);
        const finalUsername = (username && username.trim()) || normalizedEmail.split('@')[0];

        const newUser = {
            id: userId,
            email: normalizedEmail,
            username: finalUsername,
            password: hashedPassword,
            created_at: new Date().toISOString()
        };

        const { data: createdUser, error: insertError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

        if (insertError) throw insertError;

        // Also add profile
        await supabase.from('profiles').insert({
            id: userId,
            username: finalUsername,
            avatar_url: ''
        });

        const { accessToken, refreshToken } = generateTokens(createdUser || newUser);

        return res.status(201).json({
            user: {
                id: userId,
                email: normalizedEmail,
                username: finalUsername
            },
            token: accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', normalizedEmail)
            .single();

        if (!user) {
            return res.status(401).json({ error: 'No account found with this email. Please sign up.' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        return res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username || user.email.split('@')[0]
            },
            token: accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        } catch {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', decoded.sub)
            .single();

        if (!user) {
            return res.status(401).json({ error: 'User associated with token no longer exists' });
        }

        const tokens = generateTokens(user);
        return res.json({
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

