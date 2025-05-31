export function ArabesqueBorder({ children, className = "" }) {
  return (
    <div className={`relative rounded-lg p-0.5 bg-gradient-to-r from-secondary to-primary ${className}`}>
      <div className="rounded-md bg-background h-full">
        {children}
      </div>
    </div>
  );
}
