import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FamilyDemographicsItem } from '@/services/familyDemographicsService';

interface FamilyDemographicsStatsCardsProps {
    data: FamilyDemographicsItem[];
    selectedAgeRange: 'below16' | '16To24' | '25To45' | '46To60' | 'above60';
}

const FamilyDemographicsStatsCards: React.FC<FamilyDemographicsStatsCardsProps> = ({ data, selectedAgeRange }) => {
    const { theme } = useTheme();

    // Calculate statistics for selected age range
    const totalFamilies = data.length;
    
    let totalMembersInRange = 0;
    let totalMaleInRange = 0;
    let totalFemaleInRange = 0;
    
    // Map selectedAgeRange to the actual keys in the data
    const ageRangeKeyMap: Record<FamilyDemographicsStatsCardsProps['selectedAgeRange'], keyof typeof data[0]['demographics']['ageRanges']> = {
        below16: 'below16',
        '16To24': 'age16To24',
        '25To45': 'age25To45',
        '46To60': 'age46To60',
        above60: 'above60'
    };

    data.forEach(family => {
        const ageRangeKey = ageRangeKeyMap[selectedAgeRange];
        const ageRangeData = family.demographics.ageRanges[ageRangeKey];
        totalMembersInRange += ageRangeData.total;
        totalMaleInRange += ageRangeData.male;
        totalFemaleInRange += ageRangeData.female;
    });

    // Program counts
    const npCount = data.filter(item => item.mainProgram === 'NP').length;
    const adbCount = data.filter(item => item.mainProgram === 'ADB').length;
    const wbCount = data.filter(item => item.mainProgram === 'WB').length;

    // Average members per family in selected age range
    const avgMembersPerFamily = totalFamilies > 0 ? (totalMembersInRange / totalFamilies).toFixed(1) : '0';

    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getSubTextColor = () => theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

    const getAgeRangeLabel = (range: string) => {
        const labels = {
            'below16': 'Below 16',
            '16To24': '16-24',
            '25To45': '25-45',
            '46To60': '46-60',
            'above60': '60+'
        };
        return labels[range as keyof typeof labels];
    };

    const StatCard = ({
        title,
        value,
        subtitle,
        icon,
        color = 'blue'
    }: {
        title: string;
        value: string | number;
        subtitle?: string;
        icon: React.ReactNode;
        color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'cyan';
    }) => {
        const colorClasses = {
            blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
            green: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
            orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
            red: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
            indigo: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
            pink: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400',
            cyan: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400'
        };

        return (
            <div className={`${getCardBgColor()} ${getBorderColor()} border rounded-lg p-6 shadow-sm`}>
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        {icon}
                    </div>
                    <div className="ml-4">
                        <p className={`text-sm font-medium ${getSubTextColor()}`}>{title}</p>
                        <p className={`text-2xl font-semibold ${getTextColor()}`}>{value}</p>
                        {subtitle && (
                            <p className={`text-sm ${getSubTextColor()}`}>{subtitle}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
                title={`Total Families`}
                value={totalFamilies}
                subtitle={`Age Group: ${getAgeRangeLabel(selectedAgeRange)}`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 7 4-4 4 4" />
                    </svg>
                }
                color="blue"
            />

            <StatCard
                title={`Members (${getAgeRangeLabel(selectedAgeRange)})`}
                value={totalMembersInRange}
                subtitle={`Avg ${avgMembersPerFamily} per family`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                }
                color="cyan"
            />

            <StatCard
                title="Gender Distribution"
                value={`${totalMaleInRange}M / ${totalFemaleInRange}F`}
                subtitle={totalMembersInRange > 0 ? `${Math.round((totalMaleInRange / totalMembersInRange) * 100)}% Male` : 'No data'}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                }
                color="green"
            />

            <StatCard
                title="Active Locations"
                value={new Set(data.map(item => item.district.district_id)).size}
                subtitle={`${new Set(data.map(item => item.gnd.gnd_id)).size} GND divisions`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                }
                color="purple"
            />

            {/* Program Distribution Cards */}
            <StatCard
                title="National Program (NP)"
                value={npCount}
                subtitle={`${totalFamilies > 0 ? Math.round((npCount / totalFamilies) * 100) : 0}% of families`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 7 4-4 4 4" />
                    </svg>
                }
                color="indigo"
            />

            <StatCard
                title="ADB Program"
                value={adbCount}
                subtitle={`${totalFamilies > 0 ? Math.round((adbCount / totalFamilies) * 100) : 0}% of families`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                }
                color="orange"
            />

            <StatCard
                title="World Bank Program"
                value={wbCount}
                subtitle={`${totalFamilies > 0 ? Math.round((wbCount / totalFamilies) * 100) : 0}% of families`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
                color="pink"
            />

            <StatCard
                title="Male Distribution"
                value={`${((totalMaleInRange / Math.max(totalMembersInRange, 1)) * 100).toFixed(1)}%`}
                subtitle={`${totalMaleInRange} male members`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                }
                color="red"
            />
        </div>
    );
};

export default FamilyDemographicsStatsCards;