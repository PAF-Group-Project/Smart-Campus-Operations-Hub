import React from 'react';
import { PackageX } from 'lucide-react';

export const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        <PackageX className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
