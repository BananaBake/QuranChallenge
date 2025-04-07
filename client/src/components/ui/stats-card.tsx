import { ArabesqueBorder } from "./arabesque-border";

interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function StatsCard({ title, value, className = "" }: StatsCardProps) {
  return (
    <ArabesqueBorder className={className}>
      <div className="p-4">
        <p className="text-center text-gray-600 text-sm">{title}</p>
        <p className="text-center text-3xl font-bold text-primary">{value}</p>
      </div>
    </ArabesqueBorder>
  );
}
