import { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';
interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}
const PageHeader = memo(({ title, subtitle }: PageHeaderProps) => {
  if (!title && !subtitle) return null;
  return (
    <div className="mb-6">
      {title && <h1 className="text-2xl font-bold text-primary">{title}</h1>}
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
});
PageHeader.displayName = "PageHeader";
interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}
export const PageContainer = memo(({ 
  children, 
  title, 
  subtitle,
  className
}: PageContainerProps) => {
  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <PageHeader title={title} subtitle={subtitle} />
      {children}
    </div>
  );
});
PageContainer.displayName = "PageContainer";