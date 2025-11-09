import React from 'react';

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  iconLeft?: React.ReactNode;
};

export const Chip: React.FC<ChipProps> = ({ label, selected, onClick, iconLeft }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium
        transition-colors touch-target
        ${selected
          ? 'border-brand-teal bg-brand-teal text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700'}
      `}
    >
      {iconLeft && <span className="text-[10px]">{iconLeft}</span>}
      <span>{label}</span>
    </button>
  );
};

