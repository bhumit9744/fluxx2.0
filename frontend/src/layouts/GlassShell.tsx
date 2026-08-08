import React from 'react';

export const GlassShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fluxx-background min-h-screen w-screen flex items-center justify-center p-4 md:p-8 box-border">
      <div className="dashboard-shell w-full max-w-[1800px] h-full max-h-[1000px] flex overflow-hidden">
        {children}
      </div>
    </div>
  );
};
