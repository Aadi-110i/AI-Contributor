import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '@/lib/supabase-server';
import { generateTokens } from '@/lib/auth-tokens';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, username } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const { data: existingUser } = await supabaseServer
            .from('users')
            .select('*')
            .eq('email', normalizedEmail)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
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

        const { data: createdUser, error: insertError } = await supabaseServer
            .from('users')
            .insert(newUser)
            .select()
            .single();

        if (insertError) {
            console.error('Supabase user insert error:', insertError);
            return NextResponse.json({ error: insertError.message || 'Failed to create user' }, { status: 500 });
        }

        // Also add profile
        await supabaseServer.from('profiles').insert({
            id: userId,
            username: finalUsername,
            avatar_url: ''
        });

        const { accessToken, refreshToken } = generateTokens(createdUser || newUser);

        return NextResponse.json({
            user: {
                id: userId,
                email: normalizedEmail,
                username: finalUsername
            },
            token: accessToken,
            refreshToken
        }, { status: 201 });
    } catch (err: any) {
        console.error('Signup error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
