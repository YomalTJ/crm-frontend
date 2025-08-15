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
            isSamurdhiBeneficiary: false,
            isAswasumaBeneficiary: false,
            isSamurdhiOrLowIncome: false
        };
    }

    const isSamurdhiBeneficiary = selectedBeneficiaryType.nameEnglish.includes("Samurdhi beneficiary");
    const isAswasumaBeneficiary = selectedBeneficiaryType.nameEnglish.includes("Aswasuma beneficiary") &&
        !selectedBeneficiaryType.nameEnglish.includes("Samurdhi") &&
        !selectedBeneficiaryType.nameEnglish.includes("low income");
    const isSamurdhiOrLowIncome = selectedBeneficiaryType.nameEnglish.includes("Samurdhi") ||
        selectedBeneficiaryType.nameEnglish.includes("low income");

    return {
        selectedBeneficiaryType,
        isSamurdhiBeneficiary,
        isAswasumaBeneficiary,
        isSamurdhiOrLowIncome
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

export const shouldShowNicField = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isAswasumaBeneficiary } = getBeneficiaryTypeInfo(formData, formOptions);
    return formData.beneficiary_type_id && !isAswasumaBeneficiary;
};

export const shouldShowHouseholdField = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isSamurdhiOrLowIncome } = getBeneficiaryTypeInfo(formData, formOptions);
    return formData.beneficiary_type_id && !isSamurdhiOrLowIncome;
};

export const isNicRequired = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isSamurdhiBeneficiary } = getBeneficiaryTypeInfo(formData, formOptions);
    return isSamurdhiBeneficiary;
};

export const isHouseholdRequired = (
    formData: FormData,
    formOptions: FormOptions
) => {
    const { isAswasumaBeneficiary } = getBeneficiaryTypeInfo(formData, formOptions);
    return isAswasumaBeneficiary;
};