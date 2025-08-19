export interface FormErrors {
    amount?: string;
    grantDate?: string;
    purchaseDate?: string;
    projectStartDate?: string;
    courseStartDate?: string;
    courseEndDate?: string;
    [key: string]: string | undefined;
}

export interface GrantUtilizationPayload {
    hhNumberOrNic: string;
    amount: number;
    grantDate: string;
    purchaseDate?: string | null; // Made optional to match service
    equipmentPurchased?: string | null; // Made optional to match service
    animalsPurchased?: string | null; // Made optional to match service
    plantsPurchased?: string | null; // Made optional to match service
    othersPurchased?: string | null; // Made optional to match service
    projectStartDate?: string | null; // Made optional to match service
    employmentOpportunities?: string | null; // Made optional to match service
    traineeName?: string | null; // Made optional to match service
    traineeAge?: number | null; // Made optional to match service
    traineeGender?: string | null; // Made optional to match service
    courseName?: string | null; // Made optional to match service
    institutionName?: string | null; // Made optional to match service
    courseFee?: number | null; // Made optional to match service
    courseDuration?: string | null; // Made optional to match service
    courseStartDate?: string | null; // Made optional to match service
    courseEndDate?: string | null; // Made optional to match service
}

export interface BeneficiaryDetailsResponse {
    beneficiaryDetails: {
        name: string;
    };
    householdNumber: string;
    address: string;
    mainProgram: string;
    location: LocationDetails;
}

export interface LocationDetails {
    district?: {
        id: number; // Changed from string to number
        name: string;
    };
    divisionalSecretariat?: {
        id: number; // Changed from string to number
        name: string;
    };
    samurdhiBank?: {
        id: number; // Changed from string to number
        name: string;
    };
    gramaNiladhariDivision?: {
        id: string; // This remains string as it's different in the backend
        name: string;
    };
}

export interface AccessibleLocations {
    districts: Array<{ id: number; name: string }>; // Changed from string to number
    divisionalSecretariats: Array<{ id: number; name: string }>; // Changed from string to number
    samurdhiBanks: Array<{ id: number; name: string }>; // Changed from string to number
    gramaNiladhariDivisions: Array<{ id: string; name: string }>;
}