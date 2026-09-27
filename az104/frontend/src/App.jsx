import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VaultProvider } from './context/VaultContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Secrets } from './pages/Secrets';
import { Certificates } from './pages/Certificates';
import { MigrationWizard } from './pages/MigrationWizard';
import { AccessControl } from './pages/AccessControl';
import { SoftDelete } from './pages/SoftDelete';
import { ActivityLogs } from './pages/ActivityLogs';
import { Settings } from './pages/Settings';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] overflow-hidden antialiased font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <VaultProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/secrets"
                element={
                  <ProtectedLayout>
                    <Secrets />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/certificates"
                element={
                  <ProtectedLayout>
                    <Certificates />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/migration-wizard"
                element={
                  <ProtectedLayout>
                    <MigrationWizard />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/access-control"
                element={
                  <ProtectedLayout>
                    <AccessControl />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/soft-delete"
                element={
                  <ProtectedLayout>
                    <SoftDelete />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/activity-logs"
                element={
                  <ProtectedLayout>
                    <ActivityLogs />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedLayout>
                    <Settings />
                  </ProtectedLayout>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </VaultProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
