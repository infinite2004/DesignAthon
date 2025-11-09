import React from 'react';
import { Chip } from './Chip';

type ChipOption = { label: string; value: string };

type ChipGroupProps =
  | {
      mode: 'single';
      value: string | null;
      options: ChipOption[];
      onChange: (value: string) => void;
    }
  | {
      mode: 'multi';
      value: string[];
      options: ChipOption[];
      onChange: (values: string[]) => void;
    };

export const ChipGroup: React.FC<ChipGroupProps> = (props) => {
  const { options } = props;

  const handleToggle = (val: string) => {
    if (props.mode === 'single') {
      props.onChange(val);
    } else {
      const set = new Set(props.value);
      set.has(val) ? set.delete(val) : set.add(val);
      props.onChange(Array.from(set));
    }
  };

  const selectedValues =
    props.mode === 'single' ? new Set([props.value].filter(Boolean)) : new Set(props.value);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          selected={selectedValues.has(opt.value)}
          onClick={() => handleToggle(opt.value)}
        />
      ))}
    </div>
  );
};

