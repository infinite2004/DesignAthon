import { cn } from '../../lib/utils';

export type AvatarProps = {
  src?: string | null;
  initials?: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, initials, size = 40, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt="Avatar"
        className={cn(
          "rounded-full object-cover",
          `w-[${size}px] h-[${size}px]`,
          className
        )}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-brand-sage text-white flex items-center justify-center font-semibold",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials || '?'}
    </div>
  );
}

