'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    createGrantUtilization,
    updateGrantUtilization,
    GrantUtilizationPayload,
    checkGrantUtilizationExists,
    getGrantUtilizationsByHhNumberOrNic
} from '@/services/grantUtilizationService';
import { BeneficiaryDetailsResponse, getBeneficiaryByIdentifier } from '@/services/samurdhiService';
import { AccessibleLocations, getAccessibleLocations } from '@/services/projectDetailReportService';
import BeneficiaryInfo from '@/components/grant-utilization/BeneficiaryInfo';
import CustomDatePicker from '@/components/grant-utilization/CustomDatePicker';
import GrantInfoSection from '@/components/grant-utilization/GrantInfoSection';
import LivelihoodSection from '@/components/grant-utilization/LivelihoodSection';
import LocationInfo from '@/components/grant-utilization/LocationInfo';
import TrainingSection from '@/components/grant-utilization/TrainingSection';
import { FormErrors } from '@/types/samurdhi-form.types';
import toast, { Toaster } from 'react-hot-toast';

const GrantUtilizationForm = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const hhNumberOrNic = params.id as string;
    const [errors, setErrors] = useState<FormErrors>({});
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [existingGrantId, setExistingGrantId] = useState<string | null>(null);

    // State for form data
    const [formData, setFormData] = useState<GrantUtilizationPayload>({
        hhNumberOrNic: hhNumberOrNic,
        amount: 0,
        grantDate: '',
        purchaseDate: null,
        equipmentPurchased: null,
        animalsPurchased: null,
        plantsPurchased: null,
        othersPurchased: null,
        projectStartDate: null,
        employmentOpportunities: null,
        traineeName: null,
        traineeAge: null,
        traineeGender: null,
        courseName: null,
        institutionName: null,
        courseFee: null,
        courseDuration: null,
        courseStartDate: null,
        courseEndDate: null
    });

    // State for beneficiary and location data
    const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryDetailsResponse | null>(null);
    const [, setAccessibleLocations] = useState<AccessibleLocations | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Theme-aware styles
    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBgColor = () => theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const getInputBgColor = () => theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
    const getLabelColor = () => theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

    // Load initial data and check if record exists
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setError(null);
                setLoading(true);

                // Load beneficiary data
                const beneficiary = await getBeneficiaryByIdentifier(hhNumberOrNic);
                setBeneficiaryData(beneficiary);
                toast.success(t('grantUtilization.beneficiaryLoaded'));

                // Load locations
                const locations = await getAccessibleLocations();
                setAccessibleLocations(locations);

                // Check if grant utilization already exists
                const exists = await checkGrantUtilizationExists(hhNumberOrNic);

                if (exists) {
                    // Load existing grant utilization data
                    const existingData = await getGrantUtilizationsByHhNumberOrNic(hhNumberOrNic);

                    if (existingData.grantUtilizations && existingData.grantUtilizations.length > 0) {
                        setIsUpdateMode(true);
                        const latestGrant = existingData.grantUtilizations[0]; // Get the most recent grant
                        setExistingGrantId(latestGrant.id);

                        // Pre-fill form with existing data
                        setFormData(prev => ({
                            ...prev,
                            amount: latestGrant.amount || 0,
                            grantDate: latestGrant.grantDate ? new Date(latestGrant.grantDate).toISOString().split('T')[0] : '',
                            purchaseDate: latestGrant.purchaseDate ? new Date(latestGrant.purchaseDate).toISOString().split('T')[0] : null,
                            equipmentPurchased: latestGrant.equipmentPurchased || null,
                            animalsPurchased: latestGrant.animalsPurchased || null,
                            plantsPurchased: latestGrant.plantsPurchased || null,
                            othersPurchased: latestGrant.othersPurchased || null,
                            projectStartDate: latestGrant.projectStartDate ? new Date(latestGrant.projectStartDate).toISOString().split('T')[0] : null,
                            employmentOpportunities: latestGrant.employmentOpportunities || null,
                            traineeName: latestGrant.traineeName || null,
                            traineeAge: latestGrant.traineeAge || null,
                            traineeGender: latestGrant.traineeGender || null,
                            courseName: latestGrant.courseName || null,
                            institutionName: latestGrant.institutionName || null,
                            courseFee: latestGrant.courseFee || null,
                            courseDuration: latestGrant.courseDuration || null,
                            courseStartDate: latestGrant.courseStartDate ? new Date(latestGrant.courseStartDate).toISOString().split('T')[0] : null,
                            courseEndDate: latestGrant.courseEndDate ? new Date(latestGrant.courseEndDate).toISOString().split('T')[0] : null
                        }));

                        toast.success(t('grantUtilization.existingDataLoaded'));
                    }
                }

                setFormData(prev => ({ ...prev, hhNumberOrNic }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : t('grantUtilization.loadingError');
                setError(errorMessage);
                toast.error(errorMessage);
                console.error('Error loading grant utilization form data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (hhNumberOrNic) loadInitialData();
    }, [hhNumberOrNic, t]);

    // Handle input changes
    const handleInputChange = (field: keyof GrantUtilizationPayload, value: string | number | null | undefined) => {
        setFormData(prev => ({
            ...prev,
            [field]: value === null ? null : value || null
        }));
    };

    // Validation function
    const validateGrantUtilizationForm = (formData: GrantUtilizationPayload): FormErrors => {
        const errors: FormErrors = {};
        if (!formData.amount || formData.amount <= 0) errors.amount = t('grantUtilization.validAmount');
        if (!formData.grantDate) errors.grantDate = t('grantUtilization.grantDateRequired');

        if (formData.courseStartDate && formData.courseEndDate) {
            const startDate = new Date(formData.courseStartDate);
            const endDate = new Date(formData.courseEndDate);
            if (endDate < startDate) errors.courseEndDate = t('grantUtilization.endDateAfterStart');
        }

        if (formData.purchaseDate) {
            const purchaseDate = new Date(formData.purchaseDate);
            const today = new Date();
            if (purchaseDate > today) errors.purchaseDate = t('grantUtilization.purchaseDateFuture');
        }

        if (formData.grantDate && formData.projectStartDate) {
            const grantDate = new Date(formData.grantDate);
            const projectStartDate = new Date(formData.projectStartDate);
            if (projectStartDate < grantDate) errors.projectStartDate = t('grantUtilization.projectAfterGrant');
        }

        if (formData.courseName && (!formData.courseFee || formData.courseFee <= 0)) {
            errors.courseFee = t('grantUtilization.validCourseFee');
        }

        if (formData.traineeName && (!formData.traineeAge || formData.traineeAge <= 0)) {
            errors.traineeAge = t('grantUtilization.validAge');
        }

        return errors;
    };

    // Handle form submission - UPDATED VERSION
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formErrors = validateGrantUtilizationForm(formData);
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            const errorMessage = t('grantUtilization.fixErrors');
            setError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            if (isUpdateMode && existingGrantId) {
                // Update existing record
                await updateGrantUtilization(existingGrantId, formData);
                toast.success(t('grantUtilization.updateSuccess'));
            } else {
                // Create new record
                console.log('Creating new grant utilization');
                await createGrantUtilization(formData);
                toast.success(t('grantUtilization.createSuccess'));
            }

            setTimeout(() => {
                router.push('/dashboard/grant-utilization');
            }, 1500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message :
                isUpdateMode ? t('grantUtilization.updateError') : t('grantUtilization.createError');
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${getBgColor()}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className={`ml-3 text-lg ${getTextColor()}`}>{t('grantUtilization.loadingFormData')}</span>
            </div>
        );
    }

    if (error && !beneficiaryData) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${getBgColor()}`}>
                <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-red-100' : 'text-red-800'}`}>{t('grantUtilization.errorLoadingData')}</h3>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className={`mt-4 px-4 py-2 rounded-md text-sm transition-colors ${theme === 'dark'
                            ? 'bg-red-700 text-white hover:bg-red-600'
                            : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {t('grantUtilization.retry')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        maxWidth: '500px',
                    },
                    success: {
                        duration: 5000,
                        style: {
                            background: '#10B981',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid #059669',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: '#10B981',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid #DC2626',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                        },
                    },
                }}
                containerStyle={{
                    top: '100px',
                    right: 20,
                }}
            />

            <div className={`min-h-screen ${getBgColor()} p-6`}>
                <div className={`${getCardBgColor()} rounded-lg shadow-sm p-6 mb-6 border ${getBorderColor()}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className={`text-2xl font-bold ${getTextColor()}`}>
                            {isUpdateMode ? t('grantUtilization.updateTitle') : t('grantUtilization.title')}
                        </h1>
                        {isUpdateMode && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark'
                                ? 'bg-blue-900 text-blue-100'
                                : 'bg-blue-100 text-blue-800'
                                }`}>
                                {t('grantUtilization.updateMode')}
                            </span>
                        )}
                    </div>

                    {beneficiaryData && (
                        <BeneficiaryInfo
                            beneficiaryData={beneficiaryData}
                            theme={theme}
                            t={t}
                            getBorderColor={getBorderColor}
                            getTextColor={getTextColor}
                        />
                    )}

                    {error && (
                        <div className={`bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 ${getBorderColor()} border border-red-300 dark:border-red-700`}>
                            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className={`${getCardBgColor()} rounded-lg shadow-sm p-6 border ${getBorderColor()}`}>
                    <LocationInfo
                        beneficiaryData={beneficiaryData}
                        theme={theme}
                        t={t}
                        getBorderColor={getBorderColor}
                        getLabelColor={getLabelColor}
                    />

                    <GrantInfoSection
                        formData={formData}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        theme={theme}
                        t={t}
                        getBorderColor={getBorderColor}
                        getInputBgColor={getInputBgColor}
                        getLabelColor={getLabelColor}
                        CustomDatePicker={CustomDatePicker}
                    />

                    <LivelihoodSection
                        formData={formData}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        theme={theme}
                        t={t}
                        getBorderColor={getBorderColor}
                        getInputBgColor={getInputBgColor}
                        getLabelColor={getLabelColor}
                        CustomDatePicker={CustomDatePicker}
                    />

                    <TrainingSection
                        formData={formData}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        theme={theme}
                        t={t}
                        getBorderColor={getBorderColor}
                        getInputBgColor={getInputBgColor}
                        getLabelColor={getLabelColor}
                        CustomDatePicker={CustomDatePicker}
                    />

                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={submitting}
                            className={`px-6 py-2 border rounded-md text-sm font-medium transition-colors ${theme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                                }`}
                        >
                            {t('common.cancel')}
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${submitting
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : theme === 'dark'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {submitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isUpdateMode ? t('grantUtilization.updating') : t('grantUtilization.creating')}
                                </span>
                            ) : (
                                isUpdateMode ? t('grantUtilization.updateGrantUtilization') : t('grantUtilization.createGrantUtilization')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default GrantUtilizationForm;