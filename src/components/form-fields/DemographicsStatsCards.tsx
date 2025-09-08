import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { OwnerDemographicsItem } from '@/services/ownerDemographicsService';

interface DemographicsStatsCardsProps {
    data: OwnerDemographicsItem[];
}

const DemographicsStatsCards: React.FC<DemographicsStatsCardsProps> = ({ data }) => {
    const { theme } = useTheme();

    // Calculate statistics
    const totalOwners = data.length;
    const maleCount = data.filter(item => item.projectOwnerGender?.toLowerCase() === 'male').length;
    const femaleCount = data.filter(item => item.projectOwnerGender?.toLowerCase() === 'female').length;
    const disabilityCount = data.filter(item => item.disability).length;
    const averageAge = totalOwners > 0
        ? Math.round(data.reduce((sum, item) => sum + item.projectOwnerAge, 0) / totalOwners)
        : 0;

    // Program counts
    const npCount = data.filter(item => item.mainProgram === 'NP').length;
    const adbCount = data.filter(item => item.mainProgram === 'ADB').length;
    const wbCount = data.filter(item => item.mainProgram === 'WB').length;

    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getSubTextColor = () => theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

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
        color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink';
    }) => {
        const colorClasses = {
            blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
            green: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
            orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
            red: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
            indigo: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
            pink: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400'
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
                title="Total Project Owners"
                value={totalOwners}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                }
                color="blue"
            />

            <StatCard
                title="Gender Distribution"
                value={`${maleCount}M / ${femaleCount}F`}
                subtitle={`${totalOwners > 0 ? Math.round((maleCount / totalOwners) * 100) : 0}% Male`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                }
                color="green"
            />

            <StatCard
                title="Average Age"
                value={`${averageAge} years`}
                subtitle={totalOwners > 0 ? `Range: ${Math.min(...data.map(d => d.projectOwnerAge))}-${Math.max(...data.map(d => d.projectOwnerAge))}` : 'No data'}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                }
                color="purple"
            />

            <StatCard
                title="With Disabilities"
                value={disabilityCount}
                subtitle={`${totalOwners > 0 ? Math.round((disabilityCount / totalOwners) * 100) : 0}% of total`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                }
                color="red"
            />

            {/* Program Distribution Cards */}
            <StatCard
                title="National Program (NP)"
                value={npCount}
                subtitle={`${totalOwners > 0 ? Math.round((npCount / totalOwners) * 100) : 0}% of total`}
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
                subtitle={`${totalOwners > 0 ? Math.round((adbCount / totalOwners) * 100) : 0}% of total`}
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
                subtitle={`${totalOwners > 0 ? Math.round((wbCount / totalOwners) * 100) : 0}% of total`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
                color="pink"
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
                color="green"
            />
        </div>
    );
};

export default DemographicsStatsCards;