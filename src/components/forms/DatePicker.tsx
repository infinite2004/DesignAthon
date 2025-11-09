import React from 'react';

type DatePickerProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  return (
    <label className="block text-xs">
      {label && <span className="mb-1 block font-medium text-slate-700">{label}</span>}
      <input
        type="date"
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-teal focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};

