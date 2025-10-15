'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { BeneficiaryDetailsResponse } from '@/services/samurdhiService';
import BeneficiaryInfo from '@/components/grant-utilization/BeneficiaryInfo';
import LocationInfo from '@/components/grant-utilization/LocationInfo';
import { FormErrors } from '@/types/samurdhi-form.types';
import toast, { Toaster } from 'react-hot-toast';
import {
  BeneficiaryTrainingPayload,
  BeneficiaryTrainingResponse,
  createBeneficiaryTraining,
  updateBeneficiaryTrainingByIdentifier,
  fetchBeneficiaryData,
  fetchBeneficiaryTrainingByIdentifier,
  fetchCourses,
  Course
} from '@/services/beneficiaryTrainingService';

const BeneficiaryTrainingForm = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const hhNumberOrNic = params.id as string;

  // State management
  const [errors, setErrors] = useState<FormErrors>({});
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryDetailsResponse | null>(null);
  const [, setExistingTrainingData] = useState<BeneficiaryTrainingResponse[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<BeneficiaryTrainingPayload>({
    districtId: '',
    dsId: '',
    zoneId: '',
    gndId: '',
    hhNumber: '',
    nicNumber: hhNumberOrNic,
    name: '',
    address: '',
    phoneNumber: '',
    trainingActivitiesDone: false,
    trainingActivitiesRequired: false,
    courseId: undefined,
    trainingInstitution: '',
    trainingInstituteAddress: '',
    trainingInstitutePhone: '',
    courseCost: undefined,
    trainingDuration: '',
    trainerName: '',
    trainerContactNumber: ''
  });

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

        const existingData = await fetchBeneficiaryTrainingByIdentifier(
          hhNumberOrNic, // Always pass as NIC first
          undefined       // Don't pass HH number initially
        );

        if (existingData && existingData.length > 0) {
          setExistingTrainingData(existingData);
          setIsEditMode(true);

          // Pre-fill form with the first existing record
          const firstRecord = existingData[0];
          setFormData({
            districtId: firstRecord.districtId || '',
            dsId: firstRecord.dsId || '',
            zoneId: firstRecord.zoneId || '',
            gndId: firstRecord.gndId || '',
            hhNumber: firstRecord.hhNumber || '',
            nicNumber: firstRecord.nicNumber || '',
            name: firstRecord.name || '',
            address: firstRecord.address || '',
            phoneNumber: firstRecord.phoneNumber || '',
            trainingActivitiesDone: firstRecord.trainingActivitiesDone || false,
            trainingActivitiesRequired: firstRecord.trainingActivitiesRequired || false,
            courseId: firstRecord.courseId || undefined,
            trainingInstitution: firstRecord.trainingInstitution || '',
            trainingInstituteAddress: firstRecord.trainingInstituteAddress || '',
            trainingInstitutePhone: firstRecord.trainingInstitutePhone || '',
            courseCost: firstRecord.courseCost || undefined,
            trainingDuration: firstRecord.trainingDuration || '',
            trainerName: firstRecord.trainerName || '',
            trainerContactNumber: firstRecord.trainerContactNumber || ''
          });
        } else {
          // If no data found with NIC, try searching by HH number as fallback
          if (beneficiary.householdNumber) {
            const existingDataByHh = await fetchBeneficiaryTrainingByIdentifier(
              undefined,
              beneficiary.householdNumber
            );

            if (existingDataByHh && existingDataByHh.length > 0) {
              setExistingTrainingData(existingDataByHh);
              setIsEditMode(true);

              const firstRecord = existingDataByHh[0];
              setFormData({
                districtId: firstRecord.districtId || '',
                dsId: firstRecord.dsId || '',
                zoneId: firstRecord.zoneId || '',
                gndId: firstRecord.gndId || '',
                hhNumber: firstRecord.hhNumber || '',
                nicNumber: firstRecord.nicNumber || '',
                name: firstRecord.name || '',
                address: firstRecord.address || '',
                phoneNumber: firstRecord.phoneNumber || '',
                trainingActivitiesDone: firstRecord.trainingActivitiesDone || false,
                trainingActivitiesRequired: firstRecord.trainingActivitiesRequired || false,
                courseId: firstRecord.courseId || undefined,
                trainingInstitution: firstRecord.trainingInstitution || '',
                trainingInstituteAddress: firstRecord.trainingInstituteAddress || '',
                trainingInstitutePhone: firstRecord.trainingInstitutePhone || '',
                courseCost: firstRecord.courseCost || undefined,
                trainingDuration: firstRecord.trainingDuration || '',
                trainerName: firstRecord.trainerName || '',
                trainerContactNumber: firstRecord.trainerContactNumber || ''
              });
            } else {
              // Pre-fill form with beneficiary data for new record
              setFormData(prev => ({
                ...prev,
                name: beneficiary.beneficiaryDetails?.name || '',
                phoneNumber: beneficiary.mobilePhone || '',
                address: beneficiary.address || '',
                districtId: beneficiary.location?.district?.id || '',
                dsId: beneficiary.location?.divisionalSecretariat?.id || '',
                zoneId: beneficiary.location?.samurdhiBank?.id || '',
                gndId: beneficiary.location?.gramaNiladhariDivision?.id || '',
                hhNumber: beneficiary.householdNumber || '',
                nicNumber: beneficiary.beneficiaryDetails?.nicNumber || hhNumberOrNic
              }));
            }
          } else {
            // Pre-fill form with beneficiary data for new record
            setFormData(prev => ({
              ...prev,
              name: beneficiary.beneficiaryDetails?.name || '',
              phoneNumber: beneficiary.mobilePhone || '',
              address: beneficiary.address || '',
              districtId: beneficiary.location?.district?.id || '',
              dsId: beneficiary.location?.divisionalSecretariat?.id || '',
              zoneId: beneficiary.location?.samurdhiBank?.id || '',
              gndId: beneficiary.location?.gramaNiladhariDivision?.id || '',
              hhNumber: beneficiary.householdNumber || '',
              nicNumber: beneficiary.beneficiaryDetails?.nicNumber || hhNumberOrNic
            }));
          }
        }

        // Load courses
        const coursesData = await fetchCourses();
        setCourses(coursesData);

        toast.success(isEditMode ? 'Training data loaded for editing' : 'Beneficiary data loaded');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error loading beneficiary training form data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (hhNumberOrNic) loadInitialData();
  }, [hhNumberOrNic]);

  // Handle input changes
  const handleInputChange = (field: keyof BeneficiaryTrainingPayload, value: string | number | boolean | null | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === null ? undefined : value
    }));
  };

  // Validation function
  const validateForm = (formData: BeneficiaryTrainingPayload): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.phoneNumber?.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.address?.trim()) errors.address = 'Address is required';

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      const errorMessage = 'Please fix the errors in the form';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isEditMode) {
        // Use the actual NIC and HH from the form data for update
        await updateBeneficiaryTrainingByIdentifier(
          formData,
          formData.nicNumber, // Use the actual NIC from form data
          formData.hhNumber   // Use the actual HH number from form data
        );
        toast.success('Training record updated successfully');
      } else {
        await createBeneficiaryTraining(formData);
        toast.success('Training record created successfully');
      }

      setTimeout(() => {
        router.push('/dashboard/gn-level/beneficiary-training/view');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message :
        isEditMode ? 'Failed to update training record' : 'Failed to create training record';
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
        <span className={`ml-3 text-lg ${getTextColor()}`}>Loading training data...</span>
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
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-red-100' : 'text-red-800'}`}>Error Loading Data</h3>
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
            Retry
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
              {isEditMode ? 'Edit Beneficiary Training Information' : 'Beneficiary Training Information'}
            </h1>
            {isEditMode && (
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                  <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Edit Mode
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
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter beneficiary name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()} ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Training Activities Status */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              Training Activities Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 border rounded-lg ${getBorderColor()}`}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.trainingActivitiesDone || false}
                    onChange={(e) => handleInputChange('trainingActivitiesDone', e.target.checked)}
                    className="mr-2"
                  />
                  <span className={`font-medium ${getLabelColor()}`}>
                    Training Activities Done (සිදු කර ඇත)
                  </span>
                </label>
              </div>

              <div className={`p-4 border rounded-lg ${getBorderColor()}`}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.trainingActivitiesRequired || false}
                    onChange={(e) => handleInputChange('trainingActivitiesRequired', e.target.checked)}
                    className="mr-2"
                  />
                  <span className={`font-medium ${getLabelColor()}`}>
                    Training Activities Required (අවශ්‍යව ඇත)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              Course Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Training Course
                </label>
                <select
                  value={formData.courseId || ''}
                  onChange={(e) => handleInputChange('courseId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.nameEnglish} / {course.nameSinhala}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Course Cost (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.courseCost || ''}
                  onChange={(e) => handleInputChange('courseCost', parseFloat(e.target.value) || undefined)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder="Enter course cost"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Training Duration
                </label>
                <input
                  type="text"
                  value={formData.trainingDuration || ''}
                  onChange={(e) => handleInputChange('trainingDuration', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder="e.g., 3 months, 6 weeks"
                />
              </div>
            </div>
          </div>

          {/* Training Institution */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              Training Institution Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Training Institution Name
                </label>
                <input
                  type="text"
                  value={formData.trainingInstitution || ''}
                  onChange={(e) => handleInputChange('trainingInstitution', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder="Enter institution name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Institution Phone Number
                </label>
                <input
                  type="text"
                  value={formData.trainingInstitutePhone || ''}
                  onChange={(e) => handleInputChange('trainingInstitutePhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Institution Address
                </label>
                <textarea
                  value={formData.trainingInstituteAddress || ''}
                  onChange={(e) => handleInputChange('trainingInstituteAddress', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder="Enter institution address"
                />
              </div>
            </div>
          </div>

          {/* Trainer Information */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>
              Trainer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Trainer Name
                </label>
                <input
                  type="text"
                  value={formData.trainerName || ''}
                  onChange={(e) => handleInputChange('trainerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder="Enter trainer name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                  Trainer Contact Number
                </label>
                <input
                  type="text"
                  value={formData.trainerContactNumber || ''}
                  onChange={(e) => handleInputChange('trainerContactNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${getInputBgColor()} ${getBorderColor()}`}
                  placeholder="Enter trainer contact number"
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
              Cancel
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
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Training Record' : 'Create Training Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BeneficiaryTrainingForm;