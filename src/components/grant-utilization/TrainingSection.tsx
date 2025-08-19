/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GrantUtilizationPayload, FormErrors } from './types';

interface TrainingSectionProps {
    formData: GrantUtilizationPayload;
    errors: FormErrors;
    handleInputChange: (field: keyof GrantUtilizationPayload, value: string | number | null | undefined) => void;
    theme: string;
    t: (key: string) => string;
    getBorderColor: () => string;
    getInputBgColor: () => string;
    getLabelColor: () => string;
    CustomDatePicker: React.FC<any>;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({
    formData,
    errors,
    handleInputChange,
    theme,
    t,
    getBorderColor,
    getInputBgColor,
    getLabelColor,
    CustomDatePicker
}) => {
    return (
        <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {t('grantUtilization.trainingInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.traineeName')}
                    </label>
                    <input
                        type="text"
                        value={formData.traineeName || ''}
                        onChange={(e) => handleInputChange('traineeName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterTraineeName')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.traineeAge')}
                    </label>
                    <input
                        type="number"
                        value={formData.traineeAge ?? ''}
                        onChange={(e) => handleInputChange('traineeAge', e.target.value ? parseInt(e.target.value) : null)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()} ${errors.traineeAge ? 'border-red-500' : ''
                            }`}
                        placeholder={t('grantUtilization.enterAge')}
                    />
                    {errors.traineeAge && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.traineeAge}</p>
                    )}
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.traineeGender')}
                    </label>
                    <select
                        value={formData.traineeGender || ''}
                        onChange={(e) => handleInputChange('traineeGender', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                    >
                        <option value="">{t('grantUtilization.selectGender')}</option>
                        <option value="Male">{t('grantUtilization.male')}</option>
                        <option value="Female">{t('grantUtilization.female')}</option>
                        <option value="Other">{t('grantUtilization.other')}</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.courseName')}
                    </label>
                    <input
                        type="text"
                        value={formData.courseName || ''}
                        onChange={(e) => handleInputChange('courseName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterCourseName')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.institutionName')}
                    </label>
                    <input
                        type="text"
                        value={formData.institutionName || ''}
                        onChange={(e) => handleInputChange('institutionName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterInstitution')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.courseFee')}
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.courseFee ?? ''}
                        onChange={(e) => handleInputChange('courseFee', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterCourseFee')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.courseDuration')}
                    </label>
                    <input
                        type="text"
                        value={formData.courseDuration ?? ''}
                        onChange={(e) => handleInputChange('courseDuration', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterDuration')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.courseStartDate')}
                    </label>
                    <CustomDatePicker
                        value={formData.courseStartDate || ''}
                        onChange={(value: string) => handleInputChange('courseStartDate', value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()} ${errors.courseStartDate ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.courseStartDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.courseStartDate}</p>
                    )}
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.courseEndDate')}
                    </label>
                    <CustomDatePicker
                        value={formData.courseEndDate || ''}
                        onChange={(value: string) => handleInputChange('courseEndDate', value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()} ${errors.courseEndDate ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.courseEndDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.courseEndDate}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingSection;