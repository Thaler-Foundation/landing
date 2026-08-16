import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-foreground/40 mb-4 text-sm font-medium uppercase tracking-widest">
        404
      </p>
      <h1 className="text-altitude-black dark:text-white mb-3 text-[40px] font-semibold leading-none tracking-[-0.02em] sm:text-[56px]">
        Page not found
      </h1>
      <p className="text-foreground/50 mb-10 max-w-sm text-base">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-foreground text-background rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-80"
      >
        Back to home
      </Link>
    </div>
  );
}
