import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
    getProjectTypesByLivelihood,
    getLivelihoods,
    ProjectType,
    Livelihood
} from '@/services/businessOpportunityService';

const ProjectTypesTable: React.FC = () => {
    const { theme } = useTheme();
    const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
    const [livelihoods, setLivelihoods] = useState<Livelihood[]>([]);
    const [selectedLivelihoodId, setSelectedLivelihoodId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [loadingLivelihoods, setLoadingLivelihoods] = useState(true);

    useEffect(() => {
        fetchLivelihoods();
    }, []);

    useEffect(() => {
        if (selectedLivelihoodId) {
            fetchProjectTypes();
        } else {
            setProjectTypes([]);
        }
    }, [selectedLivelihoodId]);

    const fetchLivelihoods = async () => {
        try {
            setLoadingLivelihoods(true);
            const data = await getLivelihoods();
            setLivelihoods(data);
        } catch (error) {
            console.error('Error fetching livelihoods:', error);
        } finally {
            setLoadingLivelihoods(false);
        }
    };

    const fetchProjectTypes = async () => {
        try {
            setLoading(true);
            const data = await getProjectTypesByLivelihood(selectedLivelihoodId);
            setProjectTypes(data);
        } catch (error) {
            console.error('Error fetching project types:', error);
            setProjectTypes([]);
        } finally {
            setLoading(false);
        }
    };

    const selectClasses = `px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        }`;

    const tableClasses = `min-w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg rounded-lg overflow-hidden`;

    const thClasses = `px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
        }`;

    const tdClasses = `px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
        }`;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'
                    }`}>
                    Select Livelihood to view Project Types:
                </label>
                {loadingLivelihoods ? (
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Loading...
                        </span>
                    </div>
                ) : (
                    <select
                        value={selectedLivelihoodId}
                        onChange={(e) => setSelectedLivelihoodId(e.target.value)}
                        className={selectClasses}
                    >
                        <option value="">-- Select Livelihood --</option>
                        {livelihoods.map((livelihood) => (
                            <option key={livelihood.id} value={livelihood.id.toString()}>
                                {livelihood.english_name} / {livelihood.sinhala_name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {selectedLivelihoodId && (
                <div className={`rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            Project Types for Selected Livelihood
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center">
                            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                Loading project types...
                            </p>
                        </div>
                    ) : projectTypes.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                No project types found for the selected livelihood.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className={tableClasses}>
                                <thead>
                                    <tr>
                                        <th className={thClasses}>ID</th>
                                        <th className={thClasses}>English Name</th>
                                        <th className={thClasses}>සිංහල නම</th>
                                        <th className={thClasses}>தமிழ் பெயர்</th>
                                        <th className={thClasses}>Livelihood</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
                                    }`}>
                                    {projectTypes.map((projectType) => (
                                        <tr key={projectType.project_type_id} className={
                                            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                        }>
                                            <td className={tdClasses}>
                                                <span className="font-mono text-xs">
                                                    {projectType.project_type_id}
                                                </span>
                                            </td>
                                            <td className={tdClasses}>
                                                <div className="font-medium">
                                                    {projectType.nameEnglish}
                                                </div>
                                            </td>
                                            <td className={tdClasses}>
                                                <div className="font-medium">
                                                    {projectType.nameSinhala}
                                                </div>
                                            </td>
                                            <td className={tdClasses}>
                                                <div className="font-medium">
                                                    {projectType.nameTamil}
                                                </div>
                                            </td>
                                            <td className={tdClasses}>
                                                <div className="text-xs">
                                                    <div>{projectType.livelihood.english_name}</div>
                                                    <div className="text-gray-500">
                                                        {projectType.livelihood.sinhala_name}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {!selectedLivelihoodId && (
                <div className={`p-6 rounded-lg border-2 border-dashed ${theme === 'dark'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                    <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Please select a livelihood to view its project types.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProjectTypesTable;