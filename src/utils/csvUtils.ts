/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatCurrencyForCSV = (value: any): string => {
    if (value === undefined || value === null || value === '') return '0.00';

    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Check if it's a valid number
    if (isNaN(numValue)) return '0.00';

    return numValue.toFixed(2);
};

export const cleanCSVValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const stringValue = String(value);
    // Escape quotes and remove line breaks for CSV
    return stringValue.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ');
};