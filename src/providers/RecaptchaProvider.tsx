'use client';

import { ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function RecaptchaProvider({ children }: { children: ReactNode }) {
    const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!reCaptchaKey) {
        console.warn('reCAPTCHA Site Key is not defined');
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={reCaptchaKey || ''}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}