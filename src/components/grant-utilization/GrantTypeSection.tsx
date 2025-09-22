/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GrantUtilizationPayload, FormErrors } from './types';

interface GrantTypeSectionProps {
    formData: GrantUtilizationPayload;
    errors: FormErrors;
    handleInputChange: (field: keyof GrantUtilizationPayload, value: string | number | null | undefined) => void;
    theme: string;
    t: (key: string) => string;
    getBorderColor: () => string;
    getInputBgColor: () => string;
    getLabelColor: () => string;
}

const GrantTypeSection: React.FC<GrantTypeSectionProps> = ({
    formData,
    handleInputChange,
    theme,
    t,
    getBorderColor,
    getInputBgColor,
    getLabelColor
}) => {
    return (
        <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {t('grantUtilization.grantTypeBreakdown')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.financialAid')}
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.financialAid ?? ''}
                        onChange={(e) => handleInputChange('financialAid', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterFinancialAid')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.interestSubsidizedLoan')}
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.interestSubsidizedLoan ?? ''}
                        onChange={(e) => handleInputChange('interestSubsidizedLoan', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterSubsidizedLoan')}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.samurdiBankLoan')}
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.samurdiBankLoan ?? ''}
                        onChange={(e) => handleInputChange('samurdiBankLoan', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getBorderColor()} ${getInputBgColor()}`}
                        placeholder={t('grantUtilization.enterBankLoan')}
                    />
                </div>
            </div>
        </div>
    );
};

export default GrantTypeSection;