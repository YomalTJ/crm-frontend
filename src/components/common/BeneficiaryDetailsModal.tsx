'use client'

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { BeneficiaryDetailsResponseDto } from '@/services/benficiaryService';

interface BeneficiaryDetailsModalProps {
    beneficiary: BeneficiaryDetailsResponseDto | null;
    isOpen: boolean;
    onClose: () => void;
}

// Interface for list items with different ID field names
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

    // Helper function to parse string numbers to integers
    const parseNumber = (value: string | number): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            // Remove leading zeros and parse
            const parsed = parseInt(value.replace(/^0+/, '') || '0');
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // Parse demographics data
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

    // Helper function to get the ID from any list item
    const getItemId = (item: ListItem): string => {
        return item.id ||
            item.resource_id ||
            item.health_indicator_id ||
            item.domestic_dynamic_id ||
            item.community_participation_id ||
            item.housing_service_id ||
            'unknown';
    };

    // Helper function to render list items
    const renderListItems = (items: ListItem[] | undefined, title: string) => {
        if (!items || items.length === 0) return null;

        return (
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h4 className="font-medium mb-2">{title}</h4>
                <ul className="space-y-1">
                    {items.map((item) => (
                        <li key={getItemId(item)} className="text-sm">
                            • {item.nameEnglish}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Helper function to parse subsidy amount (handle string or number)
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

    // Check empowerment dimension type
    const isEmploymentFacilitation = beneficiary.empowermentDimension?.empowerment_dimension_id === '247029ca-e2fd-4741-aea2-6d22e2fc32b0';
    const isBusinessOpportunities = beneficiary.empowermentDimension?.empowerment_dimension_id === '2edd58f6-8d1e-463a-9f1a-47bbe3f107a0';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                {/* Header */}
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Beneficiary Details</h2>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full hover:bg-opacity-20 ${theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-300'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {beneficiary.beneficiaryName} - {beneficiary.nic}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Aswasuma Household No</p>
                                <p className="font-medium">{beneficiary.aswasumaHouseholdNo || 'N/A'}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>NIC</p>
                                <p className="font-medium">{beneficiary.nic}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                                <p className="font-medium">{beneficiary.beneficiaryName}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Age</p>
                                <p className="font-medium">{beneficiary.beneficiaryAge || 'N/A'}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
                                <p className="font-medium">{beneficiary.beneficiaryGender}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Mobile</p>
                                <p className="font-medium">{beneficiary.mobilePhone}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Area Classification</p>
                                <p className="font-medium">{beneficiary.areaClassification || 'N/A'}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Has Disability</p>
                                <p className="font-medium">{beneficiary.hasDisability ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Consented to Empowerment</p>
                                <p className="font-medium">{beneficiary.hasConsentedToEmpowerment ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Location Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {beneficiary.location.district && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>District</p>
                                    <p className="font-medium">{beneficiary.location.district.district_name}</p>
                                </div>
                            )}
                            {beneficiary.location.ds && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>DS Division</p>
                                    <p className="font-medium">{beneficiary.location.ds.ds_name}</p>
                                </div>
                            )}
                            {beneficiary.location.zone && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Zone</p>
                                    <p className="font-medium">{beneficiary.location.zone.zone_name}</p>
                                </div>
                            )}
                            {beneficiary.location.gnd && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>GND</p>
                                    <p className="font-medium">{beneficiary.location.gnd.gnd_name}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                            <p className="font-medium">{beneficiary.address}</p>
                        </div>
                    </div>

                    {/* Family Demographics */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Family Demographics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Family Members</p>
                                <p className="font-medium text-xl">{parsedDemographics.totalFamilyMembers}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Male</p>
                                <p className="font-medium">{parsedDemographics.totalMale}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Female</p>
                                <p className="font-medium">{parsedDemographics.totalFemale}</p>
                            </div>
                        </div>

                        {/* Age Ranges */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Object.entries(parsedDemographics.ageRanges).map(([ageRange, data]) => (
                                <div key={ageRange} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <p className={`text-sm font-medium capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {ageRange.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-lg font-bold mt-1">{data.total}</p>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        M: {data.male} | F: {data.female}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project & Employment Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Project & Employment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {beneficiary.beneficiaryType && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Beneficiary Type</p>
                                    <p className="font-medium">{beneficiary.beneficiaryType.nameEnglish}</p>
                                </div>
                            )}
                            {beneficiary.currentEmployment && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Employment</p>
                                    <p className="font-medium">{beneficiary.currentEmployment.nameEnglish}</p>
                                </div>
                            )}
                            {beneficiary.mainProgram && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Main Program</p>
                                    <p className="font-medium">{beneficiary.mainProgram}</p>
                                </div>
                            )}
                            {beneficiary.aswasumaCategory && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Aswasuma Category</p>
                                    <p className="font-medium">{beneficiary.aswasumaCategory.nameEnglish}</p>
                                </div>
                            )}
                            {beneficiary.empowermentDimension && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Empowerment Dimension</p>
                                    <p className="font-medium">{beneficiary.empowermentDimension.nameEnglish}</p>
                                </div>
                            )}

                            {/* Show Job Field only for Employment Facilitation */}
                            {isEmploymentFacilitation && beneficiary.jobField && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Job Field</p>
                                    <p className="font-medium">{beneficiary.jobField.nameEnglish}</p>
                                </div>
                            )}

                            {/* Show Livelihood and Project Type only for Business Opportunities */}
                            {isBusinessOpportunities && beneficiary.livelihood && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Livelihood</p>
                                    <p className="font-medium">{beneficiary.livelihood.english_name}</p>
                                </div>
                            )}
                            {isBusinessOpportunities && beneficiary.projectType && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Project Type</p>
                                    <p className="font-medium">{beneficiary.projectType.nameEnglish}</p>
                                </div>
                            )}

                            {beneficiary.samurdhiSubsidy && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Samurdhi Subsidy</p>
                                    <p className="font-medium">{parseSubsidyAmount(beneficiary.samurdhiSubsidy.amount)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Financial Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Saving</p>
                                <p className="font-medium">{beneficiary.monthlySaving ? 'Yes' : 'No'}</p>
                            </div>
                            {beneficiary.savingAmount && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Saving Amount</p>
                                    <p className="font-medium">LKR {beneficiary.savingAmount.toLocaleString()}</p>
                                </div>
                            )}
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Other Government Subsidy</p>
                                <p className="font-medium">{beneficiary.hasOtherGovernmentSubsidy ? 'Yes' : 'No'}</p>
                            </div>
                            {beneficiary.otherGovernmentInstitution && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Other Institution</p>
                                    <p className="font-medium">{beneficiary.otherGovernmentInstitution}</p>
                                </div>
                            )}
                            {beneficiary.otherSubsidyAmount && (
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Other Subsidy Amount</p>
                                    <p className="font-medium">LKR {beneficiary.otherSubsidyAmount.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bank Details */}
                    {(beneficiary.bankDetails.commercial || beneficiary.bankDetails.samurdhi || beneficiary.bankDetails.other || beneficiary.bankDetails.wantsAswesumaBankTransfer) && (
                        <div>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Bank Details
                            </h3>
                            <div className="space-y-4">
                                {beneficiary.bankDetails.commercial && Object.values(beneficiary.bankDetails.commercial).some(Boolean) && (
                                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <h4 className="font-medium mb-2">Commercial Bank</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            {beneficiary.bankDetails.commercial.accountName && (
                                                <p>Account Name: {beneficiary.bankDetails.commercial.accountName}</p>
                                            )}
                                            {beneficiary.bankDetails.commercial.accountNumber && (
                                                <p>Account Number: {beneficiary.bankDetails.commercial.accountNumber}</p>
                                            )}
                                            {beneficiary.bankDetails.commercial.bankName && (
                                                <p>Bank: {beneficiary.bankDetails.commercial.bankName}</p>
                                            )}
                                            {beneficiary.bankDetails.commercial.branch && (
                                                <p>Branch: {beneficiary.bankDetails.commercial.branch}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {beneficiary.bankDetails.wantsAswesumaBankTransfer && (
                                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-100'}`}>
                                        <p className="font-medium text-green-600">✓ Wants Aswesuma Bank Transfer</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Child Details - Only show for Employment Facilitation */}
                    {isEmploymentFacilitation && beneficiary.childDetails && (beneficiary.childDetails.childName || beneficiary.childDetails.childAge || beneficiary.childDetails.childGender) && (
                        <div>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Child Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {beneficiary.childDetails.childName && (
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Child Name</p>
                                        <p className="font-medium">{beneficiary.childDetails.childName}</p>
                                    </div>
                                )}
                                {beneficiary.childDetails.childAge && (
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Child Age</p>
                                        <p className="font-medium">{beneficiary.childDetails.childAge}</p>
                                    </div>
                                )}
                                {beneficiary.childDetails.childGender && (
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Child Gender</p>
                                        <p className="font-medium">{beneficiary.childDetails.childGender}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resources */}
                    {renderListItems(beneficiary.resources as ListItem[], 'Resources')}

                    {/* Health Indicators */}
                    {renderListItems(beneficiary.healthIndicators as ListItem[], 'Health Indicators')}

                    {/* Domestic Dynamics */}
                    {renderListItems(beneficiary.domesticDynamics as ListItem[], 'Domestic Dynamics')}

                    {/* Community Participations */}
                    {renderListItems(beneficiary.communityParticipations as ListItem[], 'Community Participations')}

                    {/* Housing Services */}
                    {renderListItems(beneficiary.housingServices as ListItem[], 'Housing Services')}

                    {/* Created By Information */}
                    {beneficiary.createdBy && (
                        <div>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Created By
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Staff Name</p>
                                    <p className="font-medium">{beneficiary.createdBy.staffName}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Role</p>
                                    <p className="font-medium">{beneficiary.createdBy.role}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Created Date</p>
                                    <p className="font-medium">{new Date(beneficiary.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryDetailsModal;