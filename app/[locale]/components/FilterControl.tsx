"use client";

import { useTranslations } from 'next-intl';

interface FilterControlProps {
  currentFilter: string;
  onFilterChange: (newFilter: string) => void;
}

const FilterControl: React.FC<FilterControlProps> = ({ currentFilter, onFilterChange }) => {
  const t = useTranslations('Enums');
  const tMap = useTranslations('Map');

  return (
    <div className="leaflet-top leaflet-right p-4" style={{ zIndex: 1001 }}>
      <div className="bg-white p-2 rounded shadow-lg">
        <label htmlFor="severity-filter" className="block text-sm font-medium text-gray-700">
          {tMap('filterBySeverity')}
        </label>
        <select
          id="severity-filter"
          name="severity-filter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="ALL">{tMap('allSeverities')}</option>
          <option value="HIGH">{t('HIGH')}</option>
          <option value="MEDIUM">{t('MEDIUM')}</option>
          <option value="LOW">{t('LOW')}</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControl;
