/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import Select from '../form/Select'
import { ChevronDownIcon } from '@/icons'
import Radio from '../form/input/Radio';
import Checkbox from '../form/input/Checkbox';
import Button from '../ui/button/Button';
import { getCurrentEmploymentOptions } from '@/services/employmentService';
import { getSamurdhiSubsidyOptions } from '@/services/subsidyService';
import { getAswasumaCategories } from '@/services/aswasumaService';
import { getProjectTypes } from '@/services/projectService';
import { getJobFields } from '@/services/jobFieldService';
import { getResourceNeeded } from '@/services/resourceService';
import { getHealthIndicators } from '@/services/healthIndicatorService';
import { getDomesticDynamics } from '@/services/domesticDynamicsService';
import { getCommunityParticipation } from '@/services/communityService';
import { getHousingServices } from '@/services/housingService';
import { getBeneficiaryStatuses } from '@/services/beneficiaryService';
import { getEmpowermentDimensions } from '@/services/empowermentService';
import { createSamurdhiFamily, getBeneficiaryByNIC, getHouseholdDetailsByReference, getHouseholdNumbersByGnCode, updateSamurdhiFamily } from '@/services/samurdhiService';
import toast, { Toaster } from 'react-hot-toast';
import FormSkeleton from '../loading/FormSkeleton';
import LoadingOverlay from '../loading/LoadingOverlay';
import LoadingSpinner from '../loading/LoadingSpinner';
import { BeneficiaryStatus, CommunityParticipation, DomesticDynamic, EmpowermentDimension, FormData, HealthIndicator, HousingService, JobField, ProjectType, Resource } from '@/interfaces/samurdhi-form/benficiaryFormInterfaces';
import { getEmpowermentRefusalReasons } from '@/services/empowermentRefusalReasonsService';
import { getDisabilities } from '@/services/disabilitiesService';

const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
        </p>
    );

}

const MAIN_PROGRAM_OPTIONS = [
    { value: 'NP', label: 'National Program' },
    { value: 'ADB', label: 'ADB Program' },
    { value: 'WB', label: 'World Bank Program' }
];

const SamurdhiFamillyForm = () => {

    const [employmentOptions, setEmploymentOptions] = useState<Array<{
        employment_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>>([]);

    const [subsidyOptions, setSubsidyOptions] = useState<Array<{
        subsisdy_id: string;
        amount: string;
    }>>([]);

    const [aswasumaCategories, setAswasumaCategories] = useState<Array<{
        aswesuma_cat_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>>([]);

    const [refusalReasons, setRefusalReasons] = useState<Array<{
        id: string;
        reason_en: string;
        reason_si: string;
        reason_ta: string;
    }>>([]);

    const [disabilities, setDisabilities] = useState<Array<{
        disabilityId: string;
        nameEN: string;
        nameSi: string;
        nameTa: string;
    }>>([]);

    const [jobFields, setJobFields] = useState<JobField[]>([]);

    const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);

    const [resourcesNeeded, setResourcesNeeded] = useState<Resource[]>([]);

    const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);

    const [domesticDynamics, setDomesticDynamics] = useState<DomesticDynamic[]>([]);

    const [communityParticipationOptions, setCommunityParticipationOptions] = useState<CommunityParticipation[]>([]);

    const [housingServices, setHousingServices] = useState<HousingService[]>([]);

    const [beneficiaryStatuses, setBeneficiaryStatuses] = useState<BeneficiaryStatus[]>([]);

    const [empowermentDimensions, setEmpowermentDimensions] = useState<EmpowermentDimension[]>([]);

    const [isFetching, setIsFetching] = useState(false);

    const [isExistingBeneficiary, setIsExistingBeneficiary] = useState(false);

    const [, setIsAswasumaHouseholdDisabled] = useState(false);

    const [householdNumbers, setHouseholdNumbers] = useState<string[]>([]);

    const [isLoadingHouseholdNumbers, setIsLoadingHouseholdNumbers] = useState(false);

    const [isFormResetting, setIsFormResetting] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [showAllFieldsForExistingBeneficiary, setShowAllFieldsForExistingBeneficiary] = useState(false);

    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const storedLocation = localStorage.getItem('staffLocation');
        if (storedLocation) {
            const locationDetails = JSON.parse(storedLocation);

            setFormData(prev => ({
                ...prev,
                district: {
                    id: locationDetails.district?.id?.toString() || '',
                    name: locationDetails.district?.name || ''
                },
                dsDivision: {
                    id: locationDetails.dsDivision?.id?.toString() || '',
                    name: locationDetails.dsDivision?.name || ''
                },
                zone: {
                    id: locationDetails.zone?.id?.toString() || '',
                    name: locationDetails.zone?.name || ''
                },
                gnd: {
                    id: locationDetails.gnd?.id?.toString() || '',
                    name: locationDetails.gnd?.name || ''
                }
            }));
        }
    }, []);

    useEffect(() => {
        const initializeFormData = async () => {
            setIsInitialLoading(true);

            try {
                // Load all data in parallel for better performance
                const [
                    employmentData,
                    subsidyData,
                    aswasumaData,
                    jobFieldsData,
                    projectTypesData,
                    resourcesData,
                    healthIndicatorsData,
                    domesticDynamicsData,
                    communityParticipationData,
                    housingServicesData,
                    beneficiaryStatusesData,
                    empowermentDimensionsData,
                    refusalReasonsData,
                    disabilitiesData
                ] = await Promise.all([
                    getCurrentEmploymentOptions().catch(err => {
                        console.error('Error fetching employment options:', err);
                        return [];
                    }),
                    getSamurdhiSubsidyOptions().catch(err => {
                        console.error('Error fetching subsidy options:', err);
                        return [];
                    }),
                    getAswasumaCategories().catch(err => {
                        console.error('Error fetching Aswasuma categories:', err);
                        return [];
                    }),
                    getJobFields().catch(err => {
                        console.error('Error fetching job fields:', err);
                        return [];
                    }),
                    getProjectTypes().catch(err => {
                        console.error('Error fetching project types:', err);
                        return [];
                    }),
                    getResourceNeeded().catch(err => {
                        console.error('Error fetching resources needed:', err);
                        return [];
                    }),
                    getHealthIndicators().catch(err => {
                        console.error('Error fetching health indicators:', err);
                        return [];
                    }),
                    getDomesticDynamics().catch(err => {
                        console.error('Error fetching domestic dynamics:', err);
                        return [];
                    }),
                    getCommunityParticipation().catch(err => {
                        console.error('Error fetching community participation:', err);
                        return [];
                    }),
                    getHousingServices().catch(err => {
                        console.error('Error fetching housing services:', err);
                        return [];
                    }),
                    getBeneficiaryStatuses().catch(err => {
                        console.error('Error fetching beneficiary statuses:', err);
                        return [];
                    }),
                    getEmpowermentDimensions().catch(err => {
                        console.error('Error fetching empowerment dimensions:', err);
                        return [];
                    }),
                    getEmpowermentRefusalReasons().catch(err => {
                        console.error('Error fetching refusal reasons:', err);
                        return [];
                    }),
                    getDisabilities().catch(err => {
                        console.error('Error fetching disabilities:', err);
                        return [];
                    })
                ]);

                // Set all the state data
                setEmploymentOptions(employmentData);
                setSubsidyOptions(subsidyData);
                setAswasumaCategories(aswasumaData);
                setJobFields(jobFieldsData);
                setProjectTypes(projectTypesData);
                setResourcesNeeded(resourcesData);
                setHealthIndicators(healthIndicatorsData);
                setDomesticDynamics(domesticDynamicsData);
                setCommunityParticipationOptions(communityParticipationData);
                setHousingServices(housingServicesData);
                setBeneficiaryStatuses(beneficiaryStatusesData);
                setEmpowermentDimensions(empowermentDimensionsData);
                setRefusalReasons(refusalReasonsData);
                setDisabilities(disabilitiesData);

            } catch (error) {
                console.error('Error initializing form data:', error);
                toast.error('Failed to load form data. Please refresh the page.');
            } finally {
                setIsInitialLoading(false);
            }
        };

        initializeFormData();
    }, []);

    useEffect(() => {
        const fetchHouseholdNumbers = async () => {
            try {
                const storedLocation = localStorage.getItem('staffLocation');
                console.log('Stored location:', storedLocation); // Debug log

                if (storedLocation) {
                    const locationDetails = JSON.parse(storedLocation);
                    console.log('Location details:', locationDetails); // Debug log

                    // Extract all required IDs
                    const provinceId = locationDetails.provinceId;
                    const districtId = locationDetails.district?.id;
                    const dsId = locationDetails.dsDivision?.id;
                    const zoneId = locationDetails.zone?.id;
                    const gndId = locationDetails.gnd?.id;

                    console.log('Extracted IDs:', { provinceId, districtId, dsId, zoneId, gndId }); // Debug log

                    // Validate that all required IDs are present
                    if (provinceId && districtId && dsId && zoneId && gndId) {
                        // Format each part with leading zeros where necessary
                        const formattedProvinceId = provinceId.toString();
                        const formattedDistrictId = districtId.toString();

                        // DS ID needs to be zero-padded to 2 digits
                        const formattedDsId = dsId.toString().padStart(2, '0');

                        // Zone ID needs to be zero-padded to 2 digits  
                        const formattedZoneId = zoneId.toString().padStart(2, '0');

                        // GND ID should remain as is (it's already formatted correctly as "175")
                        const formattedGndId = gndId.toString();

                        // Construct the full GN Code
                        const gnCode = `${formattedProvinceId}-${formattedDistrictId}-${formattedDsId}-${formattedZoneId}-${formattedGndId}`;

                        console.log('Formatted GN Code:', gnCode); // Debug log
                        console.log('Individual parts:', {
                            province: formattedProvinceId,
                            district: formattedDistrictId,
                            ds: formattedDsId,
                            zone: formattedZoneId,
                            gnd: formattedGndId
                        });

                        setIsLoadingHouseholdNumbers(true);
                        console.log('Making API call with GN Code:', gnCode); // Debug log

                        const numbers = await getHouseholdNumbersByGnCode(gnCode);
                        console.log('API response:', numbers); // Debug log

                        setHouseholdNumbers(numbers);
                    } else {
                        console.error('Missing required location data:', {
                            provinceId, districtId, dsId, zoneId, gndId
                        });
                        toast.error('message')
                    }
                } else {
                    console.error('No stored location found');
                    toast.error('message')
                }
            } catch (error) {
                console.error('Error fetching household numbers:', error);
                toast.error('message')
            } finally {
                setIsLoadingHouseholdNumbers(false);
            }
        };

        fetchHouseholdNumbers();
    }, []);

    const handleNicLookup = async () => {
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

            // If existing beneficiary has values for conditional fields, show them
            if (hasHiddenFieldValues) {
                setShowAllFieldsForExistingBeneficiary(true);
            }

            // Clear the household number when fetching from NIC (since it's Samurdhi beneficiary)
            setFormData(prev => ({
                ...prev,
                mainProgram: null,
                aswasumaHouseholdNo: null, // Clear household number for Samurdhi beneficiaries
                beneficiaryName: data.name || '',
                gender: data.gender || 'Male',
                address: data.address || '',
                phone: data.phone || '',
                projectOwnerAge: data.age || 0,
                male18To60: data.members18To60?.male || 0,
                female18To60: data.members18To60?.female || 0,
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
                housing_service_id: Array.isArray(data.housing_service_id) ? data.housing_service_id : (data.housing_service_id ? [data.housing_service_id] : [])
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
                gender: null,
                address: null,
                phone: null,
                projectOwnerAge: 0,
                male18To60: 0,
                female18To60: 0,
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

    const convertEmptyToNull = (value: string | null | undefined): string | null => {
        if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
            return null;
        }
        return value;
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.mainProgram || formData.mainProgram.trim() === '') {
            newErrors.mainProgram = 'Please select main program';
        }

        // Basic required fields - check for null or empty
        if (!formData.beneficiary_type_id) {
            newErrors.beneficiary_type_id = 'Please select beneficiary type';
        }

        const selectedBeneficiaryType = beneficiaryStatuses.find(
            status => status.beneficiary_type_id === formData.beneficiary_type_id
        );

        const isSamurdhiBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Samurdhi beneficiary");
        const isAswasumaBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Aswasuma beneficiary") &&
            !selectedBeneficiaryType?.nameEnglish.includes("Samurdhi") &&
            !selectedBeneficiaryType?.nameEnglish.includes("low income");
        const isSamurdhiOrLowIncome = selectedBeneficiaryType?.nameEnglish.includes("Samurdhi") ||
            selectedBeneficiaryType?.nameEnglish.includes("low income");

        // Validation for consent fields
        if (formData.hasConsentedToEmpowerment === null || formData.hasConsentedToEmpowerment === undefined) {
            newErrors.hasConsentedToEmpowerment = 'Please select consent to empowerment program';
        }

        if (formData.hasObtainedConsentLetter === null || formData.hasObtainedConsentLetter === undefined) {
            newErrors.hasObtainedConsentLetter = 'Please select consent letter status';
        }

        // If user consented to empowerment, date is required
        if (formData.hasConsentedToEmpowerment === true && !formData.consentGivenAt) {
            newErrors.consentGivenAt = 'Please select a consent date';
        }

        // If user refused empowerment, refusal reason is required
        if (formData.hasConsentedToEmpowerment === false && !formData.refusal_reason_id) {
            newErrors.refusal_reason_id = 'Please select a refusal reason';
        }

        // Conditional NIC validation - only for non-pure Aswasuma beneficiaries
        if (!isAswasumaBeneficiary && isSamurdhiBeneficiary) {
            if (!formData.nic || formData.nic.trim() === '') {
                newErrors.nic = 'NIC number is required for Samurdhi beneficiaries';
            } else if (formData.nic.length < 10) {
                newErrors.nic = 'NIC must be at least 10 characters';
            }
        }

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

        // Conditional household number validation - only for non-Samurdhi/low-income beneficiaries
        if (!isSamurdhiOrLowIncome && isAswasumaBeneficiary && !formData.aswasumaHouseholdNo) {
            newErrors.aswasumaHouseholdNo = 'Aswasuma household number is required';
        }

        if (formData.monthlySaving && (!formData.savingAmount || formData.savingAmount <= 0)) {
            newErrors.savingAmount = 'Please enter a valid saving amount';
        }

        // Check if Employment Facilitation is selected
        const hasEmploymentFacilitation = formData.empowerment_dimension_id && (() => {
            const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id);
            return dimension?.nameEnglish.includes("Employment Facilitation");
        })();

        // Check if Business Opportunities is selected
        const hasBusinessOpportunities = formData.empowerment_dimension_id && (() => {
            const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id);
            return dimension?.nameEnglish.includes("Business Opportunities") ||
                dimension?.nameEnglish.includes("Self-Employment");
        })();

        // Validate child details if Employment Facilitation is selected
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

        // Validate project type if Business Opportunities is selected
        if (hasBusinessOpportunities) {
            if (!formData.project_type_id) {
                newErrors.project_type_id = 'Project type is required for Business Opportunities/Self-Employment';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (fieldName: string) => {
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    // Format community participation label
    const formatCommunityLabel = (item: {
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }) => {
        return `${item.nameSinhala} - ${item.nameTamil} - ${item.nameEnglish}`;
    };

    const formatCategoryLabel = (category: {
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }) => {
        return `${category.nameSinhala} - ${category.nameTamil} - ${category.nameEnglish}`;
    };

    const formatAmount = (amount: string) => {
        return `Rs. ${parseFloat(amount).toFixed(2)}`;
    };

    const [formData, setFormData] = useState<FormData>({
        district: { id: '', name: '' },
        dsDivision: { id: '', name: '' },
        zone: { id: '', name: '' },
        gnd: { id: '', name: '' },
        mainProgram: null,
        hasConsentedToEmpowerment: null,
        hasObtainedConsentLetter: null,
        consentGivenAt: null,
        beneficiary_type_id: null,
        aswasumaHouseholdNo: null,
        nic: null,
        beneficiaryName: null,
        gender: null,
        address: null,
        phone: null,
        projectOwnerAge: 0,
        male18To60: 0,
        female18To60: 0,
        employment_id: null,
        otherOccupation: null,
        subsisdy_id: null,
        aswesuma_cat_id: null,
        empowerment_dimension_id: null, // Changed from [] to null
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
        areaClassification: null,
        refusal_reason_id: null,
        disability_id: null,
        projectOwnerName: null,
        projectOwnerGender: null,
        commercialBankAccountName: null,
        commercialBankAccountNumber: null,
        commercialBankName: null,
        commercialBankBranch: null,
        samurdhiBankAccountName: null,
        samurdhiBankAccountNumber: null,
        samurdhiBankName: null,
        samurdhiBankAccountType: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        // Clear error when user starts typing
        clearError(name);

        if (name === 'nic') {
            setFormData(prev => ({
                ...prev,
                nic: value.trim() === '' ? null : value.trim()
            }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        clearError(name);

        // Handle different cases for null/empty values
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
            [name]: value
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

    const handleHouseholdSelection = async (selectedHhNumber: string) => {
        if (!selectedHhNumber) {
            // Clear auto-filled data when no household is selected
            setFormData(prev => ({
                ...prev,
                aswasumaHouseholdNo: null,
                beneficiaryName: null,
                gender: null,
                address: null,
                projectOwnerAge: 0,
                male18To60: 0,
                female18To60: 0,
                aswesuma_cat_id: null
            }));
            return;
        }

        try {
            setIsLoadingHouseholdNumbers(true);
            console.log('Fetching details for household:', selectedHhNumber);

            const householdData = await getHouseholdDetailsByReference(selectedHhNumber);
            console.log('Household data received:', householdData);

            // Get the primary citizen (usually the first one or the applicant)
            const primaryCitizen = householdData.citizens?.[0];

            if (householdData.household && primaryCitizen) {
                // Clear NIC when household is selected (since it's Aswasuma beneficiary)
                setFormData(prev => ({
                    ...prev,
                    nic: null, // Clear NIC for Aswasuma beneficiaries
                    aswasumaHouseholdNo: selectedHhNumber,
                    beneficiaryName: householdData.household.applicantName || primaryCitizen.name || '',
                    address: [
                        householdData.household.addressLine1,
                        householdData.household.addressLine2,
                        householdData.household.addressLine3
                    ].filter(line => line && line.trim()).join(', ') || '',

                    // Calculate age from date of birth if available
                    projectOwnerAge: primaryCitizen.age || 0,

                    // Set gender based on citizen data
                    gender: primaryCitizen.gender === 'male' ? 'Male' : 'Female',

                    // Set Aswasuma category based on level
                    aswesuma_cat_id: getAswasumaIdByLevel(householdData.household.level),

                    // Clear other auto-filled fields that might conflict
                    phone: null,
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
                    let male18To60 = 0;
                    let female18To60 = 0;

                    householdData.citizens.forEach((citizen: any) => {
                        const age = citizen.age;
                        if (age >= 18 && age <= 60) {
                            if (citizen.gender === 'male') {
                                male18To60++;
                            } else if (citizen.gender === 'female') {
                                female18To60++;
                            }
                        }
                    });

                    setFormData(prev => ({
                        ...prev,
                        male18To60,
                        female18To60
                    }));
                }
            }
        } catch (error: any) {
            console.error('Error fetching household details:', error);

            // Clear auto-filled data on error
            setFormData(prev => ({
                ...prev,
                aswasumaHouseholdNo: null,
                beneficiaryName: null,
                gender: null,
                address: null,
                projectOwnerAge: 0,
                male18To60: 0,
                female18To60: 0,
                aswesuma_cat_id: null
            }));

            toast.error('Failed to fetch household details. Please try again.');
        } finally {
            setIsLoadingHouseholdNumbers(false);
        }
    };

    const getAswasumaIdByLevel = (level: number): string => {
        // You'll need to map this based on your actual aswasuma categories
        // This is just an example - adjust according to your data
        const levelToIdMap: { [key: number]: string } = {
            1: '5563333f-1ac4-450f-ae77-aee6907fff6d',
            2: 'd934f9b8-b849-4195-acac-a421d367eef8',
            3: '598eed9f-4b0a-457c-98d4-9c70498c8a50',
            4: '8091882c-a474-4982-91fe-3ba9b5f78200',
        };

        return levelToIdMap[level] || '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix all validation errors before submitting');
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (!formData.beneficiary_type_id) {
            toast.error('Beneficiary type is required');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Form data being submitted:', formData);

            const payload = {
                district_id: formData.district.id || "1",
                ds_id: formData.dsDivision.id || "1",
                zone_id: formData.zone.id || "1",
                gnd_id: formData.gnd.id || "1",
                beneficiary_type_id: formData.beneficiary_type_id as string,
                mainProgram: formData.mainProgram ?? "",

                // Enhanced consent fields
                hasConsentedToEmpowerment: formData.hasConsentedToEmpowerment,
                hasObtainedConsentLetter: formData.hasObtainedConsentLetter,
                refusal_reason_id: convertEmptyToNull(formData.refusal_reason_id),
                consentGivenAt: formData.consentGivenAt
                    ? new Date(formData.consentGivenAt).toISOString()
                    : null,

                // Area classification
                areaClassification: formData.areaClassification,

                // Basic info
                aswasumaHouseholdNo: convertEmptyToNull(formData.aswasumaHouseholdNo),
                nic: convertEmptyToNull(formData.nic),
                beneficiaryName: convertEmptyToNull(formData.beneficiaryName),
                beneficiaryGender: convertEmptyToNull(formData.gender), // Note: backend uses beneficiaryGender
                address: convertEmptyToNull(formData.address),
                phone: convertEmptyToNull(formData.phone),

                // Project owner details
                projectOwnerName: convertEmptyToNull(formData.projectOwnerName),
                projectOwnerAge: formData.projectOwnerAge || 0,
                projectOwnerGender: convertEmptyToNull(formData.projectOwnerGender),

                // Disability
                disability_id: convertEmptyToNull(formData.disability_id),

                // Household members
                male18To60: formData.male18To60 || 0,
                female18To60: formData.female18To60 || 0,

                // Employment
                employment_id: convertEmptyToNull(formData.employment_id),
                otherOccupation: convertEmptyToNull(formData.otherOccupation),

                // Benefits
                subsisdy_id: convertEmptyToNull(formData.subsisdy_id),
                aswesuma_cat_id: convertEmptyToNull(formData.aswesuma_cat_id),

                // Empowerment
                empowerment_dimension_id: convertEmptyToNull(formData.empowerment_dimension_id),
                project_type_id: convertEmptyToNull(formData.project_type_id),
                otherProject: convertEmptyToNull(formData.otherProject),

                // Child details
                childName: convertEmptyToNull(formData.childName),
                childAge: formData.childAge || 0,
                childGender: convertEmptyToNull(formData.childGender) || "Male",
                job_field_id: convertEmptyToNull(formData.job_field_id),
                otherJobField: convertEmptyToNull(formData.otherJobField),

                // Array fields
                resource_id: formData.resource_id || [],
                monthlySaving: formData.monthlySaving,
                savingAmount: formData.savingAmount || 0,
                health_indicator_id: formData.health_indicator_id || [],
                domestic_dynamic_id: formData.domestic_dynamic_id || [],
                community_participation_id: formData.community_participation_id || [],
                housing_service_id: formData.housing_service_id || [],

                // Banking details
                commercialBankAccountName: convertEmptyToNull(formData.commercialBankAccountName),
                commercialBankAccountNumber: convertEmptyToNull(formData.commercialBankAccountNumber),
                commercialBankName: convertEmptyToNull(formData.commercialBankName),
                commercialBankBranch: convertEmptyToNull(formData.commercialBankBranch),
                samurdhiBankAccountName: convertEmptyToNull(formData.samurdhiBankAccountName),
                samurdhiBankAccountNumber: convertEmptyToNull(formData.samurdhiBankAccountNumber),
                samurdhiBankName: convertEmptyToNull(formData.samurdhiBankName),
                samurdhiBankAccountType: convertEmptyToNull(formData.samurdhiBankAccountType)
            };

            let response;
            if (isExistingBeneficiary) {
                if (!formData.nic) {
                    throw new Error("NIC is required for updating existing beneficiary");
                }
                response = await updateSamurdhiFamily(formData.nic, payload);
            } else {
                response = await createSamurdhiFamily(payload);
            }

            console.log('API Response:', response);

            if (response && response.id) {
                // Set form resetting state to keep button disabled
                setIsFormResetting(true);

                const successMessage = isExistingBeneficiary
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

                setTimeout(() => {
                    toast.loading('Preparing form for next entry...', {
                        duration: 2000,
                        style: {
                            background: '#3B82F6',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500',
                            minHeight: '60px',
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                        },
                    });
                }, 3000);

                setTimeout(() => {
                    const storedLocation = localStorage.getItem('staffLocation');
                    let locationData = {
                        district: { id: '', name: '' },
                        dsDivision: { id: '', name: '' },
                        zone: { id: '', name: '' },
                        gnd: { id: '', name: '' }
                    };

                    if (storedLocation) {
                        const locationDetails = JSON.parse(storedLocation);
                        locationData = {
                            district: {
                                id: locationDetails.district?.id?.toString() || '',
                                name: locationDetails.district?.name || ''
                            },
                            dsDivision: {
                                id: locationDetails.dsDivision?.id?.toString() || '',
                                name: locationDetails.dsDivision?.name || ''
                            },
                            zone: {
                                id: locationDetails.zone?.id?.toString() || '',
                                name: locationDetails.zone?.name || ''
                            },
                            gnd: {
                                id: locationDetails.gnd?.id?.toString() || '',
                                name: locationDetails.gnd?.name || ''
                            }
                        };
                    }

                    setFormData({
                        ...locationData,
                        mainProgram: null,
                        areaClassification: null,
                        beneficiary_type_id: null,
                        hasConsentedToEmpowerment: null,
                        hasObtainedConsentLetter: null,
                        refusal_reason_id: null,
                        consentGivenAt: null,
                        aswasumaHouseholdNo: null,
                        nic: null,
                        beneficiaryName: null,
                        gender: null,
                        address: null,
                        phone: null,
                        projectOwnerName: null,
                        projectOwnerAge: 0,
                        projectOwnerGender: null,
                        disability_id: null,
                        male18To60: 0,
                        female18To60: 0,
                        employment_id: null,
                        otherOccupation: null,
                        subsisdy_id: null,
                        aswesuma_cat_id: null,
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
                        housing_service_id: [],
                        // Banking details
                        commercialBankAccountName: null,
                        commercialBankAccountNumber: null,
                        commercialBankName: null,
                        commercialBankBranch: null,
                        samurdhiBankAccountName: null,
                        samurdhiBankAccountNumber: null,
                        samurdhiBankName: null,
                        samurdhiBankAccountType: null
                    });

                    setIsExistingBeneficiary(false);
                    setErrors({});
                    setIsAswasumaHouseholdDisabled(false);

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    setTimeout(() => {
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

                        // Enable the form after everything is complete
                        setIsFormResetting(false);
                    }, 500);

                }, 5000);

            } else {
                throw new Error(response?.message || 'Unexpected response from server');
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'An error occurred while submitting the form';

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

    return (
        <ComponentCard title="Family Development plan for Community Empowerment">
            <ErrorMessage />

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
                            <div>
                                <Label>District</Label>
                                <Input
                                    type="text"
                                    value={formData.district.name}
                                    readOnly
                                />
                                <input type="hidden" name="district_id" value={formData.district.id} />
                            </div>

                            <div>
                                <Label>Divisional Secretariat Division</Label>
                                <Input
                                    type="text"
                                    value={formData.dsDivision.name}
                                    readOnly
                                />
                                <input type="hidden" name="ds_id" value={formData.dsDivision.id} />
                            </div>


                            <div>
                                <Label>Samurdhi Bank</Label>
                                <Input
                                    type="text"
                                    value={formData.zone.name}
                                    readOnly
                                />
                                <input type="hidden" name="zone_id" value={formData.zone.id} />
                            </div>

                            <div>
                                <Label>Grama Nildhari Division</Label>
                                <Input
                                    type="text"
                                    value={formData.gnd.name}
                                    readOnly
                                />
                                <input type="hidden" name="gnd_id" value={formData.gnd.id} />
                            </div>

                            <div>
                                <Label>Main Program <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Select
                                        options={MAIN_PROGRAM_OPTIONS}
                                        placeholder="Select Main Program"
                                        onChange={(value) => {
                                            console.log('Selected main program:', value); // Debug log
                                            // Clear error immediately when user selects
                                            clearError('mainProgram');
                                            // Ensure we handle empty/null values properly
                                            const selectedValue = value && value !== '' && value !== 'null' ? value : null;
                                            setFormData(prev => ({
                                                ...prev,
                                                mainProgram: selectedValue
                                            }));
                                        }}
                                        className={`dark:bg-dark-900 ${errors.mainProgram ? 'border-red-500' : ''}`}
                                        value={formData.mainProgram || ''}  // Keep this as is
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                                <ErrorMessage error={errors.mainProgram} />
                            </div>

                            <div className="space-y-4">
                                <Label>Empowerment Program Consent</Label>

                                <div className="flex flex-col gap-6">
                                    {/* Consent to participate - Radio buttons */}
                                    <div className="flex flex-col gap-4">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Consent to participate in the empowerment program
                                        </Label>
                                        <div className="flex flex-col gap-3">
                                            <Radio
                                                id="consent-yes"
                                                name="hasConsentedToEmpowerment"
                                                value="true"
                                                checked={formData.hasConsentedToEmpowerment === true}
                                                onChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        hasConsentedToEmpowerment: true,
                                                        consentGivenAt: new Date().toISOString(),
                                                        refusal_reason_id: null // Clear refusal reason when consenting
                                                    }));
                                                    clearError('consentGivenAt');
                                                }}
                                                label="Yes"
                                            />
                                            <Radio
                                                id="consent-no"
                                                name="hasConsentedToEmpowerment"
                                                value="false"
                                                checked={formData.hasConsentedToEmpowerment === false}
                                                onChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        hasConsentedToEmpowerment: false,
                                                        consentGivenAt: null, // Clear consent date when refusing
                                                        refusal_reason_id: null
                                                    }));
                                                    clearError('refusal_reason_id');
                                                }}
                                                label="No"
                                            />
                                        </div>
                                    </div>

                                    {/* Conditional Date Selection - Only show when consent is Yes */}
                                    {formData.hasConsentedToEmpowerment === true && (
                                        <div className="flex flex-col gap-2">
                                            <Label>Consent Given Date <span className="text-red-500">*</span></Label>
                                            <div className="relative max-w-xs">
                                                <Input
                                                    type="date"
                                                    name="consentGivenAt"
                                                    value={formData.consentGivenAt ? formData.consentGivenAt.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const dateValue = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            consentGivenAt: dateValue ? new Date(dateValue).toISOString() : null
                                                        }));
                                                        clearError('consentGivenAt');
                                                    }}
                                                    className={`pr-10 ${errors.consentGivenAt ? 'border-red-500' : ''}`}
                                                    onFocus={(e) => e.target.showPicker()}
                                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                                />
                                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                                    </svg>
                                                </span>
                                            </div>
                                            <ErrorMessage error={errors.consentGivenAt} />
                                        </div>
                                    )}

                                    {/* Conditional Refusal Reason - Only show when consent is No */}
                                    {formData.hasConsentedToEmpowerment === false && (
                                        <div>
                                            <Label>Refusal Reason <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Select
                                                    options={refusalReasons.map(reason => ({
                                                        value: reason.id,
                                                        label: `${reason.reason_si} - ${reason.reason_ta} - ${reason.reason_en}`
                                                    }))}
                                                    placeholder="Select refusal reason"
                                                    onChange={(value) => {
                                                        handleSelectChange('refusal_reason_id', value);
                                                        clearError('refusal_reason_id');
                                                    }}
                                                    className={`dark:bg-dark-900 ${errors.refusal_reason_id ? 'border-red-500' : ''}`}
                                                    value={formData.refusal_reason_id || ''}
                                                />
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <ChevronDownIcon />
                                                </span>
                                            </div>
                                            <ErrorMessage error={errors.refusal_reason_id} />
                                        </div>
                                    )}

                                    {/* Consent letter obtained - Radio buttons */}
                                    <div className="flex flex-col gap-4">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Consent letter obtained
                                        </Label>
                                        <div className="flex flex-col gap-3">
                                            <Radio
                                                id="consent-letter-yes"
                                                name="hasObtainedConsentLetter"
                                                value="true"
                                                checked={formData.hasObtainedConsentLetter === true}
                                                onChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        hasObtainedConsentLetter: true
                                                    }));
                                                }}
                                                label="Yes"
                                            />
                                            <Radio
                                                id="consent-letter-no"
                                                name="hasObtainedConsentLetter"
                                                value="false"
                                                checked={formData.hasObtainedConsentLetter === false}
                                                onChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        hasObtainedConsentLetter: false
                                                    }));
                                                }}
                                                label="No"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Area Classification */}
                            <div>
                                <Label>Area Classification</Label>
                                <div className="flex flex-col gap-4">
                                    {[
                                        { value: 'නාගරික/ Urban/ நகர்ப்புற', label: 'නාගරික/ Urban/ நகர்ப்புற' },
                                        { value: 'ග්‍රාමීය/ Rural/ கிராமப்புறம்', label: 'ග්‍රාමීය/ Rural/ கிராமப்புறம்' },
                                        { value: 'වතු/ Estates / எஸ்டேட்ஸ்', label: 'වතු/ Estates / எஸ்டேட்ஸ்' }
                                    ].map((option) => (
                                        <Radio
                                            key={option.value}
                                            id={`area-${option.value}`}
                                            name="areaClassification"
                                            value={option.value}
                                            checked={formData.areaClassification === option.value}
                                            onChange={() => handleRadioChange('areaClassification', option.value)}
                                            label={option.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Label>Are you a Samurdhi beneficiary?/ Aswasuma beneficiary?/low-income earner?</Label>
                                <div className='flex flex-col md:flex-row gap-5 md:gap-20'>
                                    {beneficiaryStatuses.map((status) => (
                                        <Radio
                                            key={status.beneficiary_type_id}
                                            id={`status-${status.beneficiary_type_id}`}
                                            name="beneficiary_type_id"
                                            value={status.beneficiary_type_id}
                                            checked={formData.beneficiary_type_id === status.beneficiary_type_id}
                                            onChange={() => {
                                                console.log('Selected beneficiary_type_id:', status.beneficiary_type_id);

                                                // Check if it's Aswasuma beneficiary (hide NIC field)
                                                const isAswasumaBeneficiary = status.nameEnglish.includes("Aswasuma beneficiary") &&
                                                    !status.nameEnglish.includes("Samurdhi") &&
                                                    !status.nameEnglish.includes("low income");

                                                // Check if it's Samurdhi/Previous Samurdhi/Low income (hide household dropdown)
                                                const isSamurdhiOrLowIncome = status.nameEnglish.includes("Samurdhi") ||
                                                    status.nameEnglish.includes("low income");

                                                // Clear auto-filled data when switching beneficiary types
                                                setFormData(prev => ({
                                                    ...prev,
                                                    beneficiary_type_id: status.beneficiary_type_id,

                                                    // Clear auto-filled fields
                                                    beneficiaryName: null,
                                                    gender: null,
                                                    address: null,
                                                    phone: null,
                                                    projectOwnerAge: 0,
                                                    male18To60: 0,
                                                    female18To60: 0,
                                                    aswesuma_cat_id: null,

                                                    // Clear NIC when switching to Aswasuma beneficiary
                                                    nic: isAswasumaBeneficiary ? null : prev.nic,

                                                    // Clear household number when switching to Samurdhi/low income
                                                    aswasumaHouseholdNo: isSamurdhiOrLowIncome ? null : prev.aswasumaHouseholdNo,

                                                    // Clear employment and other optional fields
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

                                                // Reset states
                                                setIsExistingBeneficiary(false);
                                                setShowAllFieldsForExistingBeneficiary(false);
                                                setIsAswasumaHouseholdDisabled(isSamurdhiOrLowIncome);

                                                // Clear any validation errors
                                                setErrors({});

                                                // Clear error for beneficiary_type_id specifically
                                                clearError('beneficiary_type_id');
                                            }}
                                            label={
                                                <div className="flex flex-col">
                                                    <span className="font-sinhala">{status.nameSinhala}</span>
                                                    <span className="font-tamil">{status.nameTamil}</span>
                                                    <span>{status.nameEnglish}</span>
                                                </div>
                                            }
                                        />
                                    ))}
                                </div>
                                <ErrorMessage error={errors.beneficiary_type_id} />
                            </div>

                            {(() => {
                                const selectedBeneficiaryType = beneficiaryStatuses.find(
                                    status => status.beneficiary_type_id === formData.beneficiary_type_id
                                );

                                // Only show if a beneficiary type is selected AND it's not Samurdhi or low income
                                if (formData.beneficiary_type_id && selectedBeneficiaryType) {
                                    const isSamurdhiOrLowIncome = selectedBeneficiaryType.nameEnglish.includes("Samurdhi") ||
                                        selectedBeneficiaryType.nameEnglish.includes("low income");

                                    // Only show if NOT Samurdhi or low income beneficiary
                                    if (!isSamurdhiOrLowIncome) {
                                        return (
                                            <div>
                                                <Label>
                                                    Aswasuma household number
                                                    {(() => {
                                                        const isAswasumaBeneficiary = selectedBeneficiaryType.nameEnglish.includes("Aswasuma beneficiary") &&
                                                            !selectedBeneficiaryType.nameEnglish.includes("Samurdhi") &&
                                                            !selectedBeneficiaryType.nameEnglish.includes("low income");
                                                        return isAswasumaBeneficiary ? <span className="text-red-500"> *</span> : '';
                                                    })()}
                                                </Label>
                                                <div className="relative">
                                                    <Select
                                                        options={householdNumbers.map(number => ({
                                                            value: number,
                                                            label: number
                                                        }))}
                                                        placeholder={
                                                            householdNumbers.length === 0
                                                                ? 'No household numbers available for this GN division'
                                                                : 'Select household number'
                                                        }
                                                        onChange={async (value) => {
                                                            handleSelectChange('aswasumaHouseholdNo', value);
                                                            await handleHouseholdSelection(value);
                                                        }}
                                                        className={`dark:bg-dark-900 ${errors.aswasumaHouseholdNo ? 'border-red-500' : ''}`}
                                                        value={formData.aswasumaHouseholdNo || undefined}
                                                        disabled={isLoadingHouseholdNumbers}
                                                    />
                                                    {isLoadingHouseholdNumbers && (
                                                        <div className="absolute top-2 right-3">
                                                            <LoadingSpinner size="sm" />
                                                        </div>
                                                    )}
                                                </div>

                                                <ErrorMessage error={errors.aswasumaHouseholdNo} />
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })()}

                            {(() => {
                                const selectedBeneficiaryType = beneficiaryStatuses.find(
                                    status => status.beneficiary_type_id === formData.beneficiary_type_id
                                );

                                // Only show if a beneficiary type is selected AND it's not pure Aswasuma beneficiary
                                if (formData.beneficiary_type_id && selectedBeneficiaryType) {
                                    const isAswasumaBeneficiary = selectedBeneficiaryType.nameEnglish.includes("Aswasuma beneficiary") &&
                                        !selectedBeneficiaryType.nameEnglish.includes("Samurdhi") &&
                                        !selectedBeneficiaryType.nameEnglish.includes("low income");

                                    // Only show if NOT pure Aswasuma beneficiary
                                    if (!isAswasumaBeneficiary) {
                                        return (
                                            <div className="flex flex-col md:flex-row gap-2 md:items-end">
                                                <div className="md:flex-1">
                                                    <Label>
                                                        National Identity Card Number
                                                        {(() => {
                                                            const isSamurdhiBeneficiary = selectedBeneficiaryType.nameEnglish.includes("Samurdhi beneficiary");
                                                            return isSamurdhiBeneficiary ? <span className="text-red-500"> *</span> : '';
                                                        })()}
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        name="nic"
                                                        value={formData.nic || ''}
                                                        onChange={handleInputChange}
                                                        className={errors.nic ? 'border-red-500' : ''}
                                                    />
                                                    <ErrorMessage error={errors.nic} />
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={handleNicLookup}
                                                    disabled={isFetching}
                                                    className="h-11 w-full md:w-auto flex items-center gap-2"
                                                >
                                                    {isFetching && <LoadingSpinner size="sm" color="white" />}
                                                    {isFetching ? 'Fetching...' : 'Get Details'}
                                                </Button>
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })()}

                            <div>
                                <Label>Name of the Beneficiary</Label>
                                <Input
                                    type="text"
                                    name="beneficiaryName"
                                    value={formData.beneficiaryName || ""}
                                    onChange={handleInputChange}
                                    className={errors.beneficiaryName ? 'border-red-500' : ''}
                                />
                                <ErrorMessage error={errors.beneficiaryName} />
                            </div>

                            <div className="flex flex-col gap-4">
                                <Label>Gender</Label>
                                <Radio
                                    id="gender-female"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === "Female"}
                                    onChange={() => handleRadioChange('gender', "Female")}
                                    label="Female"
                                />
                                <Radio
                                    id="gender-male"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === "Male"}
                                    onChange={() => handleRadioChange('gender', "Male")}
                                    label="Male"
                                />
                                <Radio
                                    id="gender-other"
                                    name="gender"
                                    value="Other"
                                    checked={formData.gender === "Other"}
                                    onChange={() => handleRadioChange('gender', "Other")}
                                    label="Other"
                                />
                            </div>

                            <div>
                                <Label>Address</Label>
                                <Input
                                    type="text"
                                    name="address"
                                    value={formData.address || ""}
                                    onChange={handleInputChange}
                                    className={errors.address ? 'border-red-500' : ''}
                                />
                                <ErrorMessage error={errors.address} />
                            </div>

                            <div>
                                <Label>Phone Number</Label>
                                <Input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleInputChange}
                                    className={errors.phone ? 'border-red-500' : ''}
                                />
                                <ErrorMessage error={errors.phone} />
                            </div>

                            <div>
                                <Label>Project Owner Name</Label>
                                <Input
                                    type="text"
                                    name="projectOwnerName"
                                    value={formData.projectOwnerName || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <Label>Project Owner Gender</Label>
                                <Radio
                                    id="project-owner-gender-female"
                                    name="projectOwnerGender"
                                    value="Female"
                                    checked={formData.projectOwnerGender === "Female"}
                                    onChange={() => handleRadioChange('projectOwnerGender', "Female")}
                                    label="Female"
                                />
                                <Radio
                                    id="project-owner-gender-male"
                                    name="projectOwnerGender"
                                    value="Male"
                                    checked={formData.projectOwnerGender === "Male"}
                                    onChange={() => handleRadioChange('projectOwnerGender', "Male")}
                                    label="Male"
                                />
                                <Radio
                                    id="project-owner-gender-other"
                                    name="projectOwnerGender"
                                    value="Other"
                                    checked={formData.projectOwnerGender === "Other"}
                                    onChange={() => handleRadioChange('projectOwnerGender', "Other")}
                                    label="Other"
                                />
                            </div>

                            <div>
                                <Label>Age of Project Owner</Label>
                                <Input
                                    type="number"
                                    name="projectOwnerAge"
                                    value={formData.projectOwnerAge}
                                    onChange={handleInputChange}
                                    className={errors.projectOwnerAge ? 'border-red-500' : ''}
                                />
                                <ErrorMessage error={errors.projectOwnerAge} />
                            </div>

                            <div>
                                <Label>Disability (if any)</Label>
                                <div className="relative">
                                    <Select
                                        options={[
                                            { value: '', label: 'No disability' },
                                            ...disabilities.map(disability => ({
                                                value: disability.disabilityId,
                                                label: `${disability.nameSi} - ${disability.nameTa} - ${disability.nameEN}`
                                            }))
                                        ]}
                                        placeholder="Select disability status"
                                        onChange={(value) => handleSelectChange('disability_id', value)}
                                        className="dark:bg-dark-900"
                                        value={formData.disability_id || ''}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>No. of Household Members Aged 18–60</Label>
                                <Label>Female</Label>
                                <Input
                                    type="number"
                                    name="female18To60"
                                    defaultValue={formData.female18To60 || 0}
                                    onChange={handleInputChange}
                                />
                                <Label>Male</Label>
                                <Input
                                    type="number"
                                    name="male18To60"
                                    defaultValue={formData.male18To60 || 0}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Current Employment</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {employmentOptions.map((option) => (
                                        <Radio
                                            key={option.employment_id}
                                            id={`employment-${option.employment_id}`}
                                            name="employment_id"
                                            value={option.employment_id}
                                            checked={formData.employment_id === option.employment_id}
                                            onChange={() => {
                                                console.log('Selected employment_id:', option.employment_id);
                                                handleRadioChange('employment_id', option.employment_id);
                                            }}
                                            label={`${option.nameSinhala} - ${option.nameTamil} - ${option.nameEnglish}`}
                                            className="text-sm sm:text-base"
                                        />
                                    ))}
                                </div>
                                <ErrorMessage error={errors.employment_id} />
                            </div>

                            <div>
                                <Label>Other Occupation (if any)</Label>
                                <Input
                                    type="text"
                                    name="otherOccupation"
                                    defaultValue={formData.otherOccupation || undefined}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label>Samurdhi subsidy received</Label>
                                <div className="relative">
                                    <Select
                                        options={subsidyOptions.map(option => ({
                                            value: option.subsisdy_id,  // Changed from amount to id
                                            label: formatAmount(option.amount)  // Keep formatted amount as display label
                                        }))}
                                        placeholder="Select Subsidy Amount"
                                        onChange={(value) => handleSelectChange('subsisdy_id', value)}  // Changed to correct field name
                                        className="dark:bg-dark-900"
                                        defaultValue={formData.subsisdy_id || ""}  // Changed to correct field name
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>

                            <div>
                                <Label>Aswasuma category</Label>
                                <div className="relative">
                                    <Select
                                        options={aswasumaCategories.map(category => ({
                                            value: category.aswesuma_cat_id,  // Changed from nameEnglish to id
                                            label: formatCategoryLabel(category)  // Keep formatted label for display
                                        }))}
                                        placeholder="Select Aswasuma Category"
                                        onChange={(value) => handleSelectChange('aswesuma_cat_id', value)}  // Changed to correct API field name
                                        className="dark:bg-dark-900"
                                        defaultValue={formData.aswesuma_cat_id || ""}  // Changed to correct field name
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>What is Empowerment Dimension</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                    {empowermentDimensions.map((dimension) => (
                                        <Radio
                                            key={dimension.empowerment_dimension_id}
                                            id={`empowerment-${dimension.empowerment_dimension_id}`}
                                            name="empowerment_dimension_id"
                                            value={dimension.empowerment_dimension_id}
                                            checked={formData.empowerment_dimension_id === dimension.empowerment_dimension_id}
                                            onChange={() => {
                                                console.log('Selected empowerment_dimension_id:', dimension.empowerment_dimension_id);
                                                handleRadioChange('empowerment_dimension_id', dimension.empowerment_dimension_id);
                                            }}
                                            label={
                                                <div className="flex flex-col text-sm sm:text-base">
                                                    <span className="font-sinhala">{dimension.nameSinhala}</span>
                                                    <span className="font-tamil">{dimension.nameTamil}</span>
                                                    <span>{dimension.nameEnglish}</span>
                                                </div>
                                            }
                                        />
                                    ))}
                                </div>
                                <ErrorMessage error={errors.empowerment_dimension_id} />
                            </div>

                            {(formData.empowerment_dimension_id && (() => {
                                const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id);
                                return dimension?.nameEnglish.includes("Business Opportunities") ||
                                    dimension?.nameEnglish.includes("Self-Employment");
                            })() || (showAllFieldsForExistingBeneficiary && formData.project_type_id)) && (
                                    <div className="space-y-2">
                                        <Label>Types of Projects</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                            {projectTypes.map((project) => (
                                                <Radio
                                                    key={project.project_type_id}
                                                    id={`project-${project.project_type_id}`}
                                                    name="project_type_id"
                                                    value={project.project_type_id}
                                                    checked={formData.project_type_id === project.project_type_id}
                                                    onChange={() => {
                                                        console.log('Selected project_type_id:', project.project_type_id);
                                                        handleRadioChange('project_type_id', project.project_type_id);
                                                    }}
                                                    label={
                                                        <div className="flex flex-col text-sm sm:text-base">
                                                            <span className="font-sinhala">{project.nameSinhala}</span>
                                                            <span className="font-tamil">{project.nameTamil}</span>
                                                            <span>{project.nameEnglish}</span>
                                                        </div>
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <ErrorMessage error={errors.project_type_id} />
                                    </div>
                                )}

                            <div>
                                <Label>Specify other projects</Label>
                                <Input
                                    type="text"
                                    name="otherProject"
                                    defaultValue={formData.otherProject || undefined}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {(formData.empowerment_dimension_id && (() => {
                                const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id);
                                return dimension?.nameEnglish.includes("Employment Facilitation");
                            })() || (showAllFieldsForExistingBeneficiary && (formData.childName || formData.job_field_id))) && (
                                    <>
                                        <div>
                                            <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ නම</Label>
                                            <Input
                                                type="text"
                                                name="childName"
                                                value={formData.childName || ""}
                                                onChange={handleInputChange}
                                                className={errors.childName ? 'border-red-500' : ''}
                                            />
                                            <ErrorMessage error={errors.childName} />
                                        </div>

                                        <div>
                                            <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ වයස</Label>
                                            <Input
                                                type="number"
                                                name="childAge"
                                                value={formData.childAge}
                                                onChange={handleInputChange}
                                                className={errors.childAge ? 'border-red-500' : ''}
                                            />
                                            <ErrorMessage error={errors.childAge} />
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ  ස්ත්‍රී - පුරුෂ භාවය</Label>
                                            <Radio
                                                id="child-gender-female"
                                                name="childGender"
                                                value="Female"
                                                checked={formData.childGender === "Female"}
                                                onChange={() => handleRadioChange('childGender', "Female")}
                                                label="Female"
                                            />
                                            <Radio
                                                id="child-gender-male"
                                                name="childGender"
                                                value="Male"
                                                checked={formData.childGender === "Male"}
                                                onChange={() => handleRadioChange('childGender', "Male")}
                                                label="Male"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Job Field</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                                {jobFields.map((jobField) => (
                                                    <Radio
                                                        key={jobField.job_field_id}
                                                        id={`job-field-${jobField.job_field_id}`}
                                                        name="job_field_id"
                                                        value={jobField.job_field_id}
                                                        checked={formData.job_field_id === jobField.job_field_id}
                                                        onChange={() => {
                                                            console.log('Selected job_field_id:', jobField.job_field_id);
                                                            handleRadioChange('job_field_id', jobField.job_field_id);
                                                        }}
                                                        label={
                                                            <div className="flex flex-col text-sm sm:text-base">
                                                                <span className="font-sinhala">{jobField.nameSinhala}</span>
                                                                <span className="font-tamil">{jobField.nameTamil}</span>
                                                                <span>{jobField.nameEnglish}</span>
                                                            </div>
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <ErrorMessage error={errors.job_field_id} />
                                        </div>

                                        <div>
                                            <Label>Please specify Other employment fields</Label>
                                            <Input
                                                type="text"
                                                name="otherJobField"
                                                value={formData.otherJobField || undefined}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </>
                                )}

                            <div className="space-y-2">
                                <Label>Resources Needed</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {resourcesNeeded.map((resource) => (
                                        <div key={resource.resource_id} className="flex gap-3 items-start">
                                            <Checkbox
                                                checked={formData.resource_id.includes(resource.resource_id)}
                                                onChange={(checked) => {
                                                    console.log('Resource selection changed:', resource.resource_id, checked);
                                                    handleCheckboxChange('resource_id', resource.resource_id, checked);
                                                }}
                                            />
                                            <span className="block text-gray-700 dark:text-gray-400 text-sm sm:text-base">
                                                {resource.nameEnglish} - {resource.nameSinhala} - {resource.nameTamil}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <ErrorMessage error={errors.resource_id} />
                            </div>

                            <div className="space-y-2">
                                <Label>Health/Nutrition/Education</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {healthIndicators.map((indicator) => (
                                        <div key={indicator.health_indicator_id} className="flex gap-3 items-start">
                                            <Checkbox
                                                checked={formData.health_indicator_id.includes(indicator.health_indicator_id)}
                                                onChange={(checked) => {
                                                    console.log('Health indicator selection changed:',
                                                        indicator.health_indicator_id, checked);
                                                    handleCheckboxChange(
                                                        'health_indicator_id',
                                                        indicator.health_indicator_id,
                                                        checked
                                                    );
                                                }}
                                            />
                                            <span className="flex flex-col text-gray-700 dark:text-gray-400 text-sm sm:text-base">
                                                <span className="font-sinhala">{indicator.nameSinhala}</span>
                                                <span className="font-tamil">{indicator.nameTamil}</span>
                                                <span>{indicator.nameEnglish}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <ErrorMessage error={errors.health_indicator_id} />
                            </div>

                            <div className="space-y-2">
                                <Label>Domestic Dynamics</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {domesticDynamics.map((dynamic) => (
                                        <div key={dynamic.domestic_dynamic_id} className="flex gap-3 items-start">
                                            <Checkbox
                                                checked={formData.domestic_dynamic_id.includes(dynamic.domestic_dynamic_id)}
                                                onChange={(checked) => {
                                                    console.log('Domestic dynamic selection changed:',
                                                        dynamic.domestic_dynamic_id, checked);
                                                    handleCheckboxChange(
                                                        'domestic_dynamic_id',
                                                        dynamic.domestic_dynamic_id,
                                                        checked
                                                    );
                                                }}
                                            />
                                            <div className="flex flex-col text-gray-700 dark:text-gray-400 text-sm sm:text-base">
                                                <span className="font-sinhala">{dynamic.nameSinhala}</span>
                                                <span className="font-tamil">{dynamic.nameTamil}</span>
                                                <span>{dynamic.nameEnglish}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <ErrorMessage error={errors.domestic_dynamic_id} />
                            </div>

                            <div className="space-y-2">
                                <Label>Community Participation</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {communityParticipationOptions.map((item) => (
                                        <div key={item.community_participation_id} className="flex gap-3 items-start">
                                            <Checkbox
                                                checked={formData.community_participation_id.includes(item.community_participation_id)}
                                                onChange={(checked) =>
                                                    handleCheckboxChange('community_participation_id', item.community_participation_id, checked)
                                                }
                                            />
                                            <span className="block text-gray-700 dark:text-gray-400 text-sm sm:text-base">
                                                {formatCommunityLabel(item)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <ErrorMessage error={errors.community_participation_id} />
                            </div>

                            <div className="space-y-2">
                                <Label>Housing Services</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {housingServices.map((service) => (
                                        <div key={service.housing_service_id} className="flex gap-3 items-start">
                                            <Checkbox
                                                checked={formData.housing_service_id.includes(service.housing_service_id)}
                                                onChange={(checked) =>
                                                    handleCheckboxChange('housing_service_id', service.housing_service_id, checked)
                                                }
                                            />
                                            <div className="flex flex-col text-gray-700 dark:text-gray-400 text-sm sm:text-base">
                                                <span className="font-sinhala">{service.nameSinhala}</span>
                                                <span className="font-tamil">{service.nameTamil}</span>
                                                <span>{service.nameEnglish}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <ErrorMessage error={errors.housing_service_id} />
                            </div>

                            <div className="space-y-6 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Banking Details
                                </h3>

                                {/* Commercial Bank Details */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                                        Commercial Bank Details
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Account Name</Label>
                                            <Input
                                                type="text"
                                                name="commercialBankAccountName"
                                                value={formData.commercialBankAccountName || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Account Number</Label>
                                            <Input
                                                type="text"
                                                name="commercialBankAccountNumber"
                                                value={formData.commercialBankAccountNumber || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Bank Name</Label>
                                            <Input
                                                type="text"
                                                name="commercialBankName"
                                                value={formData.commercialBankName || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Branch</Label>
                                            <Input
                                                type="text"
                                                name="commercialBankBranch"
                                                value={formData.commercialBankBranch || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Samurdhi Bank Details */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                                        Samurdhi Bank Details
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Account Name</Label>
                                            <Input
                                                type="text"
                                                name="samurdhiBankAccountName"
                                                value={formData.samurdhiBankAccountName || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Account Number</Label>
                                            <Input
                                                type="text"
                                                name="samurdhiBankAccountNumber"
                                                value={formData.samurdhiBankAccountNumber || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Bank Name</Label>
                                            <Input
                                                type="text"
                                                name="samurdhiBankName"
                                                value={formData.samurdhiBankName || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Account Type</Label>
                                            <Input
                                                type="text"
                                                name="samurdhiBankAccountType"
                                                value={formData.samurdhiBankAccountType || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                    type="button"  // Explicitly set type to button to prevent form submission
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent any default behavior
                                        // Reset form
                                        setFormData({
                                            district: { id: formData.district.id, name: formData.district.name },
                                            dsDivision: { id: formData.dsDivision.id, name: formData.dsDivision.name },
                                            zone: { id: formData.zone.id, name: formData.zone.name },
                                            gnd: { id: formData.gnd.id, name: formData.gnd.name },
                                            mainProgram: null,
                                            areaClassification: null,
                                            beneficiary_type_id: null,
                                            hasConsentedToEmpowerment: null,
                                            hasObtainedConsentLetter: null,
                                            refusal_reason_id: null,
                                            consentGivenAt: null,
                                            aswasumaHouseholdNo: null,
                                            nic: null,
                                            beneficiaryName: null,
                                            gender: null,
                                            address: null,
                                            phone: null,
                                            projectOwnerName: null,
                                            projectOwnerAge: 0,
                                            projectOwnerGender: null,
                                            disability_id: null,
                                            male18To60: 0,
                                            female18To60: 0,
                                            employment_id: null,
                                            otherOccupation: null,
                                            subsisdy_id: null,
                                            aswesuma_cat_id: null,
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
                                            housing_service_id: [],
                                            // Banking details
                                            commercialBankAccountName: null,
                                            commercialBankAccountNumber: null,
                                            commercialBankName: null,
                                            commercialBankBranch: null,
                                            samurdhiBankAccountName: null,
                                            samurdhiBankAccountNumber: null,
                                            samurdhiBankName: null,
                                            samurdhiBankAccountType: null
                                        });
                                        setIsExistingBeneficiary(false);
                                        setErrors({}); // Clear validation errors
                                        setIsAswasumaHouseholdDisabled(false); // Reset any disabled states
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                maxWidth: '500px',
                            },
                            success: {
                                duration: 5000, // Longer duration for success messages
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
    )
}

export default SamurdhiFamillyForm
