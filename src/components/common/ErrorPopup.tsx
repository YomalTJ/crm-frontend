import React from 'react';

interface ErrorPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
    isOpen,
    onClose,
    title = "Error",
    message
}) => {
    if (!isOpen) return null;

    // Function to extract the core error message
    const extractErrorMessage = (error: string): string => {
        // Remove any file paths or line numbers
        const cleanError = error.replace(/\(.*?\)/g, '')
            .replace(/at.*/g, '')
            .replace(/rsc:.*/g, '')
            .replace(/webpack-internal:.*/g, '')
            .trim();

        // Return first line if it's multi-line
        return cleanError.split('\n')[0];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                                {title}
                            </h3>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Error Message */}
                    <div className="mb-4">
                        <p className="text-red-600 dark:text-red-400">
                            {extractErrorMessage(message)}
                        </p>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};