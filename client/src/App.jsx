import React, { Suspense } from 'react';
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/authHooks';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { IssuesPage } from './features/issues/components/IssuesPage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import ErrorPage from "./features/ErrorPage/error"

import { useSelector } from "react-redux";


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  return !user ? children : <Navigate to="/issues" />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/issues" />} />
        
        <Route path="/login" element={
          <PublicRoute>
            <Layout>
              <LoginForm />
            </Layout>
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <Layout>
              <RegisterForm />
            </Layout>
          </PublicRoute>
        } />
        
        <Route path="/issues" element={
          <ProtectedRoute>
            <Layout>
              <IssuesPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  const loading = useSelector((state) => state.loading.value);

  return (
    <AuthProvider>
      <SnackbarProvider maxSnack={3}>
        <Suspense fallback={<LoadingScreen />}>
          <AppContent />
          {loading && <LoadingScreen />}
        </Suspense>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;