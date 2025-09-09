import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ProjectOwnerItem } from '@/services/projectOwnersService';

interface ProjectOwnersTableProps {
    data: (ProjectOwnerItem & { action?: React.ReactNode })[];
    totalCount: number;
    showActionColumn?: boolean;
}

const ProjectOwnersTable: React.FC<ProjectOwnersTableProps> = ({
    data,
    totalCount,
    showActionColumn = false
}) => {
    const { theme } = useTheme();

    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    return (
        <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
            <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                <h2 className={`text-lg font-medium ${getTextColor()}`}>Project Owners Details</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Showing {data.length} of {totalCount} project owners
                </p>
            </div>

            {data.length === 0 ? (
                <div className={`text-center py-12 ${getTextColor()}`}>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">No project owners found</h3>
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
                                    Address
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Tel Number
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Empowerment Way
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Main Program
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Sub Program
                                </th>
                                {showActionColumn && (
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {data.map((item, index) => (
                                <tr
                                    key={`${item.gnd.gnd_id}-${index}`}
                                    className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                                >
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.district.district_name}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.ds.ds_name}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.zone.zone_name}
                                    </td>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {item.gnd.gnd_name}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <div className="font-medium">
                                                {item.beneficiaryName?.split(" ").slice(0, 2).join(" ")}
                                            </div>
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Owner: {item.projectOwnerName?.split(" ").slice(0, 2).join(" ")}
                                                ({item.projectOwnerAge}y, {item.projectOwnerGender})
                                            </div>
                                        </div>
                                    </td>

                                    <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} max-w-xs truncate`}>
                                        <div title={item.address}>{item.address}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            <div className="font-medium">{item.mobilePhone}</div>
                                            {item.telephone && (
                                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {item.telephone}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            <div className="font-medium">{item.empowermentDimension?.nameEnglish}</div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            {item.livelihood?.english_name}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {item.projectType?.nameEnglish}
                                        </div>
                                    </td>

                                    {showActionColumn && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {item.action}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProjectOwnersTable;