'use client';

import Script from 'next/script';
import { ReactNode } from 'react';

export default function AnalyticsProvider({ children }: { children: ReactNode }) {
    const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

    if (!GA_ID) {
        console.warn('Google Analytics ID is not defined');
    }

    return (
        <>
            {children}

            {/* Google Analytics Script */}
            {GA_ID && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                });
              `,
                        }}
                    />
                </>
            )}
        </>
    );
}