import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/5" />
      <div className="h-9 bg-gray-200 rounded mt-4" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-4" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-28" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
  </tr>
);
