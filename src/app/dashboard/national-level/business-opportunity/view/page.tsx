'use client'

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import ProjectTypesTable from '@/components/business-opportunity/ProjectTypesTable';

const BusinessOpportunityView = () => {
    const { theme } = useTheme();

    return (
        <div>
            <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                ව්‍යාපාරික අවස්ථා දර්ශනය -
                Business Opportunity View  / வணிக வாய்ப்பு காண்க
            </h1>

            <div className="space-y-6 mt-10">
                <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <div className="mb-6">
                        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            Project Types by Livelihood / ජීවනෝපාය අනුව ව්‍යාපෘති වර්ග / வாழ்வாதார அடிப்படையில் திட்ட வகைகள்
                        </h2>
                        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            View all project types organized by their respective livelihoods. Select a livelihood to see its project types.
                        </p>
                    </div>

                    <ProjectTypesTable />
                </div>

                <div className={`p-4 rounded-lg border ${theme === 'dark'
                        ? 'border-gray-600 bg-gray-700'
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                <strong>Note:</strong> If you don&apos;t see any livelihoods in the dropdown, please add them first from the Create page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessOpportunityView;