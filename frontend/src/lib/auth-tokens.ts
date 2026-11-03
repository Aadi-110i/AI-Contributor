import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_access_key_wii_build_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_wii_build_2026';

export interface TokenUser {
    id: string;
    email: string;
    username: string;
    role?: string;
}

export function generateTokens(user: TokenUser) {
    const payload = {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: 'authenticated'
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenUser | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return {
            id: decoded.sub,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role
        };
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): { sub: string } | null {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
    } catch {
        return null;
    }
}
