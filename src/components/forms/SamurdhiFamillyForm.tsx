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

interface BeneficiaryStatus {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        name: string;
        username: string;
        language: string;
        role: {
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface EmpowermentDimension {
    empowerment_dimension_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        name: string;
        username: string;
        language: string;
        role: {
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface ProjectType {
    project_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface JobField {
    job_field_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface DomesticDynamic {
    domestic_dynamic_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface HousingService {
    housing_service_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface FormData {
    district: {
        id: string;
        name: string;
    };
    dsDivision: {
        id: string;
        name: string;
    };
    zone: {
        id: string;
        name: string;
    };
    gnd: {
        id: string;
        name: string;
    };
    beneficiary_type_id: string | null; // Remove null from here
    aswasumaHouseholdNo: string | null;
    nic: string | null;
    beneficiaryName: string | null;
    gender: string | null;
    address: string | null;
    phone: string | null;
    projectOwnerAge: number;
    male18To60: number;
    female18To60: number;
    employment_id: string | null;
    otherOccupation: string | null;
    subsisdy_id: string | null;
    aswesuma_cat_id: string | null;
    empowerment_dimension_id: string[];
    project_type_id: string | null;
    otherProject: string | null;
    childName?: string | null;
    childAge?: number;
    childGender?: string | null;
    job_field_id: string | null;
    otherJobField?: string | null;
    resource_id: string[];
    monthlySaving: boolean;
    savingAmount: number;
    health_indicator_id: string[];
    domestic_dynamic_id: string[];
    community_participation_id: string[];
    housing_service_id: string[];
}

interface Resource {
    resource_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface CommunityParticipation {
    community_participation_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

interface HealthIndicator {
    health_indicator_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
        </p>
    );

}

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

    const [isAswasumaHouseholdDisabled, setIsAswasumaHouseholdDisabled] = useState(false);

    const [householdNumbers, setHouseholdNumbers] = useState<string[]>([]);

    const [isLoadingHouseholdNumbers, setIsLoadingHouseholdNumbers] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        const fetchDomesticDynamics = async () => {
            try {
                const data = await getDomesticDynamics();
                setDomesticDynamics(data);
            } catch (error) {
                console.error('Error fetching domestic dynamics:', error);
            }
        };

        fetchDomesticDynamics();
    }, []);

    useEffect(() => {
        const fetchHealthIndicators = async () => {
            try {
                const data = await getHealthIndicators();
                setHealthIndicators(data);
            } catch (error) {
                console.error('Error fetching health indicators:', error);
            }
        };

        fetchHealthIndicators();
    }, []);

    useEffect(() => {
        const fetchEmploymentOptions = async () => {
            try {
                const data = await getCurrentEmploymentOptions();
                setEmploymentOptions(data);
            } catch (error) {
                console.error('Error fetching employment options:', error);
            }
        };

        fetchEmploymentOptions();
    }, []);

    useEffect(() => {
        const fetchSubsidyOptions = async () => {
            try {

                const data = await getSamurdhiSubsidyOptions();
                setSubsidyOptions(data);
            } catch (error) {
                console.error('Error fetching subsidy options:', error);
            }
        };

        fetchSubsidyOptions();
    }, []);

    useEffect(() => {
        const fetchAswasumaCategories = async () => {
            try {
                const data = await getAswasumaCategories();
                setAswasumaCategories(data);
            } catch (error) {
                console.error('Error fetching Aswasuma categories:', error);
            }
        };

        fetchAswasumaCategories();
    }, []);

    useEffect(() => {
        const fetchProjectTypes = async () => {
            try {
                const data = await getProjectTypes();
                setProjectTypes(data);
            } catch (error) {
                console.error('Error fetching project types:', error);
            }
        };

        fetchProjectTypes();
    }, []);

    useEffect(() => {
        const fetchJobFields = async () => {
            try {
                const data = await getJobFields();
                setJobFields(data);
            } catch (error) {
                console.error('Error fetching job fields:', error);
            }
        };

        fetchJobFields();
    }, []);

    useEffect(() => {
        const fetchResourcesNeeded = async () => {
            try {
                const data = await getResourceNeeded();
                setResourcesNeeded(data);
            } catch (error) {
                console.error('Error fetching resources needed:', error);
            }
        };

        fetchResourcesNeeded();
    }, []);

    useEffect(() => {
        const fetchCommunityParticipation = async () => {
            try {
                const data = await getCommunityParticipation();
                setCommunityParticipationOptions(data);
            } catch (error) {
                console.error('Error fetching community participation:', error);
            }
        };

        fetchCommunityParticipation();
    }, []);

    useEffect(() => {
        const fetchHousingServices = async () => {
            try {
                const data = await getHousingServices();
                setHousingServices(data);
            } catch (error) {
                console.error('Error fetching housing services:', error);
            }
        };
        fetchHousingServices();
    }, []);

    useEffect(() => {
        const fetchBeneficiaryStatuses = async () => {
            try {
                const data = await getBeneficiaryStatuses();
                setBeneficiaryStatuses(data);
            } catch (error) {
                console.error('Error fetching beneficiary statuses:', error);
            }
        };
        fetchBeneficiaryStatuses();
    }, []);

    useEffect(() => {
        const fetchEmpowermentDimensions = async () => {
            try {
                const data = await getEmpowermentDimensions();
                setEmpowermentDimensions(data);
            } catch (error) {
                console.error('Error fetching empowerment dimensions:', error);
            }
        };
        fetchEmpowermentDimensions();
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
            toast.error('message')
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

            setFormData(prev => ({
                ...prev,
                beneficiaryName: data.name || '',
                gender: data.gender || 'Male',
                address: data.address || '',
                phone: data.phone || '',
                projectOwnerAge: data.age || 0,
                male18To60: data.members18To60?.male || 0,
                female18To60: data.members18To60?.female || 0,
                aswasumaHouseholdNo: data.householdNumber || '',
                beneficiary_type_id: data.beneficiary_type_id || '',
                employment_id: data.employment_id || '',
                otherOccupation: data.otherOccupation || '',
                subsisdy_id: data.subsisdy_id || '',
                aswesuma_cat_id: data.aswesuma_cat_id || '',
                empowerment_dimension_id: data.empowerment_dimension_id || '',
                project_type_id: data.project_type_id || '',
                otherProject: data.otherProject || '',
                childName: data.childName || '',
                childAge: data.childAge || 0,
                childGender: data.childGender || 'Male',
                job_field_id: data.job_field_id || '',
                otherJobField: data.otherJobField || '',
                resource_id: data.resource_id ? [data.resource_id] : [],
                monthlySaving: data.monthlySaving || false,
                savingAmount: data.savingAmount || 0,
                health_indicator_id: data.health_indicator_id ? [data.health_indicator_id] : [],
                domestic_dynamic_id: data.domestic_dynamic_id ? [data.domestic_dynamic_id] : [],
                community_participation_id: data.community_participation_id ? [data.community_participation_id] : [],
                housing_service_id: data.housing_service_id ? [data.housing_service_id] : []
            }));
        } catch (error: any) {
            setIsExistingBeneficiary(false);
            toast.error('message', error)
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

        // Basic required fields - check for null or empty
        if (!formData.beneficiary_type_id) {
            newErrors.beneficiary_type_id = 'Please select beneficiary type';
        }

        const selectedBeneficiaryType = beneficiaryStatuses.find(
            status => status.beneficiary_type_id === formData.beneficiary_type_id
        );
        const isSamurdhiBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Samurdhi beneficiary");

        if (isSamurdhiBeneficiary) {
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

        // Conditional validations with null checks
        if (formData.beneficiary_type_id && !isAswasumaHouseholdDisabled && !formData.aswasumaHouseholdNo) {
            newErrors.aswasumaHouseholdNo = 'Aswasuma household number is required';
        }

        if (formData.monthlySaving && (!formData.savingAmount || formData.savingAmount <= 0)) {
            newErrors.savingAmount = 'Please enter a valid saving amount';
        }

        // Check if Employment Facilitation is selected
        const hasEmploymentFacilitation = formData.empowerment_dimension_id.some(id => {
            const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === id);
            return dimension?.nameEnglish.includes("Employment Facilitation");
        });

        // Check if Business Opportunities is selected
        const hasBusinessOpportunities = formData.empowerment_dimension_id.some(id => {
            const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === id);
            return dimension?.nameEnglish.includes("Business Opportunities") ||
                dimension?.nameEnglish.includes("Self-Employment");
        });

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
        beneficiary_type_id: '', // Change from null to empty string
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
        empowerment_dimension_id: [],
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
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                // Auto-fill form fields with household data
                setFormData(prev => ({
                    ...prev,
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
                    aswesuma_cat_id: getAswasumaIdByLevel(householdData.household.level)
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
            toast.error('message')
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
        e.preventDefault(); // This prevents the default form submission behavior

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
                aswasumaHouseholdNo: convertEmptyToNull(formData.aswasumaHouseholdNo),
                nic: convertEmptyToNull(formData.nic),
                beneficiaryName: convertEmptyToNull(formData.beneficiaryName),
                gender: convertEmptyToNull(formData.gender),
                address: convertEmptyToNull(formData.address),
                phone: convertEmptyToNull(formData.phone),
                projectOwnerAge: formData.projectOwnerAge || 0,
                male18To60: formData.male18To60 || 0,
                female18To60: formData.female18To60 || 0,
                employment_id: convertEmptyToNull(formData.employment_id),
                otherOccupation: convertEmptyToNull(formData.otherOccupation),
                subsisdy_id: convertEmptyToNull(formData.subsisdy_id),
                aswesuma_cat_id: convertEmptyToNull(formData.aswesuma_cat_id),
                empowerment_dimension_id: formData.empowerment_dimension_id.length > 0 ? formData.empowerment_dimension_id[0] : null,
                project_type_id: convertEmptyToNull(formData.project_type_id),
                otherProject: convertEmptyToNull(formData.otherProject),
                childName: convertEmptyToNull(formData.childName),
                childAge: formData.childAge || 0,
                childGender: convertEmptyToNull(formData.childGender) || "Male",
                job_field_id: convertEmptyToNull(formData.job_field_id),
                otherJobField: convertEmptyToNull(formData.otherJobField),
                resource_id: formData.resource_id.length > 0 ? formData.resource_id[0] : null,
                monthlySaving: formData.monthlySaving,
                savingAmount: formData.savingAmount || 0,
                health_indicator_id: formData.health_indicator_id.length > 0 ? formData.health_indicator_id[0] : null,
                domestic_dynamic_id: formData.domestic_dynamic_id.length > 0 ? formData.domestic_dynamic_id[0] : null,
                community_participation_id: formData.community_participation_id.length > 0 ? formData.community_participation_id[0] : null,
                housing_service_id: formData.housing_service_id.length > 0 ? formData.housing_service_id[0] : null
            };

            console.log('Prepared payload:', payload);

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

            // Modified success check - if we got a response with an id, consider it successful
            if (response && response.id) {
                const successMessage = isExistingBeneficiary
                    ? 'Beneficiary updated successfully!'
                    : 'Beneficiary created successfully!';

                // Show success toast first
                toast.success(successMessage, {
                    duration: 4000,
                    style: {
                        background: '#10B981',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: '#10B981',
                    },
                });

                // Wait a bit before resetting the form to ensure toast is visible
                setTimeout(() => {
                    // Reset form after successful submission
                    setFormData({
                        district: { id: '', name: '' },
                        dsDivision: { id: '', name: '' },
                        zone: { id: '', name: '' },
                        gnd: { id: '', name: '' },
                        beneficiary_type_id: '',
                        aswasumaHouseholdNo: '',
                        nic: null,
                        beneficiaryName: '',
                        gender: 'Male',
                        address: '',
                        phone: '',
                        projectOwnerAge: 0,
                        male18To60: 0,
                        female18To60: 0,
                        employment_id: '',
                        otherOccupation: '',
                        subsisdy_id: '',
                        aswesuma_cat_id: '',
                        empowerment_dimension_id: [],
                        project_type_id: '',
                        otherProject: '',
                        childName: '',
                        childAge: 0,
                        childGender: 'Male',
                        job_field_id: '',
                        otherJobField: '',
                        resource_id: [],
                        monthlySaving: false,
                        savingAmount: 0,
                        health_indicator_id: [],
                        domestic_dynamic_id: [],
                        community_participation_id: [],
                        housing_service_id: []
                    });
                    setIsExistingBeneficiary(false);
                    setErrors({}); // Clear any validation errors
                }, 1000); // Wait 1 second before resetting

            } else {
                // If we didn't get an expected response, throw an error
                throw new Error(response?.message || 'Unexpected response from server');
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'An error occurred while submitting the form';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ComponentCard title="Family Development plan for Community Empowerment">
            <ErrorMessage />
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

                    <div className="flex flex-col gap-4">
                        <Label>Are you a Samurdhi beneficiary?/ Aswasuma beneficiary?/low-income earner?</Label>
                        {beneficiaryStatuses.map((status) => (
                            <Radio
                                key={status.beneficiary_type_id}
                                id={`status-${status.beneficiary_type_id}`}
                                name="beneficiary_type_id"
                                value={status.beneficiary_type_id}
                                checked={formData.beneficiary_type_id === status.beneficiary_type_id}
                                onChange={() => {
                                    console.log('Selected beneficiary_type_id:', status.beneficiary_type_id);
                                    handleRadioChange('beneficiary_type_id', status.beneficiary_type_id);

                                    // Check if it's Samurdhi beneficiary (disable household dropdown)
                                    const isSamurdhiBeneficiary = status.nameEnglish.includes("Samurdhi beneficiary");

                                    // Check if it's Previous Samurdhi or low income (disable household dropdown)
                                    const isPreviousSamurdhi = status.nameEnglish.includes("Previous Samurdhi beneficiary") ||
                                        status.nameEnglish.includes("Low income earner");

                                    // Disable household dropdown for both Samurdhi and Previous Samurdhi/Low income
                                    setIsAswasumaHouseholdDisabled(isSamurdhiBeneficiary || isPreviousSamurdhi);

                                    if (isSamurdhiBeneficiary || isPreviousSamurdhi) {
                                        setFormData(prev => ({
                                            ...prev,
                                            aswasumaHouseholdNo: ''
                                        }));
                                    }
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
                        <ErrorMessage error={errors.beneficiary_type_id} />
                    </div>

                    <div>
                        <Label>
                            Aswasuma household number
                            {(() => {
                                const selectedBeneficiaryType = beneficiaryStatuses.find(
                                    status => status.beneficiary_type_id === formData.beneficiary_type_id
                                );
                                const isAswasumaBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Aswasuma beneficiary");
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
                                    isLoadingHouseholdNumbers
                                        ? 'Loading household numbers...'
                                        : householdNumbers.length === 0
                                            ? 'No household numbers available for this GN division'
                                            : isAswasumaHouseholdDisabled
                                                ? 'Not available for selected beneficiary type'
                                                : 'Select household number'
                                }
                                onChange={async (value) => {
                                    handleSelectChange('aswasumaHouseholdNo', value);
                                    await handleHouseholdSelection(value);
                                }}
                                className={`dark:bg-dark-900 ${errors.aswasumaHouseholdNo ? 'border-red-500' : ''}`}
                                value={formData.aswasumaHouseholdNo || undefined}  // Convert null to undefined
                                disabled={isAswasumaHouseholdDisabled || isLoadingHouseholdNumbers}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                        <ErrorMessage error={errors.aswasumaHouseholdNo} />
                    </div>

                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label>
                                National Identity Card Number
                                {(() => {
                                    const selectedBeneficiaryType = beneficiaryStatuses.find(
                                        status => status.beneficiary_type_id === formData.beneficiary_type_id
                                    );
                                    const isSamurdhiBeneficiary = selectedBeneficiaryType?.nameEnglish.includes("Samurdhi beneficiary");
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
                            className="h-11"
                        >
                            {isFetching ? 'Fetching...' : 'Get Details'}
                        </Button>
                    </div>

                    <div>
                        <Label>Name of the Beneficiary</Label>
                        <Input
                            type="text"
                            name="beneficiaryName"
                            value={formData.beneficiaryName || undefined}
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
                    </div>

                    <div>
                        <Label>Address</Label>
                        <Input
                            type="text"
                            name="address"
                            value={formData.address || undefined}
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
                            value={formData.phone || undefined}
                            onChange={handleInputChange}
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        <ErrorMessage error={errors.phone} />
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
                        <Label>No. of Household Members Aged 18–60</Label>
                        <Label>Female</Label>
                        <Input
                            type="number"
                            name="female18To60"
                            defaultValue={formData.female18To60}
                            onChange={handleInputChange}
                        />
                        <Label>Male</Label>
                        <Input
                            type="number"
                            name="male18To60"
                            defaultValue={formData.male18To60}
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
                                defaultValue={formData.subsisdy_id || undefined}  // Changed to correct field name
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
                                defaultValue={formData.aswesuma_cat_id || undefined}  // Changed to correct field name
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
                                <div key={dimension.empowerment_dimension_id} className="flex gap-3 items-start">
                                    <Checkbox  // Changed from Radio to Checkbox
                                        checked={formData.empowerment_dimension_id.includes(dimension.empowerment_dimension_id)}
                                        onChange={(checked) => {
                                            console.log('Selected empowerment_dimension_id:', dimension.empowerment_dimension_id);
                                            handleCheckboxChange('empowerment_dimension_id', dimension.empowerment_dimension_id, checked);
                                        }}
                                    />
                                    <div className="flex flex-col text-sm sm:text-base font-medium text-gray-700 dark:text-gray-400">
                                        <span className="font-sinhala">{dimension.nameSinhala}</span>
                                        <span className="font-tamil">{dimension.nameTamil}</span>
                                        <span>{dimension.nameEnglish}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ErrorMessage error={errors.empowerment_dimension_id} />
                    </div>

                    {formData.empowerment_dimension_id.some(id => {
                        const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === id);
                        return dimension?.nameEnglish.includes("Business Opportunities") ||
                            dimension?.nameEnglish.includes("Self-Employment");
                    }) && (
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

                    {formData.empowerment_dimension_id.some(id => {
                        const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === id);
                        return dimension?.nameEnglish.includes("Employment Facilitation");
                    }) && (
                            <>
                                <div>
                                    <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ නම</Label>
                                    <Input
                                        type="text"
                                        name="childName"
                                        value={formData.childName || undefined}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ වයස</Label>
                                    <Input
                                        type="number"
                                        name="childAge"
                                        value={formData.childAge}
                                        onChange={handleInputChange}
                                    />
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

                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={formData.monthlySaving}
                            onChange={(checked) => setFormData(prev => ({ ...prev, monthlySaving: checked }))}
                        />
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Monthly Saving
                        </span>
                    </div>

                    {formData.monthlySaving && (
                        <div>
                            <Label>Saving Amount</Label>
                            <Input
                                type="number"
                                name="savingAmount"
                                value={formData.savingAmount}
                                onChange={handleInputChange}
                                className={errors.savingAmount ? 'border-red-500' : ''}
                            />
                            <ErrorMessage error={errors.savingAmount} />
                        </div>
                    )}

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

                    <div className="flex items-center gap-5">
                        <Button
                            size="sm"
                            variant="primary"
                            type="submit"  // Add this line
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (isExistingBeneficiary ? 'Updating...' : 'Submitting...') : (isExistingBeneficiary ? 'Update' : 'Submit')}
                        </Button>
                        <Button
                            size="md"
                            variant="danger"
                            type="button"  // Explicitly set type to button to prevent form submission
                            onClick={(e) => {
                                e.preventDefault(); // Prevent any default behavior
                                // Reset form
                                setFormData({
                                    district: { id: '', name: '' },
                                    dsDivision: { id: '', name: '' },
                                    zone: { id: '', name: '' },
                                    gnd: { id: '', name: '' },
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
                                    empowerment_dimension_id: [],
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
                    top: 20,
                    right: 20,
                }}
            />
        </ComponentCard>
    )
}

export default SamurdhiFamillyForm
