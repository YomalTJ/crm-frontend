import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          {/* Mobile Logo Section - Shows only on mobile */}
          <div className="lg:hidden w-full py-6 flex items-center justify-center">
            <div className="flex flex-col items-center max-w-xs">
              <Image
                width={231}
                height={48}
                src="/images/logo/samurdi_logo.jpg"
                alt="Logo"
                className="mb-2"
              />
              <p className="text-center text-gray-400 dark:text-white/60 text-sm">
                Department of Samurdhi Development
              </p>
            </div>
          </div>

          {children}

          {/* Desktop Logo Section - Hidden on mobile */}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:flex items-center hidden">
            <div className="relative items-center justify-center flex z-1 w-full">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Image
                  width={231}
                  height={48}
                  src="/images/logo/samurdi_logo.jpg"
                  alt="Logo"
                  className="mb-4"
                />
                <p className="text-center text-gray-400 dark:text-white/60">
                  Department of Samurdhi Development
                </p>
              </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}