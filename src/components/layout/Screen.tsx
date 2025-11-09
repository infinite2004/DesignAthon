import { cn } from '../../lib/utils';

export type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  background?: 'default' | 'muted' | 'transparent';
};

export function Screen({ 
  children, 
  scroll = true, 
  background = 'default' 
}: ScreenProps) {
  const bgClass = {
    default: 'bg-brand-bg',
    muted: 'bg-slate-100',
    transparent: 'bg-transparent',
  }[background];

  return (
    <div className={cn(
      "min-h-screen h-full",
      bgClass,
      scroll && "overflow-y-auto"
    )}>
      {children}
    </div>
  );
}

