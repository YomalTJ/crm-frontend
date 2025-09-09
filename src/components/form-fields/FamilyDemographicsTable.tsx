import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FamilyDemographicsItem } from '@/services/familyDemographicsService';
import ProgramBadge from './ProgramBadge';

interface FamilyDemographicsTableProps {
    data: FamilyDemographicsItem[];
    totalCount: number;
    selectedAgeRange: 'below16' | '16To24' | '25To45' | '46To60' | 'above60';
}

const FamilyDemographicsTable: React.FC<FamilyDemographicsTableProps> = ({
    data,
    totalCount,
    selectedAgeRange
}) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    const getAgeRangeLabel = (range: string) => {
        const labels = {
            'below16': 'Below 16',
            '16To24': '16-24',
            '25To45': '25-45',
            '46To60': '46-60',
            'above60': '60+'
        };
        return labels[range as keyof typeof labels];
    };

    return (
        <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
            <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                <h2 className={`text-lg font-medium ${getTextColor()}`}>
                    Family Demographics - Age Group: {getAgeRangeLabel(selectedAgeRange)}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Showing {data.length} of {totalCount} families with members in the selected age range
                </p>
            </div>

            {data.length === 0 ? (
                <div className={`text-center py-12 ${getTextColor()}`}>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">No families found</h3>
                    <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Project Owner Name
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Program
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Total Family Members
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {getAgeRangeLabel(selectedAgeRange)} Members
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Gender (M/F)
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Beneficiary Type
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Location
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {data.map((item, index) => {
                                const ageRangeKeyMap: Record<
                                    'below16' | '16To24' | '25To45' | '46To60' | 'above60',
                                    keyof typeof item.demographics.ageRanges
                                > = {
                                    below16: 'below16',
                                    '16To24': 'age16To24',
                                    '25To45': 'age25To45',
                                    '46To60': 'age46To60',
                                    above60: 'above60'
                                };
                                const ageRangeData = item.demographics.ageRanges[ageRangeKeyMap[selectedAgeRange]];
                                return (
                                    <tr
                                        key={`${item.gnd.gnd_id}-${index}`}
                                        className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {item.projectOwnerName
                                                    ?.split(" ")
                                                    .slice(0, 2)
                                                    .join(" ")}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <ProgramBadge program={item.mainProgram} />
                                        </td>

                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.demographics.totalFamilyMembers} members</span>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {item.demographics.totalMale}M / {item.demographics.totalFemale}F
                                                </span>
                                            </div>
                                        </td>

                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-lg">{ageRangeData.total}</span>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    in age range
                                                </span>
                                            </div>
                                        </td>

                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{ageRangeData.male}M / {ageRangeData.female}F</span>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {ageRangeData.total > 0 ? `${Math.round((ageRangeData.male / ageRangeData.total) * 100)}% male` : 'No data'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.beneficiaryType ? (
                                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    <div className="font-medium">{item.beneficiaryType.nameEnglish}</div>
                                                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {item.beneficiaryType.nameSinhala}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    N/A
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                <div className="font-medium">{item.gnd.gnd_name}</div>
                                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {item.zone.zone_name}, {item.ds.ds_name}
                                                </div>
                                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {item.district.district_name}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FamilyDemographicsTable;