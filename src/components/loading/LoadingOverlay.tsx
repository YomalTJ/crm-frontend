import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    children: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    message = 'Loading...',
    children
}) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                        <LoadingSpinner size="lg" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoadingOverlay;