/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import Radio from '../form/input/Radio';
import Checkbox from '../form/input/Checkbox';
import LoadingSpinner from '../loading/LoadingSpinner';
import { ChevronDownIcon } from '@/icons';
import { FormData, FormOptions, FormErrors } from '@/types/samurdhi-form.types';
import { MAIN_PROGRAM_OPTIONS } from '@/types/samurdhi-form.types';
import {
    formatAmount,
    formatCategoryLabel,
    formatCommunityLabel,
    shouldShowNicField,
    shouldShowHouseholdField,
    isNicRequired,
    isHouseholdRequired,
    shouldShowChildFields,
    shouldShowProjectFields
} from '@/utils/formHelpers';

interface FormFieldProps {
    formData: FormData;
    formOptions: FormOptions;
    errors: FormErrors;
    householdNumbers: string[];
    isLoadingHouseholdNumbers: boolean;
    isFetching: boolean;
    showAllFieldsForExistingBeneficiary: boolean;
    t: (key: string) => string;
    householdLoadedFields: Set<string>;
    handlers: {
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSelectChange: (name: string, value: string) => void;
        handleRadioChange: (name: string, value: string) => void;
        handleCheckboxChange: (name: string, value: string, isChecked: boolean) => void;
        handleNicLookup: () => void;
        handleHouseholdSelection: (value: string) => void;
        handleFileChange?: (file: File | null) => void;
        clearHouseholdLoadedFields?: () => void
        clearSubsequentFields?: () => void;
    };
}

interface FileUploadProps {
    formData: FormData;
    errors: FormErrors;
    t: (key: string) => string;
    handlers: {
        handleFileChange: (file: File | null) => void;
    };
    selectedFile: File | null;
}

const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
        </p>
    );
};

export const LocationFields: React.FC<Pick<FormFieldProps, 'formData' | 't'>> = ({ formData, t }) => (
    <>
        <div>
            <Label>{t('samurdhiForm.district')}</Label>
            <Input type="text" value={formData.district.name} readOnly />
            <input type="hidden" name="district_id" value={formData.district.districtId} />
        </div>

        <div>
            <Label>{t('samurdhiForm.divisionalSecretariat')}</Label>
            <Input type="text" value={formData.dsDivision.name} readOnly />
            <input type="hidden" name="ds_id" value={formData.dsDivision.dsId} />
        </div>

        <div>
            <Label>{t('samurdhiForm.samurdhiBank')}</Label>
            <Input type="text" value={formData.zone.name} readOnly />
            <input type="hidden" name="zone_id" value={formData.zone.zoneId} />
        </div>

        <div>
            <Label>{t('samurdhiForm.gnDivision')}</Label>
            <Input type="text" value={formData.gnd.name} readOnly />
            <input type="hidden" name="gnd_id" value={formData.gnd.gndId} />
        </div>
    </>
);


export const MainProgramField: React.FC<Pick<FormFieldProps, 'formData' | 'errors' | 'handlers' | 't'>> = ({
    formData,
    errors,
    handlers,
    t
}) => (
    <div>
        <Label>{t('samurdhiForm.mainProgram')} <span className="text-red-500">*</span></Label>
        <div className="relative">
            <Select
                options={MAIN_PROGRAM_OPTIONS}
                placeholder={t('samurdhiForm.selectMainProgram')}
                onChange={(value) => {
                    const selectedValue = value && value !== '' && value !== 'null' ? value : null;
                    handlers.handleSelectChange('mainProgram', selectedValue || '');
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
);

// Update ImpactEvaluationField component
export const ImpactEvaluationField: React.FC<Pick<FormFieldProps, 'formData' | 'handlers' | 't'>> = ({
    formData,
    handlers,
    t
}) => {
    if (formData.mainProgram !== 'WB') return null;

    return (
        <div className="space-y-4">
            <Label>{t('samurdhiForm.impactEvaluation')}</Label>
            <div className="flex flex-col gap-3">
                <Radio
                    id="impact-evaluation-yes"
                    name="isImpactEvaluation"
                    value="true"
                    checked={formData.isImpactEvaluation === true}
                    onChange={() => handlers.handleRadioChange('isImpactEvaluation', 'true')}
                    label={t('common.yes')}
                />
                <Radio
                    id="impact-evaluation-no"
                    name="isImpactEvaluation"
                    value="false"
                    checked={formData.isImpactEvaluation === false}
                    onChange={() => handlers.handleRadioChange('isImpactEvaluation', 'false')}
                    label={t('common.no')}
                />
            </div>
        </div>
    );
};

// Update ConsentFields component
export const ConsentFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    handlers,
    t
}) => (
    <div className="space-y-4">
        <Label>{t('samurdhiForm.empowermentConsent')}</Label>

        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('samurdhiForm.consentToParticipate')}
                </Label>
                <div className="flex flex-col gap-3">
                    <Radio
                        id="consent-yes"
                        name="hasConsentedToEmpowerment"
                        value="true"
                        checked={formData.hasConsentedToEmpowerment === true}
                        onChange={() => {
                            handlers.handleRadioChange('hasConsentedToEmpowerment', 'true');
                            handlers.handleSelectChange('refusal_reason_id', '');
                        }}
                        label={t('common.yes')}
                    />
                    <Radio
                        id="consent-no"
                        name="hasConsentedToEmpowerment"
                        value="false"
                        checked={formData.hasConsentedToEmpowerment === false}
                        onChange={() => {
                            handlers.handleRadioChange('hasConsentedToEmpowerment', 'false');
                            handlers.handleInputChange({
                                target: { name: 'consentGivenAt', value: '' }
                            } as React.ChangeEvent<HTMLInputElement>);
                            if (handlers.clearSubsequentFields) {
                                handlers.clearSubsequentFields();
                            }
                        }}
                        label={t('common.no')}
                    />
                </div>
                <ErrorMessage error={errors.hasConsentedToEmpowerment} />
            </div>

            {formData.hasConsentedToEmpowerment === true && (
                <div className="flex flex-col gap-2">
                    <Label>{t('samurdhiForm.consentGivenDate')} <span className="text-red-500">*</span></Label>
                    <div className="relative max-w-xs">
                        <Input
                            type="date"
                            name="consentGivenAt"
                            value={formData.consentGivenAt ? formData.consentGivenAt.split('T')[0] : ''}
                            onChange={(e) => {
                                const dateValue = e.target.value;
                                handlers.handleInputChange({
                                    target: {
                                        name: 'consentGivenAt',
                                        value: dateValue ? new Date(dateValue).toISOString() : ''
                                    }
                                } as React.ChangeEvent<HTMLInputElement>);
                            }}
                            className={`pr-10 ${errors.consentGivenAt ? 'border-red-500' : ''}`}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
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
                    <ErrorMessage error={errors.consentGivenAt} />
                </div>
            )}

            {formData.hasConsentedToEmpowerment === false && (
                <div>
                    <Label>{t('samurdhiForm.refusalReason')} <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <Select
                            options={formOptions.refusalReasons.map(reason => ({
                                value: reason.id,
                                label: `${reason.reason_si} - ${reason.reason_ta} - ${reason.reason_en}`
                            }))}
                            placeholder={t('samurdhiForm.selectRefusalReason')}
                            onChange={(value) => handlers.handleSelectChange('refusal_reason_id', value)}
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
        </div>
    </div>
);

// Update ConsentLetterUpload component
export const ConsentLetterUpload: React.FC<FileUploadProps & { t: (key: string) => string }> = ({
    formData,
    errors,
    handlers,
    selectedFile,
    t
}) => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'pending' | null>(null);

    if (formData.hasConsentedToEmpowerment !== false) {
        return null;
    }

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            setIsValidating(true);
            setValidationStatus('pending');

            try {
                // Simulate validation process (replace with actual validation)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Check file integrity
                const isValid = await validateFileIntegrity(file);

                if (isValid) {
                    setValidationStatus('valid');
                    handlers.handleFileChange(file);
                    // toast.success('File validated successfully!');
                } else {
                    setValidationStatus('invalid');
                    handlers.handleFileChange(null);
                    // Clear the file input
                    e.target.value = '';
                }
            } catch (error) {
                console.error('File validation error:', error);
                setValidationStatus('invalid');
                handlers.handleFileChange(null);
                e.target.value = '';
            } finally {
                setIsValidating(false);
            }
        } else {
            handlers.handleFileChange(null);
            setValidationStatus(null);
        }
    };

    const validateFileIntegrity = async (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
                try {
                    // Basic integrity checks
                    if (file.size === 0) {
                        resolve(false);
                        return;
                    }

                    // Check file signature/magic numbers
                    const arrayBuffer = reader.result as ArrayBuffer;
                    const view = new Uint8Array(arrayBuffer.slice(0, 8));

                    // Common file signatures
                    const signatures = {
                        pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
                        jpg: [0xFF, 0xD8, 0xFF],
                        png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
                        gif: [0x47, 0x49, 0x46, 0x38], // GIF8
                    };

                    // Verify file matches its declared type
                    let isValid = true;
                    if (file.type === 'application/pdf') {
                        isValid = signatures.pdf.every((byte, index) => view[index] === byte);
                    } else if (file.type.startsWith('image/')) {
                        const isJpg = signatures.jpg.every((byte, index) => view[index] === byte);
                        const isPng = signatures.png.every((byte, index) => view[index] === byte);
                        const isGif = signatures.gif.every((byte, index) => view[index] === byte);
                        isValid = isJpg || isPng || isGif;
                    }

                    resolve(isValid);
                } catch (error) {
                    console.error('File validation error:', error);
                    resolve(false);
                }
            };

            reader.onerror = () => {
                resolve(false);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const getValidationMessage = () => {
        if (validationStatus === 'valid') {
            return (
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-1">
                    {/* <CheckCircleIcon className="h-4 w-4 mr-1" /> */}
                    {t('samurdhiForm.fileValid')}
                </div>
            );
        }
        if (validationStatus === 'invalid') {
            return (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm mt-1">
                    {/* <ExclamationTriangleIcon className="h-4 w-4 mr-1" /> */}
                    {t('samurdhiForm.fileInvalid')}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-2">
            <Label>
                {t('samurdhiForm.uploadRejectionLetter')} <span className="text-red-500">*</span>
            </Label>

            <div className="flex flex-col gap-2">
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp"
                        onChange={handleFileInput}
                        disabled={isValidating}
                        className={`block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            dark:file:bg-blue-900 dark:file:text-blue-300
                            dark:hover:file:bg-blue-800
                            ${errors.consentLetter ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                            border rounded-md p-2
                            ${isValidating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />

                    {isValidating && (
                        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-80 flex items-center justify-center rounded-md">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2 text-sm text-white">{t('samurdhiForm.validatingFile')}</span>
                        </div>
                    )}
                </div>

                {selectedFile && validationStatus === 'valid' && (
                    <div className="text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900 rounded-md">
                        <div className="font-medium">{t('samurdhiForm.selectedFile')}:</div>
                        <div>{selectedFile.name}</div>
                        <div>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        {getValidationMessage()}
                    </div>
                )}

                {validationStatus === 'invalid' && (
                    <div className="text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900 rounded-md">
                        {/* <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" /> */}
                        {t('samurdhiForm.fileDamagedWarning')}
                    </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('samurdhiForm.fileUploadNote')}
                </p>
            </div>

            <ErrorMessage error={errors.consentLetter} />
        </div>
    );
};

// Update AreaClassificationField component
export const AreaClassificationField: React.FC<Pick<FormFieldProps, 'formData' | 'handlers' | 't'>> = ({
    formData,
    handlers,
    t
}) => (
    <div>
        <Label>{t('samurdhiForm.areaClassification')}</Label>
        <div className="flex flex-col gap-4">
            {[
                { value: 'නාගරික/ Urban/ நகர்ப்புற', label: `${t('samurdhiForm.urban')}` },
                { value: 'ග්‍රාමීය/ Rural/ கிராமப்புறம்', label: `${t('samurdhiForm.rural')}` },
                { value: 'වතු/ Estates / எஸ்டேட்ஸ்', label: `${t('samurdhiForm.estates')}` }
            ].map((option) => (
                <Radio
                    key={option.value}
                    id={`area-${option.value}`}
                    name="areaClassification"
                    value={option.value}
                    checked={formData.areaClassification === option.value}
                    onChange={() => handlers.handleRadioChange('areaClassification', option.value)}
                    label={option.label}
                />
            ))}
        </div>
    </div>
);

// Update BeneficiaryTypeField component
export const BeneficiaryTypeField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    handlers,
    t
}) => (
    <div className="flex flex-col gap-4">
        <Label>{t('samurdhiForm.beneficiaryType')}</Label>
        <div className='flex flex-col md:flex-row gap-5 md:gap-20'>
            {formOptions.beneficiaryStatuses.map((status) => (
                <Radio
                    key={status.beneficiary_type_id}
                    id={`status-${status.beneficiary_type_id}`}
                    name="beneficiary_type_id"
                    value={status.beneficiary_type_id}
                    checked={formData.beneficiary_type_id === status.beneficiary_type_id}
                    onChange={() => {
                        // Clear household loaded fields when beneficiary type changes
                        if (handlers.clearHouseholdLoadedFields) {
                            handlers.clearHouseholdLoadedFields();
                        }
                        handlers.handleRadioChange('beneficiary_type_id', status.beneficiary_type_id);
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
);

// Update HouseholdNumberField component
export const HouseholdNumberField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'householdNumbers' | 'isLoadingHouseholdNumbers' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    householdNumbers,
    isLoadingHouseholdNumbers,
    handlers,
    t
}) => {
    if (!shouldShowHouseholdField(formData, formOptions)) return null;

    return (
        <div>
            <Label>
                {t('samurdhiForm.householdNumber')}
                {isHouseholdRequired(formData, formOptions) && <span className="text-red-500"> *</span>}
            </Label>
            <div className="relative">
                <Select
                    options={householdNumbers.map(number => ({
                        value: number,
                        label: number
                    }))}
                    placeholder={
                        householdNumbers.length === 0
                            ? t('samurdhiForm.noHouseholdNumbers')
                            : t('samurdhiForm.selectHouseholdNumber')
                    }
                    onChange={handlers.handleHouseholdSelection}
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
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {t('samurdhiForm.householdSelectionNote') || 'The system will check if this household number is already registered.'}
            </p>
        </div>
    );
};

// Update NicField component
export const NicField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'isFetching' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    handlers,
    t
}) => {
    if (!shouldShowNicField(formData, formOptions)) return null;

    return (
        <div className="flex flex-col md:flex-row gap-2 md:items-end">
            <div className="md:flex-1">
                <Label>
                    {t('samurdhiForm.nicNumber')}
                    {isNicRequired(formData, formOptions) && <span className="text-red-500"> *</span>}
                </Label>
                <Input
                    type="text"
                    name="nic"
                    value={formData.nic || ''}
                    onChange={handlers.handleInputChange}
                    className={errors.nic ? 'border-red-500' : ''}
                />
                <ErrorMessage error={errors.nic} />
            </div>
        </div>
    );
};

// Update BasicInfoFields component
export const BasicInfoFields: React.FC<Pick<FormFieldProps, 'formData' | 'errors' | 'handlers' | 'householdLoadedFields' | 't'>> = ({
    formData,
    errors,
    handlers,
    householdLoadedFields,
    t
}) => (
    <>
        <div>
            <Label>{t('samurdhiForm.beneficiaryName')}</Label>
            <Input
                type="text"
                name="beneficiaryName"
                value={formData.beneficiaryName || ""}
                onChange={handlers.handleInputChange}
                className={errors.beneficiaryName ? 'border-red-500' : ''}
                disabled={householdLoadedFields.has('beneficiaryName')}
                readOnly={householdLoadedFields.has('beneficiaryName')}
            />
            <ErrorMessage error={errors.beneficiaryName} />
        </div>

        <div>
            <Label>{t('samurdhiForm.beneficiaryAge')}</Label>
            <Input
                type="number"
                name="beneficiaryAge"
                value={formData.beneficiaryAge}
                onChange={handlers.handleInputChange}
                className={errors.projectOwnerAge ? 'border-red-500' : ''}
                disabled={householdLoadedFields.has('beneficiaryAge')}
                readOnly={householdLoadedFields.has('beneficiaryAge')}
            />
            <ErrorMessage error={errors.projectOwnerAge} />
        </div>

        <div className="flex flex-col gap-4">
            <Label>{t('samurdhiForm.gender')}</Label>
            {['Female', 'Male', 'Other'].map(gender => (
                <Radio
                    key={gender}
                    id={`gender-${gender.toLowerCase()}`}
                    name="beneficiaryGender"
                    value={gender}
                    checked={formData.beneficiaryGender === gender}
                    onChange={() => handlers.handleRadioChange('beneficiaryGender', gender)}
                    label={t(`common.${gender.toLowerCase()}`)}
                    disabled={householdLoadedFields.has('beneficiaryGender')}
                />
            ))}
        </div>

        <div>
            <Label>{t('samurdhiForm.address')}</Label>
            <Input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handlers.handleInputChange}
                className={errors.address ? 'border-red-500' : ''}
                disabled={householdLoadedFields.has('address')}
                readOnly={householdLoadedFields.has('address')}
            />
            <ErrorMessage error={errors.address} />
        </div>

        <div>
            <Label>{t('samurdhiForm.mobilePhone')}</Label>
            <Input
                type="text"
                name="mobilePhone"
                value={formData.mobilePhone || ""}
                onChange={handlers.handleInputChange}
                className={errors.mobilePhone ? 'border-red-500' : ''}
            />
            <ErrorMessage error={errors.mobilePhone} />
        </div>

        <div>
            <Label>{t('samurdhiForm.telephone')}</Label>
            <Input
                type="text"
                name="telephone"
                value={formData.telephone || ""}
                onChange={handlers.handleInputChange}
            />
        </div>

        {formData.beneficiaryName && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <Checkbox
                    checked={formData.isProjectOwnerSameAsBeneficiary}
                    onChange={(checked) => {
                        handlers.handleCheckboxChange('isProjectOwnerSameAsBeneficiary', 'true', checked);
                        if (checked && formData.beneficiaryName) {
                            // Copy all beneficiary details to project owner
                            handlers.handleInputChange({
                                target: { name: 'projectOwnerName', value: formData.beneficiaryName }
                            } as React.ChangeEvent<HTMLInputElement>);

                            handlers.handleInputChange({
                                target: { name: 'projectOwnerAge', value: formData.beneficiaryAge.toString() }
                            } as React.ChangeEvent<HTMLInputElement>);

                            if (formData.beneficiaryGender) {
                                handlers.handleRadioChange('projectOwnerGender', formData.beneficiaryGender);
                            }
                        } else {
                            // Reset project owner fields
                            handlers.handleInputChange({
                                target: { name: 'projectOwnerName', value: '' }
                            } as React.ChangeEvent<HTMLInputElement>);

                            handlers.handleInputChange({
                                target: { name: 'projectOwnerAge', value: '0' }
                            } as React.ChangeEvent<HTMLInputElement>);

                            handlers.handleRadioChange('projectOwnerGender', '');
                        }
                    }}
                />
                <Label className="text-sm text-blue-700 dark:text-blue-300">
                    {t('samurdhiForm.projectOwnerSameAsBeneficiary')}
                </Label>
            </div>
        )}
    </>
);

// Update ProjectOwnerFields component
export const ProjectOwnerFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers' | 'householdLoadedFields' | 't'>> = ({
    formData,
    formOptions,
    errors,
    handlers,
    householdLoadedFields,
    t
}) => (
    <>
        <div>
            <Label>{t('samurdhiForm.projectOwnerName')}</Label>
            <Input
                type="text"
                name="projectOwnerName"
                value={formData.projectOwnerName || ""}
                onChange={(e) => {
                    handlers.handleInputChange(e);
                    // If user manually types, uncheck the "same as beneficiary" checkbox
                    if (formData.isProjectOwnerSameAsBeneficiary && e.target.value !== formData.beneficiaryName) {
                        handlers.handleCheckboxChange('isProjectOwnerSameAsBeneficiary', 'false', false);
                    }
                }}
                className={formData.isProjectOwnerSameAsBeneficiary ? 'bg-gray-100 dark:bg-gray-800' : ''}
                disabled={formData.isProjectOwnerSameAsBeneficiary}
                readOnly={formData.isProjectOwnerSameAsBeneficiary}
            />
            {formData.isProjectOwnerSameAsBeneficiary && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {t('samurdhiForm.autoFilledFromBeneficiary')}
                </p>
            )}
        </div>

        <div className="flex flex-col gap-4">
            <Label>{t('samurdhiForm.projectOwnerGender')}</Label>
            {['Female', 'Male', 'Other'].map(gender => (
                <Radio
                    key={gender}
                    id={`project-owner-gender-${gender.toLowerCase()}`}
                    name="projectOwnerGender"
                    value={gender}
                    checked={formData.projectOwnerGender === gender}
                    onChange={() => {
                        handlers.handleRadioChange('projectOwnerGender', gender);
                        // If user manually changes gender, uncheck the "same as beneficiary" checkbox
                        if (formData.isProjectOwnerSameAsBeneficiary && gender !== formData.beneficiaryGender) {
                            handlers.handleCheckboxChange('isProjectOwnerSameAsBeneficiary', 'false', false);
                        }
                    }}
                    label={t(`common.${gender.toLowerCase()}`)}
                    disabled={formData.isProjectOwnerSameAsBeneficiary}
                    className={formData.isProjectOwnerSameAsBeneficiary ? 'opacity-50' : ''}
                />
            ))}
        </div>

        <div>
            <Label>{t('samurdhiForm.projectOwnerAge')}</Label>
            <Input
                type="number"
                name="projectOwnerAge"
                value={formData.projectOwnerAge}
                onChange={(e) => {
                    handlers.handleInputChange(e);
                    // If user manually changes age, uncheck the "same as beneficiary" checkbox
                    if (formData.isProjectOwnerSameAsBeneficiary && parseInt(e.target.value) !== formData.beneficiaryAge) {
                        handlers.handleCheckboxChange('isProjectOwnerSameAsBeneficiary', 'false', false);
                    }
                }}
                className={`${errors.projectOwnerAge ? 'border-red-500' : ''} ${formData.isProjectOwnerSameAsBeneficiary ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                disabled={householdLoadedFields.has('projectOwnerAge') || formData.isProjectOwnerSameAsBeneficiary}
                readOnly={householdLoadedFields.has('projectOwnerAge') || formData.isProjectOwnerSameAsBeneficiary}
            />
            <ErrorMessage error={errors.projectOwnerAge} />
        </div>

        <div className="flex flex-col gap-4">
            <Label>{t('samurdhiForm.hasDisability')}</Label>
            <div className="flex flex-col gap-3">
                <Radio
                    id="disability-yes"
                    name="hasDisability"
                    value="true"
                    checked={formData.hasDisability === true}
                    onChange={() => handlers.handleRadioChange('hasDisability', 'true')}
                    label={t('common.yes')}
                />
                <Radio
                    id="disability-no"
                    name="hasDisability"
                    value="false"
                    checked={formData.hasDisability === false}
                    onChange={() => {
                        handlers.handleRadioChange('hasDisability', 'false');
                        handlers.handleSelectChange('disability_id', '');
                    }}
                    label={t('common.no')}
                />
            </div>
        </div>

        {formData.hasDisability && (
            <div>
                <Label>{t('samurdhiForm.disabilityType')} <span className="text-red-500">*</span></Label>
                <div className="relative">
                    <Select
                        options={formOptions.disabilities.map(disability => ({
                            value: disability.disabilityId,
                            label: `${disability.nameSi} - ${disability.nameTa} - ${disability.nameEN}`
                        }))}
                        placeholder={t('samurdhiForm.selectDisabilityType')}
                        onChange={(value) => handlers.handleSelectChange('disability_id', value)}
                        className={`dark:bg-dark-900 ${errors.disability_id ? 'border-red-500' : ''}`}
                        value={formData.disability_id || ''}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
                <ErrorMessage error={errors.disability_id} />
            </div>
        )}
    </>
);

// Update HouseholdMembersField component
export const HouseholdMembersField: React.FC<Pick<FormFieldProps, 'formData' | 'handlers' | 'householdLoadedFields' | 't'>> = ({
    formData,
    handlers,
    householdLoadedFields,
    t
}) => (
    <div className="space-y-6">
        <Label className="text-lg font-medium">{t('samurdhiForm.householdMembers')}</Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Below 16 */}
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">{t('samurdhiForm.ageBelow16')}</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>{t('common.male')}</Label>
                        <Input
                            type="number"
                            name="maleBelow16"
                            value={formData.maleBelow16 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('maleBelow16')}
                            readOnly={householdLoadedFields.has('maleBelow16')}
                        />
                    </div>
                    <div>
                        <Label>{t('common.female')}</Label>
                        <Input
                            type="number"
                            name="femaleBelow16"
                            value={formData.femaleBelow16 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('femaleBelow16')}
                            readOnly={householdLoadedFields.has('femaleBelow16')}
                        />
                    </div>
                </div>
            </div>

            {/* 16 to 24 */}
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">{t('samurdhiForm.age16To24')}</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>{t('common.male')}</Label>
                        <Input
                            type="number"
                            name="male16To24"
                            value={formData.male16To24 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('male16To24')}
                            readOnly={householdLoadedFields.has('male16To24')}
                        />
                    </div>
                    <div>
                        <Label>{t('common.female')}</Label>
                        <Input
                            type="number"
                            name="female16To24"
                            value={formData.female16To24 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('female16To24')}
                            readOnly={householdLoadedFields.has('female16To24')}
                        />
                    </div>
                </div>
            </div>

            {/* 25 to 45 */}
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">{t('samurdhiForm.age25To45')}</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>{t('common.male')}</Label>
                        <Input
                            type="number"
                            name="male25To45"
                            value={formData.male25To45 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('male25To45')}
                            readOnly={householdLoadedFields.has('male25To45')}
                        />
                    </div>
                    <div>
                        <Label>{t('common.female')}</Label>
                        <Input
                            type="number"
                            name="female25To45"
                            value={formData.female25To45 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('female25To45')}
                            readOnly={householdLoadedFields.has('female25To45')}
                        />
                    </div>
                </div>
            </div>

            {/* 46 to 60 */}
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">{t('samurdhiForm.age46To60')}</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>{t('common.male')}</Label>
                        <Input
                            type="number"
                            name="male46To60"
                            value={formData.male46To60 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('male46To60')}
                            readOnly={householdLoadedFields.has('male46To60')}
                        />
                    </div>
                    <div>
                        <Label>{t('common.female')}</Label>
                        <Input
                            type="number"
                            name="female46To60"
                            value={formData.female46To60 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('female46To60')}
                            readOnly={householdLoadedFields.has('female46To60')}
                        />
                    </div>
                </div>
            </div>

            {/* Above 60 */}
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">{t('samurdhiForm.ageAbove60')}</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>{t('common.male')}</Label>
                        <Input
                            type="number"
                            name="maleAbove60"
                            value={formData.maleAbove60 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('maleAbove60')}
                            readOnly={householdLoadedFields.has('maleAbove60')}
                        />
                    </div>
                    <div>
                        <Label>{t('common.female')}</Label>
                        <Input
                            type="number"
                            name="femaleAbove60"
                            value={formData.femaleAbove60 || 0}
                            onChange={handlers.handleInputChange}
                            min="0"
                            disabled={householdLoadedFields.has('femaleAbove60')}
                            readOnly={householdLoadedFields.has('femaleAbove60')}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);


// Update EmploymentFields component
export const EmploymentFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    handlers,
    t
}) => (
    <>
        <div className="space-y-2">
            <Label>{t('samurdhiForm.currentEmployment')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {formOptions.employmentOptions.map((option) => (
                    <Radio
                        key={option.employment_id}
                        id={`employment-${option.employment_id}`}
                        name="employment_id"
                        value={option.employment_id}
                        checked={formData.employment_id === option.employment_id}
                        onChange={() => handlers.handleRadioChange('employment_id', option.employment_id)}
                        label={`${option.nameSinhala} - ${option.nameTamil} - ${option.nameEnglish}`}
                        className="text-sm sm:text-base"
                    />
                ))}
            </div>
            <ErrorMessage error={errors.employment_id} />
        </div>

        <div>
            <Label>{t('samurdhiForm.otherOccupation')}</Label>
            <Input
                type="text"
                name="otherOccupation"
                value={formData.otherOccupation || ""}
                onChange={handlers.handleInputChange}
            />
        </div>
    </>
);

// Update BenefitsFields component
export const BenefitsFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'handlers' | 'householdLoadedFields' | 't'>> = ({
    formData,
    formOptions,
    handlers,
    householdLoadedFields,
    t
}) => {
    // Hide Samurdhi subsidy for Aswasuma beneficiaries
    const isAswasumaBeneficiary = formData.beneficiary_type_id === 'a8625875-41a4-47cf-9cb3-d2d185b7722d';

    return (
        <>
            {/* Hide Samurdhi subsidy for Aswasuma beneficiaries */}
            {!isAswasumaBeneficiary && (
                <div>
                    <Label>{t('samurdhiForm.samurdhiSubsidy')}</Label>
                    <div className="relative">
                        <Select
                            options={formOptions.subsidyOptions.map(option => ({
                                value: option.subsisdy_id,
                                label: formatAmount(option.amount)
                            }))}
                            placeholder={t('samurdhiForm.selectSubsidyAmount')}
                            onChange={(value) => handlers.handleSelectChange('subsisdy_id', value)}
                            className="dark:bg-dark-900"
                            value={formData.subsisdy_id || ""}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
            )}

            <div>
                <Label>{t('samurdhiForm.aswasumaCategory')}</Label>
                <div className="relative">
                    <Select
                        options={formOptions.aswasumaCategories.map(category => ({
                            value: category.aswesuma_cat_id,
                            label: formatCategoryLabel(category)
                        }))}
                        placeholder={t('samurdhiForm.selectAswasumaCategory')}
                        onChange={(value) => handlers.handleSelectChange('aswesuma_cat_id', value)}
                        className="dark:bg-dark-900"
                        value={formData.aswesuma_cat_id || ""}
                        disabled={householdLoadedFields.has('aswesuma_cat_id')}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>
        </>
    );
};

// Update EmpowermentField component
export const EmpowermentField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    handlers,
    t
}) => (
    <div className="space-y-2">
        <Label>{t('samurdhiForm.empowermentDimension')}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {formOptions.empowermentDimensions.map((dimension) => (
                <Radio
                    key={dimension.empowerment_dimension_id}
                    id={`empowerment-${dimension.empowerment_dimension_id}`}
                    name="empowerment_dimension_id"
                    value={dimension.empowerment_dimension_id}
                    checked={formData.empowerment_dimension_id === dimension.empowerment_dimension_id}
                    onChange={() => {
                        const isEmploymentFacilitation = dimension.nameEnglish.includes("Employment Facilitation");
                        const isBusinessOpportunities = dimension.nameEnglish.includes("Business Opportunities") ||
                            dimension.nameEnglish.includes("Self-Employment");

                        // Clear Employment Facilitation related fields if switching to Business Opportunities
                        if (isBusinessOpportunities) {
                            handlers.handleSelectChange('job_field_id', '');
                            handlers.handleInputChange({
                                target: { name: 'otherJobField', value: '' }
                            } as React.ChangeEvent<HTMLInputElement>);
                            handlers.handleInputChange({
                                target: { name: 'childName', value: '' }
                            } as React.ChangeEvent<HTMLInputElement>);
                            handlers.handleInputChange({
                                target: { name: 'childAge', value: '0' }
                            } as React.ChangeEvent<HTMLInputElement>);
                            handlers.handleRadioChange('childGender', '');
                        }

                        // Clear Business Opportunities related fields if switching to Employment Facilitation
                        if (isEmploymentFacilitation) {
                            handlers.handleSelectChange('selectedLivelihood', '');
                            handlers.handleSelectChange('livelihood_id', '');
                            handlers.handleSelectChange('project_type_id', '');
                            handlers.handleInputChange({
                                target: { name: 'otherProject', value: '' }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }

                        // Set the new empowerment dimension
                        handlers.handleRadioChange('empowerment_dimension_id', dimension.empowerment_dimension_id);
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
);

// Update ProjectTypeField component
export const ProjectTypeField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'showAllFieldsForExistingBeneficiary' | 'handlers' | 't'> & {
    projectTypesByLivelihood: any[];
    isLoadingProjectTypes: boolean;
    onLivelihoodChange: (livelihoodId: string) => void;
}> = ({
    formData,
    formOptions,
    errors,
    showAllFieldsForExistingBeneficiary,
    handlers,
    projectTypesByLivelihood,
    isLoadingProjectTypes,
    onLivelihoodChange,
    t
}) => {
        if (!shouldShowProjectFields(formData, formOptions, showAllFieldsForExistingBeneficiary)) return null;

        // const selectedLivelihood = formOptions.livelihoods?.find(l => l.id.toString() === formData.selectedLivelihood);
        // const isOtherLivelihoodSelected = selectedLivelihood?.english_name === 'Other';

        const selectedProjectType = projectTypesByLivelihood.find(pt => pt.project_type_id.toString() === formData.project_type_id);
        const isOtherProjectTypeSelected = selectedProjectType?.nameEnglish === 'Other';



        return (
            <div className="space-y-4">
                {/* Livelihood Dropdown */}
                <div>
                    <Label>{t('samurdhiForm.livelihood')}</Label>
                    <div className="relative">
                        <Select
                            options={formOptions.livelihoods?.map((livelihood: any) => ({
                                value: livelihood.id.toString(),
                                label: `${livelihood.sinhala_name} - ${livelihood.tamil_name} - ${livelihood.english_name}`
                            })) || []}
                            placeholder={t('samurdhiForm.selectLivelihood')}
                            onChange={(value) => {
                                // Update both selectedLivelihood (for UI logic) and livelihood_id (for payload)
                                handlers.handleSelectChange('selectedLivelihood', value);
                                handlers.handleSelectChange('livelihood_id', value);
                                onLivelihoodChange(value);

                                // Clear project type when livelihood changes
                                handlers.handleSelectChange('project_type_id', '');
                                handlers.handleInputChange({
                                    target: { name: 'otherProject', value: '' }
                                } as React.ChangeEvent<HTMLInputElement>);
                            }}
                            className={`dark:bg-dark-900 ${errors.selectedLivelihood ? 'border-red-500' : ''}`}
                            value={formData.selectedLivelihood || ''}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                    <ErrorMessage error={errors.selectedLivelihood} />
                </div>

                {/* Project Type Dropdown - only show when livelihood is selected */}
                {formData.selectedLivelihood && (
                    <>
                        <div>
                            <Label>{t('samurdhiForm.projectTypes')}</Label>
                            <div className="relative">
                                <Select
                                    options={projectTypesByLivelihood.map(project => ({
                                        value: project.project_type_id.toString(),
                                        label: `${project.nameSinhala} - ${project.nameTamil} - ${project.nameEnglish}`
                                    }))}
                                    placeholder={isLoadingProjectTypes ? t('common.loading') : t('samurdhiForm.selectProjectType')}
                                    onChange={(value) => {
                                        handlers.handleSelectChange('project_type_id', value);
                                        // Clear other project when changing selection
                                        if (value) {
                                            const selected = projectTypesByLivelihood.find(pt => pt.project_type_id.toString() === value);
                                            if (selected?.nameEnglish !== 'Other') {
                                                handlers.handleInputChange({
                                                    target: { name: 'otherProject', value: '' }
                                                } as React.ChangeEvent<HTMLInputElement>);
                                            }
                                        }
                                    }}
                                    className={`dark:bg-dark-900 ${errors.project_type_id ? 'border-red-500' : ''}`}
                                    value={formData.project_type_id || ''}
                                    disabled={isLoadingProjectTypes}
                                />
                                {isLoadingProjectTypes && (
                                    <div className="absolute top-2 right-3">
                                        <LoadingSpinner size="sm" />
                                    </div>
                                )}
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                            <ErrorMessage error={errors.project_type_id} />
                        </div>

                        {/* Show "Other Project" input only when "Other" is selected in project type */}
                        {isOtherProjectTypeSelected && (
                            <div>
                                <Label>{t('samurdhiForm.pleaseSpecifyOtherProject')} <span className="text-red-500">*</span></Label>
                                <Input
                                    type="text"
                                    name="otherProject"
                                    value={formData.otherProject || ""}
                                    onChange={handlers.handleInputChange}
                                    placeholder={t('samurdhiForm.enterOtherProject')}
                                    className={errors.otherProject ? 'border-red-500' : ''}
                                />
                                <ErrorMessage error={errors.otherProject} />
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };


// Update ChildDetailsFields component
export const ChildDetailsFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'showAllFieldsForExistingBeneficiary' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    showAllFieldsForExistingBeneficiary,
    handlers,
    t
}) => {
    if (!shouldShowChildFields(formData, formOptions, showAllFieldsForExistingBeneficiary)) return null;

    const selectedJobField = formOptions.jobFields.find(jf => jf.job_field_id === formData.job_field_id);
    const isOtherJobFieldSelected = selectedJobField?.nameEnglish === 'Other';

    return (
        <>
            <div>
                <Label>{t('samurdhiForm.jobField')}</Label>
                <div className="relative">
                    <Select
                        options={formOptions.jobFields.map(jobField => ({
                            value: jobField.job_field_id.toString(),
                            label: `${jobField.nameSinhala} - ${jobField.nameTamil} - ${jobField.nameEnglish}`
                        }))}
                        placeholder={t('samurdhiForm.selectJobField')}
                        onChange={(value) => {
                            handlers.handleSelectChange('job_field_id', value);
                            // Clear other job field when changing selection
                            if (value) {
                                const selected = formOptions.jobFields.find(jf => jf.job_field_id === value);
                                if (selected?.nameEnglish !== 'Other') {
                                    handlers.handleInputChange({
                                        target: { name: 'otherJobField', value: '' }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }
                            }
                        }}
                        className={`dark:bg-dark-900 ${errors.job_field_id ? 'border-red-500' : ''}`}
                        value={formData.job_field_id || ''}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
                <ErrorMessage error={errors.job_field_id} />
            </div>

            {/* Show "Other Job Field" input only when "Other" is selected */}
            {isOtherJobFieldSelected && (
                <div>
                    <Label>{t('samurdhiForm.pleaseSpecifyOtherJobField')} <span className="text-red-500">*</span></Label>
                    <Input
                        type="text"
                        name="otherJobField"
                        value={formData.otherJobField || ""}
                        onChange={handlers.handleInputChange}
                        placeholder={t('samurdhiForm.enterOtherJobField')}
                        className={errors.otherJobField ? 'border-red-500' : ''}
                    />
                    <ErrorMessage error={errors.otherJobField} />
                </div>
            )}

            <div>
                <Label>{t('samurdhiForm.childName')}</Label>
                <Input
                    type="text"
                    name="childName"
                    value={formData.childName || ""}
                    onChange={handlers.handleInputChange}
                    className={errors.childName ? 'border-red-500' : ''}
                />
                <ErrorMessage error={errors.childName} />
            </div>

            <div>
                <Label>{t('samurdhiForm.childAge')}</Label>
                <Input
                    type="number"
                    name="childAge"
                    value={formData.childAge}
                    onChange={handlers.handleInputChange}
                    className={errors.childAge ? 'border-red-500' : ''}
                />
                <ErrorMessage error={errors.childAge} />
            </div>

            <div className="flex flex-col gap-4">
                <Label>{t('samurdhiForm.childGender')}</Label>
                {['Female', 'Male'].map(gender => (
                    <Radio
                        key={gender}
                        id={`child-gender-${gender.toLowerCase()}`}
                        name="childGender"
                        value={gender}
                        checked={formData.childGender === gender}
                        onChange={() => handlers.handleRadioChange('childGender', gender)}
                        label={t(`common.${gender.toLowerCase()}`)}
                    />
                ))}
            </div>
        </>
    );
};

// Update MonthlySavingField component
export const MonthlySavingField: React.FC<Pick<FormFieldProps, 'formData' | 'errors' | 'handlers' | 't'>> = ({
    formData,
    errors,
    handlers,
    t
}) => (
    <div className="space-y-4">
        <Label>{t('samurdhiForm.monthlySaving')} <span className="text-red-500">*</span></Label>

        <div className="flex flex-col gap-3">
            <Radio
                id="monthly-saving-yes"
                name="monthlySaving"
                value="true"
                checked={formData.monthlySaving === true}
                onChange={() => handlers.handleRadioChange('monthlySaving', 'true')}
                label={t('common.yes')}
            />
            <Radio
                id="monthly-saving-no"
                name="monthlySaving"
                value="false"
                checked={formData.monthlySaving === false}
                onChange={() => {
                    handlers.handleRadioChange('monthlySaving', 'false');
                    handlers.handleInputChange({
                        target: { name: 'savingAmount', value: '' }
                    } as React.ChangeEvent<HTMLInputElement>);
                }}
                label={t('common.no')}
            />
        </div>
        <ErrorMessage error={errors.monthlySaving} />

        {formData.monthlySaving === true && (
            <div>
                <Label>
                    {t('samurdhiForm.savingAmount')}
                    <span className="text-red-500"> *</span>
                </Label>
                <Input
                    type="number"
                    name="savingAmount"
                    value={formData.savingAmount || 0}
                    onChange={handlers.handleInputChange}
                    min="0"
                    step={100}
                    placeholder={t('samurdhiForm.enterAmountLKR')}
                    className={`w-full max-w-xs ${errors.savingAmount ? 'border-red-500' : ''}`}
                />
                <ErrorMessage error={errors.savingAmount} />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('samurdhiForm.amountInLKR')}
                </p>
            </div>
        )}
    </div>
);

// Update CheckboxSections component
export const CheckboxSections: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers' | 't'>> = ({
    formData,
    formOptions,
    errors,
    handlers,
    t
}) => (
    <>
        <div className="space-y-2">
            <Label>{t('samurdhiForm.resourcesNeeded')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formOptions.resourcesNeeded.map((resource) => (
                    <div key={resource.resource_id} className="flex gap-3 items-start">
                        <Checkbox
                            checked={formData.resource_id.includes(resource.resource_id)}
                            onChange={(checked) => handlers.handleCheckboxChange('resource_id', resource.resource_id, checked)}
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
            <Label>{t('samurdhiForm.healthNutritionEducation')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formOptions.healthIndicators.map((indicator) => (
                    <div key={indicator.health_indicator_id} className="flex gap-3 items-start">
                        <Checkbox
                            checked={formData.health_indicator_id.includes(indicator.health_indicator_id)}
                            onChange={(checked) => handlers.handleCheckboxChange('health_indicator_id', indicator.health_indicator_id, checked)}
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
            <Label>{t('samurdhiForm.domesticDynamics')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formOptions.domesticDynamics.map((dynamic) => (
                    <div key={dynamic.domestic_dynamic_id} className="flex gap-3 items-start">
                        <Checkbox
                            checked={formData.domestic_dynamic_id.includes(dynamic.domestic_dynamic_id)}
                            onChange={(checked) => handlers.handleCheckboxChange('domestic_dynamic_id', dynamic.domestic_dynamic_id, checked)}
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
            <Label>{t('samurdhiForm.communityParticipation')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formOptions.communityParticipationOptions.map((item) => (
                    <div key={item.community_participation_id} className="flex gap-3 items-start">
                        <Checkbox
                            checked={formData.community_participation_id.includes(item.community_participation_id)}
                            onChange={(checked) => handlers.handleCheckboxChange('community_participation_id', item.community_participation_id, checked)}
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
            <Label>{t('samurdhiForm.housingServices')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formOptions.housingServices.map((service) => (
                    <div key={service.housing_service_id} className="flex gap-3 items-start">
                        <Checkbox
                            checked={formData.housing_service_id.includes(service.housing_service_id)}
                            onChange={(checked) => handlers.handleCheckboxChange('housing_service_id', service.housing_service_id, checked)}
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
    </>
);

// Update BankingDetailsFields component
export const BankingDetailsFields: React.FC<Pick<FormFieldProps, 'formData' | 'handlers' | 'formOptions' | 't'>> = ({
    formData,
    handlers,
    formOptions,
    t
}) => (
    <div className="space-y-6 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('samurdhiForm.bankingDetails')}
        </h3>

        {/* Commercial Bank Details */}
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                {t('samurdhiForm.commercialBankDetails')}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t('samurdhiForm.accountName')}</Label>
                    <Input
                        type="text"
                        name="commercialBankAccountName"
                        value={formData.commercialBankAccountName || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>{t('samurdhiForm.accountNumber')}</Label>
                    <Input
                        type="text"
                        name="commercialBankAccountNumber"
                        value={formData.commercialBankAccountNumber || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>{t('samurdhiForm.bankName')}</Label>
                    <Input
                        type="text"
                        name="commercialBankName"
                        value={formData.commercialBankName || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>{t('samurdhiForm.branch')}</Label>
                    <Input
                        type="text"
                        name="commercialBankBranch"
                        value={formData.commercialBankBranch || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>
            </div>
        </div>

        {/* Samurdhi Bank Details */}
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                {t('samurdhiForm.samurdhiBankDetails')}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t('samurdhiForm.accountName')}</Label>
                    <Input
                        type="text"
                        name="samurdhiBankAccountName"
                        value={formData.samurdhiBankAccountName || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>{t('samurdhiForm.accountNumber')}</Label>
                    <Input
                        type="text"
                        name="samurdhiBankAccountNumber"
                        value={formData.samurdhiBankAccountNumber || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>{t('samurdhiForm.bankName')}</Label>
                    <Input
                        type="text"
                        name="samurdhiBankName"
                        value={formData.samurdhiBankName || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>{t('samurdhiForm.accountType')}</Label>
                    <div className="relative">
                        <Select
                            options={formOptions.accountTypes.map(type => ({
                                value: type.samurdhi_bank_account_type_id.toString(),
                                label: type.name
                            }))}
                            placeholder={t('samurdhiForm.selectAccountType')}
                            onChange={(value) => handlers.handleSelectChange('samurdhiBankAccountType', value)}
                            className="dark:bg-dark-900"
                            value={formData.samurdhiBankAccountType?.toString() || ''}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Aswasuma Bank Transfer Preference */}
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                {t('samurdhiForm.aswasumaBankTransfer')}
            </h4>

            <div className="flex flex-col gap-4">
                <Label>{t('samurdhiForm.wantsBankTransfer')}</Label>
                <div className="flex flex-col gap-3">
                    <Radio
                        id="aswasuma-transfer-yes"
                        name="wantsAswesumaBankTransfer"
                        value="true"
                        checked={formData.wantsAswesumaBankTransfer === true}
                        onChange={() => handlers.handleRadioChange('wantsAswesumaBankTransfer', 'true')}
                        label={t('common.yes')}
                    />
                    <Radio
                        id="aswasuma-transfer-no"
                        name="wantsAswesumaBankTransfer"
                        value="false"
                        checked={formData.wantsAswesumaBankTransfer === false}
                        onChange={() => handlers.handleRadioChange('wantsAswesumaBankTransfer', 'false')}
                        label={t('common.no')}
                    />
                </div>
            </div>
        </div>

        {/* Other Bank Details (conditional) */}
        {formData.wantsAswesumaBankTransfer === false && (
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                    {t('samurdhiForm.otherBankDetails')}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>{t('samurdhiForm.bankName')}</Label>
                        <Input
                            type="text"
                            name="otherBankName"
                            value={formData.otherBankName || ""}
                            onChange={handlers.handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>{t('samurdhiForm.branch')}</Label>
                        <Input
                            type="text"
                            name="otherBankBranch"
                            value={formData.otherBankBranch || ""}
                            onChange={handlers.handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>{t('samurdhiForm.accountHolder')}</Label>
                        <Input
                            type="text"
                            name="otherBankAccountHolder"
                            value={formData.otherBankAccountHolder || ""}
                            onChange={handlers.handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>{t('samurdhiForm.accountNumber')}</Label>
                        <Input
                            type="text"
                            name="otherBankAccountNumber"
                            value={formData.otherBankAccountNumber || ""}
                            onChange={handlers.handleInputChange}
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Other Government Subsidy */}
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                {t('samurdhiForm.otherGovernmentSubsidies')}
            </h4>

            <div className="flex flex-col gap-4">
                <Label>{t('samurdhiForm.hasOtherSubsidy')}</Label>
                <div className="flex flex-col gap-3">
                    <Radio
                        id="other-subsidy-yes"
                        name="hasOtherGovernmentSubsidy"
                        value="true"
                        checked={formData.hasOtherGovernmentSubsidy === true}
                        onChange={() => handlers.handleRadioChange('hasOtherGovernmentSubsidy', 'true')}
                        label={t('common.yes')}
                    />
                    <Radio
                        id="other-subsidy-no"
                        name="hasOtherGovernmentSubsidy"
                        value="false"
                        checked={formData.hasOtherGovernmentSubsidy === false}
                        onChange={() => handlers.handleRadioChange('hasOtherGovernmentSubsidy', 'false')}
                        label={t('common.no')}
                    />
                </div>
            </div>

            {formData.hasOtherGovernmentSubsidy && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>{t('samurdhiForm.governmentInstitution')}</Label>
                        <Input
                            type="text"
                            name="otherGovernmentInstitution"
                            value={formData.otherGovernmentInstitution || ""}
                            onChange={handlers.handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>{t('samurdhiForm.subsidyAmount')}</Label>
                        <Input
                            type="number"
                            name="otherSubsidyAmount"
                            value={formData.otherSubsidyAmount || ""}
                            onChange={handlers.handleInputChange}
                            min="0"
                            step={0.01}
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
);