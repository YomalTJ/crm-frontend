/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

export const useAnalytics = () => {
    const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', eventName, eventParams);
            console.log(`Event tracked: ${eventName}`, eventParams);
        }
    };

    const trackPageView = (pagePath: string, pageTitle: string) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
                page_path: pagePath,
                page_title: pageTitle,
            });
            console.log(`Page view tracked: ${pageTitle}`);
        }
    };

    const trackException = (description: string, fatal: boolean = false) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: description,
                fatal: fatal,
            });
            console.log(`Exception tracked: ${description}`);
        }
    };

    return { trackEvent, trackPageView, trackException };
};