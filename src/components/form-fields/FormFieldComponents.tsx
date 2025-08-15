import React from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import Radio from '../form/input/Radio';
import Checkbox from '../form/input/Checkbox';
import Button from '../ui/button/Button';
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
    handlers: {
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSelectChange: (name: string, value: string) => void;
        handleRadioChange: (name: string, value: string) => void;
        handleCheckboxChange: (name: string, value: string, isChecked: boolean) => void;
        handleNicLookup: () => void;
        handleHouseholdSelection: (value: string) => void;
    };
}

const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
        </p>
    );
};

export const LocationFields: React.FC<Pick<FormFieldProps, 'formData'>> = ({ formData }) => (
    <>
        <div>
            <Label>District</Label>
            <Input type="text" value={formData.district.name} readOnly />
            <input type="hidden" name="district_id" value={formData.district.id} />
        </div>

        <div>
            <Label>Divisional Secretariat Division</Label>
            <Input type="text" value={formData.dsDivision.name} readOnly />
            <input type="hidden" name="ds_id" value={formData.dsDivision.id} />
        </div>

        <div>
            <Label>Samurdhi Bank</Label>
            <Input type="text" value={formData.zone.name} readOnly />
            <input type="hidden" name="zone_id" value={formData.zone.id} />
        </div>

        <div>
            <Label>Grama Nildhari Division</Label>
            <Input type="text" value={formData.gnd.name} readOnly />
            <input type="hidden" name="gnd_id" value={formData.gnd.id} />
        </div>
    </>
);

export const MainProgramField: React.FC<Pick<FormFieldProps, 'formData' | 'errors' | 'handlers'>> = ({
    formData,
    errors,
    handlers
}) => (
    <div>
        <Label>Main Program <span className="text-red-500">*</span></Label>
        <div className="relative">
            <Select
                options={MAIN_PROGRAM_OPTIONS}
                placeholder="Select Main Program"
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

export const ConsentFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    handlers
}) => (
    <div className="space-y-4">
        <Label>Empowerment Program Consent</Label>

        <div className="flex flex-col gap-6">
            {/* Consent to participate */}
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
                            handlers.handleRadioChange('hasConsentedToEmpowerment', 'true');
                            // Clear refusal reason when selecting Yes
                            handlers.handleSelectChange('refusal_reason_id', '');
                        }}
                        label="Yes"
                    />
                    <Radio
                        id="consent-no"
                        name="hasConsentedToEmpowerment"
                        value="false"
                        checked={formData.hasConsentedToEmpowerment === false}
                        onChange={() => {
                            handlers.handleRadioChange('hasConsentedToEmpowerment', 'false');
                            // Clear consent date when selecting No
                            handlers.handleInputChange({
                                target: { name: 'consentGivenAt', value: '' }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        label="No"
                    />
                </div>
                <ErrorMessage error={errors.hasConsentedToEmpowerment} />
            </div>

            {/* Consent date - only show when consent is Yes */}
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

            {/* Refusal reason - only show when consent is No */}
            {formData.hasConsentedToEmpowerment === false && (
                <div>
                    <Label>Refusal Reason <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <Select
                            options={formOptions.refusalReasons.map(reason => ({
                                value: reason.id,
                                label: `${reason.reason_si} - ${reason.reason_ta} - ${reason.reason_en}`
                            }))}
                            placeholder="Select refusal reason"
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

            {/* Consent letter obtained */}
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
                        onChange={() => handlers.handleRadioChange('hasObtainedConsentLetter', 'true')}
                        label="Yes"
                    />
                    <Radio
                        id="consent-letter-no"
                        name="hasObtainedConsentLetter"
                        value="false"
                        checked={formData.hasObtainedConsentLetter === false}
                        onChange={() => handlers.handleRadioChange('hasObtainedConsentLetter', 'false')}
                        label="No"
                    />
                </div>
                <ErrorMessage error={errors.hasObtainedConsentLetter} />
            </div>
        </div>
    </div>
);

export const AreaClassificationField: React.FC<Pick<FormFieldProps, 'formData' | 'handlers'>> = ({
    formData,
    handlers
}) => (
    <div>
        <Label>Area Classification</Label>
        <div className="flex flex-col gap-4">
            {[
                { value: 'නැගරික/ Urban/ நகர்புற', label: 'නැගරික/ Urban/ நகர்புற' },
                { value: 'ග්‍රාමීය/ Rural/ கிராமப்புற', label: 'ග්‍රාමීය/ Rural/ கிராமப்புற' },
                { value: 'වතු/ Estates / எஸ்டேட்ஸ்', label: 'වතු/ Estates / எஸ்டேட்ஸ்' }
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

export const BeneficiaryTypeField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    handlers
}) => (
    <div className="flex flex-col gap-4">
        <Label>Are you a Samurdhi beneficiary?/ Aswasuma beneficiary?/low-income earner?</Label>
        <div className='flex flex-col md:flex-row gap-5 md:gap-20'>
            {formOptions.beneficiaryStatuses.map((status) => (
                <Radio
                    key={status.beneficiary_type_id}
                    id={`status-${status.beneficiary_type_id}`}
                    name="beneficiary_type_id"
                    value={status.beneficiary_type_id}
                    checked={formData.beneficiary_type_id === status.beneficiary_type_id}
                    onChange={() => handlers.handleRadioChange('beneficiary_type_id', status.beneficiary_type_id)}
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

export const HouseholdNumberField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'householdNumbers' | 'isLoadingHouseholdNumbers' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    householdNumbers,
    isLoadingHouseholdNumbers,
    handlers
}) => {
    if (!shouldShowHouseholdField(formData, formOptions)) return null;

    return (
        <div>
            <Label>
                Aswasuma household number
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
                            ? 'No household numbers available for this GN division'
                            : 'Select household number'
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
        </div>
    );
};

export const NicField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'isFetching' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    isFetching,
    handlers
}) => {
    if (!shouldShowNicField(formData, formOptions)) return null;

    return (
        <div className="flex flex-col md:flex-row gap-2 md:items-end">
            <div className="md:flex-1">
                <Label>
                    National Identity Card Number
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
            <Button
                size="sm"
                variant="secondary"
                onClick={handlers.handleNicLookup}
                disabled={isFetching}
                className="h-11 w-full md:w-auto flex items-center gap-2"
            >
                {isFetching && <LoadingSpinner size="sm" color="white" />}
                {isFetching ? 'Fetching...' : 'Get Details'}
            </Button>
        </div>
    );
};

export const BasicInfoFields: React.FC<Pick<FormFieldProps, 'formData' | 'errors' | 'handlers'>> = ({
    formData,
    errors,
    handlers
}) => (
    <>
        <div>
            <Label>Name of the Beneficiary</Label>
            <Input
                type="text"
                name="beneficiaryName"
                value={formData.beneficiaryName || ""}
                onChange={handlers.handleInputChange}
                className={errors.beneficiaryName ? 'border-red-500' : ''}
            />
            <ErrorMessage error={errors.beneficiaryName} />
        </div>

        <div className="flex flex-col gap-4">
            <Label>Gender</Label>
            {['Female', 'Male', 'Other'].map(gender => (
                <Radio
                    key={gender}
                    id={`gender-${gender.toLowerCase()}`}
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={() => handlers.handleRadioChange('gender', gender)}
                    label={gender}
                />
            ))}
        </div>

        <div>
            <Label>Address</Label>
            <Input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handlers.handleInputChange}
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
                onChange={handlers.handleInputChange}
                className={errors.phone ? 'border-red-500' : ''}
            />
            <ErrorMessage error={errors.phone} />
        </div>
    </>
);

export const ProjectOwnerFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    handlers
}) => (
    <>
        <div>
            <Label>Project Owner Name</Label>
            <Input
                type="text"
                name="projectOwnerName"
                value={formData.projectOwnerName || ""}
                onChange={handlers.handleInputChange}
            />
        </div>

        <div className="flex flex-col gap-4">
            <Label>Project Owner Gender</Label>
            {['Female', 'Male', 'Other'].map(gender => (
                <Radio
                    key={gender}
                    id={`project-owner-gender-${gender.toLowerCase()}`}
                    name="projectOwnerGender"
                    value={gender}
                    checked={formData.projectOwnerGender === gender}
                    onChange={() => handlers.handleRadioChange('projectOwnerGender', gender)}
                    label={gender}
                />
            ))}
        </div>

        <div>
            <Label>Age of Project Owner</Label>
            <Input
                type="number"
                name="projectOwnerAge"
                value={formData.projectOwnerAge}
                onChange={handlers.handleInputChange}
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
                        ...formOptions.disabilities.map(disability => ({
                            value: disability.disabilityId,
                            label: `${disability.nameSi} - ${disability.nameTa} - ${disability.nameEN}`
                        }))
                    ]}
                    placeholder="Select disability status"
                    onChange={(value) => handlers.handleSelectChange('disability_id', value)}
                    className="dark:bg-dark-900"
                    value={formData.disability_id || ''}
                />
            </div>
        </div>
    </>
);

export const HouseholdMembersField: React.FC<Pick<FormFieldProps, 'formData' | 'handlers'>> = ({
    formData,
    handlers
}) => (
    <div>
        <Label>No. of Household Members Aged 18–60</Label>
        <Label>Female</Label>
        <Input
            type="number"
            name="female18To60"
            value={formData.female18To60 || 0}
            onChange={handlers.handleInputChange}
        />
        <Label>Male</Label>
        <Input
            type="number"
            name="male18To60"
            value={formData.male18To60 || 0}
            onChange={handlers.handleInputChange}
        />
    </div>
);

export const EmploymentFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    handlers
}) => (
    <>
        <div className="space-y-2">
            <Label>Current Employment</Label>
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
            <Label>Other Occupation (if any)</Label>
            <Input
                type="text"
                name="otherOccupation"
                value={formData.otherOccupation || ""}
                onChange={handlers.handleInputChange}
            />
        </div>
    </>
);

export const BenefitsFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'handlers'>> = ({
    formData,
    formOptions,
    handlers
}) => (
    <>
        <div>
            <Label>Samurdhi subsidy received</Label>
            <div className="relative">
                <Select
                    options={formOptions.subsidyOptions.map(option => ({
                        value: option.subsisdy_id,
                        label: formatAmount(option.amount)
                    }))}
                    placeholder="Select Subsidy Amount"
                    onChange={(value) => handlers.handleSelectChange('subsisdy_id', value)}
                    className="dark:bg-dark-900"
                    value={formData.subsisdy_id || ""}
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
                    options={formOptions.aswasumaCategories.map(category => ({
                        value: category.aswesuma_cat_id,
                        label: formatCategoryLabel(category)
                    }))}
                    placeholder="Select Aswasuma Category"
                    onChange={(value) => handlers.handleSelectChange('aswesuma_cat_id', value)}
                    className="dark:bg-dark-900"
                    value={formData.aswesuma_cat_id || ""}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                </span>
            </div>
        </div>
    </>
);

export const EmpowermentField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    handlers
}) => (
    <div className="space-y-2">
        <Label>What is Empowerment Dimension</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {formOptions.empowermentDimensions.map((dimension) => (
                <Radio
                    key={dimension.empowerment_dimension_id}
                    id={`empowerment-${dimension.empowerment_dimension_id}`}
                    name="empowerment_dimension_id"
                    value={dimension.empowerment_dimension_id}
                    checked={formData.empowerment_dimension_id === dimension.empowerment_dimension_id}
                    onChange={() => handlers.handleRadioChange('empowerment_dimension_id', dimension.empowerment_dimension_id)}
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

export const ProjectTypeField: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'showAllFieldsForExistingBeneficiary' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    showAllFieldsForExistingBeneficiary,
    handlers
}) => {
    if (!shouldShowProjectFields(formData, formOptions, showAllFieldsForExistingBeneficiary)) return null;

    return (
        <div className="space-y-2">
            <Label>Types of Projects</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {formOptions.projectTypes.map((project) => (
                    <Radio
                        key={project.project_type_id}
                        id={`project-${project.project_type_id}`}
                        name="project_type_id"
                        value={project.project_type_id}
                        checked={formData.project_type_id === project.project_type_id}
                        onChange={() => handlers.handleRadioChange('project_type_id', project.project_type_id)}
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
    );
};

export const ChildDetailsFields: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'showAllFieldsForExistingBeneficiary' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    showAllFieldsForExistingBeneficiary,
    handlers
}) => {
    if (!shouldShowChildFields(formData, formOptions, showAllFieldsForExistingBeneficiary)) return null;

    return (
        <>
            <div>
                <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ නම</Label>
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
                <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ වයස</Label>
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
                <Label>පුහුණුව ලබාදීමට/ රැකියාගත කිරීමට අපේක්ෂිත දරුවාගේ ස්ත්‍රී - පුරුෂ භාවය</Label>
                {['Female', 'Male'].map(gender => (
                    <Radio
                        key={gender}
                        id={`child-gender-${gender.toLowerCase()}`}
                        name="childGender"
                        value={gender}
                        checked={formData.childGender === gender}
                        onChange={() => handlers.handleRadioChange('childGender', gender)}
                        label={gender}
                    />
                ))}
            </div>

            <div className="space-y-2">
                <Label>Job Field</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {formOptions.jobFields.map((jobField) => (
                        <Radio
                            key={jobField.job_field_id}
                            id={`job-field-${jobField.job_field_id}`}
                            name="job_field_id"
                            value={jobField.job_field_id}
                            checked={formData.job_field_id === jobField.job_field_id}
                            onChange={() => handlers.handleRadioChange('job_field_id', jobField.job_field_id)}
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
                    value={formData.otherJobField || ""}
                    onChange={handlers.handleInputChange}
                />
            </div>
        </>
    );
};

export const CheckboxSections: React.FC<Pick<FormFieldProps, 'formData' | 'formOptions' | 'errors' | 'handlers'>> = ({
    formData,
    formOptions,
    errors,
    handlers
}) => (
    <>
        <div className="space-y-2">
            <Label>Resources Needed</Label>
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
            <Label>Health/Nutrition/Education</Label>
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
            <Label>Domestic Dynamics</Label>
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
            <Label>Community Participation</Label>
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
            <Label>Housing Services</Label>
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

export const BankingDetailsFields: React.FC<Pick<FormFieldProps, 'formData' | 'handlers'>> = ({
    formData,
    handlers
}) => (
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
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>Account Number</Label>
                    <Input
                        type="text"
                        name="commercialBankAccountNumber"
                        value={formData.commercialBankAccountNumber || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>Bank Name</Label>
                    <Input
                        type="text"
                        name="commercialBankName"
                        value={formData.commercialBankName || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>Branch</Label>
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
                Samurdhi Bank Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Account Name</Label>
                    <Input
                        type="text"
                        name="samurdhiBankAccountName"
                        value={formData.samurdhiBankAccountName || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>Account Number</Label>
                    <Input
                        type="text"
                        name="samurdhiBankAccountNumber"
                        value={formData.samurdhiBankAccountNumber || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>Bank Name</Label>
                    <Input
                        type="text"
                        name="samurdhiBankName"
                        value={formData.samurdhiBankName || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>

                <div>
                    <Label>Account Type</Label>
                    <Input
                        type="text"
                        name="samurdhiBankAccountType"
                        value={formData.samurdhiBankAccountType || ""}
                        onChange={handlers.handleInputChange}
                    />
                </div>
            </div>
        </div>
    </div>
);