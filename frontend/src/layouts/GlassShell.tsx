import React from 'react';

export const GlassShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fluxx-background min-h-screen w-screen flex items-center justify-center box-border">
      <div className="dashboard-shell w-full h-screen flex overflow-hidden">
        {children}
      </div>
    </div>
  );
};
