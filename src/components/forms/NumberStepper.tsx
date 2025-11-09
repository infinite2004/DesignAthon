import React from 'react';

type NumberStepperProps = {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
};

export const NumberStepper: React.FC<NumberStepperProps> = ({
  label,
  value,
  min = 0,
  max = 999,
  step = 1,
  onChange,
}) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <label className="block text-xs">
      {label && <span className="mb-1 block font-medium text-slate-700">{label}</span>}
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
        <button
          type="button"
          className="px-3 py-1 text-xs text-slate-500 touch-target"
          onClick={() => onChange(clamp(value - step))}
        >
          –
        </button>
        <input
          type="number"
          className="w-14 border-x border-slate-200 bg-transparent px-2 py-1 text-center text-xs focus:outline-none"
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        />
        <button
          type="button"
          className="px-3 py-1 text-xs text-slate-500 touch-target"
          onClick={() => onChange(clamp(value + step))}
        >
          +
        </button>
      </div>
    </label>
  );
};

