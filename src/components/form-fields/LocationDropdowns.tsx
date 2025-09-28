/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AccessibleLocations } from '@/services/areaTypesService';

interface LocationDropdownsProps {
    accessibleLocations: AccessibleLocations;
    filters: any; // Use any to make it generic
    updateFilter: (key: string, value: string) => void;
}

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({
    accessibleLocations,
    filters,
    updateFilter
}) => {
    const { theme } = useTheme();

    const getFilteredLocations = () => {
        if (!accessibleLocations) return { districts: [], dss: [], zones: [], gnds: [] };

        let availableDS = accessibleLocations.dss;
        let availableZones = accessibleLocations.zones;
        let availableGNDs = accessibleLocations.gndDivisions;

        if (filters.district_id) {
            availableDS = accessibleLocations.dss.filter(ds =>
                ds.district_id?.toString() === filters.district_id
            );
        }

        if (filters.ds_id) {
            availableZones = accessibleLocations.zones.filter(zone =>
                zone.ds_id?.toString() === filters.ds_id
            );
        }

        if (filters.zone_id) {
            availableGNDs = accessibleLocations.gndDivisions.filter(gnd =>
                gnd.zone_id?.toString() === filters.zone_id
            );
        }

        return {
            districts: accessibleLocations.districts,
            dss: availableDS,
            zones: availableZones,
            gnds: availableGNDs
        };
    };

    const filteredLocations = getFilteredLocations();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* District Selection */}
            {filteredLocations.districts.length > 0 && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>District</p>
                    {filteredLocations.districts.length === 1 ? (
                        <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {filteredLocations.districts[0].district_name}
                        </p>
                    ) : (
                        <select
                            value={filters.district_id || ''}
                            onChange={(e) => updateFilter('district_id', e.target.value)}
                            className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}
                        >
                            <option value="">All Districts</option>
                            {filteredLocations.districts.map((district) => (
                                <option key={district.district_id} value={district.district_id.toString()}>
                                    {district.district_name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {/* DS Division Selection */}
            {filteredLocations.dss.length > 0 && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>DS Division</p>
                    {filteredLocations.dss.length === 1 ? (
                        <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {filteredLocations.dss[0].ds_name}
                        </p>
                    ) : (
                        <select
                            value={filters.ds_id || ''}
                            onChange={(e) => updateFilter('ds_id', e.target.value)}
                            className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}
                        >
                            <option value="">All DS Divisions</option>
                            {filteredLocations.dss.map((ds) => (
                                <option key={ds.ds_id} value={ds.ds_id.toString()}>
                                    {ds.ds_name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {/* Zone Selection */}
            {filteredLocations.zones.length > 0 && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Zone</p>
                    {filteredLocations.zones.length === 1 ? (
                        <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {filteredLocations.zones[0].zone_name}
                        </p>
                    ) : (
                        <select
                            value={filters.zone_id || ''}
                            onChange={(e) => updateFilter('zone_id', e.target.value)}
                            className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}
                        >
                            <option value="">All Zones</option>
                            {filteredLocations.zones.map((zone) => (
                                <option key={zone.zone_id} value={zone.zone_id.toString()}>
                                    {zone.zone_name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {/* GND Selection */}
            {filteredLocations.gnds.length > 0 && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>GND</p>
                    {filteredLocations.gnds.length === 1 ? (
                        <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {filteredLocations.gnds[0].gnd_name}
                        </p>
                    ) : (
                        <select
                            value={filters.gnd_id || ''}
                            onChange={(e) => updateFilter('gnd_id', e.target.value)}
                            className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}
                        >
                            <option value="">All GNDs</option>
                            {filteredLocations.gnds.map((gnd) => (
                                <option key={gnd.gnd_id} value={gnd.gnd_id}>
                                    {gnd.gnd_name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </div>

    );
};

export default LocationDropdowns;