import { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';

interface CaptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showHashtags?: boolean;
}

export function CaptionField({
  value,
  onChange,
  placeholder = "Share your cooking story, tip, or experience...",
  maxLength = 500,
  showHashtags = true,
}: CaptionFieldProps) {
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
    // Extract hashtags from caption
    const matches = value.match(/#\w+/g);
    if (matches) {
      setHashtags([...new Set(matches)]);
    } else {
      setHashtags([]);
    }
  }, [value]);

  const remaining = maxLength - value.length;
  const isNearLimit = remaining < 50;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Caption
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full min-h-[120px] p-3 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
      />
      
      {/* Hashtags */}
      {showHashtags && hashtags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-brand-sage/10 text-brand-teal rounded-full text-xs"
            >
              <Hash size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Character count */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {hashtags.length > 0 && `${hashtags.length} hashtag${hashtags.length > 1 ? 's' : ''}`}
        </span>
        <span className={isNearLimit ? 'text-orange-500' : 'text-slate-500'}>
          {remaining} characters remaining
        </span>
      </div>
    </div>
  );
}
