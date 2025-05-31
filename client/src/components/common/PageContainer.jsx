import { memo } from 'react';
import { cn } from '@/lib/utils';

const PageHeader = memo(({ title, subtitle }) => {
  if (!title && !subtitle) return null;
  return (
    <div className="mb-6">
      {title && <h1 className="text-2xl font-bold text-primary">{title}</h1>}
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
});
PageHeader.displayName = "PageHeader";

export const PageContainer = memo(({ 
  children, 
  title, 
  subtitle,
  className
}) => {
  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <PageHeader title={title} subtitle={subtitle} />
      {children}
    </div>
  );
});
PageContainer.displayName = "PageContainer";
