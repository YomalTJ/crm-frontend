import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ProgramBadgeProps {
    program: 'NP' | 'ADB' | 'WB';
}

const ProgramBadge: React.FC<ProgramBadgeProps> = ({ program }) => {
    const { theme } = useTheme();

    const getProgramBadgeColor = () => {
        const baseColors = {
            NP: { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900 text-blue-100' },
            ADB: { light: 'bg-green-100 text-green-800', dark: 'bg-green-900 text-green-100' },
            WB: { light: 'bg-purple-100 text-purple-800', dark: 'bg-purple-900 text-purple-100' },
            default: { light: 'bg-gray-100 text-gray-800', dark: 'bg-gray-700 text-gray-100' }
        };

        const colorSet =
            program === 'NP' ? baseColors.NP :
                program === 'ADB' ? baseColors.ADB :
                    program === 'WB' ? baseColors.WB :
                        baseColors.default;

        return theme === 'dark' ? colorSet.dark : colorSet.light;
    };

    return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProgramBadgeColor()}`}>
            {program}
        </span>
    );
};

export default ProgramBadge;