/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormData as SamurdhiFormData, FormErrors, FormOptions } from '@/types/samurdhi-form.types';
import {
    getHouseholdDetailsByReference,
    createSamurdhiFamily,
    updateSamurdhiFamily,
    SamurdhiFamilyPayload,
    getBeneficiaryByIdentifier, // Add this import
    getProjectTypesByLivelihood,
    checkExistingBeneficiary
} from '@/services/samurdhiService';
import { validateSamurdhiForm, convertEmptyToNull, getAswasumaIdByLevel, convertEmptyToNullForNumber } from '@/utils/formValidation';
import toast from 'react-hot-toast';
import { validateFile } from '@/utils/fileValidation';

interface UseFormHandlersProps {
    formData: SamurdhiFormData;
    setFormData: React.Dispatch<React.SetStateAction<SamurdhiFormData>>;
    formOptions: FormOptions;
    resetForm: () => void;
    isEditMode?: boolean;
    editId?: string;
    householdLoadedFields: Set<string>;
    setHouseholdLoadedFields: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const useSamurdhiFormHandlers = ({
    formData,
    setFormData,
    formOptions,
    resetForm,
    isEditMode = false,
    editId,
    setHouseholdLoadedFields
}: UseFormHandlersProps) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isFetching, setIsFetching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormResetting, setIsFormResetting] = useState(false);
    const [isExistingBeneficiary, setIsExistingBeneficiary] = useState(isEditMode);
    const [isAswasumaHouseholdDisabled, setIsAswasumaHouseholdDisabled] = useState(false);
    const [showAllFieldsForExistingBeneficiary, setShowAllFieldsForExistingBeneficiary] = useState(isEditMode);

    const [projectTypesByLivelihood, setProjectTypesByLivelihood] = useState<any[]>([]);
    const [isLoadingProjectTypes, setIsLoadingProjectTypes] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const clearError = (fieldName: string) => {
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const clearHouseholdLoadedFields = () => {
        setHouseholdLoadedFields(new Set());
    };

    const clearSubsequentFields = () => {
        setFormData(prev => ({
            ...prev,
            // Keep everything up to consent fields, clear everything after
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
        }));
    };

    const handleLivelihoodChange = async (livelihoodId: string) => {
        clearError('selectedLivelihood');
        clearError('livelihood_id');
        clearError('project_type_id');

        setFormData(prev => ({
            ...prev,
            selectedLivelihood: livelihoodId,
            livelihood_id: livelihoodId, // ADDED: Set both for UI and payload
            project_type_id: null // Reset project type when livelihood changes
        }));

        if (livelihoodId && livelihoodId !== '') {
            setIsLoadingProjectTypes(true);
            try {
                const projectTypes = await getProjectTypesByLivelihood(parseInt(livelihoodId));
                setProjectTypesByLivelihood(projectTypes);
            } catch (error) {
                console.error('Error fetching project types:', error);
                toast.error('Failed to load project types');
                setProjectTypesByLivelihood([]);
            } finally {
                setIsLoadingProjectTypes(false);
            }
        } else {
            setProjectTypesByLivelihood([]);
        }
    };

    const clearEmpowermentFields = (keepEmploymentFields = false, keepBusinessFields = false) => {
        const fieldsToUpdate: Partial<SamurdhiFormData> = {};

        if (!keepEmploymentFields) {
            // Clear Employment Facilitation fields
            fieldsToUpdate.job_field_id = null;
            fieldsToUpdate.otherJobField = null;
            fieldsToUpdate.childName = null;
            fieldsToUpdate.childAge = 0;
            fieldsToUpdate.childGender = null;
        }

        if (!keepBusinessFields) {
            // Clear Business Opportunities fields
            fieldsToUpdate.selectedLivelihood = null;
            fieldsToUpdate.livelihood_id = null;
            fieldsToUpdate.project_type_id = null;
            fieldsToUpdate.otherProject = null;
        }

        setFormData(prev => ({
            ...prev,
            ...fieldsToUpdate
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        clearError(name);

        // Handle field name mapping
        let fieldName = name;
        if (name === 'phone') fieldName = 'mobilePhone';
        if (name === 'gender') fieldName = 'beneficiaryGender';

        if (fieldName === 'nic') {
            setFormData(prev => ({
                ...prev,
                nic: value.trim()
            }));
            return;
        }

        // Handle date input
        if (type === 'date') {
            setFormData(prev => ({
                ...prev,
                [fieldName]: value ? value : null
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [fieldName]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const validateAndSetFile = async (file: File | null): Promise<boolean> => {
        if (!file) {
            setSelectedFile(null);
            return true;
        }

        try {
            const validationResult = await validateFile(file);

            if (!validationResult.isValid) {
                setErrors(prev => ({
                    ...prev,
                    consentLetter: validationResult.error || 'File validation failed'
                }));
                setSelectedFile(null);
                return false;
            }

            setSelectedFile(file);
            clearError('consentLetter');
            return true;
        } catch (error) {
            console.error('File validation error:', error);
            setErrors(prev => ({
                ...prev,
                consentLetter: 'Failed to validate file'
            }));
            setSelectedFile(null);
            return false;
        }
    };

    const handleFileChange = async (file: File | null) => {
        await validateAndSetFile(file);
    };

    const handleSelectChange = (name: string, value: string) => {
        clearError(name);

        let processedValue: string | number | null;

        if (!value || value === '' || value === 'null' || value === 'undefined') {
            processedValue = null;
        } else if (name === 'samurdhiBankAccountType') {
            // Convert to number for account type
            processedValue = parseInt(value);
        } else {
            processedValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleRadioChange = (name: string, value: string) => {
        clearError(name);

        if (name === 'beneficiary_type_id') {
            clearHouseholdLoadedFields();
            setIsAswasumaHouseholdDisabled(false);

            // Clear beneficiary type specific fields when switching
            const isAswasumaSelected = value === 'a8625875-41a4-47cf-9cb3-d2d185b7722d';
            const isPreviousSamurdhiSelected = value === '77744e4d-48a4-4295-8a5d-38d2100599f9';

            if (isAswasumaSelected) {
                // Clear Previous Samurdhi/Low income related fields, keep NIC available
                setFormData(prev => ({
                    ...prev,
                    // Keep NIC field available for both types
                    // Clear household number when switching to Aswasuma (will be selected from dropdown)
                    aswasumaHouseholdNo: null,
                    // Clear auto-filled data from previous selections
                    beneficiaryName: null,
                    beneficiaryAge: 0,
                    beneficiaryGender: null,
                    address: null,
                    mobilePhone: null,
                    telephone: null,
                    projectOwnerName: null,
                    projectOwnerAge: 0,
                    projectOwnerGender: null,
                    // Clear household member counts
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
                    subsisdy_id: null,
                    // Clear benefits
                    aswesuma_cat_id: null,
                    // Reset project owner checkbox
                    isProjectOwnerSameAsBeneficiary: false
                }));
            } else if (isPreviousSamurdhiSelected) {
                // Clear Aswasuma related fields, keep NIC available
                setFormData(prev => ({
                    ...prev,
                    // Keep NIC field available for both types
                    // Clear household number (not applicable for Previous Samurdhi)
                    aswasumaHouseholdNo: null,
                    // Clear auto-filled data from household selection
                    beneficiaryName: null,
                    beneficiaryAge: 0,
                    beneficiaryGender: null,
                    address: null,
                    mobilePhone: null,
                    telephone: null,
                    projectOwnerName: null,
                    projectOwnerAge: 0,
                    projectOwnerGender: null,
                    // Clear household member counts
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
                    // Clear benefits
                    aswesuma_cat_id: null,
                    // Reset project owner checkbox
                    isProjectOwnerSameAsBeneficiary: false
                }));
                // Disable household selection for Previous Samurdhi
                setIsAswasumaHouseholdDisabled(true);
            }
        }

        if (name === 'empowerment_dimension_id') {
            const selectedDimension = formOptions.empowermentDimensions.find(
                dim => dim.empowerment_dimension_id === value
            );

            if (selectedDimension) {
                const isEmploymentFacilitation = selectedDimension.nameEnglish.includes("Employment Facilitation");
                const isBusinessOpportunities = selectedDimension.nameEnglish.includes("Business Opportunities") ||
                    selectedDimension.nameEnglish.includes("Self-Employment");

                if (isEmploymentFacilitation) {
                    // Clear business-related fields, keep employment fields
                    clearEmpowermentFields(true, false);
                } else if (isBusinessOpportunities) {
                    // Clear employment-related fields, keep business fields
                    clearEmpowermentFields(false, true);
                }
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value === 'true' ? true : value === 'false' ? false : value
        }));
    };

    const handleCheckboxChange = (name: string, value: string, isChecked: boolean) => {
        clearError(name);

        if (name === 'isProjectOwnerSameAsBeneficiary') {
            setFormData(prev => ({
                ...prev,
                [name]: isChecked
            }));
            return;
        }

        setFormData(prev => {
            const currentArray = prev[name as keyof typeof formData] as string[];
            return {
                ...prev,
                [name]: isChecked
                    ? [...currentArray, value]
                    : currentArray.filter(item => item !== value)
            };
        });
    };

    const handleNicLookup = async () => {
        // In edit mode, don't allow NIC lookup as data is already loaded
        if (isEditMode) {
            toast.error('NIC lookup is not available in edit mode');
            return;
        }

        if (!formData.nic || formData.nic.trim() === '') {
            toast.error('Please enter NIC number');
            return;
        }

        setIsFetching(true);
        try {
            // Use the new unified service method
            const data = await getBeneficiaryByIdentifier(formData.nic);
            setIsExistingBeneficiary(true);

            // Check if this is a previous Samurdhi beneficiary
            const isPreviousSamurdhi = data.beneficiaryType?.id === '77744e4d-48a4-4295-8a5d-38d2100599f9' ||
                data.beneficiaryType?.nameEnglish?.includes("Previous Samurdhi") ||
                data.beneficiaryType?.nameEnglish?.includes("Low income");
            setIsAswasumaHouseholdDisabled(isPreviousSamurdhi);

            // Check if the fetched data has values for fields that might be hidden
            const hasHiddenFieldValues = data.householdNumber ||
                data.empowermentDimension ||
                data.projectType ||
                data.childName ||
                data.jobField ||
                data.resources?.length > 0 ||
                data.healthIndicators?.length > 0 ||
                data.domesticDynamics?.length > 0 ||
                data.communityParticipations?.length > 0 ||
                data.housingServices?.length > 0;

            if (hasHiddenFieldValues) {
                setShowAllFieldsForExistingBeneficiary(true);
            }

            // Update form data with fetched information - PRESERVE existing form state
            setFormData(prev => ({
                ...prev,
                // Keep the current beneficiary type and NIC - DON'T reset them
                // nic: formData.nic, // Keep current NIC
                // beneficiary_type_id: prev.beneficiary_type_id, // Keep current selection

                // Update with fetched data
                mainProgram: data.mainProgram || prev.mainProgram,
                aswasumaHouseholdNo: data.householdNumber || prev.aswasumaHouseholdNo,
                beneficiaryName: data.beneficiaryDetails.name || prev.beneficiaryName,
                beneficiaryAge: data.beneficiaryDetails.age || prev.beneficiaryAge,
                beneficiaryGender: data.beneficiaryDetails.gender || prev.beneficiaryGender,
                address: data.address || prev.address,
                mobilePhone: data.mobilePhone || prev.mobilePhone,
                telephone: data.telephone || prev.telephone,
                projectOwnerName: data.projectOwnerDetails.name || prev.projectOwnerName,
                projectOwnerAge: data.projectOwnerDetails.age || prev.projectOwnerAge,
                projectOwnerGender: data.projectOwnerDetails.gender || prev.projectOwnerGender,
                hasDisability: data.hasDisability !== undefined ? data.hasDisability : prev.hasDisability,
                disability_id: data.disability?.id || prev.disability_id,

                // Household members
                maleBelow16: data.noOfMembers?.male?.ageBelow16 || prev.maleBelow16,
                femaleBelow16: data.noOfMembers?.female?.ageBelow16 || prev.femaleBelow16,

                male16To24: data.noOfMembers?.male?.age16To24 || prev.male16To24,
                female16To24: data.noOfMembers?.female?.age16To24 || prev.female16To24,

                male25To45: data.noOfMembers?.male?.age25To45 || prev.male25To45,
                female25To45: data.noOfMembers?.female?.age25To45 || prev.female25To45,

                male46To60: data.noOfMembers?.male?.age46To60 || prev.male46To60,
                female46To60: data.noOfMembers?.female?.age46To60 || prev.female46To60,

                maleAbove60: data.noOfMembers?.male?.ageAbove60 || prev.maleAbove60,
                femaleAbove60: data.noOfMembers?.female?.ageAbove60 || prev.femaleAbove60,


                // Employment and benefits
                employment_id: data.currentEmployment?.id || prev.employment_id,
                otherOccupation: data.otherOccupation || prev.otherOccupation,
                subsisdy_id: data.samurdhiSubsidy?.id || prev.subsisdy_id,
                aswesuma_cat_id: data.aswasumaCategory?.id || prev.aswesuma_cat_id,

                // Empowerment and projects
                empowerment_dimension_id: data.empowermentDimension?.id || prev.empowerment_dimension_id,
                selectedLivelihood: data.livelihood?.id || prev.selectedLivelihood,
                livelihood_id: data.livelihood?.id || prev.livelihood_id,
                project_type_id: data.projectType?.id || prev.project_type_id,
                otherProject: data.otherProject || prev.otherProject,

                // Child details
                childName: data.childName || prev.childName,
                childAge: data.childAge || prev.childAge,
                childGender: data.childGender || prev.childGender,
                job_field_id: data.jobField?.id || prev.job_field_id,
                otherJobField: data.otherJobField || prev.otherJobField,

                // Arrays - ensure they're properly formatted
                resource_id: Array.isArray(data.resources) ? data.resources.map(r => r.id) : prev.resource_id,
                health_indicator_id: Array.isArray(data.healthIndicators) ? data.healthIndicators.map(h => h.id) : prev.health_indicator_id,
                domestic_dynamic_id: Array.isArray(data.domesticDynamics) ? data.domesticDynamics.map(d => d.id) : prev.domestic_dynamic_id,
                community_participation_id: Array.isArray(data.communityParticipations) ? data.communityParticipations.map(c => c.id) : prev.community_participation_id,
                housing_service_id: Array.isArray(data.housingServices) ? data.housingServices.map(h => h.id) : prev.housing_service_id,

                // Savings
                monthlySaving: data.monthlySaving !== undefined ? data.monthlySaving : prev.monthlySaving,
                savingAmount: data.savingAmount || prev.savingAmount,

                // Banking and subsidy details
                commercialBankAccountName: data.location?.commercialBankDetails?.accountName || prev.commercialBankAccountName,
                commercialBankAccountNumber: data.location?.commercialBankDetails?.accountNumber || prev.commercialBankAccountNumber,
                commercialBankName: data.location?.commercialBankDetails?.bankName || prev.commercialBankName,
                commercialBankBranch: data.location?.commercialBankDetails?.branch || prev.commercialBankBranch,
                samurdhiBankAccountName: data.location?.samurdhiBankDetails?.accountName || prev.samurdhiBankAccountName,
                samurdhiBankAccountNumber: data.location?.samurdhiBankDetails?.accountNumber || prev.samurdhiBankAccountNumber,
                samurdhiBankName: data.location?.samurdhiBankDetails?.bankName || prev.samurdhiBankName,
                samurdhiBankAccountType: data.location?.samurdhiBankDetails?.accountType || prev.samurdhiBankAccountType,

                // Bank transfer preferences
                wantsAswesumaBankTransfer: data.bankTransferPreferences?.wantsAswesumaBankTransfer !== undefined ?
                    data.bankTransferPreferences.wantsAswesumaBankTransfer : prev.wantsAswesumaBankTransfer,
                otherBankName: data.bankTransferPreferences?.otherBankDetails?.bankName || prev.otherBankName,
                otherBankBranch: data.bankTransferPreferences?.otherBankDetails?.branch || prev.otherBankBranch,
                otherBankAccountHolder: data.bankTransferPreferences?.otherBankDetails?.accountHolder || prev.otherBankAccountHolder,
                otherBankAccountNumber: data.bankTransferPreferences?.otherBankDetails?.accountNumber || prev.otherBankAccountNumber,

                // Government subsidy
                hasOtherGovernmentSubsidy: data.governmentSubsidy?.hasOtherGovernmentSubsidy !== undefined ?
                    data.governmentSubsidy.hasOtherGovernmentSubsidy : prev.hasOtherGovernmentSubsidy,
                otherGovernmentInstitution: data.governmentSubsidy?.institution || prev.otherGovernmentInstitution,
                otherSubsidyAmount: data.governmentSubsidy?.amount || prev.otherSubsidyAmount,

                // Consent fields
                hasConsentedToEmpowerment: data.hasConsentedToEmpowerment !== undefined ?
                    data.hasConsentedToEmpowerment : prev.hasConsentedToEmpowerment,
                consentGivenAt: data.consentGivenAt || prev.consentGivenAt,
                refusal_reason_id: data.refusalReason?.id || prev.refusal_reason_id,

                // Area classification
                areaClassification: data.areaClassification || prev.areaClassification
            }));

            toast.success('Beneficiary details loaded successfully!');

        } catch (error) {
            console.error('NIC lookup error:', error);
            setIsExistingBeneficiary(false);
            setShowAllFieldsForExistingBeneficiary(false);
            setIsAswasumaHouseholdDisabled(false);

            // DON'T reset the form data completely - just show error
            toast.error('Beneficiary not found. You can continue to add as new beneficiary.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleHouseholdSelection = async (selectedHhNumber: string) => {
        // In edit mode, don't allow household selection changes if it affects core data
        if (isEditMode) {
            toast.error('Household selection is limited in edit mode');
            return;
        }

        if (!selectedHhNumber) {
            // Clear auto-filled data and reset disabled fields
            setHouseholdLoadedFields(new Set());
            setFormData(prev => ({
                ...prev,
                aswasumaHouseholdNo: null,
                beneficiaryName: null,
                beneficiaryAge: 0,
                beneficiaryGender: null,
                address: null,
                projectOwnerAge: 0,
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
                aswesuma_cat_id: null
            }));
            return;
        }

        try {
            const existsCheck = await checkExistingBeneficiary(selectedHhNumber, 'household');
            if (existsCheck.exists) {
                toast.error(
                    `This household number is already registered for beneficiary: ${existsCheck.beneficiaryName || 'Unknown'}. Please select a different household number.`,
                    { duration: 6000 }
                );

                // Clear the selection immediately
                setFormData(prev => ({
                    ...prev,
                    aswasumaHouseholdNo: null,
                    beneficiaryName: null,
                    beneficiaryAge: 0,
                    beneficiaryGender: null,
                    address: null,
                    aswesuma_cat_id: null
                }));
                setHouseholdLoadedFields(new Set());
                return;
            }
        } catch (error) {
            console.error('Error checking existing beneficiary:', error);
            toast.error('Failed to verify household number availability. Please try again.');
            setFormData(prev => ({ ...prev, aswasumaHouseholdNo: null }));
            return;
        }

        try {
            const householdData = await getHouseholdDetailsByReference(selectedHhNumber);
            const primaryCitizen = householdData.citizens?.[0];

            if (householdData.household && primaryCitizen) {
                const loadedFields = new Set<string>();

                setFormData(prev => ({
                    ...prev,
                    nic: null,
                    aswasumaHouseholdNo: selectedHhNumber,
                    beneficiaryName: householdData.household.applicantName || primaryCitizen.name || '',
                    beneficiaryAge: primaryCitizen.age || 0,
                    beneficiaryGender: primaryCitizen.gender === 'male' ? 'Male' : 'Female',
                    address: [
                        householdData.household.addressLine1,
                        householdData.household.addressLine2,
                        householdData.household.addressLine3
                    ].filter(line => line && line.trim()).join(', ') || '',
                    aswesuma_cat_id: getAswasumaIdByLevel(householdData.household.level),

                    isProjectOwnerSameAsBeneficiary: false,
                    projectOwnerName: null,
                    projectOwnerAge: 0,
                    projectOwnerGender: null,

                    // reset optional/other fields
                    mobilePhone: null,
                    employment_id: null,
                    otherOccupation: null,
                    subsisdy_id: null,
                    empowerment_dimension_id: null,
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
                    housing_service_id: []
                }));

                // Track which fields were loaded from household data
                if (householdData.household.applicantName || primaryCitizen.name) {
                    loadedFields.add('beneficiaryName');
                }
                if (householdData.household.addressLine1 || householdData.household.addressLine2 || householdData.household.addressLine3) {
                    loadedFields.add('address');
                }
                if (primaryCitizen.age) {
                    loadedFields.add('beneficiaryAge');
                }
                if (primaryCitizen.gender) {
                    loadedFields.add('beneficiaryGender');
                }
                if (householdData.household.level !== undefined && householdData.household.level !== null) {
                    loadedFields.add('aswesuma_cat_id');
                    console.log('Added aswesuma_cat_id to loadedFields, level:', householdData.household.level);
                }

                // Calculate household member counts
                if (householdData.citizens && householdData.citizens.length > 0) {
                    let maleBelow16 = 0, femaleBelow16 = 0;
                    let male16To24 = 0, female16To24 = 0;
                    let male25To45 = 0, female25To45 = 0;
                    let male46To60 = 0, female46To60 = 0;
                    let maleAbove60 = 0, femaleAbove60 = 0;

                    householdData.citizens.forEach((citizen: any) => {
                        const age = citizen.age;
                        const isMale = citizen.gender === 'male';

                        if (age < 16) {
                            if (isMale) maleBelow16++; else femaleBelow16++;
                        } else if (age >= 16 && age <= 24) {
                            if (isMale) male16To24++; else female16To24++;
                        } else if (age >= 25 && age <= 45) {
                            if (isMale) male25To45++; else female25To45++;
                        } else if (age >= 46 && age <= 60) {
                            if (isMale) male46To60++; else female46To60++;
                        } else if (age > 60) {
                            if (isMale) maleAbove60++; else femaleAbove60++;
                        }
                    });

                    setFormData(prev => ({
                        ...prev,
                        maleBelow16,
                        femaleBelow16,
                        male16To24,
                        female16To24,
                        male25To45,
                        female25To45,
                        male46To60,
                        female46To60,
                        maleAbove60,
                        femaleAbove60
                    }));

                    loadedFields.add('maleBelow16');
                    loadedFields.add('femaleBelow16');
                    loadedFields.add('male16To24');
                    loadedFields.add('female16To24');
                    loadedFields.add('male25To45');
                    loadedFields.add('female25To45');
                    loadedFields.add('male46To60');
                    loadedFields.add('female46To60');
                    loadedFields.add('maleAbove60');
                    loadedFields.add('femaleAbove60');
                }

                setHouseholdLoadedFields(loadedFields);
                console.log('Final loadedFields:', Array.from(loadedFields));
            }
        } catch (error: unknown) {
            console.error('Error fetching household details:', error);
            setHouseholdLoadedFields(new Set());
            setFormData(prev => ({
                ...prev,
                aswasumaHouseholdNo: null,
                beneficiaryName: null,
                beneficiaryAge: 0,
                beneficiaryGender: null,
                address: null,
                projectOwnerAge: 0,
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
                aswesuma_cat_id: null
            }));
            toast.error('Failed to fetch household details. Please try again.');
        }
    };

    const hasEmploymentFacilitation = formData.empowerment_dimension_id && (() => {
        const dimension = formOptions.empowermentDimensions.find(
            dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id
        );
        return dimension?.nameEnglish.includes("Employment Facilitation");
    })();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateSamurdhiForm(formData, formOptions, selectedFile);
        setErrors(validation.errors);

        if (!validation.isValid) {
            toast.error('Please fix all validation errors before submitting');
            const firstErrorField = Object.keys(validation.errors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();

            const payload: SamurdhiFamilyPayload = {
                district_id: formData.district.districtId?.toString() || "",
                ds_id: formData.dsDivision.dsId?.toString() || "",
                zone_id: formData.zone.zoneId?.toString() || "",
                gnd_id: formData.gnd.gndId?.toString() || "",
                beneficiary_type_id: formData.beneficiary_type_id as string,
                mainProgram: formData.mainProgram ?? "",
                hasConsentedToEmpowerment: formData.hasConsentedToEmpowerment,
                consentLetterPath: null,
                refusal_reason_id: convertEmptyToNull(formData.refusal_reason_id),
                consentGivenAt: formData.consentGivenAt ? new Date(formData.consentGivenAt).toISOString() : null,
                areaClassification: formData.areaClassification,
                aswasumaHouseholdNo: convertEmptyToNull(formData.aswasumaHouseholdNo),
                nic: convertEmptyToNull(formData.nic),
                beneficiaryName: convertEmptyToNull(formData.beneficiaryName),
                beneficiaryAge: formData.beneficiaryAge || 0,
                beneficiaryGender: convertEmptyToNull(formData.beneficiaryGender),
                address: convertEmptyToNull(formData.address),
                mobilePhone: convertEmptyToNull(formData.mobilePhone),
                telephone: convertEmptyToNull(formData.telephone),
                projectOwnerName: convertEmptyToNull(formData.projectOwnerName),
                projectOwnerAge: formData.projectOwnerAge || 0,
                projectOwnerGender: convertEmptyToNull(formData.projectOwnerGender),
                hasDisability: formData.hasDisability,
                disability_id: convertEmptyToNull(formData.disability_id),
                maleBelow16: formData.maleBelow16 || 0,
                femaleBelow16: formData.femaleBelow16 || 0,

                male16To24: formData.male16To24 || 0,
                female16To24: formData.female16To24 || 0,

                male25To45: formData.male25To45 || 0,
                female25To45: formData.female25To45 || 0,

                male46To60: formData.male46To60 || 0,
                female46To60: formData.female46To60 || 0,

                maleAbove60: formData.maleAbove60 || 0,
                femaleAbove60: formData.femaleAbove60 || 0,

                employment_id: convertEmptyToNull(formData.employment_id),
                otherOccupation: convertEmptyToNull(formData.otherOccupation),
                subsisdy_id: convertEmptyToNull(formData.subsisdy_id),
                aswesuma_cat_id: convertEmptyToNull(formData.aswesuma_cat_id),
                empowerment_dimension_id: (formData.hasConsentedToEmpowerment === true)
                    ? convertEmptyToNull(formData.empowerment_dimension_id)
                    : null,
                livelihood_id: (formData.hasConsentedToEmpowerment === true)
                    ? convertEmptyToNull(formData.livelihood_id)
                    : null,
                project_type_id: (formData.hasConsentedToEmpowerment === true)
                    ? convertEmptyToNull(formData.project_type_id)
                    : null,
                otherProject: (formData.hasConsentedToEmpowerment === true)
                    ? convertEmptyToNull(formData.otherProject)
                    : null,
                childName: (formData.hasConsentedToEmpowerment === true && hasEmploymentFacilitation)
                    ? convertEmptyToNull(formData.childName)
                    : null,
                childAge: (formData.hasConsentedToEmpowerment === true && hasEmploymentFacilitation)
                    ? convertEmptyToNullForNumber(formData.childAge)
                    : null,
                childGender: (formData.hasConsentedToEmpowerment === true && hasEmploymentFacilitation)
                    ? convertEmptyToNull(formData.childGender)
                    : null,
                job_field_id: (formData.hasConsentedToEmpowerment === true)
                    ? convertEmptyToNull(formData.job_field_id)
                    : null,
                otherJobField: (formData.hasConsentedToEmpowerment === true)
                    ? convertEmptyToNull(formData.otherJobField)
                    : null,
                resource_id: (formData.hasConsentedToEmpowerment === true)
                    ? (formData.resource_id || [])
                    : [],
                monthlySaving: formData.monthlySaving,
                savingAmount: formData.monthlySaving ? (formData.savingAmount || 0) : null,
                health_indicator_id: (formData.hasConsentedToEmpowerment === true)
                    ? (formData.health_indicator_id || [])
                    : [],
                domestic_dynamic_id: (formData.hasConsentedToEmpowerment === true)
                    ? (formData.domestic_dynamic_id || [])
                    : [],
                community_participation_id: (formData.hasConsentedToEmpowerment === true)
                    ? (formData.community_participation_id || [])
                    : [],
                housing_service_id: (formData.hasConsentedToEmpowerment === true)
                    ? (formData.housing_service_id || [])
                    : [],
                commercialBankAccountName: convertEmptyToNull(formData.commercialBankAccountName),
                commercialBankAccountNumber: convertEmptyToNull(formData.commercialBankAccountNumber),
                commercialBankName: convertEmptyToNull(formData.commercialBankName),
                commercialBankBranch: convertEmptyToNull(formData.commercialBankBranch),
                samurdhiBankAccountName: convertEmptyToNull(formData.samurdhiBankAccountName),
                samurdhiBankAccountNumber: convertEmptyToNull(formData.samurdhiBankAccountNumber),
                samurdhiBankName: convertEmptyToNull(formData.samurdhiBankName),
                samurdhiBankAccountType:
                    formData.samurdhiBankAccountType !== null &&
                    formData.samurdhiBankAccountType !== undefined &&
                    (typeof formData.samurdhiBankAccountType !== 'string' || formData.samurdhiBankAccountType !== '')
                        ? Number(formData.samurdhiBankAccountType)
                        : null,
                wantsAswesumaBankTransfer: formData.wantsAswesumaBankTransfer,
                otherBankName: convertEmptyToNull(formData.otherBankName),
                otherBankBranch: convertEmptyToNull(formData.otherBankBranch),
                otherBankAccountHolder: convertEmptyToNull(formData.otherBankAccountHolder),
                otherBankAccountNumber: convertEmptyToNull(formData.otherBankAccountNumber),
                hasOtherGovernmentSubsidy: formData.hasOtherGovernmentSubsidy,
                otherGovernmentInstitution: convertEmptyToNull(formData.otherGovernmentInstitution),
                otherSubsidyAmount: formData.otherSubsidyAmount || null
            };

            console.log("payload: ", payload);


            // Add JSON payload
            Object.entries(payload).forEach(([key, value]) => {
                // Skip null and undefined values entirely
                if (value === null || value === undefined) {
                    return;
                }

                if (Array.isArray(value)) {
                    submitFormData.append(key, JSON.stringify(value));
                } else if (typeof value === 'number') {
                    submitFormData.append(key, value.toString());
                } else if (typeof value === 'boolean') {
                    submitFormData.append(key, value.toString());
                } else {
                    submitFormData.append(key, value);
                }
            });

            // Add file if selected
            if (selectedFile) {
                submitFormData.append('consentLetter', selectedFile);
            }

            console.log("FormData contents:");
            for (const pair of submitFormData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            let response;
            if (isEditMode) {
                // Use edit ID (NIC or household number) for update
                if (!editId) {
                    throw new Error("Edit ID is required for updating beneficiary");
                }
                response = await updateSamurdhiFamily(editId, payload, selectedFile || undefined);
            } else if (isExistingBeneficiary) {
                if (!formData.nic && !formData.aswasumaHouseholdNo) {
                    throw new Error("NIC or Household number is required for updating existing beneficiary");
                }
                const identifier = formData.nic || formData.aswasumaHouseholdNo;
                response = await updateSamurdhiFamily(identifier!, payload, selectedFile || undefined);
            } else {
                response = await createSamurdhiFamily(payload, selectedFile || undefined);
            }

            if (response && response.id) {
                setIsFormResetting(true);

                const successMessage = isEditMode || isExistingBeneficiary
                    ? 'Beneficiary updated successfully!'
                    : 'Beneficiary created successfully!';

                toast.success(successMessage, {
                    duration: 6000,
                    style: {
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        maxWidth: '400px',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: '#10B981',
                    },
                });

                // Handle post-submission logic based on mode
                if (isEditMode) {
                    // In edit mode, redirect back to the previous page
                    setTimeout(() => {
                        setIsFormResetting(false);
                        window.history.back();
                    }, 2000);
                } else {
                    // Reset form after successful submission in create mode
                    setTimeout(() => {
                        resetForm();
                        setIsExistingBeneficiary(false);
                        setErrors({});
                        setIsAswasumaHouseholdDisabled(false);
                        setShowAllFieldsForExistingBeneficiary(false);
                        setSelectedFile(null);

                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });

                        setIsFormResetting(false);

                        toast.success('Form is ready for next entry!', {
                            duration: 3000,
                            style: {
                                background: '#8B5CF6',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                minHeight: '60px',
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                            },
                        });
                    }, 5000);
                }
            } else {
                throw new Error(response?.message || 'Unexpected response from server');
            }
            setSelectedFile(null);
        } catch (error: unknown) {
            console.error('Error submitting form:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'An error occurred while submitting the form';

            toast.error(errorMessage, {
                duration: 6000,
                style: {
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    maxWidth: '400px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        errors,
        setErrors,
        clearError,
        isFetching,
        isSubmitting,
        isFormResetting,
        isExistingBeneficiary,
        setIsExistingBeneficiary,
        isAswasumaHouseholdDisabled,
        setIsAswasumaHouseholdDisabled,
        showAllFieldsForExistingBeneficiary,
        setShowAllFieldsForExistingBeneficiary,
        projectTypesByLivelihood,
        isLoadingProjectTypes,
        handleLivelihoodChange,
        selectedFile,
        handleFileChange,
        handleInputChange,
        handleSelectChange,
        handleRadioChange,
        handleCheckboxChange,
        handleNicLookup,
        handleHouseholdSelection,
        setSelectedFile,
        handleSubmit,
        clearSubsequentFields
    };
};