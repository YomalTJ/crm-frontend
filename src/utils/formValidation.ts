import { FormData, FormErrors, FormOptions } from '@/types/samurdhi-form.types';

export const validateSamurdhiForm = (
    formData: FormData,
    formOptions: FormOptions,
    selectedFile?: File | null
): { isValid: boolean; errors: FormErrors } => {
    const newErrors: FormErrors = {};

    // Main program validation
    if (!formData.mainProgram || formData.mainProgram.trim() === '') {
        newErrors.mainProgram = 'Please select main program';
    }

    if (formData.mainProgram === 'WB' && formData.isImpactEvaluation === null) {
        newErrors.isImpactEvaluation = 'Please select impact evaluation status';
    }

    // Beneficiary type validation
    if (!formData.beneficiary_type_id) {
        newErrors.beneficiary_type_id = 'Please select beneficiary type';
    }

    const selectedBeneficiaryType = formOptions.beneficiaryStatuses.find(
        status => status.beneficiary_type_id === formData.beneficiary_type_id
    );

    const isAswasumaBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Aswasuma beneficiary") &&
        !selectedBeneficiaryType?.nameEnglish.includes("Samurdhi") &&
        !selectedBeneficiaryType?.nameEnglish.includes("low income");
    const isSamurdhiOrLowIncome = selectedBeneficiaryType?.nameEnglish.includes("Samurdhi") ||
        selectedBeneficiaryType?.nameEnglish.includes("low income");

    // Consent validation
    if (formData.hasConsentedToEmpowerment === null || formData.hasConsentedToEmpowerment === undefined) {
        newErrors.hasConsentedToEmpowerment = 'Please select consent to empowerment program';
    }

    // Consent date validation - only required when consent is true
    if (formData.hasConsentedToEmpowerment === true && !formData.consentGivenAt) {
        newErrors.consentGivenAt = 'Please select a consent date';
    }

    // Refusal reason validation - only required when consent is false
    if (formData.hasConsentedToEmpowerment === false && !formData.refusal_reason_id) {
        newErrors.refusal_reason_id = 'Please select a refusal reason';
    }

    // File upload validation for rejection - only required when consent is false
    if (formData.hasConsentedToEmpowerment === false && !selectedFile) {
        newErrors.consentLetter = 'Please upload the consent letter PDF';
    }

    // File type and size validation - only check if file exists and consent is false
    if (formData.hasConsentedToEmpowerment === false && selectedFile) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

        if (!allowedTypes.includes(selectedFile.type)) {
            newErrors.consentLetter = 'Only PDF or image files (JPG, JPEG, PNG, GIF, WEBP, BMP) are allowed';
        } else if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            newErrors.consentLetter = 'File size must be less than 5MB';
        }
    }

    // SKIP ALL REMAINING VALIDATIONS IF CONSENT IS FALSE
    if (formData.hasConsentedToEmpowerment === false) {
        if (Object.keys(newErrors).length > 0) {
            Object.entries(newErrors).forEach(([]) => {
            });
        }

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors
        };
    }

    // Continue with remaining validations only if consent is true or null/undefined

    // Area Classification - required for certain beneficiary types
    if (formData.beneficiary_type_id && !formData.areaClassification) {
        newErrors.areaClassification = 'Area classification is required';
    }

    // Employment - required
    if (!formData.employment_id) {
        newErrors.employment_id = 'Employment status is required';
    }

    // Empowerment Dimension - required when consented to empowerment
    if (formData.hasConsentedToEmpowerment === true && !formData.empowerment_dimension_id) {
        newErrors.empowerment_dimension_id = 'Empowerment dimension is required when consent is given';
    }

    // NIC validation for non-pure Aswasuma beneficiaries
    if (!formData.nic || formData.nic.trim() === '') {
        newErrors.nic = 'NIC number is required';
    } else if (formData.nic.length < 10) {
        newErrors.nic = 'NIC must be at least 10 characters';
    }

    if (formData.job_field_id) {
        const selectedJobField = formOptions.jobFields.find(jf => jf.job_field_id === formData.job_field_id);
        if (selectedJobField?.nameEnglish === 'Other' && (!formData.otherJobField || formData.otherJobField.trim() === '')) {
            newErrors.otherJobField = 'Please specify other job field';
        }
    }

    if (formData.project_type_id) {
        // You'll need to pass projectTypesByLivelihood to this function or find another way to get the selected project type
        // For now, assuming you can access it somehow
        const isOtherProjectType = formData.project_type_id === '30'; // Based on your example, "Other" has project_type_id: '30'
        if (isOtherProjectType && (!formData.otherProject || formData.otherProject.trim() === '')) {
            newErrors.otherProject = 'Please specify other project type';
        }
    }

    // Basic required fields
    if (!formData.beneficiaryName || formData.beneficiaryName.trim() === '') {
        newErrors.beneficiaryName = 'Beneficiary name is required';
    }

    if (!formData.beneficiaryGender) {
        newErrors.beneficiaryGender = 'Gender is required';
    }

    if (!formData.address || formData.address.trim() === '') {
        newErrors.address = 'Address is required';
    }

    if (!formData.mobilePhone?.trim()) {
        newErrors.mobilePhone = 'Mobile phone number is required';
    }

    if (!formData.projectOwnerAge || formData.projectOwnerAge <= 0) {
        newErrors.projectOwnerAge = 'Valid age is required';
    } else if (formData.projectOwnerAge > 120) {
        newErrors.projectOwnerAge = 'Please enter a valid age';
    }

    if (formData.hasDisability && !formData.disability_id) {
        newErrors.disability_id = 'Please select the type of disability';
    }

    // Household number validation for non-Samurdhi/low-income beneficiaries
    if (!isSamurdhiOrLowIncome && isAswasumaBeneficiary && !formData.aswasumaHouseholdNo) {
        newErrors.aswasumaHouseholdNo = 'Aswasuma household number is required';
    }

    const ageFields = [
        'male16To24', 'female16To24',
        'male25To45', 'female25To45',
        'male46To60', 'female46To60'
    ];

    ageFields.forEach(field => {
        const value = formData[field as keyof FormData] as number;
        if (value < 0) {
            newErrors[field] = 'Value cannot be negative';
        }
    });

    // Monthly saving validation
    if (formData.monthlySaving === null || formData.monthlySaving === undefined) {
        newErrors.monthlySaving = 'Please select monthly saving status';
    }

    if (formData.monthlySaving === true) {
        if (formData.savingAmount === null || formData.savingAmount === undefined || formData.savingAmount <= 0) {
            newErrors.savingAmount = 'Please enter a valid saving amount';
        } else if (formData.savingAmount > 1000000) {
            newErrors.savingAmount = 'Saving amount seems too high. Please verify.';
        }
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

    // Bank transfer validation
    if (formData.wantsAswesumaBankTransfer) {
        if (!formData.otherBankName?.trim()) {
            newErrors.otherBankName = 'Bank name is required when requesting transfer';
        }
        if (!formData.otherBankAccountNumber?.trim()) {
            newErrors.otherBankAccountNumber = 'Account number is required when requesting transfer';
        }
    }

    // Government subsidy validation
    if (formData.hasOtherGovernmentSubsidy) {
        if (!formData.otherGovernmentInstitution?.trim()) {
            newErrors.otherGovernmentInstitution = 'Institution name is required';
        }
        if (!formData.otherSubsidyAmount || formData.otherSubsidyAmount <= 0) {
            newErrors.otherSubsidyAmount = 'Subsidy amount must be greater than 0';
        }
    }

    if (Object.keys(newErrors).length > 0) {
        Object.entries(newErrors).forEach(([]) => {
        });
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

export const convertEmptyToNullNumber = (value: number | null | undefined): number | null => {
    if (value === undefined || value === null || value === 0) {
        return null;
    }
    return value;
};

export const getAswasumaIdByLevel = (level: number): string => {
    const levelToIdMap: { [key: number]: string } = {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
    };

    return levelToIdMap[level] || '';
};

export const convertEmptyToNullForNumber = (value: number | null | undefined | string): number | null => {
    if (value === undefined || value === null || value === '' || value === 0) {
        return null;
    }
    if (typeof value === 'string') {
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
    }
    return value;
};