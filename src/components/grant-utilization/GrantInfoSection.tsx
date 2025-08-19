/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GrantUtilizationPayload, FormErrors } from './types';

interface GrantInfoSectionProps {
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

const GrantInfoSection: React.FC<GrantInfoSectionProps> = ({
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
                {t('grantUtilization.grantInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.amount')} *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()} ${errors.amount ? 'border-red-500' : ''
                            }`}
                        placeholder={t('grantUtilization.enterAmount')}
                    />
                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                    )}
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.grantDate')} *
                    </label>
                    <CustomDatePicker
                        value={formData.grantDate}
                        onChange={(value: string) => handleInputChange('grantDate', value)}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()} ${errors.grantDate ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.grantDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.grantDate}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GrantInfoSection;