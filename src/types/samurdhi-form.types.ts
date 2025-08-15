export interface LocationData {
    id: string;
    name: string;
}

export interface FormData {
    district: LocationData;
    dsDivision: LocationData;
    zone: LocationData;
    gnd: LocationData;
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
    empowerment_dimension_id: string | null;
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
    areaClassification: string | null;
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

export interface FormErrors {
    [key: string]: string;
}

export interface FormOptions {
    employmentOptions: Array<{
        employment_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>;
    subsidyOptions: Array<{
        subsisdy_id: string;
        amount: string;
    }>;
    aswasumaCategories: Array<{
        aswesuma_cat_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    }>;
    refusalReasons: Array<{
        id: string;
        reason_en: string;
        reason_si: string;
        reason_ta: string;
    }>;
    disabilities: Array<{
        disabilityId: string;
        nameEN: string;
        nameSi: string;
        nameTa: string;
    }>;
    jobFields: JobField[];
    projectTypes: ProjectType[];
    resourcesNeeded: Resource[];
    healthIndicators: HealthIndicator[];
    domesticDynamics: DomesticDynamic[];
    communityParticipationOptions: CommunityParticipation[];
    housingServices: HousingService[];
    beneficiaryStatuses: BeneficiaryStatus[];
    empowermentDimensions: EmpowermentDimension[];
}

export interface FormState {
    isInitialLoading: boolean;
    isFetching: boolean;
    isSubmitting: boolean;
    isFormResetting: boolean;
    isLoadingHouseholdNumbers: boolean;
    isExistingBeneficiary: boolean;
    isAswasumaHouseholdDisabled: boolean;
    showAllFieldsForExistingBeneficiary: boolean;
    householdNumbers: string[];
    errors: FormErrors;
}

// Import existing interfaces from the original file
export interface BeneficiaryStatus {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface CommunityParticipation {
    community_participation_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface DomesticDynamic {
    domestic_dynamic_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface EmpowermentDimension {
    empowerment_dimension_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface HealthIndicator {
    health_indicator_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface HousingService {
    housing_service_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface JobField {
    job_field_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface ProjectType {
    project_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export interface Resource {
    resource_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
}

export const MAIN_PROGRAM_OPTIONS = [
    { value: 'NP', label: 'National Program' },
    { value: 'ADB', label: 'ADB Program' },
    { value: 'WB', label: 'World Bank Program' }
];