// FundInvestmentTable.tsx
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FundInvestmentSummary } from '@/services/fundInvestmentService';

interface FundInvestmentTableProps {
    data: FundInvestmentSummary[];
    totalCount: number;
}

const FundInvestmentTable: React.FC<FundInvestmentTableProps> = ({
    data,
    totalCount
}) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    // Format currency values
    const formatCurrency = (value: number | undefined) => {
        if (value === undefined || value === null) return 'N/A';
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
            <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                <h2 className={`text-lg font-medium ${getTextColor()}`}>Fund Investment Summary</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Showing {data.length} of {totalCount} records
                </p>
            </div>

            {data.length === 0 ? (
                <div className={`text-center py-12 ${getTextColor()}`}>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">No fund investment records found</h3>
                    <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Beneficiary Name
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    HH Number
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    NIC
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Government Contribution
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Beneficiary Contribution
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Bank Loan
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Other Organization
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Total
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
                                        {item.beneficiaryName}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.hhNumber || 'N/A'}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.nic}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {formatCurrency(item.governmentContribution)}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {formatCurrency(item.beneficiaryContribution)}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {formatCurrency(item.bankLoan)}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {formatCurrency(item.otherOrganizationContribution)}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                        }`}>
                                        {formatCurrency(item.total)}
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

export default FundInvestmentTable;