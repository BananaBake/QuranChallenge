import React from 'react';
interface LoadingSpinnerProps {
  message?: string;
}
export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center p-8">
        <div className="mb-4">{message}</div>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}