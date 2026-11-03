import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '@/lib/supabase-server';
import { generateTokens } from '@/lib/auth-tokens';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: user, error: findError } = await supabaseServer
            .from('users')
            .select('*')
            .eq('email', normalizedEmail)
            .single();

        if (findError || !user) {
            return NextResponse.json({ error: 'No account found with this email. Please sign up.' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid password. Please check your credentials.' }, { status: 401 });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username || user.email.split('@')[0]
            },
            token: accessToken,
            refreshToken
        });
    } catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
