'use client';

import React from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className={`
      fixed z-[9999]
      bottom-4 right-4        // Mobile-first: show at bottom
      md:top-4 md:right-4    // Desktop: show at top
      ${getBgColor()} 
      text-white px-4 py-3 rounded-md 
      shadow-lg 
      w-[calc(100%-2rem)]    // Full width minus margins on mobile
      max-w-[300px]          // Max width for desktop
      mx-2                   // Small margin on mobile
      transition-all duration-300 
      animate-fadeIn
    `}>
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                    <span className="mr-2 font-bold shrink-0">
                        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'i'}
                    </span>
                    <span className="truncate">{message}</span>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200 text-lg font-bold shrink-0"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

interface ToastContainerProps {
    toasts: Array<{
        id: string;
        message: string;
        type: 'success' | 'error' | 'info';
    }>;
    removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};