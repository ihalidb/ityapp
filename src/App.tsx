import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewRequest } from './pages/NewRequest';
import { UserManagement } from './pages/admin/UserManagement';
import { RoleManagement } from './pages/admin/RoleManagement';
import { RequestManagement } from './pages/admin/RequestManagement';
import { PAGE_DEFINITIONS, PageKey } from './types/index';

// Route koruma: hem login hem allowedPages kontrolü
const AllowedPageRoute = ({ pageKey, children }: { pageKey: PageKey; children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const allowedPages: PageKey[] = (user as any)?.allowedPages || [];
  if (!allowedPages.includes(pageKey)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<AllowedPageRoute pageKey="dashboard"><Dashboard /></AllowedPageRoute>} />
          <Route path="/requests/new" element={<AllowedPageRoute pageKey="new-request"><NewRequest /></AllowedPageRoute>} />
          <Route path="/my-requests" element={<AllowedPageRoute pageKey="my-requests"><Dashboard /></AllowedPageRoute>} />
          <Route path="/admin/users" element={<AllowedPageRoute pageKey="admin/users"><UserManagement /></AllowedPageRoute>} />
          <Route path="/admin/roles" element={<AllowedPageRoute pageKey="admin/roles"><RoleManagement /></AllowedPageRoute>} />
          <Route path="/admin/requests" element={<AllowedPageRoute pageKey="admin/requests"><RequestManagement /></AllowedPageRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App; 