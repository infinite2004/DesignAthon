type PostType = 'meal' | 'fridge' | 'tip';

interface PostTypePickerProps {
  value: PostType | null;
  onChange: (type: PostType) => void;
}

const postTypes: { type: PostType; label: string; icon: string }[] = [
  { type: 'meal', label: 'I cooked a meal', icon: '🍳' },
  { type: 'fridge', label: 'Fridge / pantry before & after', icon: '🧊' },
  { type: 'tip', label: 'Tip / blog / review', icon: '💡' },
];

export function PostTypePicker({ value, onChange }: PostTypePickerProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">What are you sharing?</h2>
      {postTypes.map((pt) => (
        <button
          key={pt.type}
          onClick={() => onChange(pt.type)}
          className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl hover:border-brand-sage active:bg-gray-50 transition-colors touch-target ${
            value === pt.type
              ? 'border-brand-teal bg-brand-teal/5'
              : 'border-gray-200'
          }`}
        >
          <span className="text-3xl">{pt.icon}</span>
          <span className="flex-1 text-left font-medium">{pt.label}</span>
        </button>
      ))}
    </div>
  );
}
