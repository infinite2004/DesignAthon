import React from 'react';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 safe-area-top">
      <div className="rounded-t-3xl bg-white p-4 shadow-xl safe-area-bottom">
        <div className="mb-2 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>
        {title && (
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        )}
        {children}
      </div>
      <button 
        className="h-full w-full" 
        onClick={onClose} 
        aria-label="Close sheet"
      />
    </div>
  );
};

