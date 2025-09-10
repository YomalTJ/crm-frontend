import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AreaTypeItem } from '@/services/areaTypesService';

interface AreaTypesTableProps {
    data: AreaTypeItem[];
    totalCount: number;
}

const AreaTypesTable: React.FC<AreaTypesTableProps> = ({
    data }) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    // Flatten data to create a row for each program
    const flattenedData = data.flatMap(location =>
        location.programs.map(program => ({
            ...location,
            program
        }))
    );

    return (
        <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
            <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                <h2 className={`text-lg font-medium ${getTextColor()}`}>Area Types Statistics</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Showing {flattenedData.length} program statistics across {data.length} locations
                </p>
            </div>

            {flattenedData.length === 0 ? (
                <div className={`text-center py-12 ${getTextColor()}`}>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">No area type statistics found</h3>
                    <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    District
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    DS
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Zone
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    GND
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Main Program
                                </th>
                                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Urban
                                </th>
                                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Rural
                                </th>
                                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Estate
                                </th>
                                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {flattenedData.map((item, index) => (
                                <tr
                                    key={`${item.gnd?.gnd_id || 'no-gnd'}-${item.program.mainProgram}-${index}`}
                                    className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                                >
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.district ? (
                                            item.district.district_name.split('/').map((part, index) => (
                                                <div key={index}>{part}</div>
                                            ))
                                        ) : (
                                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>All Districts</span>
                                        )}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.ds ? (
                                            item.ds.ds_name.split('/').map((part, index) => (
                                                <div key={index}>{part}</div>
                                            ))
                                        ) : (
                                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>All DS</span>
                                        )}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.zone ? (
                                            item.zone.zone_name.split('/').map((part, index) => (
                                                <div key={index}>{part}</div>
                                            ))
                                        ) : (
                                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>All Zones</span>
                                        )}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.gnd ? (
                                            item.gnd.gnd_name.split('/').map((part, index) => (
                                                <div key={index}>{part}</div>
                                            ))
                                        ) : (
                                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>All GNDs</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.program.mainProgram === 'NP' ?
                                                'bg-blue-100 text-blue-800' :
                                                item.program.mainProgram === 'ADB' ?
                                                    'bg-green-100 text-green-800' :
                                                    'bg-purple-100 text-purple-800'
                                            }`}>
                                            {item.program.mainProgram === 'NP' ? 'National Program' :
                                                item.program.mainProgram === 'ADB' ? 'ADB Program' :
                                                    'World Bank Program'}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${item.program.areaTypeCounts.URBAN > 0 ?
                                                'bg-blue-100 text-blue-800' :
                                                theme === 'dark' ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {item.program.areaTypeCounts.URBAN}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${item.program.areaTypeCounts.RURAL > 0 ?
                                                'bg-green-100 text-green-800' :
                                                theme === 'dark' ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {item.program.areaTypeCounts.RURAL}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${item.program.areaTypeCounts.ESTATE > 0 ?
                                                'bg-orange-100 text-orange-800' :
                                                theme === 'dark' ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {item.program.areaTypeCounts.ESTATE}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <span className={`inline-flex items-center justify-center w-10 h-8 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                                            }`}>
                                            {item.program.areaTypeCounts.total}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AreaTypesTable;