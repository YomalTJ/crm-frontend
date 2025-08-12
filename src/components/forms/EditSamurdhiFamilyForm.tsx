/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import { getBeneficiaryByIdentifier, updateSamurdhiFamilyByIdentifier, BeneficiaryDetailsResponse, SamurdhiFamilyPayload } from '@/services/samurdhiService';
import toast, { Toaster } from 'react-hot-toast';
import FormSkeleton from '../loading/FormSkeleton';
import LoadingOverlay from '../loading/LoadingOverlay';
import LoadingSpinner from '../loading/LoadingSpinner';
import { BeneficiaryStatus, CommunityParticipation, DomesticDynamic, EmpowermentDimension, FormData, HealthIndicator, HousingService, JobField, ProjectType, Resource } from '@/interfaces/samurdhi-form/benficiaryFormInterfaces';

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

const EditSamurdhiFamilyForm = () => {
  const params = useParams()
  const router = useRouter()
  const identifier = params.id as string

  // State for dropdown options
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
  const [, setBeneficiaryStatuses] = useState<BeneficiaryStatus[]>([]);
  const [empowermentDimensions, setEmpowermentDimensions] = useState<EmpowermentDimension[]>([]);

  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingBeneficiary, setIsLoadingBeneficiary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryDetailsResponse | null>(null);

  const [formData, setFormData] = useState<FormData>({
    district: { id: '', name: '' },
    dsDivision: { id: '', name: '' },
    zone: { id: '', name: '' },
    gnd: { id: '', name: '' },
    mainProgram: null,
    hasConsentedToEmpowerment: false,
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
  });

  // Load all dropdown options
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
          empowermentDimensionsData
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
          getEmpowermentDimensions().catch(() => [])
        ]);

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

      } catch (error) {
        console.error('Error initializing form data:', error);
        toast.error('Failed to load form data. Please refresh the page.');
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeFormData();
  }, []);

  // Load beneficiary data
  useEffect(() => {
    const loadBeneficiaryData = async () => {
      if (!identifier) {
        toast.error('No beneficiary identifier provided');
        router.push('/dashboard/gn-level/view-benficiaries');
        return;
      }

      setIsLoadingBeneficiary(true);
      try {
        const decodedIdentifier = decodeURIComponent(identifier);
        const data = await getBeneficiaryByIdentifier(decodedIdentifier);
        setBeneficiaryData(data);

        let mainProgramValue = null;
        if (data.mainProgram) {
          if (data.mainProgram.includes('NP')) mainProgramValue = 'NP';
          else if (data.mainProgram.includes('ADB')) mainProgramValue = 'ADB';
          else if (data.mainProgram.includes('WB')) mainProgramValue = 'WB';
        }

        // Map the API response to form data
        setFormData({
          district: {
            id: data.location.district.id.toString(),
            name: data.location.district.name
          },
          dsDivision: {
            id: data.location.divisionalSecretariat.id.toString(),
            name: data.location.divisionalSecretariat.name
          },
          zone: {
            id: data.location.samurdhiBank.id.toString(),
            name: data.location.samurdhiBank.name
          },
          gnd: {
            id: data.location.gramaNiladhariDivision.id.toString(),
            name: data.location.gramaNiladhariDivision.name
          },
          mainProgram: mainProgramValue, // This needs to be determined from the data
          hasConsentedToEmpowerment: data.hasConsentedToEmpowerment || false,
          consentGivenAt: data.consentGivenAt,
          beneficiary_type_id: data.beneficiaryType.id,
          aswasumaHouseholdNo: data.householdNumber,
          nic: decodedIdentifier.includes('HH-') ? null : decodedIdentifier,
          beneficiaryName: data.name,
          gender: data.gender,
          address: data.address,
          phone: data.phone,
          projectOwnerAge: data.age,
          male18To60: data.members18To60.male,
          female18To60: data.members18To60.female,
          employment_id: data.currentEmployment.id,
          otherOccupation: data.otherOccupation,
          subsisdy_id: data.samurdhiSubsidy.id,
          aswesuma_cat_id: data.aswasumaCategory.id,
          empowerment_dimension_id: data.empowermentDimension ? data.empowermentDimension.id : null,
          project_type_id: data.projectType ? data.projectType.id : null,
          otherProject: data.otherProject,
          childName: data.childName,
          childAge: data.childAge || 0,
          childGender: data.childGender,
          job_field_id: data.jobField ? data.jobField.id : null,
          otherJobField: data.otherJobField,
          resource_id: data.resources ? data.resources.map(r => r.id) : [],
          monthlySaving: data.monthlySaving,
          savingAmount: data.savingAmount,
          health_indicator_id: data.healthIndicators ? data.healthIndicators.map(h => h.id): [], 
          domestic_dynamic_id: data.domesticDynamics ? data.domesticDynamics.map(d => d.id): [],
          community_participation_id: data.communityParticipations ? data.communityParticipations.map(c => c.id): [],
          housing_service_id: data.housingServices ? data.housingServices.map(h => h.id): [],
        });

      } catch (error: any) {
        console.error('Error loading beneficiary data:', error);
        toast.error('Failed to load beneficiary data. Please try again.');
        router.push('/dashboard/gn-level/view-benficiaries');
      } finally {
        setIsLoadingBeneficiary(false);
      }
    };

    if (!isInitialLoading) {
      loadBeneficiaryData();
    }
  }, [identifier, router, isInitialLoading]);

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
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

  const formatCommunityLabel = (item: {
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  }) => {
    return `${item.nameSinhala} - ${item.nameTamil} - ${item.nameEnglish}`;
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required field validations
    if (!formData.mainProgram) {
      newErrors.mainProgram = 'Main Program is required';
    }

    if (!formData.beneficiaryName || formData.beneficiaryName.trim() === '') {
      newErrors.beneficiaryName = 'Beneficiary name is required';
    }

    if (!formData.address || formData.address.trim() === '') {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone || formData.phone.trim() === '') {
      newErrors.phone = 'Phone number is required';
    } else if (!/^0\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits starting with 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build update payload
  const buildUpdatePayload = (): SamurdhiFamilyPayload => {
    if (!formData.district.id || !formData.dsDivision.id || !formData.gnd.id || !formData.zone.id) {
      throw new Error('Location fields are required');
    }

    return {
      district_id: formData.district.id,
      ds_id: formData.dsDivision.id,
      gnd_id: formData.gnd.id,
      zone_id: formData.zone.id,
      mainProgram: formData.mainProgram || '',
      hasConsentedToEmpowerment: formData.hasConsentedToEmpowerment,
      consentGivenAt: formData.consentGivenAt || '',
      beneficiary_type_id: formData.beneficiary_type_id || '',
      aswasumaHouseholdNo: formData.aswasumaHouseholdNo || '',
      nic: formData.nic || '',
      beneficiaryName: formData.beneficiaryName || '',
      gender: formData.gender || '',
      address: formData.address || '',
      phone: formData.phone || '',
      projectOwnerAge: formData.projectOwnerAge,
      male18To60: formData.male18To60,
      female18To60: formData.female18To60,
      employment_id: formData.employment_id || '',
      otherOccupation: formData.otherOccupation || '',
      subsisdy_id: formData.subsisdy_id || '',
      aswesuma_cat_id: formData.aswesuma_cat_id || '',
      empowerment_dimension_id: formData.empowerment_dimension_id || null,
      project_type_id: formData.project_type_id || '',
      otherProject: formData.otherProject || '',
      childName: formData.childName || '',
      childAge: formData.childAge,
      childGender: formData.childGender || '',
      job_field_id: formData.job_field_id || '',
      otherJobField: formData.otherJobField || '',
      resource_id: formData.resource_id,
      monthlySaving: formData.monthlySaving,
      savingAmount: formData.savingAmount,
      health_indicator_id: formData.health_indicator_id,
      domestic_dynamic_id: formData.domestic_dynamic_id,
      community_participation_id: formData.community_participation_id,
      housing_service_id: formData.housing_service_id
    };
  };

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
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

  // API call function
  // const updateBeneficiary = async (payload: UpdateSamurdhiFamilyDto) => {
  //   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  //   const response = await fetch(`${API_BASE_URL}/samurdhi-family/${encodeURIComponent(identifier)}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json().catch(() => ({ message: 'Update failed' }));
  //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  //   }

  //   return await response.json();
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildUpdatePayload();
      console.log('Update payload:', payload);

      await updateSamurdhiFamilyByIdentifier(identifier, payload);

      toast.success('Beneficiary updated successfully!');

      setTimeout(() => {
        router.push('/dashboard/gn-level/view-benficiaries');
      }, 2000);

    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update beneficiary. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/gn-level/view-benficiaries');
  };

  if (isInitialLoading || isLoadingBeneficiary) {
    return (
      <ComponentCard title="Edit Family Development Plan">
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="lg" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {isInitialLoading ? 'Loading Form Data...' : 'Loading Beneficiary Details...'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please wait while we prepare the form
                </p>
              </div>
            </div>
          </div>
          <FormSkeleton />
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Edit Family Development Plan for Community Empowerment">
      <LoadingOverlay isLoading={isSubmitting} message="Updating beneficiary data...">
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            {/* Display identifier info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Editing beneficiary: {beneficiaryData?.name}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                {beneficiaryData?.householdNumber ?
                  `Household: ${beneficiaryData.householdNumber}` :
                  `NIC: ${identifier}`
                }
              </p>
            </div>

            {/* Location fields - read-only */}
            <div>
              <Label>District</Label>
              <Input type="text" value={formData.district.name} readOnly />
            </div>

            <div>
              <Label>Divisional Secretariat Division</Label>
              <Input type="text" value={formData.dsDivision.name} readOnly />
            </div>

            <div>
              <Label>Samurdhi Bank</Label>
              <Input type="text" value={formData.zone.name} readOnly />
            </div>

            <div>
              <Label>Grama Nildhari Division</Label>
              <Input type="text" value={formData.gnd.name} readOnly />
            </div>

            {/* Main Program */}
            <div>
              <Label>Main Program <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Select
                  options={MAIN_PROGRAM_OPTIONS}
                  placeholder="Select Main Program"
                  onChange={(value) => {
                    clearError('mainProgram');
                    const selectedValue = value && value !== '' && value !== 'null' ? value : null;
                    setFormData(prev => ({
                      ...prev,
                      mainProgram: selectedValue
                    }));
                  }}
                  className={`dark:bg-dark-900 ${errors.mainProgram ? 'border-red-500' : ''}`}
                  value={formData.mainProgram || ''}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
              <ErrorMessage error={errors.mainProgram} />
            </div>

            {/* Consent Section */}
            <div className="space-y-4">
              <Label>Empowerment Program Consent</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={formData.hasConsentedToEmpowerment}
                    onChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        hasConsentedToEmpowerment: checked,
                        consentGivenAt: checked ? new Date().toISOString() : null
                      }));
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Consent to participate in the empowerment program
                  </span>
                </div>

                {formData.hasConsentedToEmpowerment && (
                  <div className="flex flex-col gap-2">
                    <Label>Consent Given Date</Label>
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
                        }}
                        className="pr-10"
                        onFocus={(e) => (e.target as HTMLInputElement).showPicker()}
                        onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={(e) => {
                          e.preventDefault();
                          const input = e.currentTarget.parentElement?.querySelector('input[type="date"]') as HTMLInputElement;
                          if (input) input.showPicker();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Beneficiary Type - Display only */}
            <div>
              <Label>Beneficiary Type</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex flex-col text-sm text-white">
                  <span className="font-sinhala">{beneficiaryData?.beneficiaryType.nameSinhala}</span>
                  <span className="font-tamil">{beneficiaryData?.beneficiaryType.nameTamil}</span>
                  <span>{beneficiaryData?.beneficiaryType.nameEnglish}</span>
                </div>
              </div>
            </div>

            {/* Household Number or NIC - Display only */}
            {formData.aswasumaHouseholdNo ? (
              <div>
                <Label>Aswasuma Household Number</Label>
                <Input type="text" value={formData.aswasumaHouseholdNo} readOnly />
              </div>
            ) : (
              <div>
                <Label>National Identity Card Number</Label>
                <Input type="text" value={formData.nic || ''} readOnly />
              </div>
            )}

            {/* Editable fields */}
            <div>
              <Label>Name of the Beneficiary <span className="text-red-500">*</span></Label>
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
            </div>

            <div>
              <Label>Address <span className="text-red-500">*</span></Label>
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
              <Label>Phone Number <span className="text-red-500">*</span></Label>
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
                value={formData.female18To60 || 0}
                onChange={handleInputChange}
              />
              <Label>Male</Label>
              <Input
                type="number"
                name="male18To60"
                value={formData.male18To60 || 0}
                onChange={handleInputChange}
              />
            </div>

            {/* Current Employment */}
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
                    onChange={() => handleRadioChange('employment_id', option.employment_id)}
                    label={`${option.nameSinhala} - ${option.nameTamil} - ${option.nameEnglish}`}
                    className="text-sm sm:text-base"
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Other Occupation (if any)</Label>
              <Input
                type="text"
                name="otherOccupation"
                value={formData.otherOccupation || ''}
                onChange={handleInputChange}
              />
            </div>

            {/* Samurdhi Subsidy */}
            <div>
              <Label>Samurdhi subsidy received</Label>
              <div className="relative">
                <Select
                  options={subsidyOptions.map(option => ({
                    value: option.subsisdy_id,
                    label: formatAmount(option.amount)
                  }))}
                  placeholder="Select Subsidy Amount"
                  onChange={(value) => handleSelectChange('subsisdy_id', value)}
                  className="dark:bg-dark-900"
                  value={formData.subsisdy_id || ""}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Aswasuma Category */}
            <div>
              <Label>Aswasuma category</Label>
              <div className="relative">
                <Select
                  options={aswasumaCategories.map(category => ({
                    value: category.aswesuma_cat_id,
                    label: formatCategoryLabel(category)
                  }))}
                  placeholder="Select Aswasuma Category"
                  onChange={(value) => handleSelectChange('aswesuma_cat_id', value)}
                  className="dark:bg-dark-900"
                  value={formData.aswesuma_cat_id || ""}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Empowerment Dimensions */}
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

            {/* Conditional Project Types */}
            {(formData.empowerment_dimension_id && (() => {
              const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id);
              return dimension?.nameEnglish.includes("Business Opportunities") ||
                dimension?.nameEnglish.includes("Self-Employment");
            })()) && (
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
                        onChange={() => handleRadioChange('project_type_id', project.project_type_id)}
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
              )}

            <div>
              <Label>Specify other projects</Label>
              <Input
                type="text"
                name="otherProject"
                value={formData.otherProject || ''}
                onChange={handleInputChange}
              />
            </div>

            {/* Conditional Employment Facilitation fields */}
            {(formData.empowerment_dimension_id && (() => {
              const dimension = empowermentDimensions.find(dim => dim.empowerment_dimension_id === formData.empowerment_dimension_id);
              return dimension?.nameEnglish.includes("Employment Facilitation");
            })()) && (
                <>
                  <div>
                    <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ නම</Label>
                    <Input
                      type="text"
                      name="childName"
                      value={formData.childName || ""}
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
                    <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ ස්ත්‍රී - පුරුෂ භාවය</Label>
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
                          onChange={() => handleRadioChange('job_field_id', jobField.job_field_id)}
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
                      name="otherJobField"
                      value={formData.otherJobField || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

            {/* Resources Needed */}
            <div className="space-y-2">
              <Label>Resources Needed</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resourcesNeeded.map((resource) => (
                  <div key={resource.resource_id} className="flex gap-3 items-start">
                    <Checkbox
                      checked={formData.resource_id.includes(resource.resource_id)}
                      onChange={(checked) => {
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

            {/* Health Indicators */}
            <div className="space-y-2">
              <Label>Health/Nutrition/Education</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthIndicators.map((indicator) => (
                  <div key={indicator.health_indicator_id} className="flex gap-3 items-start">
                    <Checkbox
                      checked={formData.health_indicator_id.includes(indicator.health_indicator_id)}
                      onChange={(checked) => {
                        handleCheckboxChange('health_indicator_id', indicator.health_indicator_id, checked);
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

            {/* Domestic Dynamics */}
            <div className="space-y-2">
              <Label>Domestic Dynamics</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {domesticDynamics.map((dynamic) => (
                  <div key={dynamic.domestic_dynamic_id} className="flex gap-3 items-start">
                    <Checkbox
                      checked={formData.domestic_dynamic_id.includes(dynamic.domestic_dynamic_id)}
                      onChange={(checked) => {
                        handleCheckboxChange('domestic_dynamic_id', dynamic.domestic_dynamic_id, checked);
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

            {/* Community Participation */}
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

            {/* Housing Services */}
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

            {/* Action buttons */}
            <div className="flex items-center gap-5 pt-6">
              <Button
                size="sm"
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting && <LoadingSpinner size="sm" color="white" />}
                {isSubmitting ? 'Updating...' : 'Update Beneficiary'}
              </Button>
              <Button
                size="md"
                variant="secondary"
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
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
              duration: 5000,
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
    </ComponentCard>
  )
}

export default EditSamurdhiFamilyForm