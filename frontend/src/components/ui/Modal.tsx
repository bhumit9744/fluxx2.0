import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-xl'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full ${maxWidthClass} bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative space-y-4`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
