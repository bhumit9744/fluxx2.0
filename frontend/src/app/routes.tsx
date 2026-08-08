import React from 'react';
import { useEnvironmentStore } from '../stores/environmentStore';
import { HomeExperience } from '../pages/Home/HomeExperience';
import { LoginView } from '../pages/Login/LoginView';
import { DashboardLayout } from '../pages/Dashboard/DashboardLayout';

export const AppRoutes: React.FC = () => {
  const { appMode } = useEnvironmentStore();

  switch (appMode) {
    case 'home':
      return <HomeExperience />;
    case 'login':
      return <LoginView />;
    case 'dashboard':
      return <DashboardLayout />;
    default:
      return <HomeExperience />;
  }
};
