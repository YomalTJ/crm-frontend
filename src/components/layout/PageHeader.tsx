import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface UserDetails {
    username: string;
    roleName: string;
    locationCode: string;
}

interface PageHeaderProps {
    title: string;
    userDetails?: UserDetails | null;
    children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, userDetails, children }) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className={`rounded-lg shadow-sm p-6 mb-6 ${getCardBgColor()} ${getBorderColor()} border`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h1 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>{title}</h1>

                    {/* User Info */}
                    {userDetails && (
                        <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <p><span className="font-medium">User:</span> {userDetails.username} ({userDetails.roleName})</p>
                            <p><span className="font-medium">Location Code:</span> {userDetails.locationCode}</p>
                        </div>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};

export default PageHeader;