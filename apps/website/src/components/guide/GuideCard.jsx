import { cn } from '@/lib/utils';

/**
 * The neutral surface used throughout guides for grouped content
 * (paper breakdowns, strategy lists, resource lists). Pass spacing
 * modifiers such as `mt-4` via `className`.
 */
export default function GuideCard({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}
