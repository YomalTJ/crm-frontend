/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormData as SamurdhiFormData, FormErrors, FormOptions } from '@/types/samurdhi-form.types';
import {
    getBeneficiaryByNIC,
    getHouseholdDetailsByReference,
    createSamurdhiFamily,
    updateSamurdhiFamily,
    SamurdhiFamilyPayload
} from '@/services/samurdhiService';
import { validateSamurdhiForm, convertEmptyToNull, getAswasumaIdByLevel } from '@/utils/formValidation';
import toast from 'react-hot-toast';

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
                nic: value.trim() === '' ? null : value.trim()
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

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
        clearError('consentLetter');
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
            const data = await getBeneficiaryByNIC(formData.nic);
            setIsExistingBeneficiary(true);

            const isPreviousSamurdhi = data.beneficiary_type_id === '77744e4d-48a4-4295-8a5d-38d2100599f9' ||
                data.beneficiary_type_name?.includes("Previous Samurdhi") ||
                data.beneficiary_type_name?.includes("Low income");
            setIsAswasumaHouseholdDisabled(isPreviousSamurdhi);

            // Check if the fetched data has values for fields that might be hidden
            const hasHiddenFieldValues = data.aswasumaHouseholdNo ||
                data.empowerment_dimension_id ||
                data.project_type_id ||
                data.childName ||
                data.job_field_id ||
                data.resource_id?.length > 0 ||
                data.health_indicator_id?.length > 0 ||
                data.domestic_dynamic_id?.length > 0 ||
                data.community_participation_id?.length > 0 ||
                data.housing_service_id?.length > 0;

            if (hasHiddenFieldValues) {
                setShowAllFieldsForExistingBeneficiary(true);
            }

            // Update form data with fetched information
            setFormData(prev => ({
                ...prev,
                mainProgram: null,
                aswasumaHouseholdNo: null,
                beneficiaryName: data.name || '',
                beneficiaryGender: data.gender || 'Male', // Updated field name
                address: data.address || '',
                mobilePhone: data.phone || '', // Updated field name
                telephone: data.telephone || null, // NEW field
                projectOwnerAge: data.age || 0,
                hasDisability: data.hasDisability || false, // NEW field
                disability_id: data.disability_id || null,
                male16To24: data.male16To24 || 0,
                female16To24: data.female16To24 || 0,
                male25To45: data.male25To45 || 0,
                female25To45: data.female25To45 || 0,
                male46To60: data.male46To60 || 0,
                female46To60: data.female46To60 || 0,
                beneficiary_type_id: data.beneficiary_type_id || '',
                employment_id: data.employment_id || '',
                otherOccupation: data.otherOccupation || '',
                subsisdy_id: data.subsisdy_id || '',
                aswesuma_cat_id: data.aswesuma_cat_id || '',
                empowerment_dimension_id: data.empowerment_dimension_id || null,
                project_type_id: data.project_type_id || '',
                otherProject: data.otherProject || '',
                childName: data.childName || '',
                childAge: data.childAge || 0,
                childGender: data.childGender || 'Male',
                job_field_id: data.job_field_id || '',
                otherJobField: data.otherJobField || '',
                resource_id: Array.isArray(data.resource_id) ? data.resource_id : (data.resource_id ? [data.resource_id] : []),
                monthlySaving: data.monthlySaving || false,
                savingAmount: data.savingAmount || 0,
                health_indicator_id: Array.isArray(data.health_indicator_id) ? data.health_indicator_id : (data.health_indicator_id ? [data.health_indicator_id] : []),
                domestic_dynamic_id: Array.isArray(data.domestic_dynamic_id) ? data.domestic_dynamic_id : (data.domestic_dynamic_id ? [data.domestic_dynamic_id] : []),
                community_participation_id: Array.isArray(data.community_participation_id) ? data.community_participation_id : (data.community_participation_id ? [data.community_participation_id] : []),
                housing_service_id: Array.isArray(data.housing_service_id) ? data.housing_service_id : (data.housing_service_id ? [data.housing_service_id] : []),
                wantsAswesumaBankTransfer: data.wantsAswesumaBankTransfer || false,
                otherBankName: data.otherBankName || null,
                otherBankBranch: data.otherBankBranch || null,
                otherBankAccountHolder: data.otherBankAccountHolder || null,
                otherBankAccountNumber: data.otherBankAccountNumber || null,
                hasOtherGovernmentSubsidy: data.hasOtherGovernmentSubsidy || false,
                otherGovernmentInstitution: data.otherGovernmentInstitution || null,
                otherSubsidyAmount: data.otherSubsidyAmount || null
            }));
        } catch {
            setIsExistingBeneficiary(false);
            setShowAllFieldsForExistingBeneficiary(false);

            // Clear auto-filled data when NIC lookup fails
            setFormData(prev => ({
                ...prev,
                mainProgram: null,
                aswasumaHouseholdNo: null,
                beneficiaryName: null,
                beneficiaryGender: null, // Updated
                address: null,
                mobilePhone: null, // Updated
                telephone: null, // NEW
                projectOwnerAge: 0,
                hasDisability: false, // NEW
                disability_id: null,
                male16To24: 0, // NEW
                female16To24: 0, // NEW
                male25To45: 0, // NEW
                female25To45: 0, // NEW
                male46To60: 0, // NEW
                female46To60: 0, // NEW
                aswesuma_cat_id: null,
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

            toast.error('Failed to fetch beneficiary details');
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
                beneficiaryGender: null, // Updated
                address: null,
                projectOwnerAge: 0,
                male16To24: 0, // NEW
                female16To24: 0, // NEW
                male25To45: 0, // NEW
                female25To45: 0, // NEW
                male46To60: 0, // NEW
                female46To60: 0, // NEW
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
                    let male16To24 = 0, female16To24 = 0;
                    let male25To45 = 0, female25To45 = 0;
                    let male46To60 = 0, female46To60 = 0;

                    householdData.citizens.forEach((citizen: any) => {
                        const age = citizen.age;
                        const isMale = citizen.gender === 'male';

                        if (age >= 16 && age <= 24) {
                            if (isMale) male16To24++; else female16To24++;
                        } else if (age >= 25 && age <= 45) {
                            if (isMale) male25To45++; else female25To45++;
                        } else if (age >= 46 && age <= 60) {
                            if (isMale) male46To60++; else female46To60++;
                        }
                    });

                    setFormData(prev => ({
                        ...prev,
                        male16To24,
                        female16To24,
                        male25To45,
                        female25To45,
                        male46To60,
                        female46To60
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
                male16To24: 0,
                female16To24: 0,
                male25To45: 0,
                female25To45: 0,
                male46To60: 0,
                female46To60: 0,
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
                beneficiaryGender: convertEmptyToNull(formData.beneficiaryGender), // Updated
                address: convertEmptyToNull(formData.address),
                mobilePhone: convertEmptyToNull(formData.mobilePhone), // Updated
                telephone: convertEmptyToNull(formData.telephone), // NEW
                projectOwnerName: convertEmptyToNull(formData.projectOwnerName),
                projectOwnerAge: formData.projectOwnerAge || 0,
                projectOwnerGender: convertEmptyToNull(formData.projectOwnerGender),
                hasDisability: formData.hasDisability, // NEW
                disability_id: convertEmptyToNull(formData.disability_id),
                male16To24: formData.male16To24 || 0,
                female16To24: formData.female16To24 || 0,
                male25To45: formData.male25To45 || 0,
                female25To45: formData.female25To45 || 0,
                male46To60: formData.male46To60 || 0,
                female46To60: formData.female46To60 || 0,
                employment_id: convertEmptyToNull(formData.employment_id),
                otherOccupation: convertEmptyToNull(formData.otherOccupation),
                subsisdy_id: convertEmptyToNull(formData.subsisdy_id),
                aswesuma_cat_id: convertEmptyToNull(formData.aswesuma_cat_id),
                empowerment_dimension_id: convertEmptyToNull(formData.empowerment_dimension_id),
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
                if (!formData.nic) {
                    throw new Error("NIC is required for updating existing beneficiary");
                }
                response = await updateSamurdhiFamily(formData.nic, payload, selectedFile || undefined);
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