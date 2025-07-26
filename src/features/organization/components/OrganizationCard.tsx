import React from 'react';
import type { Organization } from '../types';

interface OrganizationCardProps {
  member: Organization;
  onEdit?: (member: Organization) => void;
  onDelete?: (member: Organization) => void;
  showActions?: boolean;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  member,
  onEdit,
  onDelete,
  showActions = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${member.photo ? 'hidden' : ''}`}>
          <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{member.name}</h3>
        <p className="text-sm text-gray-600 truncate mb-3">{member.position}</p>
        {showActions && onEdit && onDelete && (
          <div className="flex space-x-2">
            <button
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
              onClick={() => onEdit(member)}
              title="Düzenle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
              onClick={() => onDelete(member)}
              title="Sil"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 