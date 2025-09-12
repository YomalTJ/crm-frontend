import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ProgramCountDto {
    mainProgram: string;
    count: number;
}

interface YearlyProgramCountDto {
    year: number;
    programs: ProgramCountDto[];
}

interface BeneficiaryCountData {
    data: YearlyProgramCountDto[];
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

interface BeneficiaryCountTableProps {
    data: BeneficiaryCountData;
    title: string;
    locationDisplayName: string;
    isLoading?: boolean;
}

const BeneficiaryCountTable: React.FC<BeneficiaryCountTableProps> = ({
    data,
    title,
    locationDisplayName,
    isLoading = false
}) => {
    const { theme } = useTheme();

    // Get all unique programs from the data
    const getAllPrograms = () => {
        const programs = new Set<string>();
        data.data.forEach(yearData => {
            yearData.programs.forEach(program => {
                programs.add(program.mainProgram);
            });
        });
        return Array.from(programs).sort();
    };

    // Get count for a specific year and program
    const getCountForYearAndProgram = (year: number, program: string): number => {
        const yearData = data.data.find(d => d.year === year);
        if (!yearData) return 0;

        const programData = yearData.programs.find(p => p.mainProgram === program);
        return programData?.count || 0;
    };

    // Get total count for a year
    const getTotalForYear = (year: number): number => {
        const yearData = data.data.find(d => d.year === year);
        if (!yearData) return 0;

        return yearData.programs.reduce((total, program) => total + program.count, 0);
    };

    // Get total count for a program across all years
    const getTotalForProgram = (program: string): number => {
        return data.data.reduce((total, yearData) => {
            const programData = yearData.programs.find(p => p.mainProgram === program);
            return total + (programData?.count || 0);
        }, 0);
    };

    // Get grand total
    const getGrandTotal = (): number => {
        return data.data.reduce((total, yearData) => {
            return total + yearData.programs.reduce((yearTotal, program) => yearTotal + program.count, 0);
        }, 0);
    };

    const allPrograms = getAllPrograms();
    const years = data.data.map(d => d.year).sort();

    if (isLoading) {
        return (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="animate-pulse">
                    <div className={`h-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
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

            {data.data.length === 0 ? (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No data available for the selected criteria
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className={`min-w-full ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                    Program
                                </th>
                                {years.map(year => (
                                    <th key={year} className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        {year}
                                    </th>
                                ))}
                                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                            {allPrograms.map((program, index) => (
                                <tr key={program} className={index % 2 === 0
                                    ? (theme === 'dark' ? 'bg-gray-800' : 'bg-white')
                                    : (theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50')
                                }>
                                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {program}
                                    </td>
                                    {years.map(year => (
                                        <td key={year} className={`px-4 py-4 whitespace-nowrap text-sm text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                            }`}>
                                            {getCountForYearAndProgram(year, program).toLocaleString()}
                                        </td>
                                    ))}
                                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-center font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                        }`}>
                                        {getTotalForProgram(program).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {/* Total Row */}
                            <tr className={`border-t-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'}`}>
                                <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Total
                                </td>
                                {years.map(year => (
                                    <td key={year} className={`px-4 py-4 whitespace-nowrap text-sm text-center font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {getTotalForYear(year).toLocaleString()}
                                    </td>
                                ))}
                                <td className={`px-4 py-4 whitespace-nowrap text-sm text-center font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                    }`}>
                                    {getGrandTotal().toLocaleString()}
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

export default BeneficiaryCountTable;