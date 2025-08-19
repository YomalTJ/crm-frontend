/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GrantUtilizationPayload, FormErrors } from './types';

interface LivelihoodSectionProps {
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

const LivelihoodSection: React.FC<LivelihoodSectionProps> = ({
    formData,
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
                {t('grantUtilization.livelihoodInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.purchaseDate')}
                    </label>
                    <CustomDatePicker
                        value={formData.purchaseDate || ''}
                        onChange={(value: string) => handleInputChange('purchaseDate', value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.projectStartDate')}
                    </label>
                    <CustomDatePicker
                        value={formData.projectStartDate || ''}
                        onChange={(value: string) => handleInputChange('projectStartDate', value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.equipmentPurchased')}
                    </label>
                    <input
                        type="text"
                        value={formData.equipmentPurchased || ''}
                        onChange={(e) => handleInputChange('equipmentPurchased', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterEquipment')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.animalsPurchased')}
                    </label>
                    <input
                        type="text"
                        value={formData.animalsPurchased || ''}
                        onChange={(e) => handleInputChange('animalsPurchased', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterAnimals')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.plantsPurchased')}
                    </label>
                    <input
                        type="text"
                        value={formData.plantsPurchased || ''}
                        onChange={(e) => handleInputChange('plantsPurchased', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterPlants')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.othersPurchased')}
                    </label>
                    <input
                        type="text"
                        value={formData.othersPurchased || ''}
                        onChange={(e) => handleInputChange('othersPurchased', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterOthers')}
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                    {t('grantUtilization.employmentOpportunities')}
                </label>
                <textarea
                    value={formData.employmentOpportunities || ''}
                    onChange={(e) => handleInputChange('employmentOpportunities', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                    placeholder={t('grantUtilization.employmentOpportunities')}
                />
            </div>
        </div>
    );
};

export default LivelihoodSection;