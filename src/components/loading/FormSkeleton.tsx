import React from 'react';

const FormSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

            {/* Form fields skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            ))}

            {/* Radio group skeleton */}
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Checkbox group skeleton */}
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Button skeleton */}
            <div className="flex gap-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
        </div>
    );
};

export default FormSkeleton;