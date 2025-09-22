import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { GrantUtilizationData } from '@/services/grantUtilizationReportsService';

interface GrantUtilizationTableProps {
    data: GrantUtilizationData | null;
}

const GrantUtilizationTable: React.FC<GrantUtilizationTableProps> = ({ data }) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-LK').format(num);
    };

    if (!data) {
        return (
            <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
                <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                    <h2 className={`text-lg font-medium ${getTextColor()}`}>Grant Utilization Statistics</h2>
                </div>
                <div className={`text-center py-12 ${getTextColor()}`}>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">No grant utilization data found</h3>
                    <p className="mt-1 text-sm">Try adjusting your filters.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
            <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                <h2 className={`text-lg font-medium ${getTextColor()}`}>Grant Utilization Statistics</h2>
                {data.location && (
                    <div className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className="flex flex-wrap gap-4">
                            {data.location.district && (
                                <span>
                                    <strong>District:</strong> {data.location.district.district_name}
                                </span>
                            )}
                            {data.location.ds && (
                                <span>
                                    <strong>DS:</strong> {data.location.ds.ds_name}
                                </span>
                            )}
                            {data.location.zone && (
                                <span>
                                    <strong>Zone:</strong> {data.location.zone.zone_name}
                                </span>
                            )}
                            {data.location.gnd && (
                                <span>
                                    <strong>GND:</strong> {data.location.gnd.gnd_name}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Grant Type
                            </th>
                            <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Total Projects
                            </th>
                            <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Total Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {/* Financial Aid Row */}
                        <tr className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className={`text-sm font-medium ${getTextColor()}`}>
                                            Financial Aid
                                        </div>
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            Direct financial assistance
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getTextColor()}`}>
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                                    {formatNumber(data.financialAid.totalProjects)}
                                </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${getTextColor()}`}>
                                <span className={`inline-flex items-center px-3 py-1 rounded-md ${data.financialAid.totalAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                    {formatCurrency(data.financialAid.totalAmount)}
                                </span>
                            </td>
                        </tr>

                        {/* Interest Subsidized Loan Row */}
                        <tr className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className={`text-sm font-medium ${getTextColor()}`}>
                                            Interest Subsidized Loan
                                        </div>
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            Low-interest loan program
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getTextColor()}`}>
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-green-100 text-green-800">
                                    {formatNumber(data.interestSubsidizedLoan.totalProjects)}
                                </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${getTextColor()}`}>
                                <span className={`inline-flex items-center px-3 py-1 rounded-md ${data.interestSubsidizedLoan.totalAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                    {formatCurrency(data.interestSubsidizedLoan.totalAmount)}
                                </span>
                            </td>
                        </tr>

                        {/* Samurdhi Bank Loan Row */}
                        <tr className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className={`text-sm font-medium ${getTextColor()}`}>
                                            Samurdhi Bank Loan
                                        </div>
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            Bank-based loan program
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getTextColor()}`}>
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-purple-100 text-purple-800">
                                    {formatNumber(data.samurdiBankLoan.totalProjects)}
                                </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${getTextColor()}`}>
                                <span className={`inline-flex items-center px-3 py-1 rounded-md ${data.samurdiBankLoan.totalAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                    {formatCurrency(data.samurdiBankLoan.totalAmount)}
                                </span>
                            </td>
                        </tr>

                        {/* Overall Total Row */}
                        <tr className={`${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-50'} font-semibold`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className={`text-sm font-bold ${getTextColor()}`}>
                                            Overall Total
                                        </div>
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            All grant types combined
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${getTextColor()}`}>
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-bold">
                                    {formatNumber(data.overallTotal.totalProjects)}
                                </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${getTextColor()}`}>
                                <span className={`inline-flex items-center px-3 py-1 rounded-md font-bold ${data.overallTotal.totalAmount > 0 ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-500'}`}>
                                    {formatCurrency(data.overallTotal.totalAmount)}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GrantUtilizationTable;