'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { BeneficiaryDetailsResponse } from '@/services/samurdhiService';
import { getLivelihoods, getProjectTypesByLivelihood, Livelihood, ProjectType } from '@/services/businessOpportunityService';
import BeneficiaryInfo from '@/components/grant-utilization/BeneficiaryInfo';
import LocationInfo from '@/components/grant-utilization/LocationInfo';
import { FormErrors } from '@/types/samurdhi-form.types';
import toast, { Toaster } from 'react-hot-toast';
import {
  BusinessEmpowermentPayload,
  BusinessEmpowermentResponse,
  createBusinessEmpowerment,
  updateBusinessEmpowermentByNic,
  fetchBeneficiaryData,
  fetchBusinessEmpowermentByNic,
  fetchJobFields,
  JobField
} from '@/services/businessEmpowermentService';

const BusinessEmpowerForm = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const hhNumberOrNic = params.id as string;

  // State management
  const [errors, setErrors] = useState<FormErrors>({});
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryDetailsResponse | null>(null);
  const [existingBusinessData, setExistingBusinessData] = useState<BusinessEmpowermentResponse | null>(null);
  const [livelihoods, setLivelihoods] = useState<Livelihood[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [jobFields, setJobFields] = useState<JobField[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<BusinessEmpowermentPayload>({
    nic: hhNumberOrNic,
    name: '',
    phone: '',
    address: '',
    district_id: '',
    ds_id: '',
    zone_id: '',
    gnd_id: '',
    livelihood_id: '',
    project_type_id: '',
    job_field_id: '',
    governmentContribution: 0,
    beneficiaryContribution: 0,
    bankLoan: 0,
    linearOrganizationContribution: 0,
    total: 0,
    capitalAssets: '',
    expectedMonthlyProfit: 0,
    advisingMinistry: '',
    officerName: '',
    officerPosition: '',
    officerMobileNumber: '',
    developmentOfficer: '',
    projectManager: '',
    technicalOfficer: '',
    divisionalSecretary: ''
  });

  // Project selection state
  const [projectSelection, setProjectSelection] = useState<'livelihood' | 'wage' | ''>('');

  // Theme-aware styles
  const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const getBgColor = () => theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const getInputBgColor = () => theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';
  const getBorderColor = () => theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const getLabelColor = () => theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError(null);
        setLoading(true);

        // Load beneficiary data
        const beneficiary = await fetchBeneficiaryData(hhNumberOrNic);
        setBeneficiaryData(beneficiary);

        // Check if business empowerment record already exists
        const existingData = await fetchBusinessEmpowermentByNic(hhNumberOrNic);

        if (existingData) {
          setExistingBusinessData(existingData);
          setIsEditMode(true);

          // Pre-fill form with existing business empowerment data
          setFormData({
            nic: existingData.nic,
            name: existingData.name,
            phone: existingData.phone,
            address: existingData.address,
            district_id: existingData.district_id,
            ds_id: existingData.ds_id,
            zone_id: existingData.zone_id,
            gnd_id: existingData.gnd_id,
            livelihood_id: existingData.livelihood_id || '',
            project_type_id: existingData.project_type_id || '',
            job_field_id: existingData.job_field_id || '',
            governmentContribution: existingData.governmentContribution || 0,
            beneficiaryContribution: existingData.beneficiaryContribution || 0,
            bankLoan: existingData.bankLoan || 0,
            linearOrganizationContribution: existingData.linearOrganizationContribution || 0,
            total: existingData.total || 0,
            capitalAssets: existingData.capitalAssets || '',
            expectedMonthlyProfit: existingData.expectedMonthlyProfit || 0,
            advisingMinistry: existingData.advisingMinistry || '',
            officerName: existingData.officerName || '',
            officerPosition: existingData.officerPosition || '',
            officerMobileNumber: existingData.officerMobileNumber || '',
            developmentOfficer: existingData.developmentOfficer || '',
            projectManager: existingData.projectManager || '',
            technicalOfficer: existingData.technicalOfficer || '',
            divisionalSecretary: existingData.divisionalSecretary || ''
          });

          // Set project selection based on existing data
          if (existingData.livelihood_id && existingData.project_type_id) {
            setProjectSelection('livelihood');
          } else if (existingData.job_field_id) {
            setProjectSelection('wage');
          }
        } else {
          // Pre-fill form with beneficiary data for new record
          setFormData(prev => ({
            ...prev,
            name: beneficiary.beneficiaryDetails?.name || '',
            phone: beneficiary.mobilePhone || '',
            address: beneficiary.address || '',
            district_id: beneficiary.location?.district?.id?.toString() || '',
            ds_id: beneficiary.location?.divisionalSecretariat?.id?.toString() || '',
            zone_id: beneficiary.location?.samurdhiBank?.id?.toString() || '',
            gnd_id: beneficiary.location?.gramaNiladhariDivision?.id?.toString() || ''
          }));

          // NEW: Automatically set project selection based on empowerment dimension
          const empowermentDimension = beneficiary.empowermentDimension?.nameEnglish;

          if (empowermentDimension) {
            if (empowermentDimension.includes("Business Opportunities") || empowermentDimension.includes("Self-Employment")) {
              setProjectSelection('livelihood');

              // Pre-fill livelihood and project type if available
              if (beneficiary.livelihood?.id) {
                setFormData(prev => ({
                  ...prev,
                  livelihood_id: beneficiary.livelihood.id.toString()
                }));

                // Load project types for this livelihood
                try {
                  const projectTypesData = await getProjectTypesByLivelihood(beneficiary.livelihood.id.toString());
                  setProjectTypes(projectTypesData);

                  // Pre-fill project type if available
                  if (beneficiary.projectType?.id) {
                    setFormData(prev => ({
                      ...prev,
                      project_type_id: beneficiary.projectType.id.toString()
                    }));
                  }
                } catch (error) {
                  console.error('Error loading project types:', error);
                }
              }
            } else if (empowermentDimension.includes("Employment Facilitation")) {
              setProjectSelection('wage');

              // Pre-fill job field if available
              if (beneficiary.jobField?.id) {
                setFormData(prev => ({
                  ...prev,
                  job_field_id: beneficiary.jobField.id
                }));
              }
            }
          }
        }

        // Load livelihoods
        const livelihoodsData = await getLivelihoods();
        setLivelihoods(livelihoodsData);

        // Load job fields
        const jobFieldsData = await fetchJobFields();
        setJobFields(jobFieldsData);

        // Load project types if editing and has livelihood_id
        if (existingData && existingData.livelihood_id) {
          try {
            const projectTypesData = await getProjectTypesByLivelihood(existingData.livelihood_id);
            setProjectTypes(projectTypesData);
          } catch (error) {
            console.error('Error loading project types:', error);
          }
        }

        toast.success(isEditMode ? t('businessEmpower.editDataLoaded') : t('businessEmpower.dataLoaded'));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('businessEmpower.loadingError');
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error loading business empowerment form data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (hhNumberOrNic) loadInitialData();
  }, [hhNumberOrNic, t]);

  // Handle livelihood selection and load project types
  const handleLivelihoodChange = async (livelihoodId: string) => {
    setFormData(prev => ({ ...prev, livelihood_id: livelihoodId, project_type_id: '' }));

    if (livelihoodId) {
      try {
        const projectTypesData = await getProjectTypesByLivelihood(livelihoodId);
        setProjectTypes(projectTypesData);
      } catch (error) {
        console.error('Error loading project types:', error);
        toast.error(t('businessEmpower.loadingError'));
      }
    } else {
      setProjectTypes([]);
    }
  };

  // Handle project selection type change
  const handleProjectSelectionChange = (type: 'livelihood' | 'wage') => {
    setProjectSelection(type);
    if (type === 'wage') {
      setFormData(prev => ({
        ...prev,
        livelihood_id: '',
        project_type_id: ''
      }));
      setProjectTypes([]);
    } else if (type === 'livelihood') {
      setFormData(prev => ({
        ...prev,
        job_field_id: ''
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof BusinessEmpowermentPayload, value: string | number | null | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === null ? undefined : value
    }));

    // Auto-calculate total when contribution fields change
    if (['governmentContribution', 'beneficiaryContribution', 'bankLoan', 'linearOrganizationContribution'].includes(field)) {
      setTimeout(() => {
        setFormData(current => {
          const total = (current.governmentContribution || 0) +
            (current.beneficiaryContribution || 0) +
            (current.bankLoan || 0) +
            (current.linearOrganizationContribution || 0);
          return { ...current, total };
        });
      }, 0);
    }
  };

  // Validation function
  const validateForm = (formData: BusinessEmpowermentPayload): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.name?.trim()) errors.name = t('businessEmpower.nameRequired');
    if (!formData.phone?.trim()) errors.phone = t('businessEmpower.phoneRequired');
    if (!formData.address?.trim()) errors.address = t('businessEmpower.addressRequired');
    if (!formData.district_id) errors.district_id = t('businessEmpower.districtRequired');
    if (!formData.ds_id) errors.ds_id = t('businessEmpower.dsRequired');
    if (!formData.zone_id) errors.zone_id = t('businessEmpower.zoneRequired');
    if (!formData.gnd_id) errors.gnd_id = t('businessEmpower.gndRequired');

    if (projectSelection === 'livelihood') {
      if (!formData.livelihood_id) errors.livelihood_id = t('businessEmpower.livelihoodRequired');
      if (!formData.project_type_id) errors.project_type_id = t('businessEmpower.projectTypeRequired');
    } else if (projectSelection === 'wage') {
      if (!formData.job_field_id) errors.job_field_id = t('businessEmpower.jobFieldRequired');
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      const errorMessage = t('businessEmpower.fixErrors');
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isEditMode) {
        await updateBusinessEmpowermentByNic(hhNumberOrNic, formData);
        toast.success(t('businessEmpower.updateSuccess'));
      } else {
        await createBusinessEmpowerment(formData);
        toast.success(t('businessEmpower.createSuccess'));
      }

      setTimeout(() => {
        router.push('/dashboard/gn-level/business-empowerment/view');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message :
        isEditMode ? t('businessEmpower.updateError') : t('businessEmpower.createError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${getBgColor()}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className={`ml-3 text-lg ${getTextColor()}`}>{t('businessEmpower.loadingFormData')}</span>
      </div>
    );
  }

  if (error && !beneficiaryData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getBgColor()}`}>
        <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-red-100' : 'text-red-800'}`}>{t('businessEmpower.errorLoadingData')}</h3>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 rounded-md text-sm transition-colors ${theme === 'dark'
              ? 'bg-red-700 text-white hover:bg-red-600'
              : 'bg-red-600 text-white hover:bg-red-700'
              }`}
          >
            {t('businessEmpower.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <div className={`min-h-screen ${getBgColor()} p-6`}>
        <div className={`${getCardBgColor()} rounded-lg shadow-sm p-6 mb-6 border ${getBorderColor()}`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-bold ${getTextColor()}`}>
              {isEditMode ? t('businessEmpower.editTitle') : t('businessEmpower.title')}
            </h1>
            {isEditMode && (
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                  <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    {t('businessEmpower.editMode')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {beneficiaryData && (
            <BeneficiaryInfo
              beneficiaryData={beneficiaryData}
              theme={theme}
              t={t}
              getBorderColor={getBorderColor}
              getTextColor={getTextColor}
            />
          )}

          {isEditMode && existingBusinessData && (
            <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} border ${getBorderColor()}`}>
              <h3 className={`text-sm font-medium mb-2 ${getTextColor()}`}>
                {t('businessEmpower.existingRecordInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p className={`${getTextColor()}`}>
                  <span className="font-medium">{t('businessEmpower.createdAt')}:</span> {' '}
                  {new Date(existingBusinessData.createdAt).toLocaleDateString()}
                </p>
                <p className={`${getTextColor()}`}>
                  <span className="font-medium">{t('businessEmpower.lastUpdated')}:</span> {' '}
                  {new Date(existingBusinessData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className={`bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 ${getBorderColor()} border border-red-300 dark:border-red-700`}>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={`${getCardBgColor()} rounded-lg shadow-sm p-6 border ${getBorderColor()}`}>
          <LocationInfo
            beneficiaryData={beneficiaryData}
            theme={theme}
            t={t}
            getBorderColor={getBorderColor}
            getLabelColor={getLabelColor}
          />

          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              {t('businessEmpower.basicInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.name ? 'border-red-500' : ''}`}
                  placeholder={t('businessEmpower.enterName')}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.contactNumber')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder={t('businessEmpower.enterContact')}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.address')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.address ? 'border-red-500' : ''}`}
                  placeholder={t('businessEmpower.enterAddress')}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Project Type Selection */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              {t('businessEmpower.projectTypeSelection')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className={`p-4 border rounded-lg ${projectSelection === 'livelihood' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : getBorderColor()}`}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    value="livelihood"
                    checked={projectSelection === 'livelihood'}
                    onChange={() => handleProjectSelectionChange('livelihood')}
                    className="mr-2"
                  />
                  <span className={`font-medium ${getLabelColor()}`}>
                    {t('businessEmpower.livelihood')}
                  </span>
                </label>
              </div>

              <div className={`p-4 border rounded-lg ${projectSelection === 'wage' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : getBorderColor()}`}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    value="wage"
                    checked={projectSelection === 'wage'}
                    onChange={() => handleProjectSelectionChange('wage')}
                    className="mr-2"
                  />
                  <span className={`font-medium ${getLabelColor()}`}>
                    {t('businessEmpower.wageEmployment')}
                  </span>
                </label>
              </div>
            </div>

            {/* Livelihood Selection */}
            {projectSelection === 'livelihood' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                    {t('businessEmpower.selectLivelihood')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.livelihood_id || ''}
                    onChange={(e) => handleLivelihoodChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.livelihood_id ? 'border-red-500' : ''}`}
                  >
                    <option value="">{t('businessEmpower.selectOption')}</option>
                    {livelihoods.map((livelihood) => (
                      <option key={livelihood.id} value={livelihood.id}>
                        {livelihood.english_name}
                      </option>
                    ))}
                  </select>
                  {errors.livelihood_id && <p className="text-red-500 text-sm mt-1">{errors.livelihood_id}</p>}
                </div>

                {formData.livelihood_id && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                      {t('businessEmpower.selectProjectType')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.project_type_id || ''}
                      onChange={(e) => handleInputChange('project_type_id', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.project_type_id ? 'border-red-500' : ''}`}
                    >
                      <option value="">{t('businessEmpower.selectOption')}</option>
                      {projectTypes.map((projectType) => (
                        <option key={projectType.project_type_id} value={projectType.project_type_id}>
                          {projectType.nameEnglish}
                        </option>
                      ))}
                    </select>
                    {errors.project_type_id && <p className="text-red-500 text-sm mt-1">{errors.project_type_id}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Wage Employment Selection */}
            {projectSelection === 'wage' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.jobField')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.job_field_id || ''}
                  onChange={(e) => handleInputChange('job_field_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.job_field_id ? 'border-red-500' : ''}`}
                >
                  <option value="">{t('businessEmpower.selectJobField')}</option>
                  {jobFields.map((jobField) => (
                    <option key={jobField.job_field_id} value={jobField.job_field_id}>
                      {jobField.nameEnglish} / {jobField.nameSinhala}
                    </option>
                  ))}
                </select>
                {errors.job_field_id && <p className="text-red-500 text-sm mt-1">{errors.job_field_id}</p>}
              </div>
            )}
          </div>

          {/* Investment Details */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              {t('businessEmpower.investmentDetails')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.governmentContribution')} (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.governmentContribution || ''}
                  onChange={(e) => handleInputChange('governmentContribution', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder={t('businessEmpower.enterAmount')}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.beneficiaryContribution')} (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.beneficiaryContribution || ''}
                  onChange={(e) => handleInputChange('beneficiaryContribution', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder={t('businessEmpower.enterAmount')}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.bankLoan')} (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.bankLoan || ''}
                  onChange={(e) => handleInputChange('bankLoan', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder={t('businessEmpower.enterAmount')}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.linearOrganizationContribution')} (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.linearOrganizationContribution || ''}
                  onChange={(e) => handleInputChange('linearOrganizationContribution', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder={t('businessEmpower.enterAmount')}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.total')} (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.total || ''}
                  readOnly
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} bg-gray-100 dark:bg-gray-600`}
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              {t('businessEmpower.projectDetails')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.capitalAssets')}
                </label>
                <input
                  type="text"
                  value={formData.capitalAssets || ''}
                  onChange={(e) => handleInputChange('capitalAssets', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder={t('businessEmpower.enterAssets')}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.expectedMonthlyProfit')} (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.expectedMonthlyProfit || ''}
                  onChange={(e) => handleInputChange('expectedMonthlyProfit', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder={t('businessEmpower.enterProfit')}
                />
              </div>
            </div>
          </div>

          {/* Advising Ministry/Department */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              {t('businessEmpower.advisingMinistry')}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.ministryDepartment')}
                </label>
                <input
                  type="text"
                  value={formData.advisingMinistry || ''}
                  onChange={(e) => handleInputChange('advisingMinistry', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder={t('businessEmpower.enterMinistry')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                    {t('businessEmpower.officerName')}
                  </label>
                  <input
                    type="text"
                    value={formData.officerName || ''}
                    onChange={(e) => handleInputChange('officerName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                    placeholder={t('businessEmpower.enterOfficerName')}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                    {t('businessEmpower.officerPosition')}
                  </label>
                  <input
                    type="text"
                    value={formData.officerPosition || ''}
                    onChange={(e) => handleInputChange('officerPosition', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                    placeholder={t('businessEmpower.enterPosition')}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                    {t('businessEmpower.officerMobileNumber')}
                  </label>
                  <input
                    type="text"
                    value={formData.officerMobileNumber || ''}
                    onChange={(e) => handleInputChange('officerMobileNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                    placeholder={t('businessEmpower.enterMobile')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Final Approval Officers */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              {t('businessEmpower.finalApproval')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.developmentOfficer')}
                </label>
                <input
                  type="text"
                  value={formData.developmentOfficer || ''}
                  onChange={(e) => handleInputChange('developmentOfficer', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.projectManager')}
                </label>
                <input
                  type="text"
                  value={formData.projectManager || ''}
                  onChange={(e) => handleInputChange('projectManager', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.technicalOfficer')}
                </label>
                <input
                  type="text"
                  value={formData.technicalOfficer || ''}
                  onChange={(e) => handleInputChange('technicalOfficer', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  {t('businessEmpower.divisionalSecretary')}
                </label>
                <input
                  type="text"
                  value={formData.divisionalSecretary || ''}
                  onChange={(e) => handleInputChange('divisionalSecretary', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className={`px-6 py-2 border rounded-md text-sm font-medium transition-colors ${theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                }`}
            >
              {t('businessEmpower.cancel')}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${submitting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? t('businessEmpower.updating') : t('businessEmpower.creating')}
                </span>
              ) : (
                isEditMode ? t('businessEmpower.updatePlan') : t('businessEmpower.createPlan')
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BusinessEmpowerForm;