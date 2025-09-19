"use client";

import React, { useEffect } from 'react';
import ComponentCard from '../common/ComponentCard';
import Button from '../ui/button/Button';
import LoadingSpinner from '../loading/LoadingSpinner';
import FormSkeleton from '../loading/FormSkeleton';
import LoadingOverlay from '../loading/LoadingOverlay';
import { Toaster } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

// Custom hooks and utilities
import { useSamurdhiFormData } from '@/hooks/useSamurdhiFormData';
import { useSamurdhiFormHandlers } from '@/hooks/useSamurdhiFormHandlers';

// Form field components
import {
    LocationFields,
    MainProgramField,
    ConsentFields,
    ConsentLetterUpload,
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
    MonthlySavingField,
    BankingDetailsFields,
    ImpactEvaluationField,
} from '@/components/form-fields/FormFieldComponents';
import { BeneficiaryDetailsResponse } from '@/services/samurdhiService';
import { LocationData } from '@/types/samurdhi-form.types';

interface SamurdhiFamilyFormProps {
    initialData?: BeneficiaryDetailsResponse | null;
    isEditMode?: boolean;
    editId?: string;
}

const createEmptyFormData = (locationData: Partial<{
    district: LocationData;
    dsDivision: LocationData;
    zone: LocationData;
    gnd: LocationData;
}> = {}) => {
    return {
        district: locationData.district || { id: '', name: '' },
        dsDivision: locationData.dsDivision || { id: '', name: '' },
        zone: locationData.zone || { id: '', name: '' },
        gnd: locationData.gnd || { id: '', name: '' },
        mainProgram: null,
        isImpactEvaluation: null,
        areaClassification: null,
        beneficiary_type_id: null,
        hasConsentedToEmpowerment: null,
        consentLetterPath: null,
        hasObtainedConsentLetter: null,
        refusal_reason_id: null,
        consentGivenAt: null,
        aswasumaHouseholdNo: null,
        nic: null,
        beneficiaryName: null,
        beneficiaryAge: 0,
        beneficiaryGender: null,
        address: null,
        mobilePhone: null,
        telephone: null,
        projectOwnerName: null,
        projectOwnerAge: 0,
        projectOwnerGender: null,
        hasDisability: false,
        disability_id: null,
        maleBelow16: 0,
        femaleBelow16: 0,

        male16To24: 0,
        female16To24: 0,

        male25To45: 0,
        female25To45: 0,

        male46To60: 0,
        female46To60: 0,

        maleAbove60: 0,
        femaleAbove60: 0,

        employment_id: null,
        otherOccupation: null,
        subsisdy_id: null,
        aswesuma_cat_id: null,
        empowerment_dimension_id: null,
        selectedLivelihood: null,
        livelihood_id: null,
        project_type_id: null,
        otherProject: null,
        childName: null,
        childAge: 0,
        childGender: null,
        job_field_id: null,
        otherJobField: null,
        resource_id: [],
        monthlySaving: false,
        savingAmount: 0,
        health_indicator_id: [],
        domestic_dynamic_id: [],
        community_participation_id: [],
        housing_service_id: [],
        commercialBankAccountName: null,
        commercialBankAccountNumber: null,
        commercialBankName: null,
        commercialBankBranch: null,
        samurdhiBankAccountName: null,
        samurdhiBankAccountNumber: null,
        samurdhiBankName: null,
        samurdhiBankAccountType: null,
        wantsAswesumaBankTransfer: false,
        otherBankName: null,
        otherBankBranch: null,
        otherBankAccountHolder: null,
        otherBankAccountNumber: null,
        hasOtherGovernmentSubsidy: false,
        otherGovernmentInstitution: null,
        otherSubsidyAmount: null
    };
};

const SamurdhiFamilyForm: React.FC<SamurdhiFamilyFormProps> = ({
    initialData = null,
    isEditMode = false,
    editId
}) => {
    // Custom hooks for data and handlers
    const {
        formData,
        setFormData,
        formOptions,
        householdNumbers,
        isInitialLoading,
        isLoadingHouseholdNumbers,
        householdLoadedFields,
        setHouseholdLoadedFields,
        resetForm,
        clearHouseholdLoadedFields
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
        projectTypesByLivelihood,
        isLoadingProjectTypes,
        handleLivelihoodChange,
        setSelectedFile,
        selectedFile,
        handleInputChange,
        handleSelectChange,
        handleRadioChange,
        handleCheckboxChange,
        handleNicLookup,
        handleHouseholdSelection,
        handleFileChange,
        handleSubmit
    } = useSamurdhiFormHandlers({
        formData,
        setFormData,
        formOptions,
        resetForm,
        isEditMode,
        editId,
        householdLoadedFields,
        setHouseholdLoadedFields
    });

    const { t } = useLanguage();

    // Create handlers object for passing to components
    const handlers = {
        handleInputChange,
        handleSelectChange,
        handleRadioChange,
        handleCheckboxChange,
        handleNicLookup,
        handleHouseholdSelection,
        handleFileChange,
        clearHouseholdLoadedFields
    };

    useEffect(() => {
        if (isEditMode && initialData && !isInitialLoading) {
            // Convert API response to form data format
            const locationData = {
                district: {
                    id: initialData.location.district?.id?.toString() || '',
                    name: initialData.location.district?.name || '',
                    districtId: initialData.location.district?.id || 0
                },
                dsDivision: {
                    id: initialData.location.divisionalSecretariat?.id?.toString() || '',
                    name: initialData.location.divisionalSecretariat?.name || '',
                    dsId: initialData.location.divisionalSecretariat?.id || 0
                },
                zone: {
                    id: initialData.location.samurdhiBank?.id?.toString() || '',
                    name: initialData.location.samurdhiBank?.name || '',
                    zoneId: initialData.location.samurdhiBank?.id || 0
                },
                gnd: {
                    id: initialData.location.gramaNiladhariDivision?.id?.toString() || '',
                    name: initialData.location.gramaNiladhariDivision?.name || '',
                    gndId: parseInt(initialData.location.gramaNiladhariDivision?.id || '0') || 0
                }
            };

            const editFormData = createEmptyFormData(locationData);

            // Map API response to form data structure
            const mappedData = {
                ...editFormData,
                mainProgram: initialData.mainProgram || null,
                isImpactEvaluation: null, // This would need to be determined based on business logic
                areaClassification: initialData.areaClassification || null,
                beneficiary_type_id: initialData.beneficiaryType?.id || null,
                hasConsentedToEmpowerment: initialData.hasConsentedToEmpowerment,
                consentLetterPath: initialData.consentLetterPath || null,
                hasObtainedConsentLetter: !!initialData.consentLetterPath,
                refusal_reason_id: initialData.refusalReason?.id || null,
                consentGivenAt: initialData.consentGivenAt,
                aswasumaHouseholdNo: initialData.householdNumber || null,
                nic: editId || null, // The edit ID is the NIC or household number
                beneficiaryName: initialData.beneficiaryDetails.name || null,
                beneficiaryAge: initialData.beneficiaryDetails.age || 0,
                beneficiaryGender: initialData.beneficiaryDetails.gender || null,
                address: initialData.address || null,
                mobilePhone: initialData.mobilePhone || null,
                telephone: initialData.telephone || null,
                projectOwnerName: initialData.projectOwnerDetails.name || null,
                projectOwnerAge: initialData.projectOwnerDetails.age || 0,
                projectOwnerGender: initialData.projectOwnerDetails.gender || null,
                hasDisability: initialData.hasDisability || false,
                disability_id: initialData.disability?.id || null,
                maleBelow16: initialData.noOfMembers.male.ageBelow16 || 0,
                femaleBelow16: initialData.noOfMembers.female.ageBelow16 || 0,

                male16To24: initialData.noOfMembers.male.age16To24 || 0,
                female16To24: initialData.noOfMembers.female.age16To24 || 0,

                male25To45: initialData.noOfMembers.male.age25To45 || 0,
                female25To45: initialData.noOfMembers.female.age25To45 || 0,

                male46To60: initialData.noOfMembers.male.age46To60 || 0,
                female46To60: initialData.noOfMembers.female.age46To60 || 0,

                maleAbove60: initialData.noOfMembers.male.ageAbove60 || 0,
                femaleAbove60: initialData.noOfMembers.female.ageAbove60 || 0,

                employment_id: initialData.currentEmployment?.id || null,
                otherOccupation: initialData.otherOccupation || null,
                subsisdy_id: initialData.samurdhiSubsidy?.id || null,
                aswesuma_cat_id: initialData.aswasumaCategory?.id || null,
                empowerment_dimension_id: initialData.empowermentDimension?.id || null,
                selectedLivelihood: initialData.livelihood?.id || null,
                livelihood_id: initialData.livelihood?.id || null,
                project_type_id: initialData.projectType?.id || null,
                otherProject: initialData.otherProject || null,
                childName: initialData.childName || null,
                childAge: initialData.childAge || 0,
                childGender: initialData.childGender || null,
                job_field_id: initialData.jobField?.id || null,
                otherJobField: initialData.otherJobField || null,
                resource_id: initialData.resources?.map(r => r.id) || [],
                monthlySaving: initialData.monthlySaving || false,
                savingAmount: initialData.savingAmount || 0,
                health_indicator_id: initialData.healthIndicators?.map(h => h.id) || [],
                domestic_dynamic_id: initialData.domesticDynamics?.map(d => d.id) || [],
                community_participation_id: initialData.communityParticipations?.map(c => c.id) || [],
                housing_service_id: initialData.housingServices?.map(h => h.id) || [],
                commercialBankAccountName: initialData.location.commercialBankDetails.accountName || null,
                commercialBankAccountNumber: initialData.location.commercialBankDetails.accountNumber || null,
                commercialBankName: initialData.location.commercialBankDetails.bankName || null,
                commercialBankBranch: initialData.location.commercialBankDetails.branch || null,
                samurdhiBankAccountName: initialData.location.samurdhiBankDetails.accountName || null,
                samurdhiBankAccountNumber: initialData.location.samurdhiBankDetails.accountNumber || null,
                samurdhiBankName: initialData.location.samurdhiBankDetails.bankName || null,
                samurdhiBankAccountType: initialData.location.samurdhiBankDetails.accountType || null,
                wantsAswesumaBankTransfer: initialData.bankTransferPreferences.wantsAswesumaBankTransfer || false,
                otherBankName: initialData.bankTransferPreferences.otherBankDetails.bankName || null,
                otherBankBranch: initialData.bankTransferPreferences.otherBankDetails.branch || null,
                otherBankAccountHolder: initialData.bankTransferPreferences.otherBankDetails.accountHolder || null,
                otherBankAccountNumber: initialData.bankTransferPreferences.otherBankDetails.accountNumber || null,
                hasOtherGovernmentSubsidy: initialData.governmentSubsidy.hasOtherGovernmentSubsidy || false,
                otherGovernmentInstitution: initialData.governmentSubsidy.institution || null,
                otherSubsidyAmount: initialData.governmentSubsidy.amount || null
            };

            setFormData(mappedData);
            setIsExistingBeneficiary(true);
            setShowAllFieldsForExistingBeneficiary(true);

            // Check if this is a previous Samurdhi beneficiary to disable household selection
            const isPreviousSamurdhi = initialData.beneficiaryType?.id === '77744e4d-48a4-4295-8a5d-38d2100599f9' ||
                initialData.beneficiaryType?.nameEnglish?.includes("Previous Samurdhi") ||
                initialData.beneficiaryType?.nameEnglish?.includes("Low income");
            setIsAswasumaHouseholdDisabled(isPreviousSamurdhi);
        }
    }, [initialData, isEditMode, isInitialLoading, setFormData, setIsExistingBeneficiary, setShowAllFieldsForExistingBeneficiary, setIsAswasumaHouseholdDisabled, editId]);

    // Handle form reset
    const handleFormReset = () => {
        resetForm();
        setIsExistingBeneficiary(false);
        setErrors({});
        setIsAswasumaHouseholdDisabled(false);
        setShowAllFieldsForExistingBeneficiary(false);
        setSelectedFile(null);
        setHouseholdLoadedFields(new Set());
        clearHouseholdLoadedFields();
    };

    const formTitle = isEditMode
        ? t('samurdhiForm.editTitle')
        : t('samurdhiForm.title');

    return (
        <ComponentCard title={formTitle}>
            {isInitialLoading ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <LoadingSpinner size="lg" />
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    {t('samurdhiForm.loadingFormData')}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('samurdhiForm.loadingMessage')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <FormSkeleton />
                </div>
            ) : (
                <LoadingOverlay
                    isLoading={isFetching || isLoadingHouseholdNumbers}
                    message={isFetching ? t('samurdhiForm.fetchingDetails') : t('samurdhiForm.loadingHouseholdNumbers')}
                >
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-6">
                            {/* Location Fields */}
                            <LocationFields formData={formData} t={t} />

                            {/* Main Program Field */}
                            <MainProgramField
                                formData={formData}
                                errors={errors}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Impact Evaluation Field */}
                            <ImpactEvaluationField
                                formData={formData}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Consent Fields */}
                            <ConsentFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Consent Letter Upload */}
                            <ConsentLetterUpload
                                formData={formData}
                                errors={errors}
                                handlers={{ handleFileChange: handleFileChange }}
                                selectedFile={selectedFile}
                                t={t}
                            />

                            {/* Area Classification */}
                            <AreaClassificationField
                                formData={formData}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Beneficiary Type */}
                            <BeneficiaryTypeField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Household Number Field */}
                            <HouseholdNumberField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                householdNumbers={householdNumbers}
                                isLoadingHouseholdNumbers={isLoadingHouseholdNumbers}
                                handlers={handlers}
                                t={t}
                            />

                            {/* NIC Field */}
                            <NicField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                isFetching={isFetching}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Basic Information Fields */}
                            <BasicInfoFields
                                formData={formData}
                                errors={errors}
                                handlers={handlers}
                                householdLoadedFields={householdLoadedFields}
                                t={t}
                            />

                            {/* Project Owner Fields */}
                            <ProjectOwnerFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                                householdLoadedFields={householdLoadedFields}
                                t={t}
                            />

                            {/* Household Members */}
                            <HouseholdMembersField
                                formData={formData}
                                handlers={handlers}
                                householdLoadedFields={householdLoadedFields}
                                t={t}
                            />

                            {/* Employment Fields */}
                            <EmploymentFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Benefits Fields */}
                            <BenefitsFields
                                formData={formData}
                                formOptions={formOptions}
                                handlers={handlers}
                                householdLoadedFields={householdLoadedFields}
                                t={t}
                            />

                            {/* Empowerment Dimension */}
                            <EmpowermentField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Project Type Field (conditional) */}
                            <ProjectTypeField
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                showAllFieldsForExistingBeneficiary={showAllFieldsForExistingBeneficiary}
                                handlers={handlers}
                                projectTypesByLivelihood={projectTypesByLivelihood}
                                isLoadingProjectTypes={isLoadingProjectTypes}
                                onLivelihoodChange={handleLivelihoodChange}
                                t={t}
                            />

                            {/* Child Details Fields (conditional) */}
                            <ChildDetailsFields
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                showAllFieldsForExistingBeneficiary={showAllFieldsForExistingBeneficiary}
                                handlers={handlers}
                                t={t}
                            />


                            {/* Monthly Saving Field */}
                            <MonthlySavingField
                                formData={formData}
                                errors={errors}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Checkbox Sections */}
                            <CheckboxSections
                                formData={formData}
                                formOptions={formOptions}
                                errors={errors}
                                handlers={handlers}
                                t={t}
                            />

                            {/* Banking Details */}
                            <BankingDetailsFields
                                formData={formData}
                                handlers={handlers}
                                t={t}
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
                                        ? (isEditMode ? t('samurdhiForm.updating') : isExistingBeneficiary ? t('samurdhiForm.updating') : t('samurdhiForm.submitting'))
                                        : isFormResetting
                                            ? t('samurdhiForm.processing')
                                            : (isEditMode ? t('samurdhiForm.updateChanges') : isExistingBeneficiary ? t('samurdhiForm.update') : t('samurdhiForm.submit'))
                                    }
                                </Button>

                                <Button
                                    size="md"
                                    variant="danger"
                                    type="button"
                                    onClick={handleFormReset}
                                    disabled={isSubmitting || isFormResetting}
                                >
                                    {isEditMode ? t('common.cancel') : t('samurdhiForm.reset')}
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