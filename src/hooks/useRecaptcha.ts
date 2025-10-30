'use client';

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const useRecaptcha = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const getRecaptchaToken = async (action: string = 'submit'): Promise<string | null> => {
        if (!executeRecaptcha) {
            console.error('reCAPTCHA is not ready');
            return null;
        }

        try {
            const token = await executeRecaptcha(action);
            return token;
        } catch (error) {
            console.error('Failed to get reCAPTCHA token:', error);
            return null;
        }
    };

    return { getRecaptchaToken };
};