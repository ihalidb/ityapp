import React from 'react';
import { OrganizationList } from './OrganizationList';
import { useOrganizations } from '../hooks/useOrganizations';

export const OrganizationPage: React.FC = () => {
  const { organizations, loading, error } = useOrganizations();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Organizasyon</h1>
        <p className="text-gray-600">Kurumumuzun yönetim kadrosu</p>
      </div>

      <OrganizationList
        organizations={organizations}
        loading={loading}
        error={error}
        showActions={false}
      />
    </div>
  );
}; 