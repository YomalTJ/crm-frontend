'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import BeneficiaryCountTable from '@/components/dashboard/BeneficiaryCountTable';
import BeneficiaryTypeTable from '@/components/dashboard/BeneficiaryTypeTable';
import EmpowermentDimensionTable from '@/components/dashboard/EmpowermentDimensionTable';
import {
    getBeneficiaryCountByYear,
    getBeneficiaryTypeCounts,
    getEmpowermentDimensionCounts,
    getLocationDisplayName,
    BeneficiaryCountResponseDto,
    BeneficiaryTypeCountResponseDto,
    EmpowermentDimensionCountResponseDto
} from '@/services/dashboardService';

const ZoneOfficerDashboard = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryCountResponseDto | null>(null);
    const [beneficiaryTypeData, setBeneficiaryTypeData] = useState<BeneficiaryTypeCountResponseDto | null>(null);
    const [empowermentData, setEmpowermentData] = useState<EmpowermentDimensionCountResponseDto | null>(null);
    const [locationName, setLocationName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch all data in parallel
                const [countData, typeData, empowermentData, location] = await Promise.all([
                    getBeneficiaryCountByYear(),
                    getBeneficiaryTypeCounts(),
                    getEmpowermentDimensionCounts(),
                    getLocationDisplayName()
                ]);

                setBeneficiaryData(countData);
                setBeneficiaryTypeData(typeData);
                setEmpowermentData(empowermentData);
                setLocationName(location);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setError(t('dashboard.failedToLoadData'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [t]);

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
                    {t('dashboard.zoneOfficerDashboard')}
                </h1>
                <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {locationName}
                </p>
            </div>

            {/* Grid Layout for Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Beneficiary Count Table */}
                {beneficiaryData && (
                    <BeneficiaryCountTable
                        data={beneficiaryData}
                        title={t('dashboard.zoneBeneficiaryCountByYear')}
                        locationDisplayName={locationName}
                        isLoading={isLoading}
                    />
                )}

                {/* Beneficiary Type Table */}
                {beneficiaryTypeData && (
                    <BeneficiaryTypeTable
                        data={beneficiaryTypeData}
                        title={t('dashboard.zoneBeneficiaryCountByType')}
                        locationDisplayName={locationName}
                        isLoading={isLoading}
                    />
                )}

                {/* Empowerment Dimension Table */}
                {empowermentData && (
                    <EmpowermentDimensionTable
                        data={empowermentData}
                        title={t('dashboard.empowermentDimensionCounts')}
                        locationDisplayName={locationName}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default ZoneOfficerDashboard;