import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { RefusalReasonItem } from '@/services/refusalReasonsService';

interface RefusalReasonsTableProps {
    data: RefusalReasonItem[];
    totalCount: number;
}

const RefusalReasonsTable: React.FC<RefusalReasonsTableProps> = ({
    data,
    totalCount
}) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    return (
        <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
            <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                <h2 className={`text-lg font-medium ${getTextColor()}`}>Empowerment Refusal Reasons</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Showing {data.length} of {totalCount} refusal records
                </p>
            </div>

            {data.length === 0 ? (
                <div className={`text-center py-12 ${getTextColor()}`}>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">No refusal records found</h3>
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
                                    Name
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Contact Details
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Main Program
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Reason of Refusing
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Created Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {data.map((item, index) => (
                                <tr
                                    key={`${item.nic}-${index}`}
                                    className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                                >
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.location.district?.district_name.split('/').map((part, index) => (
                                            <div key={index}>{part}</div>
                                        )) || 'N/A'}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.location.ds?.ds_name.split('/').map((part, index) => (
                                            <div key={index}>{part}</div>
                                        )) || 'N/A'}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.location.zone?.zone_name.split('/').map((part, index) => (
                                            <div key={index}>{part}</div>
                                        )) || 'N/A'}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.location.gnd?.gnd_name.split('/').map((part, index) => (
                                            <div key={index}>{part}</div>
                                        )) || 'N/A'}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <div className="font-medium">
                                                {item.beneficiaryName?.split(" ").slice(0, 2).join(" ")}
                                            </div>
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                NIC: {item.nic}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            <div className="font-medium">{item.mobilePhone}</div>
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} max-w-xs truncate`}>
                                                {item.address}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.mainProgram === 'NP'
                                                ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                                : item.mainProgram === 'ADB'
                                                    ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                                    : theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {item.mainProgram === 'NP' ? 'National Program' :
                                                item.mainProgram === 'ADB' ? 'ADB Program' :
                                                    'World Bank Program'}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} max-w-xs`}>
                                        <div className="font-medium" title={item.refusalReason.reason_en}>
                                            {item.refusalReason.reason_en}
                                        </div>
                                        {item.refusalReason.reason_si && (
                                            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                සි: {item.refusalReason.reason_si}
                                            </div>
                                        )}
                                        {item.refusalReason.reason_ta && (
                                            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                த: {item.refusalReason.reason_ta}
                                            </div>
                                        )}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
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

export default RefusalReasonsTable;