import React from 'react';
import { OrganizationCard } from './OrganizationCard';
import type { Organization } from '../types';

interface OrganizationListProps {
  organizations: Organization[];
  onEdit?: (member: Organization) => void;
  onDelete?: (member: Organization) => void;
  showActions?: boolean;
  loading?: boolean;
  error?: string | null;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onEdit,
  onDelete,
  showActions = false,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <div className="text-lg font-semibold mb-2">Hata</div>
        <div>{error}</div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Henüz organizasyon bilgisi bulunmamaktadır.</div>
        <div className="text-gray-400">Organizasyon bilgileri yakında eklenecektir.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {organizations.map((member) => (
        <OrganizationCard
          key={member.id}
          member={member}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
}; 