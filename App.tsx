
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthScreen from './components/Auth';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-700">Loading EcoTrace...</div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthScreen />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
