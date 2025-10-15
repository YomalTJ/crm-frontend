/* eslint-disable @typescript-eslint/no-explicit-any */
// beneficiaryService.ts
'use server'

import { cookies } from 'next/headers';

export interface BeneficiaryDetailsResponseDto {
    id: string;
    aswasumaHouseholdNo?: string;
    nic: string;
    beneficiaryName: string;
    beneficiaryAge?: number;
    beneficiaryGender: string;
    address: string;
    mobilePhone: string;
    telephone?: string;
    projectOwnerName?: string;
    projectOwnerAge?: number;
    projectOwnerGender?: string;
    hasDisability?: boolean;
    hasConsentedToEmpowerment?: boolean;
    isImpactEvaluation?: boolean;
    consentGivenAt?: Date;
    mainProgram?: string;
    areaClassification?: string;
    monthlySaving: boolean;
    savingAmount?: number;
    hasOtherGovernmentSubsidy?: boolean;
    otherGovernmentInstitution?: string;
    otherSubsidyAmount?: number;
    createdAt: Date;

    // Location Information
    location: {
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

    // Family Demographics
    demographics: {
        totalFamilyMembers: number;
        totalMale: number;
        totalFemale: number;
        ageRanges: {
            below16: {
                male: number;
                female: number;
                total: number;
            };
            age16To24: {
                male: number;
                female: number;
                total: number;
            };
            age25To45: {
                male: number;
                female: number;
                total: number;
            };
            age46To60: {
                male: number;
                female: number;
                total: number;
            };
            above60: {
                male: number;
                female: number;
                total: number;
            };
        };
    };

    // Additional Fields from SQL Query
    otherOccupation?: string;
    otherProject?: string;
    otherJobField?: string;
    resource_id?: string[];
    health_indicator_id?: string[];
    domestic_dynamic_id?: string[];
    community_participation_id?: string[];
    housing_service_id?: string[];

    // Child Details
    childDetails?: {
        childName?: string;
        childAge?: number;
        childGender?: string;
    };

    // Bank Details
    bankDetails: {
        commercial?: {
            accountName?: string;
            accountNumber?: string;
            bankName?: string;
            branch?: string;
        };
        samurdhi?: {
            accountName?: string;
            accountNumber?: string;
            bankName?: string;
            accountType?: string;
        };
        other?: {
            bankName?: string;
            branch?: string;
            accountHolder?: string;
            accountNumber?: string;
        };
        wantsAswesumaBankTransfer?: boolean;
    };

    // Related Entities
    beneficiaryType?: {
        beneficiary_type_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };

    disability?: {
        disability_id: number;
        nameEN: string;
        nameSi: string;
        nameTa: string;
    };

    currentEmployment?: {
        employment_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };

    samurdhiSubsidy?: {
        subsisdy_id: string;
        amount: number;
    };

    aswasumaCategory?: {
        aswesuma_cat_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };

    empowermentDimension?: {
        empowerment_dimension_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };

    refusalReason?: {
        id: number;
        reason_si: string;
        reason_en: string;
        reason_ta: string;
    };

    livelihood?: {
        id: number;
        english_name: string;
        sinhala_name: string;
        tamil_name: string;
    };

    projectType?: {
        project_type_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };

    jobField?: {
        job_field_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };

    // Arrays for multiple selections
    resources?: Array<{
        resource_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>;

    healthIndicators?: Array<{
        health_indicator_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>;

    domesticDynamics?: Array<{
        domestic_dynamic_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>;

    communityParticipations?: Array<{
        community_participation_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>;

    housingServices?: Array<{
        housing_service_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>;

    // Created By Information
    createdBy?: {
        staff_id: string;
        staffName: string;
        role: string;
    };
}

export interface BeneficiaryDetailsFilterDto {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: string;
    empowerment_dimension_id?: string;
}

export interface BeneficiaryFilters {
    page?: number;
    limit?: number;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    beneficiaryType?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
}

export interface Beneficiary {
    aswasumaHouseholdNo: string | null;
    id: string;
    beneficiaryName: string;
    nic: string | null;
    mobilePhone: string;
    address: string;
    district: string;
    ds: string;
    zone: string;
    gnd: string;
    beneficiaryType: string;
    currentEmployment: string;
    createdAt: string;
    createdBy: string;
    mainProgram: 'NP' | 'ADB' | 'WB';
}

export interface BeneficiaryResponse {
    data: Beneficiary[];
    meta: {
        total: number;
        page: number;
        last_page: number;
    };
}

export const getBeneficiaries = async (filters: BeneficiaryFilters = {}): Promise<BeneficiaryResponse> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Build query parameters
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.mainProgram) params.append('mainProgram', filters.mainProgram);
        if (filters.beneficiaryType) params.append('beneficiaryType', filters.beneficiaryType);
        if (filters.fromDate) params.append('fromDate', filters.fromDate);
        if (filters.toDate) params.append('toDate', filters.toDate);
        if (filters.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `${baseUrl}/api/beneficiaries${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch beneficiaries');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch beneficiaries');
    }
};

export const deleteBeneficiary = async (id: string): Promise<void> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/beneficiaries/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete beneficiary');
        }
    } catch (error: any) {
        throw new Error(error.message || 'Failed to delete beneficiary');
    }
};

export const getBeneficiaryDetails = async (
    filters: BeneficiaryDetailsFilterDto
): Promise<BeneficiaryDetailsResponseDto[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters.district_id) queryParams.append('district_id', filters.district_id);
        if (filters.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters.gnd_id) queryParams.append('gnd_id', filters.gnd_id);
        if (filters.mainProgram) queryParams.append('mainProgram', filters.mainProgram);
        if (filters.empowerment_dimension_id) queryParams.append('empowerment_dimension_id', filters.empowerment_dimension_id);

        const queryString = queryParams.toString();
        const url = `${baseUrl}/api/beneficiaries/details${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch beneficiary details');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch beneficiary details');
    }
};

export const getBeneficiaryCountsByLocation = async (filters: {
    province_id?: string;
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
}) => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const queryParams = new URLSearchParams();
        if (filters.province_id) queryParams.append('province_id', filters.province_id);
        if (filters.district_id) queryParams.append('district_id', filters.district_id);
        if (filters.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters.gnd_id) queryParams.append('gnd_id', filters.gnd_id);

        const queryString = queryParams.toString();
        const url = `${baseUrl}/api/beneficiaries/counts${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch beneficiary counts');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch beneficiary counts');
    }
};