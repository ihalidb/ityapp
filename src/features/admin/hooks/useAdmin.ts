import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import type { User, Role } from '../../../shared/types';
import type { UserFormData, RoleFormData } from '../types';

export const useAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      setError(null);
      const data = await adminService.getRoles();
      setRoles(data);
    } catch (err) {
      setError('Roller yüklenirken bir hata oluştu');
    }
  }, []);

  const createUser = useCallback(async (data: UserFormData) => {
    try {
      setError(null);
      await adminService.createUser(data);
      await fetchUsers();
    } catch (err) {
      setError('Kullanıcı oluşturulurken bir hata oluştu');
      throw err;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, data: Partial<UserFormData>) => {
    try {
      setError(null);
      await adminService.updateUser(id, data);
      await fetchUsers();
    } catch (err) {
      setError('Kullanıcı güncellenirken bir hata oluştu');
      throw err;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number) => {
    try {
      setError(null);
      await adminService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError('Kullanıcı silinirken bir hata oluştu');
      throw err;
    }
  }, [fetchUsers]);

  const createRole = useCallback(async (data: RoleFormData) => {
    try {
      setError(null);
      await adminService.createRole(data);
      await fetchRoles();
    } catch (err) {
      setError('Rol oluşturulurken bir hata oluştu');
      throw err;
    }
  }, [fetchRoles]);

  const updateRole = useCallback(async (id: number, data: Partial<RoleFormData>) => {
    try {
      setError(null);
      await adminService.updateRole(id, data);
      await fetchRoles();
    } catch (err) {
      setError('Rol güncellenirken bir hata oluştu');
      throw err;
    }
  }, [fetchRoles]);

  const deleteRole = useCallback(async (id: number) => {
    try {
      setError(null);
      await adminService.deleteRole(id);
      await fetchRoles();
    } catch (err) {
      setError('Rol silinirken bir hata oluştu');
      throw err;
    }
  }, [fetchRoles]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  return {
    users,
    roles,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    createRole,
    updateRole,
    deleteRole,
    refetchUsers: fetchUsers,
    refetchRoles: fetchRoles
  };
}; 