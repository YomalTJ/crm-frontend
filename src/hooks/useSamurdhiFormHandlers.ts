/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormData as SamurdhiFormData, FormErrors, FormOptions } from '@/types/samurdhi-form.types';
import {
    getHouseholdDetailsByReference,
    createSamurdhiFamily,
    updateSamurdhiFamily,
    SamurdhiFamilyPayload,
    getBeneficiaryByIdentifier, // Add this import
    getProjectTypesByLivelihood
} from '@/services/samurdhiService';
import { validateSamurdhiForm, convertEmptyToNull, getAswasumaIdByLevel } from '@/utils/formValidation';
import toast from 'react-hot-toast';
import { validateFile } from '@/utils/fileValidation';

interface UseFormHandlersProps {
    formData: SamurdhiFormData;
    setFormData: React.Dispatch<React.SetStateAction<SamurdhiFormData>>;
    formOptions: FormOptions;
    resetForm: () => void;
    isEditMode?: boolean;
    editId?: string;
}

export const useSamurdhiFormHandlers = ({
    formData,
    setFormData,
    formOptions,
    resetForm,
    isEditMode = false,
    editId
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

        let processedValue: string | null;
        if (!value || value === '' || value === 'null' || value === 'undefined') {
            processedValue = null;
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
        setFormData(prev => ({
            ...prev,
            [name]: value === 'true' ? true : value === 'false' ? false : value
        }));
    };

    const handleCheckboxChange = (name: string, value: string, isChecked: boolean) => {
        clearError(name);
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
            // Clear auto-filled data when no household is selected
            setFormData(prev => ({
                ...prev,
                aswasumaHouseholdNo: null,
                beneficiaryName: null,
                beneficiaryGender: null,
                address: null,
                projectOwnerAge: 0,
                male16To24: 0,
                female16To24: 0,
                male25To45: 0,
                female25To45: 0,
                male46To60: 0,
                female46To60: 0,
                aswesuma_cat_id: null
            }));
            return;
        }

        try {
            const householdData = await getHouseholdDetailsByReference(selectedHhNumber);
            const primaryCitizen = householdData.citizens?.[0];

            if (householdData.household && primaryCitizen) {
                setFormData(prev => ({
                    ...prev,
                    nic: null,
                    aswasumaHouseholdNo: selectedHhNumber,
                    beneficiaryName: householdData.household.applicantName || primaryCitizen.name || '',
                    address: [
                        householdData.household.addressLine1,
                        householdData.household.addressLine2,
                        householdData.household.addressLine3
                    ].filter(line => line && line.trim()).join(', ') || '',
                    projectOwnerAge: primaryCitizen.age || 0,
                    beneficiaryGender: primaryCitizen.gender === 'male' ? 'Male' : 'Female',
                    aswesuma_cat_id: getAswasumaIdByLevel(householdData.household.level),
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

                // Calculate household members aged 18-60
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
                }

            }
        } catch (error: unknown) {
            console.error('Error fetching household details:', error);
            setFormData(prev => ({
                ...prev,
                aswasumaHouseholdNo: null,
                beneficiaryName: null,
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
                district_id: formData.district.id || "1",
                ds_id: formData.dsDivision.id || "1",
                zone_id: formData.zone.id || "1",
                gnd_id: formData.gnd.id || "1",
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
                empowerment_dimension_id: convertEmptyToNull(formData.empowerment_dimension_id),
                livelihood_id: convertEmptyToNull(formData.livelihood_id),
                project_type_id: convertEmptyToNull(formData.project_type_id),
                otherProject: convertEmptyToNull(formData.otherProject),
                childName: convertEmptyToNull(formData.childName),
                childAge: formData.childAge || 0,
                childGender: convertEmptyToNull(formData.childGender) || "Male",
                job_field_id: convertEmptyToNull(formData.job_field_id),
                otherJobField: convertEmptyToNull(formData.otherJobField),
                resource_id: formData.resource_id || [],
                monthlySaving: formData.monthlySaving,
                savingAmount: formData.savingAmount || 0,
                health_indicator_id: formData.health_indicator_id || [],
                domestic_dynamic_id: formData.domestic_dynamic_id || [],
                community_participation_id: formData.community_participation_id || [],
                housing_service_id: formData.housing_service_id || [],
                commercialBankAccountName: convertEmptyToNull(formData.commercialBankAccountName),
                commercialBankAccountNumber: convertEmptyToNull(formData.commercialBankAccountNumber),
                commercialBankName: convertEmptyToNull(formData.commercialBankName),
                commercialBankBranch: convertEmptyToNull(formData.commercialBankBranch),
                samurdhiBankAccountName: convertEmptyToNull(formData.samurdhiBankAccountName),
                samurdhiBankAccountNumber: convertEmptyToNull(formData.samurdhiBankAccountNumber),
                samurdhiBankName: convertEmptyToNull(formData.samurdhiBankName),
                samurdhiBankAccountType: convertEmptyToNull(formData.samurdhiBankAccountType),
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
                if (Array.isArray(value)) {
                    submitFormData.append(key, JSON.stringify(value));
                } else {
                    submitFormData.append(key, value?.toString() || '');
                }
            });

            // Add file if selected
            if (selectedFile) {
                submitFormData.append('consentLetter', selectedFile);
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
        handleSubmit
    };
};