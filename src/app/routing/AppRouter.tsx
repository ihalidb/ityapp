import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Login } from '../../features/auth/components/Login';
import { Dashboard } from '../../features/requests/components/Dashboard';
import { MyRequests } from '../../features/requests/components/MyRequests';
import { NewRequest } from '../../features/requests/components/NewRequest';
import { OrganizationPage } from '../../features/organization/components/OrganizationPage';
import { OrganizationManagement } from '../../features/organization/components/OrganizationManagement';
import { UserManagement } from '../../features/admin/components/UserManagement';
import { RoleManagement } from '../../features/admin/components/RoleManagement';
import { RequestManagement } from '../../features/admin/components/RequestManagement';
import { SecretariatPage } from '../../features/secretariat/components/SecretariatPage';
import { AttendancePage } from '../../features/attendance/components/AttendancePage';
import { AttendanceReportPage } from '../../features/attendance/components/AttendanceReportPage';
import { Layout } from '../layout/Layout';
import { PAGE_DEFINITIONS, type PageKey } from '../../shared/types';

interface AllowedPageRouteProps {
  children: React.ReactNode;
  pageKey: PageKey;
}

const AllowedPageRoute: React.FC<AllowedPageRouteProps> = ({ children, pageKey }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Loading durumunda bekle
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  // Giriş yapılmamışsa login'e yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı yoksa veya allowedPages yoksa dashboard'a yönlendir
  if (!user || !user.allowedPages) {
    return <Navigate to="/" replace />;
  }

  // Sayfa yetkisi yoksa dashboard'a yönlendir
  if (!user.allowedPages.includes(pageKey)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Loading durumunda bekle
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={
          <AllowedPageRoute pageKey="dashboard">
            <Layout>
              <Dashboard />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/my-requests" element={
          <AllowedPageRoute pageKey="my-requests">
            <Layout>
              <MyRequests />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/new-request" element={
          <AllowedPageRoute pageKey="new-request">
            <Layout>
              <NewRequest />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/organization" element={
          <AllowedPageRoute pageKey="organization">
            <Layout>
              <OrganizationPage />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/secretariat" element={
          <AllowedPageRoute pageKey="secretariat">
            <Layout>
              <SecretariatPage />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/attendance" element={
          <AllowedPageRoute pageKey="attendance">
            <Layout>
              <AttendancePage />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/attendance-report" element={
          <AllowedPageRoute pageKey="attendance-report">
            <Layout>
              <AttendanceReportPage />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/admin/request-management" element={
          <AllowedPageRoute pageKey="admin/request-management">
            <Layout>
              <RequestManagement />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/admin/organization" element={
          <AllowedPageRoute pageKey="admin/organization">
            <Layout>
              <OrganizationManagement />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/admin/users" element={
          <AllowedPageRoute pageKey="admin/users">
            <Layout>
              <UserManagement />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="/admin/roles" element={
          <AllowedPageRoute pageKey="admin/roles">
            <Layout>
              <RoleManagement />
            </Layout>
          </AllowedPageRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}; 