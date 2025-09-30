'use client'

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { BeneficiaryDetailsResponseDto } from '@/services/benficiaryService';

interface BeneficiaryDetailsModalProps {
    beneficiary: BeneficiaryDetailsResponseDto | null;
    isOpen: boolean;
    onClose: () => void;
}

interface ListItem {
    id?: string;
    resource_id?: string;
    health_indicator_id?: string;
    domestic_dynamic_id?: string;
    community_participation_id?: string;
    housing_service_id?: string;
    nameEnglish: string;
    nameSinhala?: string;
    nameTamil?: string;
}

const BeneficiaryDetailsModal: React.FC<BeneficiaryDetailsModalProps> = ({
    beneficiary,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();

    if (!isOpen || !beneficiary) return null;

    const parseNumber = (value: string | number): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseInt(value.replace(/^0+/, '') || '0');
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    const parsedDemographics = {
        totalFamilyMembers: parseNumber(beneficiary.demographics.totalFamilyMembers),
        totalMale: parseNumber(beneficiary.demographics.totalMale),
        totalFemale: parseNumber(beneficiary.demographics.totalFemale),
        ageRanges: {
            below16: {
                male: parseNumber(beneficiary.demographics.ageRanges.below16.male),
                female: parseNumber(beneficiary.demographics.ageRanges.below16.female),
                total: parseNumber(beneficiary.demographics.ageRanges.below16.total)
            },
            age16To24: {
                male: parseNumber(beneficiary.demographics.ageRanges.age16To24.male),
                female: parseNumber(beneficiary.demographics.ageRanges.age16To24.female),
                total: parseNumber(beneficiary.demographics.ageRanges.age16To24.total)
            },
            age25To45: {
                male: parseNumber(beneficiary.demographics.ageRanges.age25To45.male),
                female: parseNumber(beneficiary.demographics.ageRanges.age25To45.female),
                total: parseNumber(beneficiary.demographics.ageRanges.age25To45.total)
            },
            age46To60: {
                male: parseNumber(beneficiary.demographics.ageRanges.age46To60.male),
                female: parseNumber(beneficiary.demographics.ageRanges.age46To60.female),
                total: parseNumber(beneficiary.demographics.ageRanges.age46To60.total)
            },
            above60: {
                male: parseNumber(beneficiary.demographics.ageRanges.above60.male),
                female: parseNumber(beneficiary.demographics.ageRanges.above60.female),
                total: parseNumber(beneficiary.demographics.ageRanges.above60.total)
            }
        }
    };

    const getItemId = (item: ListItem): string => {
        return item.id ||
            item.resource_id ||
            item.health_indicator_id ||
            item.domestic_dynamic_id ||
            item.community_participation_id ||
            item.housing_service_id ||
            'unknown';
    };

    const renderListItems = (items: ListItem[] | undefined, title: string) => {
        if (!items || items.length === 0) return null;

        return (
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h4 className="font-medium mb-2 text-sm">{title}</h4>
                <ul className="space-y-1">
                    {items.map((item) => (
                        <li key={getItemId(item)} className="text-xs">
                            • {item.nameEnglish}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const parseSubsidyAmount = (amount: string | number): string => {
        if (typeof amount === 'number') {
            return `LKR ${amount.toLocaleString()}`;
        }
        if (typeof amount === 'string') {
            const parsed = parseFloat(amount);
            return `LKR ${isNaN(parsed) ? '0' : parsed.toLocaleString()}`;
        }
        return 'LKR 0';
    };

    const isEmploymentFacilitation = beneficiary.empowermentDimension?.empowerment_dimension_id === '247029ca-e2fd-4741-aea2-6d22e2fc32b0';
    const isBusinessOpportunities = beneficiary.empowermentDimension?.empowerment_dimension_id === '2edd58f6-8d1e-463a-9f1a-47bbe3f107a0';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            <div className={`rounded-lg shadow-xl w-full max-w-4xl my-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                {/* Fixed Header */}
                <div className={`sticky top-0 z-10 p-4 sm:p-6 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold truncate">Beneficiary Details</h2>
                            <p className={`mt-1 text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {beneficiary.beneficiaryName} - {beneficiary.nic}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`flex-shrink-0 p-2 rounded-full hover:bg-opacity-20 ${theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-300'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Basic Information */}
                    <div>
                        <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Aswasuma Household No</p>
                                <p className="font-medium text-sm truncate">{beneficiary.aswasumaHouseholdNo || 'N/A'}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>NIC</p>
                                <p className="font-medium text-sm truncate">{beneficiary.nic}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                                <p className="font-medium text-sm truncate">{beneficiary.beneficiaryName}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Age</p>
                                <p className="font-medium text-sm">{beneficiary.beneficiaryAge || 'N/A'}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
                                <p className="font-medium text-sm">{beneficiary.beneficiaryGender}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Mobile</p>
                                <p className="font-medium text-sm">{beneficiary.mobilePhone}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Area Classification</p>
                                <p className="font-medium text-sm truncate">{beneficiary.areaClassification || 'N/A'}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Has Disability</p>
                                <p className="font-medium text-sm">{beneficiary.hasDisability ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Consented to Empowerment</p>
                                <p className="font-medium text-sm">{beneficiary.hasConsentedToEmpowerment ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Location Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {beneficiary.location.district && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>District</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.location.district.district_name}</p>
                                </div>
                            )}
                            {beneficiary.location.ds && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>DS Division</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.location.ds.ds_name}</p>
                                </div>
                            )}
                            {beneficiary.location.zone && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Zone</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.location.zone.zone_name}</p>
                                </div>
                            )}
                            {beneficiary.location.gnd && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>GND</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.location.gnd.gnd_name}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-3">
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                            <p className="font-medium text-sm break-words">{beneficiary.address}</p>
                        </div>
                    </div>

                    {/* Family Demographics */}
                    <div>
                        <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Family Demographics
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Family Members</p>
                                <p className="font-medium text-lg">{parsedDemographics.totalFamilyMembers}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Male</p>
                                <p className="font-medium text-sm">{parsedDemographics.totalMale}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Female</p>
                                <p className="font-medium text-sm">{parsedDemographics.totalFemale}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {Object.entries(parsedDemographics.ageRanges).map(([ageRange, data]) => (
                                <div key={ageRange} className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <p className={`text-xs font-medium capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {ageRange.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-base font-bold mt-1">{data.total}</p>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        M: {data.male} | F: {data.female}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project & Employment Information */}
                    <div>
                        <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Project & Employment Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {beneficiary.beneficiaryType && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Beneficiary Type</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.beneficiaryType.nameEnglish}</p>
                                </div>
                            )}
                            {beneficiary.currentEmployment && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Employment</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.currentEmployment.nameEnglish}</p>
                                </div>
                            )}
                            {beneficiary.mainProgram && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Main Program</p>
                                    <p className="font-medium text-sm">{beneficiary.mainProgram}</p>
                                </div>
                            )}
                            {beneficiary.aswasumaCategory && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Aswasuma Category</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.aswasumaCategory.nameEnglish}</p>
                                </div>
                            )}
                            {beneficiary.empowermentDimension && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Empowerment Dimension</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.empowermentDimension.nameEnglish}</p>
                                </div>
                            )}
                            {isEmploymentFacilitation && beneficiary.jobField && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Job Field</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.jobField.nameEnglish}</p>
                                </div>
                            )}
                            {isBusinessOpportunities && beneficiary.livelihood && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Livelihood</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.livelihood.english_name}</p>
                                </div>
                            )}
                            {isBusinessOpportunities && beneficiary.projectType && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Project Type</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.projectType.nameEnglish}</p>
                                </div>
                            )}
                            {beneficiary.samurdhiSubsidy && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Samurdhi Subsidy</p>
                                    <p className="font-medium text-sm">{parseSubsidyAmount(beneficiary.samurdhiSubsidy.amount)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div>
                        <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Financial Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Saving</p>
                                <p className="font-medium text-sm">{beneficiary.monthlySaving ? 'Yes' : 'No'}</p>
                            </div>
                            {beneficiary.savingAmount && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Saving Amount</p>
                                    <p className="font-medium text-sm">LKR {beneficiary.savingAmount.toLocaleString()}</p>
                                </div>
                            )}
                            <div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Other Government Subsidy</p>
                                <p className="font-medium text-sm">{beneficiary.hasOtherGovernmentSubsidy ? 'Yes' : 'No'}</p>
                            </div>
                            {beneficiary.otherGovernmentInstitution && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Other Institution</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.otherGovernmentInstitution}</p>
                                </div>
                            )}
                            {beneficiary.otherSubsidyAmount && (
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Other Subsidy Amount</p>
                                    <p className="font-medium text-sm">LKR {beneficiary.otherSubsidyAmount.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bank Details */}
                    {(beneficiary.bankDetails.commercial || beneficiary.bankDetails.samurdhi || beneficiary.bankDetails.other || beneficiary.bankDetails.wantsAswesumaBankTransfer) && (
                        <div>
                            <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Bank Details
                            </h3>
                            <div className="space-y-3">
                                {beneficiary.bankDetails.commercial && Object.values(beneficiary.bankDetails.commercial).some(Boolean) && (
                                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <h4 className="font-medium mb-2 text-sm">Commercial Bank</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                            {beneficiary.bankDetails.commercial.accountName && (
                                                <p className="truncate">Account Name: {beneficiary.bankDetails.commercial.accountName}</p>
                                            )}
                                            {beneficiary.bankDetails.commercial.accountNumber && (
                                                <p>Account Number: {beneficiary.bankDetails.commercial.accountNumber}</p>
                                            )}
                                            {beneficiary.bankDetails.commercial.bankName && (
                                                <p className="truncate">Bank: {beneficiary.bankDetails.commercial.bankName}</p>
                                            )}
                                            {beneficiary.bankDetails.commercial.branch && (
                                                <p className="truncate">Branch: {beneficiary.bankDetails.commercial.branch}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {beneficiary.bankDetails.wantsAswesumaBankTransfer && (
                                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-100'}`}>
                                        <p className="font-medium text-sm text-green-600">✓ Wants Aswesuma Bank Transfer</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Child Details */}
                    {isEmploymentFacilitation && beneficiary.childDetails && (beneficiary.childDetails.childName || beneficiary.childDetails.childAge || beneficiary.childDetails.childGender) && (
                        <div>
                            <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Child Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {beneficiary.childDetails.childName && (
                                    <div>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Child Name</p>
                                        <p className="font-medium text-sm truncate">{beneficiary.childDetails.childName}</p>
                                    </div>
                                )}
                                {beneficiary.childDetails.childAge && (
                                    <div>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Child Age</p>
                                        <p className="font-medium text-sm">{beneficiary.childDetails.childAge}</p>
                                    </div>
                                )}
                                {beneficiary.childDetails.childGender && (
                                    <div>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Child Gender</p>
                                        <p className="font-medium text-sm">{beneficiary.childDetails.childGender}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* List sections */}
                    {renderListItems(beneficiary.resources as ListItem[], 'Resources')}
                    {renderListItems(beneficiary.healthIndicators as ListItem[], 'Health Indicators')}
                    {renderListItems(beneficiary.domesticDynamics as ListItem[], 'Domestic Dynamics')}
                    {renderListItems(beneficiary.communityParticipations as ListItem[], 'Community Participations')}
                    {renderListItems(beneficiary.housingServices as ListItem[], 'Housing Services')}

                    {/* Created By Information */}
                    {beneficiary.createdBy && (
                        <div>
                            <h3 className={`text-base sm:text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Created By
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Staff Name</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.createdBy.staffName}</p>
                                </div>
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Role</p>
                                    <p className="font-medium text-sm truncate">{beneficiary.createdBy.role}</p>
                                </div>
                                <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Created Date</p>
                                    <p className="font-medium text-sm">{new Date(beneficiary.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Footer */}
                <div className={`sticky bottom-0 p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex justify-end`}>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryDetailsModal;