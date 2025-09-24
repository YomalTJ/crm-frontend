import { FormData, FormOptions } from '@/types/samurdhi-form.types';

export const formatCommunityLabel = (item: {
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}) => {
    return `${item.nameSinhala} - ${item.nameTamil} - ${item.nameEnglish}`;
};

export const formatCategoryLabel = (category: {
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}) => {
    return `${category.nameSinhala} - ${category.nameTamil} - ${category.nameEnglish}`;
};

export const formatAmount = (amount: string) => {
    return `Rs. ${parseFloat(amount).toFixed(2)}`;
};

export const getBeneficiaryTypeInfo = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const selectedBeneficiaryType = formOptions.beneficiaryStatuses.find(
        status => status.beneficiary_type_id === formData.beneficiary_type_id
    );

    if (!selectedBeneficiaryType) {
        return {
            isPreviousSamurdhiOrLowIncome: false,
            isAswasumaBeneficiary: false,
            selectedBeneficiaryType: null
        };
    }

    // Updated logic based on the exact IDs you provided
    const isPreviousSamurdhiOrLowIncome = formData.beneficiary_type_id === '77744e4d-48a4-4295-8a5d-38d2100599f9';
    const isAswasumaBeneficiary = formData.beneficiary_type_id === 'a8625875-41a4-47cf-9cb3-d2d185b7722d';

    return {
        selectedBeneficiaryType,
        isPreviousSamurdhiOrLowIncome,
        isAswasumaBeneficiary
    };
};

export const getEmpowermentTypeInfo = (
    formData: FormData,
    formOptions: FormOptions
) => {
    if (!formData.empowerment_dimension_id) {
        return {
            hasEmploymentFacilitation: false,
            hasBusinessOpportunities: false
        };
    }

    const dimension = formOptions.empowermentDimensions.find(
        dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id
    );

    const hasEmploymentFacilitation = dimension?.nameEnglish.includes("Employment Facilitation") || false;
    const hasBusinessOpportunities = dimension?.nameEnglish.includes("Business Opportunities") ||
        dimension?.nameEnglish.includes("Self-Employment") || false;

    return {
        dimension,
        hasEmploymentFacilitation,
        hasBusinessOpportunities
    };
};

export const shouldShowChildFields = (
    formData: FormData,
    formOptions: FormOptions,
    showAllFieldsForExistingBeneficiary: boolean
) => {
    const { hasEmploymentFacilitation } = getEmpowermentTypeInfo(formData, formOptions);
    return hasEmploymentFacilitation ||
        (showAllFieldsForExistingBeneficiary && (formData.childName || formData.job_field_id));
};

export const shouldShowProjectFields = (
    formData: FormData,
    formOptions: FormOptions,
    showAllFieldsForExistingBeneficiary: boolean
) => {
    const { hasBusinessOpportunities } = getEmpowermentTypeInfo(formData, formOptions);
    return hasBusinessOpportunities ||
        (showAllFieldsForExistingBeneficiary && formData.project_type_id);
};

// Updated: NIC field should be available for BOTH beneficiary types
export const shouldShowNicField = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isPreviousSamurdhiOrLowIncome, isAswasumaBeneficiary } = getBeneficiaryTypeInfo(formData, formOptions);
    return formData.beneficiary_type_id && (isPreviousSamurdhiOrLowIncome || isAswasumaBeneficiary);
};

// Updated: Household field should ONLY be available for Aswasuma beneficiary
export const shouldShowHouseholdField = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isAswasumaBeneficiary } = getBeneficiaryTypeInfo(formData, formOptions);
    return formData.beneficiary_type_id && isAswasumaBeneficiary;
};

// Updated: NIC is required for Previous Samurdhi/Low income earner
export const isNicRequired = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isPreviousSamurdhiOrLowIncome } = getBeneficiaryTypeInfo(formData, formOptions);
    return isPreviousSamurdhiOrLowIncome;
};

// Updated: Household number is required for Aswasuma beneficiary
export const isHouseholdRequired = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isAswasumaBeneficiary } = getBeneficiaryTypeInfo(formData, formOptions);
    return isAswasumaBeneficiary;
};