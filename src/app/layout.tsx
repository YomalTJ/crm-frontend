import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import RecaptchaProvider from '@/providers/RecaptchaProvider';
import AnalyticsProvider from '@/providers/AnalyticsProvider';
import Script from 'next/script';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
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

        <AnalyticsProvider>
          <RecaptchaProvider>
            <ThemeProvider>
              <LanguageProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </LanguageProvider>
            </ThemeProvider>
          </RecaptchaProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}