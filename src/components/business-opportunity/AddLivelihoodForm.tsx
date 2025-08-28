import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { createLivelihood, CreateLivelihoodDto } from '@/services/businessOpportunityService';

interface AddLivelihoodFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const AddLivelihoodForm: React.FC<AddLivelihoodFormProps> = ({ onSuccess, onCancel }) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState<CreateLivelihoodDto>({
        english_name: '',
        sinhala_name: '',
        tamil_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<CreateLivelihoodDto>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof CreateLivelihoodDto]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateLivelihoodDto> = {};

        if (!formData.english_name.trim()) {
            newErrors.english_name = 'English name is required';
        } else if (formData.english_name.length > 100) {
            newErrors.english_name = 'English name must be less than 100 characters';
        }

        if (!formData.sinhala_name.trim()) {
            newErrors.sinhala_name = 'Sinhala name is required';
        } else if (formData.sinhala_name.length > 100) {
            newErrors.sinhala_name = 'Sinhala name must be less than 100 characters';
        }

        if (!formData.tamil_name.trim()) {
            newErrors.tamil_name = 'Tamil name is required';
        } else if (formData.tamil_name.length > 100) {
            newErrors.tamil_name = 'Tamil name must be less than 100 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await createLivelihood(formData);
            onSuccess();
            // Reset form
            setFormData({
                english_name: '',
                sinhala_name: '',
                tamil_name: ''
            });
        } catch (error) {
            console.error('Error creating livelihood:', error);
            alert('Failed to create livelihood. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        }`;

    const labelClasses = `block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-700'
        }`;

    return (
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    Add New Livelihood / නව ජීවනෝපාය එකතු කරන්න / புதிய வாழ்வாதாரம் சேர்க்கவும்
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="english_name" className={labelClasses}>
                        English Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="english_name"
                        name="english_name"
                        value={formData.english_name}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Enter English name"
                        maxLength={100}
                    />
                    {errors.english_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.english_name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="sinhala_name" className={labelClasses}>
                        සිංහල නම <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="sinhala_name"
                        name="sinhala_name"
                        value={formData.sinhala_name}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="සිංහල නම ඇතුළත් කරන්න"
                        maxLength={100}
                    />
                    {errors.sinhala_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.sinhala_name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="tamil_name" className={labelClasses}>
                        தமிழ் பெயர் <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="tamil_name"
                        name="tamil_name"
                        value={formData.tamil_name}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="தமிழ் பெயரை உள்ளிடவும்"
                        maxLength={100}
                    />
                    {errors.tamil_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.tamil_name}</p>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                            } text-white`}
                    >
                        {loading ? 'Adding...' : 'Add Livelihood'}
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

export default AddLivelihoodForm;