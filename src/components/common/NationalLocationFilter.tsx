'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
    getProvinces,
    getDistrictsByProvince,
    getDSDivisionsByDistrict,
    getZonesByDSDivision,
    getGNDsByZone,
    Province,
    District,
    DSDivision,
    Zone,
    GND
} from '@/services/locationService';

interface NationalLocationFilterProps {
    filters: {
        province_id?: string;
        district_id?: string;
        ds_id?: string;
        zone_id?: string;
        gnd_id?: string;
    };
    updateFilter: (key: string, value: string) => void;
}

const NationalLocationFilter: React.FC<NationalLocationFilterProps> = ({
    filters,
    updateFilter
}) => {
    const { theme } = useTheme();
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [dsDivisions, setDSDivisions] = useState<DSDivision[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [gnds, setGNDs] = useState<GND[]>([]);
    const [loading, setLoading] = useState({
        provinces: true,
        districts: false,
        dsDivisions: false,
        zones: false,
        gnds: false
    });

    // Load provinces on component mount
    useEffect(() => {
        loadProvinces();
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (filters.province_id) {
            loadDistricts(filters.province_id);
        } else {
            setDistricts([]);
            setDSDivisions([]);
            setZones([]);
            setGNDs([]);
            // Clear downstream filters
            updateFilter('district_id', '');
            updateFilter('ds_id', '');
            updateFilter('zone_id', '');
            updateFilter('gnd_id', '');
        }
    }, [filters.province_id]);

    // Load DS divisions when district changes
    useEffect(() => {
        if (filters.district_id) {
            loadDSDivisions(filters.district_id);
        } else {
            setDSDivisions([]);
            setZones([]);
            setGNDs([]);
            // Clear downstream filters
            updateFilter('ds_id', '');
            updateFilter('zone_id', '');
            updateFilter('gnd_id', '');
        }
    }, [filters.district_id]);

    // Load zones when DS division changes
    useEffect(() => {
        if (filters.ds_id) {
            loadZones(filters.ds_id);
        } else {
            setZones([]);
            setGNDs([]);
            // Clear downstream filters
            updateFilter('zone_id', '');
            updateFilter('gnd_id', '');
        }
    }, [filters.ds_id]);

    // Load GNDs when zone changes
    useEffect(() => {
        if (filters.zone_id) {
            loadGNDs(filters.zone_id);
        } else {
            setGNDs([]);
            // Clear downstream filter
            updateFilter('gnd_id', '');
        }
    }, [filters.zone_id]);

    const loadProvinces = async () => {
        try {
            setLoading(prev => ({ ...prev, provinces: true }));
            const provincesData = await getProvinces();
            setProvinces(provincesData);
        } catch (error) {
            console.error('Error loading provinces:', error);
        } finally {
            setLoading(prev => ({ ...prev, provinces: false }));
        }
    };

    const loadDistricts = async (provinceId: string) => {
        try {
            setLoading(prev => ({ ...prev, districts: true }));
            const districtsData = await getDistrictsByProvince(provinceId);
            setDistricts(districtsData);
        } catch (error) {
            console.error('Error loading districts:', error);
            setDistricts([]);
        } finally {
            setLoading(prev => ({ ...prev, districts: false }));
        }
    };

    const loadDSDivisions = async (districtId: string) => {
        try {
            setLoading(prev => ({ ...prev, dsDivisions: true }));
            const dsDivisionsData = await getDSDivisionsByDistrict(districtId);
            setDSDivisions(dsDivisionsData);
        } catch (error) {
            console.error('Error loading DS divisions:', error);
            setDSDivisions([]);
        } finally {
            setLoading(prev => ({ ...prev, dsDivisions: false }));
        }
    };

    const loadZones = async (dsId: string) => {
        try {
            setLoading(prev => ({ ...prev, zones: true }));
            const zonesData = await getZonesByDSDivision(dsId);
            setZones(zonesData);
        } catch (error) {
            console.error('Error loading zones:', error);
            setZones([]);
        } finally {
            setLoading(prev => ({ ...prev, zones: false }));
        }
    };

    const loadGNDs = async (zoneId: string) => {
        try {
            setLoading(prev => ({ ...prev, gnds: true }));
            const gndsData = await getGNDsByZone(zoneId);
            setGNDs(gndsData);
        } catch (error) {
            console.error('Error loading GNDs:', error);
            setGNDs([]);
        } finally {
            setLoading(prev => ({ ...prev, gnds: false }));
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        updateFilter(key, value);
    };

    const clearAllFilters = () => {
        updateFilter('province_id', '');
        updateFilter('district_id', '');
        updateFilter('ds_id', '');
        updateFilter('zone_id', '');
        updateFilter('gnd_id', '');
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Filter Header */}
            <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    Location Filters
                </h3>
                <button
                    onClick={clearAllFilters}
                    className={`px-3 py-1 text-sm rounded ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                >
                    Clear All
                </button>
            </div>

            {/* Location Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Province Selection */}
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Province {loading.provinces && '(Loading...)'}
                    </p>
                    <select
                        value={filters.province_id || ''}
                        onChange={(e) => handleFilterChange('province_id', e.target.value)}
                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-white text-gray-900'
                            } ${loading.provinces ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading.provinces}
                    >
                        <option value="">All Provinces</option>
                        {provinces.map((province) => (
                            <option key={province.province_id} value={province.province_id.toString()}>
                                {province.province_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* District Selection */}
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        District {loading.districts && '(Loading...)'}
                    </p>
                    <select
                        value={filters.district_id || ''}
                        onChange={(e) => handleFilterChange('district_id', e.target.value)}
                        disabled={!filters.province_id || loading.districts}
                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-white text-gray-900'
                            } ${!filters.province_id || loading.districts ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">All Districts</option>
                        {districts.map((district) => (
                            <option key={district.district_id} value={district.district_id}>
                                {district.district_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* DS Division Selection */}
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        DS Division {loading.dsDivisions && '(Loading...)'}
                    </p>
                    <select
                        value={filters.ds_id || ''}
                        onChange={(e) => handleFilterChange('ds_id', e.target.value)}
                        disabled={!filters.district_id || loading.dsDivisions}
                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-white text-gray-900'
                            } ${!filters.district_id || loading.dsDivisions ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">All DS Divisions</option>
                        {dsDivisions.map((ds) => (
                            <option key={ds.ds_id} value={ds.ds_id}>
                                {ds.ds_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Zone Selection */}
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Zone {loading.zones && '(Loading...)'}
                    </p>
                    <select
                        value={filters.zone_id || ''}
                        onChange={(e) => handleFilterChange('zone_id', e.target.value)}
                        disabled={!filters.ds_id || loading.zones}
                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-white text-gray-900'
                            } ${!filters.ds_id || loading.zones ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">All Zones</option>
                        {zones.map((zone) => (
                            <option key={zone.zone_id} value={zone.zone_id}>
                                {zone.zone_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* GND Selection */}
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        GND {loading.gnds && '(Loading...)'}
                    </p>
                    <select
                        value={filters.gnd_id || ''}
                        onChange={(e) => handleFilterChange('gnd_id', e.target.value)}
                        disabled={!filters.zone_id || loading.gnds}
                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-white text-gray-900'
                            } ${!filters.zone_id || loading.gnds ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">All GNDs</option>
                        {gnds.map((gnd) => (
                            <option key={gnd.gnd_id} value={gnd.gnd_id}>
                                {gnd.gnd_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Selected Filters Summary */}
            {(filters.province_id || filters.district_id || filters.ds_id || filters.zone_id || filters.gnd_id) && (
                <div className={`p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-blue-900 bg-opacity-20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                    <span className="font-medium">Active filters: </span>
                    {filters.province_id && (
                        <span className="mx-1">
                            Province: {provinces.find(p => p.province_id.toString() === filters.province_id)?.province_name}
                        </span>
                    )}
                    {filters.district_id && (
                        <span className="mx-1">
                            • District: {districts.find(d => d.district_id === filters.district_id)?.district_name}
                        </span>
                    )}
                    {filters.ds_id && (
                        <span className="mx-1">
                            • DS: {dsDivisions.find(ds => ds.ds_id === filters.ds_id)?.ds_name}
                        </span>
                    )}
                    {filters.zone_id && (
                        <span className="mx-1">
                            • Zone: {zones.find(z => z.zone_id === filters.zone_id)?.zone_name}
                        </span>
                    )}
                    {filters.gnd_id && (
                        <span className="mx-1">
                            • GND: {gnds.find(g => g.gnd_id === filters.gnd_id)?.gnd_name}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default NationalLocationFilter;