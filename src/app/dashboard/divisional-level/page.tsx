// /dashboard/divisional-level/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import BeneficiaryCountTable from '@/components/dashboard/BeneficiaryCountTable';
import { 
    getBeneficiaryCountByYear, 
    getLocationDisplayName,
    BeneficiaryCountResponseDto 
} from '@/services/dashboardService';

const DsOfficerDashboard = () => {
    const { theme } = useTheme();
    const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryCountResponseDto | null>(null);
    const [locationName, setLocationName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [data, location] = await Promise.all([
                    getBeneficiaryCountByYear(),
                    getLocationDisplayName()
                ]);

                setBeneficiaryData(data);
                setLocationName(location);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen p-6">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 space-y-6">
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Divisional Officer Dashboard
                </h1>
                <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {locationName}
                </p>
            </div>

            {/* Beneficiary Count Table */}
            {beneficiaryData && (
                <BeneficiaryCountTable
                    data={beneficiaryData}
                    title="Division Beneficiary Count by Year"
                    locationDisplayName={locationName}
                    isLoading={isLoading}
                />
            )}

            {/* Divisional-specific dashboard widgets */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Zone Performance Comparison
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Performance metrics of all zones under this DS division...
                    </p>
                </div>
                
                <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Program Effectiveness
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Effectiveness analysis of different programs in division...
                    </p>
                </div>

                <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        GND Division Overview
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Summary of all GND divisions and their beneficiary counts...
                    </p>
                </div>

                <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Resource Allocation
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Budget and resource allocation across zones...
                    </p>
                </div>
            </div> */}
        </div>
    );
};

export default DsOfficerDashboard;