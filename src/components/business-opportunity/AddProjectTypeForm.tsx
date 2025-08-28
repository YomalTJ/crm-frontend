import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
    createProjectType,
    getLivelihoods,
    CreateProjectTypeDto,
    Livelihood
} from '@/services/businessOpportunityService';

interface AddProjectTypeFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const AddProjectTypeForm: React.FC<AddProjectTypeFormProps> = ({ onSuccess, onCancel }) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState<CreateProjectTypeDto>({
        nameEnglish: '',
        nameSinhala: '',
        nameTamil: '',
        livelihoodId: ''
    });
    const [livelihoods, setLivelihoods] = useState<Livelihood[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingLivelihoods, setLoadingLivelihoods] = useState(true);
    const [errors, setErrors] = useState<Partial<CreateProjectTypeDto>>({});

    useEffect(() => {
        fetchLivelihoods();
    }, []);

    const fetchLivelihoods = async () => {
        try {
            setLoadingLivelihoods(true);
            const data = await getLivelihoods();
            setLivelihoods(data);
        } catch (error) {
            console.error('Error fetching livelihoods:', error);
            alert('Failed to load livelihoods. Please refresh the page.');
        } finally {
            setLoadingLivelihoods(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing/selecting
        if (errors[name as keyof CreateProjectTypeDto]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateProjectTypeDto> = {};

        if (!formData.nameEnglish.trim()) {
            newErrors.nameEnglish = 'English name is required';
        }

        if (!formData.nameSinhala.trim()) {
            newErrors.nameSinhala = 'Sinhala name is required';
        }

        if (!formData.nameTamil.trim()) {
            newErrors.nameTamil = 'Tamil name is required';
        }

        if (!formData.livelihoodId) {
            newErrors.livelihoodId = 'Livelihood selection is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await createProjectType(formData);
            onSuccess();
            // Reset form
            setFormData({
                nameEnglish: '',
                nameSinhala: '',
                nameTamil: '',
                livelihoodId: ''
            });
        } catch (error) {
            console.error('Error creating project type:', error);
            alert('Failed to create project type. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        }`;

    const selectClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        }`;

    const labelClasses = `block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-700'
        }`;

    return (
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    Add New Project Type / නව ව්‍යාපෘති වර්ගය එකතු කරන්න / புதிய திட்ட வகையை சேர்க்கவும்
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="livelihoodId" className={labelClasses}>
                        Select Livelihood / ජීවනෝපාය තෝරන්න / வாழ்வாதாரத்தை தேர்ந்தெடுக்கவும் <span className="text-red-500">*</span>
                    </label>
                    {loadingLivelihoods ? (
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                Loading livelihoods...
                            </p>
                        </div>
                    ) : (
                        <select
                            id="livelihoodId"
                            name="livelihoodId"
                            value={formData.livelihoodId}
                            onChange={handleInputChange}
                            className={selectClasses}
                        >
                            <option value="">Select a livelihood</option>
                            {livelihoods.map((livelihood) => (
                                <option key={livelihood.id} value={livelihood.id.toString()}>
                                    {livelihood.english_name} / {livelihood.sinhala_name} / {livelihood.tamil_name}
                                </option>
                            ))}
                        </select>
                    )}
                    {errors.livelihoodId && (
                        <p className="text-red-500 text-sm mt-1">{errors.livelihoodId}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="nameEnglish" className={labelClasses}>
                        English Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nameEnglish"
                        name="nameEnglish"
                        value={formData.nameEnglish}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Enter English name"
                    />
                    {errors.nameEnglish && (
                        <p className="text-red-500 text-sm mt-1">{errors.nameEnglish}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="nameSinhala" className={labelClasses}>
                        සිංහල නම <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nameSinhala"
                        name="nameSinhala"
                        value={formData.nameSinhala}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="සිංහල නම ඇතුළත් කරන්න"
                    />
                    {errors.nameSinhala && (
                        <p className="text-red-500 text-sm mt-1">{errors.nameSinhala}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="nameTamil" className={labelClasses}>
                        தமிழ் பெயர் <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nameTamil"
                        name="nameTamil"
                        value={formData.nameTamil}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="தமிழ் பெயரை உள்ளிடவும்"
                    />
                    {errors.nameTamil && (
                        <p className="text-red-500 text-sm mt-1">{errors.nameTamil}</p>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || loadingLivelihoods}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${loading || loadingLivelihoods
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                            } text-white`}
                    >
                        {loading ? 'Adding...' : 'Add Project Type'}
                    </button>

                    <button
                        onClick={onCancel}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${theme === 'dark'
                                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProjectTypeForm;