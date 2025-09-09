import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ProjectOwnerItem } from '@/services/projectOwnersService';

interface ProjectOwnersStatsCardsProps {
    data: ProjectOwnerItem[];
}

const ProjectOwnersStatsCards: React.FC<ProjectOwnersStatsCardsProps> = ({ data }) => {
    const { theme } = useTheme();

    // Calculate statistics
    const totalOwners = data.length;
    const maleCount = data.filter(item => item.projectOwnerGender?.toLowerCase() === 'male').length;
    const femaleCount = data.filter(item => item.projectOwnerGender?.toLowerCase() === 'female').length;
    const averageAge = totalOwners > 0
        ? Math.round(data.reduce((sum, item) => sum + item.projectOwnerAge, 0) / totalOwners)
        : 0;

    // Program counts
    const npCount = data.filter(item => item.mainProgram === 'NP').length;
    const adbCount = data.filter(item => item.mainProgram === 'ADB').length;
    const wbCount = data.filter(item => item.mainProgram === 'WB').length;

    // Empowerment dimensions count
    const uniqueEmpowermentDimensions = new Set(data.map(item => item.empowermentDimension?.empowerment_dimension_id)).size;

    // Livelihood types count
    const uniqueLivelihoods = new Set(data.map(item => item.livelihood?.id)).size;

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
        color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'teal';
    }) => {
        const colorClasses = {
            blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
            green: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
            orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
            red: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
            indigo: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
            pink: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400',
            teal: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400'
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
                title="Empowerment Types"
                value={uniqueEmpowermentDimensions}
                subtitle={`Different empowerment dimensions`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                }
                color="teal"
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
                title="Livelihood Types"
                value={uniqueLivelihoods}
                subtitle={`Different livelihood categories`}
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 002 2h4a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                }
                color="red"
            />
        </div>
    );
};

export default ProjectOwnersStatsCards;