export interface BeneficiaryStatus {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        name: string;
        username: string;
        language: string;
        role: {
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface EmpowermentDimension {
    empowerment_dimension_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        name: string;
        username: string;
        language: string;
        role: {
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface ProjectType {
    project_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface JobField {
    job_field_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface DomesticDynamic {
    domestic_dynamic_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface HousingService {
    housing_service_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface FormData {
    district: { id: string; name: string };
    dsDivision: { id: string; name: string };
    zone: { id: string; name: string };
    gnd: { id: string; name: string };
    mainProgram: string | null;
    hasConsentedToEmpowerment: boolean | null; 
    hasObtainedConsentLetter: boolean | null;
    consentGivenAt: string | null;
    beneficiary_type_id: string | null;
    aswasumaHouseholdNo: string | null;
    nic: string | null;
    beneficiaryName: string | null;
    gender: string | null;
    address: string | null;
    phone: string | null;
    projectOwnerAge: number;
    male18To60: number;
    female18To60: number;
    employment_id: string | null;
    otherOccupation: string | null;
    subsisdy_id: string | null;
    aswesuma_cat_id: string | null;
    empowerment_dimension_id: string | null; // Changed from string[] to string | null
    project_type_id: string | null;
    otherProject: string | null;
    childName: string | null;
    childAge: number;
    childGender: string | null;
    job_field_id: string | null;
    otherJobField: string | null;
    resource_id: string[];
    monthlySaving: boolean;
    savingAmount: number;
    health_indicator_id: string[];
    domestic_dynamic_id: string[];
    community_participation_id: string[];
    housing_service_id: string[];
    areaClassification: 'URBAN' | 'RURAL' | 'ESTATE' | null;
    refusal_reason_id: string | null;
    disability_id: string | null;
    projectOwnerName: string | null;
    projectOwnerGender: string | null;
    commercialBankAccountName: string | null;
    commercialBankAccountNumber: string | null;
    commercialBankName: string | null;
    commercialBankBranch: string | null;
    samurdhiBankAccountName: string | null;
    samurdhiBankAccountNumber: string | null;
    samurdhiBankName: string | null;
    samurdhiBankAccountType: string | null;
}

export interface Resource {
    resource_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface CommunityParticipation {
    community_participation_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}

export interface HealthIndicator {
    health_indicator_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdAt: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        addedBy: null | string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
}