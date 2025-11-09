import React from 'react';

type SegmentedControlProps = {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  options,
  onChange,
}) => {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
      {options.map((opt) => {
        const active = opt.value === value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1 rounded-full transition touch-target ${
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

