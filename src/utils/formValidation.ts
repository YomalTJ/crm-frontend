import { FormData, FormErrors, FormOptions } from '@/types/samurdhi-form.types';

export const validateSamurdhiForm = (
    formData: FormData,
    formOptions: FormOptions
): { isValid: boolean; errors: FormErrors } => {
    const newErrors: FormErrors = {};

    // Main program validation
    if (!formData.mainProgram || formData.mainProgram.trim() === '') {
        newErrors.mainProgram = 'Please select main program';
    }

    // Beneficiary type validation
    if (!formData.beneficiary_type_id) {
        newErrors.beneficiary_type_id = 'Please select beneficiary type';
    }

    const selectedBeneficiaryType = formOptions.beneficiaryStatuses.find(
        status => status.beneficiary_type_id === formData.beneficiary_type_id
    );

    const isSamurdhiBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Samurdhi beneficiary");
    const isAswasumaBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Aswasuma beneficiary") &&
        !selectedBeneficiaryType?.nameEnglish.includes("Samurdhi") &&
        !selectedBeneficiaryType?.nameEnglish.includes("low income");
    const isSamurdhiOrLowIncome = selectedBeneficiaryType?.nameEnglish.includes("Samurdhi") ||
        selectedBeneficiaryType?.nameEnglish.includes("low income");

    // Consent validation
    if (formData.hasConsentedToEmpowerment === null || formData.hasConsentedToEmpowerment === undefined) {
        newErrors.hasConsentedToEmpowerment = 'Please select consent to empowerment program';
    }

    if (formData.hasObtainedConsentLetter === null || formData.hasObtainedConsentLetter === undefined) {
        newErrors.hasObtainedConsentLetter = 'Please select consent letter status';
    }

    // Consent date validation
    if (formData.hasConsentedToEmpowerment === true && !formData.consentGivenAt) {
        newErrors.consentGivenAt = 'Please select a consent date';
    }

    // Refusal reason validation
    if (formData.hasConsentedToEmpowerment === false && !formData.refusal_reason_id) {
        newErrors.refusal_reason_id = 'Please select a refusal reason';
    }

    // NIC validation for non-pure Aswasuma beneficiaries
    if (!isAswasumaBeneficiary && isSamurdhiBeneficiary) {
        if (!formData.nic || formData.nic.trim() === '') {
            newErrors.nic = 'NIC number is required for Samurdhi beneficiaries';
        } else if (formData.nic.length < 10) {
            newErrors.nic = 'NIC must be at least 10 characters';
        }
    }

    // Basic required fields
    if (!formData.beneficiaryName || formData.beneficiaryName.trim() === '') {
        newErrors.beneficiaryName = 'Beneficiary name is required';
    }

    if (!formData.address || formData.address.trim() === '') {
        newErrors.address = 'Address is required';
    }

    if (!formData.phone || formData.phone.trim() === '') {
        newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.projectOwnerAge || formData.projectOwnerAge <= 0) {
        newErrors.projectOwnerAge = 'Valid age is required';
    } else if (formData.projectOwnerAge > 120) {
        newErrors.projectOwnerAge = 'Please enter a valid age';
    }

    // Household number validation for non-Samurdhi/low-income beneficiaries
    if (!isSamurdhiOrLowIncome && isAswasumaBeneficiary && !formData.aswasumaHouseholdNo) {
        newErrors.aswasumaHouseholdNo = 'Aswasuma household number is required';
    }

    // Saving amount validation
    if (formData.monthlySaving && (!formData.savingAmount || formData.savingAmount <= 0)) {
        newErrors.savingAmount = 'Please enter a valid saving amount';
    }

    // Employment Facilitation validation
    const hasEmploymentFacilitation = formData.empowerment_dimension_id && (() => {
        const dimension = formOptions.empowermentDimensions.find(
            dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id
        );
        return dimension?.nameEnglish.includes("Employment Facilitation");
    })();

    if (hasEmploymentFacilitation) {
        if (!formData.childName || formData.childName.trim() === '') {
            newErrors.childName = 'Child name is required for Employment Facilitation';
        }
        if (!formData.childAge || formData.childAge <= 0) {
            newErrors.childAge = 'Valid child age is required for Employment Facilitation';
        }
        if (!formData.job_field_id) {
            newErrors.job_field_id = 'Job field is required for Employment Facilitation';
        }
    }

    // Business Opportunities validation
    const hasBusinessOpportunities = formData.empowerment_dimension_id && (() => {
        const dimension = formOptions.empowermentDimensions.find(
            dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id
        );
        return dimension?.nameEnglish.includes("Business Opportunities") ||
            dimension?.nameEnglish.includes("Self-Employment");
    })();

    if (hasBusinessOpportunities) {
        if (!formData.project_type_id) {
            newErrors.project_type_id = 'Project type is required for Business Opportunities/Self-Employment';
        }
    }

    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
    };
};

export const convertEmptyToNull = (value: string | null | undefined): string | null => {
    if (value === undefined || value === null || value === '' ||
        (typeof value === 'string' && value.trim() === '')) {
        return null;
    }
    return value;
};

export const getAswasumaIdByLevel = (level: number): string => {
    const levelToIdMap: { [key: number]: string } = {
        1: '5563333f-1ac4-450f-ae77-aee6907fff6d',
        2: 'd934f9b8-b849-4195-acac-a421d367eef8',
        3: '598eed9f-4b0a-457c-98d4-9c70498c8a50',
        4: '8091882c-a474-4982-91fe-3ba9b5f78200',
    };

    return levelToIdMap[level] || '';
};