export interface UserLocationDetails {
    provinceId: number;
    district: { id: number; name: string } | null;
    dsDivision: { id: number; name: string } | null;
    zone: { id: number; name: string } | null;
    gnd: { id: string; name: string } | null;
}

// This function is deprecated - use getAccessibleLocations from the service instead
export const getUserLocationDetails = (): UserLocationDetails | null => {
    console.warn('getUserLocationDetails is deprecated. Use getAccessibleLocations from projectDetailReportService instead.');
    return null;
};