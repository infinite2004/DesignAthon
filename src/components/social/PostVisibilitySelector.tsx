import { Globe, Lock, Users } from 'lucide-react';

type Visibility = 'public' | 'followers' | 'private';

interface PostVisibilitySelectorProps {
  value: Visibility;
  onChange: (visibility: Visibility) => void;
}

const visibilityOptions: { value: Visibility; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'public',
    label: 'Public',
    icon: <Globe size={18} />,
    description: 'Anyone can see this post',
  },
  {
    value: 'followers',
    label: 'Followers',
    icon: <Users size={18} />,
    description: 'Only your followers can see this',
  },
  {
    value: 'private',
    label: 'Private',
    icon: <Lock size={18} />,
    description: 'Only you can see this',
  },
];

export function PostVisibilitySelector({ value, onChange }: PostVisibilitySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Who can see this post?
      </label>
      <div className="space-y-2">
        {visibilityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full flex items-center gap-3 p-3 border-2 rounded-xl transition-colors touch-target ${
              value === option.value
                ? 'border-brand-teal bg-brand-teal/5'
                : 'border-gray-200 hover:border-brand-sage'
            }`}
          >
            <div className={`${value === option.value ? 'text-brand-teal' : 'text-slate-400'}`}>
              {option.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{option.label}</p>
              <p className="text-xs text-slate-600">{option.description}</p>
            </div>
            {value === option.value && (
              <div className="w-5 h-5 rounded-full bg-brand-teal flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
