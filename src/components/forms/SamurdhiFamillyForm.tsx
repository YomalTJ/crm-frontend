"use client";

import React from 'react';
import ComponentCard from '../common/ComponentCard';
import Button from '../ui/button/Button';
import LoadingSpinner from '../loading/LoadingSpinner';
import FormSkeleton from '../loading/FormSkeleton';
import LoadingOverlay from '../loading/LoadingOverlay';
import { Toaster } from 'react-hot-toast';

// Custom hooks and utilities
import { useSamurdhiFormData } from '@/hooks/useSamurdhiFormData';
import { useSamurdhiFormHandlers } from '@/hooks/useSamurdhiFormHandlers';

// Form field components
import {
    LocationFields,
    MainProgramField,
    ConsentFields,
    AreaClassificationField,
    BeneficiaryTypeField,
    HouseholdNumberField,
    NicField,
    BasicInfoFields,
    ProjectOwnerFields,
    HouseholdMembersField,
    EmploymentFields,
    BenefitsFields,
    EmpowermentField,
    ProjectTypeField,
    ChildDetailsFields,
    CheckboxSections,
    BankingDetailsFields
} from '@/components/form-fields/FormFieldComponents';

const SamurdhiFamilyForm = () => {
    // Custom hooks for data and handlers
    const {
        formData,
        setFormData,
        formOptions,
        householdNumbers,
        isInitialLoading,
        isLoadingHouseholdNumbers,
        resetForm
    } = useSamurdhiFormData();

    const {
        errors,
        setErrors,
        isFetching,
        isSubmitting,
        isFormResetting,
        isExistingBeneficiary,
        setIsExistingBeneficiary,
        setIsAswasumaHouseholdDisabled,
        showAllFieldsForExistingBeneficiary,
        setShowAllFieldsForExistingBeneficiary,
        handleInputChange,
        handleSelectChange,
        handleRadioChange,
        handleCheckboxChange,
        handleNicLookup,
        handleHouseholdSelection,
        handleSubmit
    } = useSamurdhiFormHandlers({
        formData,
        setFormData,
        formOptions,
        resetForm
    });

    // Create handlers object for passing to components
    const handlers = {
        handleInputChange,
        handleSelectChange,
        handleRadioChange,
        handleCheckboxChange,
        handleNicLookup,
        handleHouseholdSelection
    };

    // Handle form reset
    const handleFormReset = () => {
        resetForm();
        setIsExistingBeneficiary(false);
        setErrors({});
        setIsAswasumaHouseholdDisabled(false);
        setShowAllFieldsForExistingBeneficiary(false);
    };

    return (
        <ComponentCard title="Family Development plan for Community Empowerment">
            {isInitialLoading ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <LoadingSpinner size="lg" />
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    Loading Form Data...
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Please wait while we prepare the form
                                </p>
                            </div>
                        </div>
                    </div>
                    <FormSkeleton />
                </div>
            ) : (
                <LoadingOverlay
                    isLoading={isFetching || isLoadingHouseholdNumbers}
                    message={isFetching ? "Fetching beneficiary details..." : "Loading household numbers..."}
                >
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-6">
                            {/* Location Fields */}
                            <LocationFields formData={formData} />

                            {/* Main Program Field */}
                            <MainProgramField
                                formData={formData}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Consent Fields */}
                            <ConsentFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Area Classification */}
                            <AreaClassificationField
                                formData={formData}
                                handlers={handlers}
                            />

                            {/* Beneficiary Type */}
                            <BeneficiaryTypeField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Household Number Field */}
                            <HouseholdNumberField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                householdNumbers={householdNumbers}
                                isLoadingHouseholdNumbers={isLoadingHouseholdNumbers}
                                handlers={handlers}
                            />

                            {/* NIC Field */}
                            <NicField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                isFetching={isFetching}
                                handlers={handlers}
                            />

                            {/* Basic Information Fields */}
                            <BasicInfoFields
                                formData={formData}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Project Owner Fields */}
                            <ProjectOwnerFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Household Members */}
                            <HouseholdMembersField
                                formData={formData}
                                handlers={handlers}
                            />

                            {/* Employment Fields */}
                            <EmploymentFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Benefits Fields */}
                            <BenefitsFields
                                formData={formData}
                                formOptions={formOptions}
                                handlers={handlers}
                            />

                            {/* Empowerment Dimension */}
                            <EmpowermentField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Project Type Field (conditional) */}
                            <ProjectTypeField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                showAllFieldsForExistingBeneficiary={showAllFieldsForExistingBeneficiary}
                                handlers={handlers}
                            />

                            {/* Other Project Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Specify other projects
                                </label>
                                <input
                                    type="text"
                                    name="otherProject"
                                    value={formData.otherProject || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            {/* Child Details Fields (conditional) */}
                            <ChildDetailsFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                showAllFieldsForExistingBeneficiary={showAllFieldsForExistingBeneficiary}
                                handlers={handlers}
                            />

                            {/* Checkbox Sections */}
                            <CheckboxSections
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                            />

                            {/* Banking Details */}
                            <BankingDetailsFields
                                formData={formData}
                                handlers={handlers}
                            />

                            {/* Form Actions */}
                            <div className="flex items-center gap-5">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting || isFormResetting}
                                    className="flex items-center gap-2"
                                >
                                    {(isSubmitting || isFormResetting) && <LoadingSpinner size="sm" color="white" />}
                                    {isSubmitting
                                        ? (isExistingBeneficiary ? 'Updating...' : 'Submitting...')
                                        : isFormResetting
                                            ? 'Processing...'
                                            : (isExistingBeneficiary ? 'Update' : 'Submit')
                                    }
                                </Button>

                                <Button
                                    size="md"
                                    variant="danger"
                                    type="button"
                                    onClick={handleFormReset}
                                    disabled={isSubmitting || isFormResetting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Toast Notifications */}
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
                </LoadingOverlay>
            )}
        </ComponentCard>
    );
};

export default SamurdhiFamilyForm;