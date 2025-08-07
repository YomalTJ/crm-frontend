'use client'

import React, { Suspense } from 'react'
import EditSamurdhiFamilyForm from '@/components/forms/EditSamurdhiFamilyForm'
import LoadingSpinner from '@/components/loading/LoadingSpinner'

const EditBeneficiaryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <EditSamurdhiFamilyForm />
                </Suspense>
            </div>
        </div>
    )
}

export default EditBeneficiaryPage