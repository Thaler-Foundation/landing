import { cn } from '@/lib/utils/cn';

type Variant = 'flat' | 'mirror' | 'invert';

const TRANSFORM: Record<Exclude<Variant, 'flat'>, string> = {
  mirror: 'translate(400,0) scale(-1,1)',
  invert: 'translate(0,400) scale(1,-1)',
};

export function SectionBackdrop({
  className,
  variant = 'flat',
}: {
  className?: string;
  variant?: Variant;
}) {
  return (
    <div
      aria-hidden
      className={cn('bg-foreground/[0.05] absolute inset-0 overflow-hidden', className)}
    >
      {variant !== 'flat' && (
        <svg
          className="text-foreground absolute inset-0 h-full w-full"
          viewBox="0 0 400 400"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g transform={TRANSFORM[variant]}>
            <path
              d="M-20 300 C 120 200, 180 120, 420 40"
              stroke="currentColor"
              strokeWidth="64"
              strokeOpacity="0.1"
              strokeLinecap="round"
            />
            <path
              d="M-20 360 C 120 300, 200 220, 420 140"
              stroke="currentColor"
              strokeWidth="40"
              strokeOpacity="0.06"
              strokeLinecap="round"
            />
          </g>
        </svg>
      )}
    </div>
  );
}
