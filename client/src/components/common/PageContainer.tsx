import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PageContainer({ 
  children, 
  title, 
  subtitle,
  className = ""
}: PageContainerProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold text-primary">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}