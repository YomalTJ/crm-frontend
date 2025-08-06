import { UserLocationDetails } from "@/services/projectDetailReportService";

export const getUserLocationDetails = (): UserLocationDetails | null => {
    if (typeof window === 'undefined') return null;

    const staffLocation = localStorage.getItem('staffLocation');
    if (!staffLocation) return null;

    try {
        const location = JSON.parse(staffLocation);
        return {
            provinceId: location.provinceId || 0,
            district: location.district || null,
            dsDivision: location.dsDivision || null,
            gnd: location.gnd || null,
            zone: location.zone || null
        };
    } catch (error) {
        console.error('Error parsing staffLocation from localStorage:', error);
        return null;
    }
}