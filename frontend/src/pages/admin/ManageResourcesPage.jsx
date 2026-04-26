import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, RefreshCw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllResources, createResource, updateResource, updateStatus, deleteResource
} from '../../services/resourceService';
import { ResourceFormModal } from '../../components/facilities/ResourceFormModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { TypeBadge, StatusBadge } from '../../components/facilities/ResourceCard';
import { SkeletonRow } from '../../components/ui/SkeletonCard';
import { ResourceAdminGate } from '../../components/facilities/ResourceAdminGate';

const PAGE_SIZE = 10;
const STATUS_CYCLE = { ACTIVE: 'UNDER_MAINTENANCE', UNDER_MAINTENANCE: 'OUT_OF_SERVICE', OUT_OF_SERVICE: 'ACTIVE' };
const SORT_KEYS = { name: 'name', type: 'type', location: 'location', capacity: 'capacity', status: 'status', createdAt: 'createdAt' };

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const ManageResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('ACTIVE');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllResources();
      setResources(Array.isArray(res) ? res : (res?.data || []));
    } catch {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Filter & sort
  const filtered = resources.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.location?.toLowerCase().includes(search.toLowerCase()) ||
    r.type?.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortKey] ?? '';
    let vb = b[sortKey] ?? '';
    if (sortKey === 'capacity') { va = va || 0; vb = vb || 0; }
    if (sortKey === 'createdAt') { va = new Date(va || 0); vb = new Date(vb || 0); }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length && paginated.every(r => selected.has(r.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map(r => r.id)));
    }
  };

  const handleStatusCycle = async (r) => {
    const next = STATUS_CYCLE[r.status] || 'ACTIVE';
    try {
      await updateStatus(r.id, next);
      toast.success(`Status → ${next.replace('_', ' ')}`);
      fetchAll();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleBulkStatus = async () => {
    if (!selected.size) return;
    setBulkLoading(true);
    try {
      await Promise.all([...selected].map(id => updateStatus(id, bulkStatus)));
      toast.success(`Updated ${selected.size} resource(s)`);
      setSelected(new Set());
      fetchAll();
    } catch {
      toast.error('Bulk update failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await createResource(data);
      toast.success('Resource created!');
      setModalOpen(false);
      fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create resource');
      throw e;
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateResource(editTarget.id, data);
      toast.success('Resource updated!');
      setEditTarget(null);
      fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update resource');
      throw e;
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteResource(deleteTarget.id);
      toast.success('Resource deleted');
      setDeleteTarget(null);
      fetchAll();
    } catch {
      toast.error('Failed to delete resource');
    } finally {
      setDeleting(false);
    }
  };

  const SortHeader = ({ k, label }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none"
      onClick={() => handleSort(k)}>
      <span className="flex items-center gap-1">
        {label}
        {sortKey === k && <span className="text-indigo-500">{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </span>
    </th>
  );

  return (
    <ResourceAdminGate>
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Resources</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} resource{filtered.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
            <Plus size={16} /> Add Resource
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, type, location..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-indigo-700">{selected.size} selected</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-500">Change to:</span>
            <div className="relative">
              <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-indigo-200 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="ACTIVE">Active</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button onClick={handleBulkStatus} disabled={bulkLoading}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {bulkLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-indigo-400 hover:text-indigo-600">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={paginated.length > 0 && paginated.every(r => selected.has(r.id))}
                    onChange={toggleAll} className="rounded border-gray-300 text-indigo-600 cursor-pointer" />
                </th>
                <SortHeader k="name" label="Name" />
                <SortHeader k="type" label="Type" />
                <SortHeader k="location" label="Location" />
                <SortHeader k="capacity" label="Capacity" />
                <SortHeader k="status" label="Status" />
                <SortHeader k="createdAt" label="Created At" />
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-gray-400">No resources found</td></tr>
              ) : paginated.map(r => (
                <tr key={r.id} className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors ${selected.has(r.id) ? 'bg-indigo-50/40' : ''}`}>
                  <td className="px-4 py-3.5">
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)}
                      className="rounded border-gray-300 text-indigo-600 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">{r.name}</td>
                  <td className="px-4 py-3.5"><TypeBadge type={r.type} /></td>
                  <td className="px-4 py-3.5 text-gray-500 max-w-[160px] truncate">{r.location}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-center">{r.capacity ?? '—'}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Status cycle button */}
                      <button onClick={() => handleStatusCycle(r)} title="Cycle status"
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Cycle status">
                        <RefreshCw size={14} />
                      </button>
                      {/* Edit */}
                      <button onClick={() => { setEditTarget(r); setModalOpen(true); }}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      {/* Delete */}
                      <button onClick={() => setDeleteTarget(r)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && sorted.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages} · {sorted.length} resources
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pg = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${pg === page ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {pg}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ResourceFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSubmit={editTarget ? handleEdit : handleCreate}
        initialData={editTarget}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
    </ResourceAdminGate>
  );
};
