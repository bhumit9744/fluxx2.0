import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  dark?: boolean;
  interactive?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  header,
  footer,
  className = '',
  dark = false,
  interactive = false
}) => {
  const baseClass = dark ? 'glass-panel-dark' : 'glass-panel-light';
  const interactiveClass = interactive ? 'glass-panel-interactive' : '';

  return (
    <div className={`rounded-3xl p-5 flex flex-col justify-between ${baseClass} ${interactiveClass} ${className}`}>
      {header && <div className="border-b border-slate-200/50 dark:border-white/10 pb-3 mb-4">{header}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="border-t border-slate-200/50 dark:border-white/10 pt-3 mt-4">{footer}</div>}
    </div>
  );
};
