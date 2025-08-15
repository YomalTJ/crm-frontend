import { useEffect, useState } from 'react';
import { FormData, FormOptions, LocationData } from '@/types/samurdhi-form.types';
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
import { getEmpowermentRefusalReasons } from '@/services/empowermentRefusalReasonsService';
import { getDisabilities } from '@/services/disabilitiesService';
import { getHouseholdNumbersByGnCode } from '@/services/samurdhiService';
import toast from 'react-hot-toast';

const createEmptyFormData = (locationData: Partial<{
    district: LocationData;
    dsDivision: LocationData;
    zone: LocationData;
    gnd: LocationData;
}> = {}): FormData => ({
    district: locationData.district || { id: '', name: '' },
    dsDivision: locationData.dsDivision || { id: '', name: '' },
    zone: locationData.zone || { id: '', name: '' },
    gnd: locationData.gnd || { id: '', name: '' },
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
    commercialBankAccountName: null,
    commercialBankAccountNumber: null,
    commercialBankName: null,
    commercialBankBranch: null,
    samurdhiBankAccountName: null,
    samurdhiBankAccountNumber: null,
    samurdhiBankName: null,
    samurdhiBankAccountType: null
});

export const useSamurdhiFormData = () => {
    const [formData, setFormData] = useState<FormData>(createEmptyFormData);
    const [formOptions, setFormOptions] = useState<FormOptions>({
        employmentOptions: [],
        subsidyOptions: [],
        aswasumaCategories: [],
        refusalReasons: [],
        disabilities: [],
        jobFields: [],
        projectTypes: [],
        resourcesNeeded: [],
        healthIndicators: [],
        domesticDynamics: [],
        communityParticipationOptions: [],
        housingServices: [],
        beneficiaryStatuses: [],
        empowermentDimensions: []
    });
    const [householdNumbers, setHouseholdNumbers] = useState<string[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingHouseholdNumbers, setIsLoadingHouseholdNumbers] = useState(false);

    // Initialize location data from localStorage
    useEffect(() => {
        const storedLocation = localStorage.getItem('staffLocation');
        if (storedLocation) {
            const locationDetails = JSON.parse(storedLocation);
            const locationData = {
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

            setFormData(createEmptyFormData(locationData));
        }
    }, []);

    // Load all form options
    useEffect(() => {
        const initializeFormData = async () => {
            setIsInitialLoading(true);

            try {
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
                    getCurrentEmploymentOptions().catch(() => []),
                    getSamurdhiSubsidyOptions().catch(() => []),
                    getAswasumaCategories().catch(() => []),
                    getJobFields().catch(() => []),
                    getProjectTypes().catch(() => []),
                    getResourceNeeded().catch(() => []),
                    getHealthIndicators().catch(() => []),
                    getDomesticDynamics().catch(() => []),
                    getCommunityParticipation().catch(() => []),
                    getHousingServices().catch(() => []),
                    getBeneficiaryStatuses().catch(() => []),
                    getEmpowermentDimensions().catch(() => []),
                    getEmpowermentRefusalReasons().catch(() => []),
                    getDisabilities().catch(() => [])
                ]);

                setFormOptions({
                    employmentOptions: employmentData,
                    subsidyOptions: subsidyData,
                    aswasumaCategories: aswasumaData,
                    jobFields: jobFieldsData,
                    projectTypes: projectTypesData,
                    resourcesNeeded: resourcesData,
                    healthIndicators: healthIndicatorsData,
                    domesticDynamics: domesticDynamicsData,
                    communityParticipationOptions: communityParticipationData,
                    housingServices: housingServicesData,
                    beneficiaryStatuses: beneficiaryStatusesData,
                    empowermentDimensions: empowermentDimensionsData,
                    refusalReasons: refusalReasonsData,
                    disabilities: disabilitiesData
                });
            } catch (error) {
                console.error('Error initializing form data:', error);
                toast.error('Failed to load form data. Please refresh the page.');
            } finally {
                setIsInitialLoading(false);
            }
        };

        initializeFormData();
    }, []);

    // Load household numbers based on location
    useEffect(() => {
        const fetchHouseholdNumbers = async () => {
            try {
                const storedLocation = localStorage.getItem('staffLocation');

                if (storedLocation) {
                    const locationDetails = JSON.parse(storedLocation);
                    const { provinceId, district, dsDivision, zone, gnd } = locationDetails;

                    if (provinceId && district?.id && dsDivision?.id && zone?.id && gnd?.id) {
                        const gnCode = `${provinceId}-${district.id}-${dsDivision.id.toString().padStart(2, '0')}-${zone.id.toString().padStart(2, '0')}-${gnd.id}`;

                        setIsLoadingHouseholdNumbers(true);
                        const numbers = await getHouseholdNumbersByGnCode(gnCode);
                        setHouseholdNumbers(numbers);
                    }
                }
            } catch (error) {
                console.error('Error fetching household numbers:', error);
                toast.error('Failed to load household numbers');
            } finally {
                setIsLoadingHouseholdNumbers(false);
            }
        };

        fetchHouseholdNumbers();
    }, []);

    const resetForm = () => {
        const storedLocation = localStorage.getItem('staffLocation');
        let locationData = {};

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

        setFormData(createEmptyFormData(locationData));
    };

    return {
        formData,
        setFormData,
        formOptions,
        householdNumbers,
        setHouseholdNumbers,
        isInitialLoading,
        isLoadingHouseholdNumbers,
        setIsLoadingHouseholdNumbers,
        resetForm,
        createEmptyFormData
    };
};