import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Building2, Users, ChevronDown } from 'lucide-react';
import { useResources } from '../../hooks/useResources';
import { ResourceCard } from '../../components/facilities/ResourceCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard';

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'LECTURE_HALL', label: 'Lecture Hall' },
  { value: 'LAB', label: 'Laboratory' },
  { value: 'MEETING_ROOM', label: 'Meeting Room' },
  { value: 'EQUIPMENT', label: 'Equipment' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'capacity_desc', label: 'Capacity High–Low' },
  { value: 'type', label: 'By Type' },
];

const sortResources = (resources, sort) => {
  if (!sort) return resources;
  const arr = [...resources];
  if (sort === 'name_asc') return arr.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'capacity_desc') return arr.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
  if (sort === 'type') return arr.sort((a, b) => a.type.localeCompare(b.type));
  return arr;
};

const SelectFilter = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

export const BrowseResourcesPage = () => {
  const [search, setSearch] = useState('');
  const [localFilters, setLocalFilters] = useState({ type: '', status: '', building: '', minCapacity: '', maxCapacity: '' });
  const [sort, setSort] = useState('');
  const { data: resources, loading } = useResources(localFilters);

  const setFilter = (key, val) => setLocalFilters(prev => ({ ...prev, [key]: val }));

  const clearAll = () => {
    setSearch('');
    setLocalFilters({ type: '', status: '', building: '', minCapacity: '', maxCapacity: '' });
    setSort('');
  };

  const hasFilters = search || Object.values(localFilters).some(Boolean) || sort;

  // Client-side keyword search across name, description, building, location
  const filtered = useMemo(() => {
    if (!search.trim()) return resources;
    const kw = search.trim().toLowerCase();
    return resources.filter(r =>
      (r.name || '').toLowerCase().includes(kw) ||
      (r.description || '').toLowerCase().includes(kw) ||
      (r.building || '').toLowerCase().includes(kw) ||
      (r.location || '').toLowerCase().includes(kw)
    );
  }, [resources, search]);

  const sorted = sortResources(filtered, sort);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden mb-0"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: Math.random() * 60 + 20, height: Math.random() * 60 + 20, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Smart Campus Operations Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Campus Facilities<br /><span className="text-indigo-200">&amp; Resources</span>
          </h1>
          <p className="text-indigo-100 text-lg max-w-xl">
            Browse, discover, and book campus spaces and equipment. Find the perfect resource for your needs.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Keyword search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resources by name, location..."
                className="w-full pl-9 pr-8 py-2 text-sm border border-indigo-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <SelectFilter value={localFilters.type} onChange={v => setFilter('type', v)} options={TYPE_OPTIONS} />
            <SelectFilter value={localFilters.status} onChange={v => setFilter('status', v)} options={STATUS_OPTIONS} />

            {/* Building */}
            <div className="relative">
              <Building2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={localFilters.building}
                onChange={e => setFilter('building', e.target.value)}
                placeholder="Building..."
                className="w-36 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Capacity range */}
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-gray-400 flex-shrink-0" />
              <input type="number" min="0" value={localFilters.minCapacity} onChange={e => setFilter('minCapacity', e.target.value)}
                placeholder="Min" className="w-16 py-2 px-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center" />
              <span className="text-gray-400 text-xs">–</span>
              <input type="number" min="0" value={localFilters.maxCapacity} onChange={e => setFilter('maxCapacity', e.target.value)}
                placeholder="Max" className="w-16 py-2 px-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center" />
            </div>

            {/* Sort */}
            <SelectFilter value={sort} onChange={setSort} options={SORT_OPTIONS} />

            {hasFilters && (
              <button onClick={clearAll}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50">
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : (
              <><span className="font-semibold text-gray-900">{sorted.length}</span> resource{sorted.length !== 1 ? 's' : ''} found</>
            )}
          </p>
          {hasFilters && !loading && (
            <button onClick={clearAll} className="text-xs text-indigo-600 hover:underline">Clear all filters</button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <SlidersHorizontal size={36} className="text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-6 max-w-sm">No resources match your current filters. Try adjusting your search criteria.</p>
            <button onClick={clearAll}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
