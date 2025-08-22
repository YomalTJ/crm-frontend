'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SamurdhiFamilyForm from '@/components/forms/SamurdhiFamillyForm';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { BeneficiaryDetailsResponse, getBeneficiaryByIdentifier } from '@/services/samurdhiService';
import toast from 'react-hot-toast';

const EditBeneficiaryContent = () => {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryDetailsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const id = params?.id as string;

    useEffect(() => {
        const fetchBeneficiaryData = async () => {
            if (!id) {
                setError('No beneficiary ID provided');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await getBeneficiaryByIdentifier(id);
                setBeneficiaryData(data);
            } catch (error: unknown) {
                console.error('Error fetching beneficiary data:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to load beneficiary data';
                setError(errorMessage);
                toast.error('Failed to load beneficiary data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBeneficiaryData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner size="lg" />
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Loading Beneficiary Data...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Please wait while we fetch the details
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/40 rounded-full">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                            Error Loading Data
                        </h3>
                        <p className="text-red-600 dark:text-red-400 mb-4">
                            {error}
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <SamurdhiFamilyForm
            initialData={beneficiaryData}
            isEditMode={true}
            editId={id}
        />
    );
};

const EditBeneficiaryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div>
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <LoadingSpinner size="lg" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    Loading Edit Form...
                                </p>
                            </div>
                        </div>
                    }
                >
                    <EditBeneficiaryContent />
                </Suspense>
            </div>
        </div>
    );
};

export default EditBeneficiaryPage;