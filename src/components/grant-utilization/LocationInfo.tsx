import React from 'react';
import { BeneficiaryDetailsResponse } from './types';

interface LocationInfoProps {
    beneficiaryData: BeneficiaryDetailsResponse | null;
    theme: string;
    t: (key: string) => string;
    getBorderColor: () => string;
    getLabelColor: () => string;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
    beneficiaryData,
    theme,
    t,
    getBorderColor,
    getLabelColor
}) => {
    return (
        <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {t('grantUtilization.locationInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* District */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.district')}
                    </label>
                    <input
                        type="text"
                        value={beneficiaryData?.location.district?.name || ''}
                        readOnly
                        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${getBorderColor()}`}
                    />
                    <input
                        type="hidden"
                        value={beneficiaryData?.location.district?.id || ''}
                        name="districtId"
                    />
                </div>

                {/* Divisional Secretariat */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.divisionalSecretariat')}
                    </label>
                    <input
                        type="text"
                        value={beneficiaryData?.location.divisionalSecretariat?.name || ''}
                        readOnly
                        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${getBorderColor()}`}
                    />
                    <input
                        type="hidden"
                        value={beneficiaryData?.location.divisionalSecretariat?.id || ''}
                        name="dsId"
                    />
                </div>

                {/* Samurdhi Bank (Zone) */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.samurdhiBank')}
                    </label>
                    <input
                        type="text"
                        value={beneficiaryData?.location.samurdhiBank?.name || ''}
                        readOnly
                        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${getBorderColor()}`}
                    />
                    <input
                        type="hidden"
                        value={beneficiaryData?.location.samurdhiBank?.id || ''}
                        name="zoneId"
                    />
                </div>

                {/* GN Division */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${getLabelColor()}`}>
                        {t('grantUtilization.gnDivision')}
                    </label>
                    <input
                        type="text"
                        value={beneficiaryData?.location.gramaNiladhariDivision?.name || ''}
                        readOnly
                        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${getBorderColor()}`}
                    />
                    <input
                        type="hidden"
                        value={beneficiaryData?.location.gramaNiladhariDivision?.id || ''}
                        name="gndId"
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationInfo;