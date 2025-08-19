import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface StatsCardsProps {
    total: number;
    npCount: number;
    adbCount: number;
    wbCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ total, npCount, adbCount, wbCount }) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>Total Beneficiaries</h3>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{total}</p>
            </div>
            <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>NP Program</h3>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{npCount}</p>
            </div>
            <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>ADB Program</h3>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{adbCount}</p>
            </div>
            <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>WB Program</h3>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{wbCount}</p>
            </div>
        </div>
    );
};

export default StatsCards;