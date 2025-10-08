import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface EmpowermentDimensionCountDto {
    empowerment_dimension_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    count: number;
}

interface EmpowermentDimensionCountData {
    counts: EmpowermentDimensionCountDto[];
    location?: {
        district?: {
            district_id: string;
            district_name: string;
        };
        ds?: {
            ds_id: string;
            ds_name: string;
        };
        zone?: {
            zone_id: string;
            zone_name: string;
        };
        gnd?: {
            gnd_id: string;
            gnd_name: string;
        };
    };
}

interface EmpowermentDimensionTableProps {
    data: EmpowermentDimensionCountData;
    title: string;
    locationDisplayName: string;
    isLoading?: boolean;
}

const EmpowermentDimensionTable: React.FC<EmpowermentDimensionTableProps> = ({
    data,
    title,
    locationDisplayName,
    isLoading = false
}) => {
    const { theme } = useTheme();

    // Get total count for all dimensions
    const getTotalCount = (): number => {
        return data.counts.reduce((total, dimension) => total + dimension.count, 0);
    };

    if (isLoading) {
        return (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="animate-pulse">
                    <div className={`h-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {locationDisplayName}
                </p>
            </div>

            {data.counts.length === 0 ? (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No empowerment dimension data available
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className={`min-w-full ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                    Empowerment Dimension
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                    Beneficiary Count
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                    Percentage
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                            {data.counts.map((dimension, index) => {
                                const percentage = getTotalCount() > 0 
                                    ? ((dimension.count / getTotalCount()) * 100).toFixed(1)
                                    : '0.0';
                                
                                return (
                                    <tr key={dimension.empowerment_dimension_id} className={index % 2 === 0
                                        ? (theme === 'dark' ? 'bg-gray-800' : 'bg-white')
                                        : (theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50')
                                    }>
                                        <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {dimension.nameEnglish}
                                        </td>
                                        <td className={`px-4 py-4 whitespace-nowrap text-sm text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                            }`}>
                                            {dimension.count.toLocaleString()}
                                        </td>
                                        <td className={`px-4 py-4 whitespace-nowrap text-sm text-center font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                            }`}>
                                            {percentage}%
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* Total Row */}
                            <tr className={`border-t-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'}`}>
                                <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Total
                                </td>
                                <td className={`px-4 py-4 whitespace-nowrap text-sm text-center font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {getTotalCount().toLocaleString()}
                                </td>
                                <td className={`px-4 py-4 whitespace-nowrap text-sm text-center font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                    }`}>
                                    100%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Location Details (if available) */}
            {/* {data.location && (
                <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Location Details:
                    </h4>
                    <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {data.location.district && (
                            <div>District: {data.location.district.district_name}</div>
                        )}
                        {data.location.ds && (
                            <div>DS Division: {data.location.ds.ds_name}</div>
                        )}
                        {data.location.zone && (
                            <div>Zone: {data.location.zone.zone_name}</div>
                        )}
                        {data.location.gnd && (
                            <div>GND: {data.location.gnd.gnd_name}</div>
                        )}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default EmpowermentDimensionTable;