import { NextRequest, NextResponse } from 'next/server';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const SCORE_THRESHOLD = 0.5;

interface RecaptchaVerifyRequest {
    token: string;
    action?: string;
}

interface GoogleRecaptchaResponse {
    success: boolean;
    score: number;
    action: string;
    challenge_ts: string;
    hostname: string;
    error_codes?: string[];
}

export async function POST(request: NextRequest) {
    try {
        const body: RecaptchaVerifyRequest = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'reCAPTCHA token is missing' },
                { status: 400 }
            );
        }

        if (!RECAPTCHA_SECRET_KEY) {
            console.error('RECAPTCHA_SECRET_KEY is not configured');
            return NextResponse.json(
                { success: false, message: 'reCAPTCHA is not properly configured' },
                { status: 500 }
            );
        }

        // Verify token with Google
        const verifyResponse = await fetch(
            'https://www.google.com/recaptcha/api/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
            }
        );

        const verifyData: GoogleRecaptchaResponse = await verifyResponse.json();

        console.log('reCAPTCHA Response:', {
            success: verifyData.success,
            score: verifyData.score,
            action: verifyData.action,
            hostname: verifyData.hostname,
        });

        // Check if verification was successful
        if (!verifyData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'reCAPTCHA verification failed',
                    errors: verifyData.error_codes,
                },
                { status: 403 }
            );
        }

        // Check score threshold
        if (verifyData.score < SCORE_THRESHOLD) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Suspicious activity detected. Please try again.',
                    score: verifyData.score,
                },
                { status: 403 }
            );
        }

        // Verification successful
        return NextResponse.json(
            {
                success: true,
                message: 'reCAPTCHA verification successful',
                score: verifyData.score,
                action: verifyData.action,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}