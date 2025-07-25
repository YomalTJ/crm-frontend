/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import Select from '../form/Select'
import { BoxIcon, ChevronDownIcon } from '@/icons'
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
import { createSamurdhiFamily, getBeneficiaryByNIC } from '@/services/samurdhiService';
import { ErrorPopup } from '../common/ErrorPopup';

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
    beneficiary_type_id: string;
    aswasumaHouseholdNo: string;
    nic: string;
    beneficiaryName: string;
    gender: string;                    // Main beneficiary gender
    address: string;
    phone: string;
    projectOwnerAge: number;
    male18To60: number;
    female18To60: number;
    employment_id: string;
    otherOccupation: string;
    subsisdy_id: string;
    aswesuma_cat_id: string;
    empowerment_dimension_id: string;
    project_type_id: string;
    otherProject: string;
    childName?: string;
    childAge?: number;
    childGender?: string;              // Add separate field for child gender
    job_field_id: string;
    otherJobField?: string;
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

// interface EmploymentOption {
//     employment_id: string;
//     nameEnglish: string;
//     nameSinhala: string;
//     nameTamil: string;
//     createdAt: string;
//     createdBy: {
//         name: string;
//         username: string;
//         language: string;
//         role: {
//             name: string;
//             canAdd: boolean;
//             canUpdate: boolean;
//             canDelete: boolean;
//         };
//     };
// }

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

    const [errorPopup, setErrorPopup] = useState({
        isOpen: false,
        title: '',
        message: '',
    });

    const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);

    const [resourcesNeeded, setResourcesNeeded] = useState<Resource[]>([]);

    const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);

    const [domesticDynamics, setDomesticDynamics] = useState<DomesticDynamic[]>([]);

    const [communityParticipationOptions, setCommunityParticipationOptions] = useState<CommunityParticipation[]>([]);

    const [housingServices, setHousingServices] = useState<HousingService[]>([]);

    const [beneficiaryStatuses, setBeneficiaryStatuses] = useState<BeneficiaryStatus[]>([]);

    const [empowermentDimensions, setEmpowermentDimensions] = useState<EmpowermentDimension[]>([]);

    const [isFetching, setIsFetching] = useState(false);

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

    const handleNicLookup = async () => {
        if (!formData.nic) {
            setErrorPopup({
                isOpen: true,
                title: 'Error',
                message: 'Please enter a NIC number first'
            });
            return;
        }

        setIsFetching(true);
        try {
            const data = await getBeneficiaryByNIC(formData.nic);

            setFormData(prev => ({
                ...prev,
                beneficiaryName: data.name || '',
                gender: data.gender || 'Male',
                address: data.address || '',
                phone: data.phone || '',
                projectOwnerAge: data.age || 0,
                male18To60: data.members18To60?.male || 0,
                female18To60: data.members18To60?.female || 0,
                aswasumaHouseholdNo: data.householdNumber || ''
            }));

        } catch (error: any) {
            setErrorPopup({
                isOpen: true,
                title: 'Error',
                message: error.message || 'Failed to fetch beneficiary details'
            });
        } finally {
            setIsFetching(false);
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
        beneficiary_type_id: '',
        aswasumaHouseholdNo: '',
        nic: '',
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
        empowerment_dimension_id: '',
        project_type_id: '',
        otherProject: '',
        childName: '',
        childAge: 0,
        childGender: 'Male',              // Add default value for child gender
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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadioChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name: string, value: string, isChecked: boolean) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare the payload according to the expected API format
            const payload = {
                district_id: formData.district.id || "1",
                ds_id: formData.dsDivision.id || "1",
                zone_id: formData.zone.id || "1",
                gnd_id: formData.gnd.id || "1",
                beneficiary_type_id: formData.beneficiary_type_id,
                aswasumaHouseholdNo: formData.aswasumaHouseholdNo,
                nic: formData.nic,
                beneficiaryName: formData.beneficiaryName,
                gender: formData.gender,
                address: formData.address,
                phone: formData.phone,
                projectOwnerAge: formData.projectOwnerAge,
                male18To60: formData.male18To60,
                female18To60: formData.female18To60,
                employment_id: formData.employment_id,
                otherOccupation: formData.otherOccupation,
                subsisdy_id: formData.subsisdy_id,
                aswesuma_cat_id: formData.aswesuma_cat_id,
                empowerment_dimension_id: formData.empowerment_dimension_id,
                project_type_id: formData.project_type_id,
                otherProject: formData.otherProject,
                childName: formData.childName || "",
                childAge: formData.childAge || 0,
                childGender: formData.childGender || "Male",
                job_field_id: formData.job_field_id,
                otherJobField: formData.otherJobField || "",
                resource_id: formData.resource_id.length > 0 ? formData.resource_id[0] : "",
                monthlySaving: formData.monthlySaving,
                savingAmount: formData.savingAmount,
                health_indicator_id: formData.health_indicator_id.length > 0 ? formData.health_indicator_id[0] : "",
                domestic_dynamic_id: formData.domestic_dynamic_id.length > 0 ? formData.domestic_dynamic_id[0] : "",
                community_participation_id: formData.community_participation_id.length > 0 ? formData.community_participation_id[0] : "",
                housing_service_id: formData.housing_service_id.length > 0 ? formData.housing_service_id[0] : ""
            };

            const response = await createSamurdhiFamily(payload);

            if (response.ok) {
                const data = await response.json();
                // Success notification (you can create a similar success popup if needed)
                alert('Form submitted successfully!');
                console.log('Response:', data);

                // Reset form after successful submission
                setFormData({
                    district: { id: '', name: '' },
                    dsDivision: { id: '', name: '' },
                    zone: { id: '', name: '' },
                    gnd: { id: '', name: '' },
                    beneficiary_type_id: '',
                    aswasumaHouseholdNo: '',
                    nic: '',
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
                    empowerment_dimension_id: '',
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
            } else {
                // Handle different types of errors
                let errorMessage = 'Failed to submit form';

                try {
                    const errorData = await response.json();
                    console.error('Error Response:', errorData);

                    // Handle different error response formats
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    } else if (errorData.errors) {
                        // Handle validation errors (array format)
                        if (Array.isArray(errorData.errors)) {
                            errorMessage = 'Validation errors occurred';
                        } else if (typeof errorData.errors === 'object') {
                            errorMessage = 'Validation errors occurred';
                        }
                    }

                } catch (parseError) {
                    console.error('Failed to parse error response:', parseError);
                    errorMessage = `Server Error (${response.status}): ${response.statusText}`;
                }

                // Show error popup
                setErrorPopup({
                    isOpen: true,
                    title: `Submission Failed (${response.status})`,
                    message: errorMessage,
                });
            }
        } catch (error: any) {
            console.error('Submission error:', error);

            let errorMessage = error.message || 'An error occurred';

            // For server errors, extract the meaningful part
            if (error.message.includes('createSamurdhiFamily')) {
                errorMessage = 'Failed to save family data';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setErrorPopup({
                isOpen: true,
                title: 'Error',
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ComponentCard title="Family Development plan for Community Empowerment">
            <form onSubmit={handleSubmit}>
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

                    <div>
                        <Label>Aswasuma household number</Label>
                        <Input
                            type="text"
                            name="aswasumaHouseholdNo"
                            defaultValue={formData.aswasumaHouseholdNo}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label>National Identity Card Number</Label>
                            <Input
                                type="text"
                                name="nic"
                                value={formData.nic}
                                onChange={handleInputChange}
                            />
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
                            defaultValue={formData.beneficiaryName}
                            onChange={handleInputChange}
                        />
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
                            defaultValue={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            name="phone"
                            defaultValue={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>Age of Project Owner</Label>
                        <Input
                            type="number"
                            name="projectOwnerAge"
                            defaultValue={formData.projectOwnerAge}
                            onChange={handleInputChange}
                        />
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
                                    className="text-sm sm:text-base" // Responsive text size
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label>Other Occupation (if any)</Label>
                        <Input
                            type="text"
                            name="otherOccupation"
                            defaultValue={formData.otherOccupation}
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
                                defaultValue={formData.subsisdy_id}  // Changed to correct field name
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
                                defaultValue={formData.aswesuma_cat_id}  // Changed to correct field name
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
                                    <Radio
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
                                </div>
                            ))}
                        </div>
                    </div>

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
                    </div>

                    <div>
                        <Label>Specify other projects</Label>
                        <Input
                            type="text"
                            name="otherProject"
                            defaultValue={formData.otherProject}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ නම</Label>
                        <Input
                            type="text"
                            name="childName"                   // Changed from "otherProject"
                            defaultValue={formData.childName}  // Changed to correct field
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ වයස</Label>
                        <Input
                            type="number"                      // Changed to number
                            name="childAge"                    // Changed from "otherProject"
                            defaultValue={formData.childAge}   // Changed to correct field
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ  ස්ත්‍රී - පුරුෂ භාවය</Label>
                        <Radio
                            id="child-gender-female"           // Changed ID
                            name="childGender"                 // Changed name attribute
                            value="Female"
                            checked={formData.childGender === "Female"}  // Changed to childGender
                            onChange={() => handleRadioChange('childGender', "Female")}  // Changed field name
                            label="Female"
                        />
                        <Radio
                            id="child-gender-male"             // Changed ID
                            name="childGender"                 // Changed name attribute
                            value="Male"
                            checked={formData.childGender === "Male"}    // Changed to childGender
                            onChange={() => handleRadioChange('childGender', "Male")}    // Changed field name
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
                    </div>

                    <div>
                        <Label>Please specify Other employment fields</Label>
                        <Input
                            type="text"
                            name="otherJobField"                    // Changed from "otherProject"
                            defaultValue={formData.otherJobField}   // Changed to correct field
                            onChange={handleInputChange}
                        />
                    </div>

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
                                defaultValue={formData.savingAmount}
                                onChange={handleInputChange}
                            />
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
                    </div>

                    <div className="flex items-center gap-5">
                        <Button
                            size="sm"
                            variant="primary"
                            startIcon={<BoxIcon />}
                            type="submit"  // Add this line
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button
                            size="md"
                            variant="primary"
                            startIcon={<BoxIcon />}
                            type="button"  // Add this line
                            onClick={() => {
                                // Reset form
                                setFormData({
                                    district: { id: '', name: '' },
                                    dsDivision: { id: '', name: '' },
                                    zone: { id: '', name: '' },
                                    gnd: { id: '', name: '' },
                                    beneficiary_type_id: '',
                                    aswasumaHouseholdNo: '',
                                    nic: '',
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
                                    empowerment_dimension_id: '',
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
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
            <ErrorPopup
                isOpen={errorPopup.isOpen}
                onClose={() => setErrorPopup(prev => ({ ...prev, isOpen: false }))}
                title={errorPopup.title}
                message={errorPopup.message}
            />
        </ComponentCard>
    )
}

export default SamurdhiFamillyForm
