import React, { useEffect } from 'react';
import { useEnvironmentStore } from '../stores/environmentStore';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initStore } = useEnvironmentStore();

  useEffect(() => {
    initStore();
  }, []);

  return <>{children}</>;
};
