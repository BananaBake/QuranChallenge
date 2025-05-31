import React from "react"; // Added React import
import { ArabesqueBorder } from "./ArabesqueBorder.jsx";

export function StatsCard({ title, value, icon: Icon, subtitle }) {
  return (
    <ArabesqueBorder className="h-full">
      <div className="p-4 text-center">
        {Icon && (
          <div className="flex justify-center mb-2">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-center text-3xl font-bold text-primary">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </ArabesqueBorder>
  );
}
