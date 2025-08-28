'use client'

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import AddLivelihoodForm from '@/components/business-opportunity/AddLivelihoodForm';
import AddProjectTypeForm from '@/components/business-opportunity/AddProjectTypeForm';

const BusinessOpportunityManage = () => {
    const { theme } = useTheme();
    const [activeForm, setActiveForm] = useState<'none' | 'livelihood' | 'projectType'>('none');

    const handleFormSuccess = () => {
        setActiveForm('none');
        // You might want to show a success message here
        alert('Successfully added!');
    };

    const handleFormCancel = () => {
        setActiveForm('none');
    };

    const buttonClasses = `px-6 py-3 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500`;

    return (
        <div>
            <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                ව්‍යාපාරික අවස්ථා කළමනාකරණය -
                Business Opportunities Management   / வணிக வாய்ப்பு மேலாண்மை
            </h1>

            <div className="space-y-6 mt-10">
                {activeForm === 'none' && (
                    <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            Choose an Action / ක්‍රියාමාර්ගයක් තෝරන්න / ஒரு செயல்பாட்டைத் தேர்ந்தெடுக்கவும்
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg border ${theme === 'dark'
                                    ? 'border-gray-600 bg-gray-700'
                                    : 'border-gray-200 bg-gray-50'
                                }`}>
                                <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Add Livelihood
                                </h3>
                                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    Add a new livelihood category to the system.
                                </p>
                                <button
                                    onClick={() => setActiveForm('livelihood')}
                                    className={`${buttonClasses} bg-blue-600 hover:bg-blue-700 text-white w-full`}
                                >
                                    Add Livelihood
                                </button>
                            </div>

                            <div className={`p-4 rounded-lg border ${theme === 'dark'
                                    ? 'border-gray-600 bg-gray-700'
                                    : 'border-gray-200 bg-gray-50'
                                }`}>
                                <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Add Project Type
                                </h3>
                                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    Add a new project type under an existing livelihood.
                                </p>
                                <button
                                    onClick={() => setActiveForm('projectType')}
                                    className={`${buttonClasses} bg-green-600 hover:bg-green-700 text-white w-full`}
                                >
                                    Add Project Type
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                        Information
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>First, you need to add livelihoods (categories) to the system</li>
                                            <li>Then you can add project types under each livelihood</li>
                                            <li>Go to the View page to see all project types organized by livelihood</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeForm === 'livelihood' && (
                    <AddLivelihoodForm
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                )}

                {activeForm === 'projectType' && (
                    <AddProjectTypeForm
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                )}
            </div>
        </div>
    );
};

export default BusinessOpportunityManage;