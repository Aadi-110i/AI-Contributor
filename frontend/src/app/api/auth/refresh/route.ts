import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { verifyRefreshToken, generateTokens } from '@/lib/auth-tokens';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.sub) {
            return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
        }

        const { data: user, error } = await supabaseServer
            .from('users')
            .select('*')
            .eq('id', decoded.sub)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'User associated with token no longer exists' }, { status: 401 });
        }

        const tokens = generateTokens(user);

        return NextResponse.json({
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
