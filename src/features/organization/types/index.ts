export interface Organization {
  id: string;
  name: string;
  position: string;
  photo: string;
  order: number;
}

export interface OrganizationFormData {
  name: string;
  position: string;
  photo: string;
  order: number;
}

export interface OrganizationState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  selectedMember: Organization | null;
} 