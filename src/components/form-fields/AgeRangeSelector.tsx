import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface AgeRangeSelectorProps {
    selectedRange: 'below16' | '16To24' | '25To45' | '46To60' | 'above60';
    onRangeChange: (range: 'below16' | '16To24' | '25To45' | '46To60' | 'above60') => void;
}

const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({ selectedRange, onRangeChange }) => {
    const { theme } = useTheme();

    // const getBorderColor = () => theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getSubTextColor = () => theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const getButtonBgColor = (isActive: boolean) => {
        if (isActive) {
            return theme === 'dark' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-600 text-white border-blue-600';
        }
        return theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
    };

    const ageRanges = [
        { value: 'below16' as const, label: 'Below 16', displayText: '< 16' },
        { value: '16To24' as const, label: '16 - 24', displayText: '16-24' },
        { value: '25To45' as const, label: '25 - 45', displayText: '25-45' },
        { value: '46To60' as const, label: '46 - 60', displayText: '46-60' },
        { value: 'above60' as const, label: '60+', displayText: '60+' }
    ];

    return (
        <div className="mb-6">
            <h3 className={`text-lg font-medium mb-3 ${getTextColor()}`}>Age Group</h3>
            <div className="flex flex-wrap gap-3">
                {ageRanges.map((range) => (
                    <button
                        key={range.value}
                        onClick={() => onRangeChange(range.value)}
                        className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${getButtonBgColor(selectedRange === range.value)}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{range.displayText}</span>
                            {selectedRange === range.value && (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            <p className={`text-sm mt-2 ${getSubTextColor()}`}>
                Select an age range to view family demographics for that specific group
            </p>
        </div>
    );
};

export default AgeRangeSelector;