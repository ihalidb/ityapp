import React, { useState } from 'react';
import { OrganizationList } from './OrganizationList';
import { OrganizationForm } from './OrganizationForm';
import { useOrganizations } from '../hooks/useOrganizations';
import type { Organization, OrganizationFormData } from '../types';

export const OrganizationManagement: React.FC = () => {
  const { organizations, loading, error, createOrganization, updateOrganization, deleteOrganization } = useOrganizations();
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Organization | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleAdd = () => {
    setSelectedMember(null);
    setShowForm(true);
  };

  const handleEdit = (member: Organization) => {
    setSelectedMember(member);
    setShowForm(true);
  };

  const handleDelete = async (member: Organization) => {
    if (window.confirm(`${member.name} isimli üyeyi silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteOrganization(member.id);
      } catch (err) {
        // Error is handled by useOrganizations hook
      }
    }
  };

  const handleFormSubmit = async (data: OrganizationFormData) => {
    try {
      setFormLoading(true);
      if (selectedMember) {
        await updateOrganization(selectedMember.id, data);
      } else {
        await createOrganization(data);
      }
      setShowForm(false);
      setSelectedMember(null);
    } catch (err) {
      // Error is handled by useOrganizations hook
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedMember(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Organizasyon Yönetimi</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAdd}
        >
          Yeni Üye Ekle
        </button>
      </div>

      <OrganizationList
        organizations={organizations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions={true}
        loading={loading}
        error={error}
      />

      {showForm && (
        <OrganizationForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={selectedMember || undefined}
          loading={formLoading}
        />
      )}
    </div>
  );
}; 