import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Users, Calendar, Building2, Layers,
  Edit2, Trash2, Activity, Wrench, AlertTriangle, Settings,
  Beaker, Monitor, LayoutDashboard, Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getResourceById, deleteResource, updateResource } from '../../services/resourceService';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ResourceFormModal } from '../../components/facilities/ResourceFormModal';
import { TypeBadge, StatusBadge } from '../../components/facilities/ResourceCard';
import { useResourceAuth } from '../../context/AuthContext';

const TYPE_ICON = {
  LAB: Beaker, LECTURE_HALL: Monitor, MEETING_ROOM: LayoutDashboard, EQUIPMENT: Settings,
};
const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useResourceAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getResourceById(id);
      setResource(res?.data ?? res);
    } catch {
      toast.error('Resource not found');
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteResource(id);
      toast.success('Resource deleted');
      navigate('/resources');
    } catch {
      toast.error('Failed to delete resource');
      setDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateResource(id, data);
      toast.success('Resource updated!');
      setIsEditOpen(false);
      fetch();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update resource');
      throw e;
    }
  };

  if (loading) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;
  if (!resource) return null;

  const TypeIcon = TYPE_ICON[resource.type] || Settings;

  // Build weekly schedule map
  const scheduleMap = {};
  (resource.availabilityWindows || []).forEach(w => {
    if (!scheduleMap[w.dayOfWeek]) scheduleMap[w.dayOfWeek] = [];
    scheduleMap[w.dayOfWeek].push(`${w.startTime} – ${w.endTime}`);
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Browse
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {resource.imageUrl ? (
          <div className="h-56 w-full overflow-hidden">
            <img src={resource.imageUrl} alt={resource.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
            <TypeIcon className="w-20 h-20 text-indigo-300" strokeWidth={1} />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-gray-900">{resource.name}</h1>
                <StatusBadge status={resource.status} />
              </div>
              <TypeBadge type={resource.type} />
            </div>

            {isAdmin() && (
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setIsEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors">
                  <Edit2 size={15} /> Edit
                </button>
                <button onClick={() => setIsDeleteOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-gray-500">Details</h2>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Location</p>
                <p className="text-sm font-semibold text-gray-800">{resource.location}</p>
              </div>
            </div>

            {resource.building && (
              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Building</p>
                  <p className="text-sm font-semibold text-gray-800">{resource.building}</p>
                </div>
              </div>
            )}

            {resource.floor !== null && resource.floor !== undefined && (
              <div className="flex items-start gap-3">
                <Layers size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Floor</p>
                  <p className="text-sm font-semibold text-gray-800">Floor {resource.floor}</p>
                </div>
              </div>
            )}

            {resource.type !== 'EQUIPMENT' && resource.capacity != null && (
              <div className="flex items-start gap-3">
                <Users size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Capacity</p>
                  <p className="text-sm font-semibold text-gray-800">{resource.capacity} people</p>
                </div>
              </div>
            )}

            {(resource.amenities || []).length > 0 && (
              <div className="flex items-start gap-3">
                <Tag size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.amenities.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Description + Availability */}
        <div className="md:col-span-2 space-y-6">
          {resource.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{resource.description}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-400" /> Availability Schedule
            </h2>
            {(resource.availabilityWindows || []).length === 0 ? (
              <div className="text-sm text-gray-400 italic py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No availability windows defined
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Day</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Slots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_ORDER.map(day => (
                      scheduleMap[day] ? (
                        <tr key={day} className="border-t border-gray-100 hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-700">{day.charAt(0) + day.slice(1).toLowerCase()}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {scheduleMap[day].map((slot, i) => (
                                <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{slot}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ) : null
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResourceFormModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSubmit={handleUpdate} initialData={resource} />
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
};
