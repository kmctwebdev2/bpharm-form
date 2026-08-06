import { cn } from '@/utils';

type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div className={cn('container mx-auto px-4 py-8 md:px-8', className)} {...props}>
      {children}
    </div>
  );
}
