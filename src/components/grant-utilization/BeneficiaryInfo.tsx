import React from 'react';
import { BeneficiaryDetailsResponse } from './types';

interface BeneficiaryInfoProps {
    beneficiaryData: BeneficiaryDetailsResponse;
    theme: string;
    t: (key: string) => string;
    getBorderColor: () => string;
    getTextColor: () => string;
}

const BeneficiaryInfo: React.FC<BeneficiaryInfoProps> = ({
    beneficiaryData,
    t,
    getBorderColor,
    getTextColor
}) => {
    return (
        <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 ${getBorderColor()} border`}>
            <h3 className={`font-semibold mb-2 ${getTextColor()}`}>{t('grantUtilization.beneficiaryInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">
                <div>
                    <span className="font-medium">{t('grantUtilization.name')}:</span> {beneficiaryData.beneficiaryDetails.name}
                </div>
                <div>
                    <span className="font-medium">{t('grantUtilization.hhNumber')}:</span> {beneficiaryData.householdNumber}
                </div>
                <div>
                    <span className="font-medium">{t('grantUtilization.address')}:</span> {beneficiaryData.address}
                </div>
                <div>
                    <span className="font-medium">{t('grantUtilization.program')}:</span> {beneficiaryData.mainProgram}
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryInfo;