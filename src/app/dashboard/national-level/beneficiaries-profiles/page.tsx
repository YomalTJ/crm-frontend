'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import NationalLocationFilter from '@/components/common/NationalLocationFilter';
import { BeneficiaryDetailsResponseDto, getBeneficiaryDetails } from '@/services/benficiaryService';
import BeneficiaryDetailsModal from '@/components/common/BeneficiaryDetailsModal';

interface Filters {
  province_id?: string;
  district_id?: string;
  ds_id?: string;
  zone_id?: string;
  gnd_id?: string;
  mainProgram?: string;
  empowerment_dimension_id?: string;
}

const BeneficiariesProfiles = () => {
  const { theme } = useTheme();
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryDetailsResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryDetailsResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    province_id: '',
    district_id: '',
    ds_id: '',
    zone_id: '',
    gnd_id: '',
    mainProgram: '',
    empowerment_dimension_id: ''
  });

  useEffect(() => {
    loadBeneficiaries();
  }, [filters.district_id, filters.ds_id, filters.zone_id, filters.gnd_id, filters.mainProgram, filters.empowerment_dimension_id]);

  const loadBeneficiaries = async () => {
    try {
      setLoading(true);

      // Convert filters to the format expected by the API
      // Note: province_id is used for filtering districts in the UI, but not in the beneficiary API
      const apiFilters = {
        district_id: filters.district_id || undefined,
        ds_id: filters.ds_id || undefined,
        zone_id: filters.zone_id || undefined,
        gnd_id: filters.gnd_id || undefined,
        mainProgram: filters.mainProgram || undefined,
        empowerment_dimension_id: filters.empowerment_dimension_id || undefined
      };

      const data = await getBeneficiaryDetails(apiFilters);
      setBeneficiaries(data);
    } catch (error) {
      console.error('Error loading beneficiaries:', error);
      setBeneficiaries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleViewMore = (beneficiary: BeneficiaryDetailsResponseDto) => {
    setSelectedBeneficiary(beneficiary);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBeneficiary(null);
  };

  return (
    <div className={`min-h-screen  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Beneficiary Profiles</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            National level view of beneficiary information with hierarchical location filtering
          </p>
        </div>

        {/* National Level Location Filter */}
        <NationalLocationFilter filters={filters} updateFilter={updateFilter} />

        {/* Additional Program Filters */}
        <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Program Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Main Program</p>
              <select
                value={filters.mainProgram || ''}
                onChange={(e) => updateFilter('mainProgram', e.target.value)}
                className={`w-full text-sm border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              >
                <option value="">All Programs</option>
                <option value="NP">NP</option>
                <option value="ADB">ADB</option>
                <option value="WB">WB</option>
              </select>
            </div>

            <div>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Empowerment Dimension</p>
              <select
                value={filters.empowerment_dimension_id || ''}
                onChange={(e) => updateFilter('empowerment_dimension_id', e.target.value)}
                className={`w-full text-sm border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              >
                <option value="">All Dimensions</option>
                <option value="247029ca-e2fd-4741-aea2-6d22e2fc32b0">Employment Facilitation</option>
                <option value="2edd58f6-8d1e-463a-9f1a-47bbe3f107a0">Business Opportunities/Self-Employment</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadBeneficiaries}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg font-medium ${theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800'
                  : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Count and Statistics */}
        <div className={`p-4 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {loading ? 'Loading beneficiaries...' : `Found ${beneficiaries.length} beneficiaries`}
            </p>
          </div>
        </div>

        {/* Beneficiaries Table */}
        <div className={`rounded-lg overflow-hidden shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading beneficiaries...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Household No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">NIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {beneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.id} className={`hover:${theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {beneficiary.aswasumaHouseholdNo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {beneficiary.beneficiaryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {beneficiary.nic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${beneficiary.mainProgram === 'NP' ? 'bg-green-100 text-green-800' :
                          beneficiary.mainProgram === 'ADB' ? 'bg-blue-100 text-blue-800' :
                            beneficiary.mainProgram === 'WB' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {beneficiary.mainProgram || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(beneficiary.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewMore(beneficiary)}
                          className={`px-3 py-1 rounded text-xs font-medium ${theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {beneficiaries.length === 0 && !loading && (
                <div className="p-8 text-center">
                  <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>
                    👥
                  </div>
                  <p className={`text-lg mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No beneficiaries found
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Beneficiary Details Modal */}
      <BeneficiaryDetailsModal
        beneficiary={selectedBeneficiary}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default BeneficiariesProfiles;