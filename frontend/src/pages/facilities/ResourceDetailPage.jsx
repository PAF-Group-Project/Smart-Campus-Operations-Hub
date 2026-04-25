import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {ArrowLeft, MapPin, Users, Calendar, AlertTriangle, Activity, Wrench, Settings, Edit2, Trash2 } from 'lucide-react';
import { getResourceById, deleteResource, updateResource, updateResourceStatus } from '../../services/resourceService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ResourceFormModal } from '../../components/facilities/ResourceFormModal';

export const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });
  
  const fetchResource = async () => {
    setLoading(true);
    try {
      const data = await getResourceById(id);
      const resourceData = data?.data ?? data;
      setResource(resourceData);
    } catch (error) {
      setNotice({ type: 'error', message: 'Failed to load facility details.' });
      navigate('/facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this facility? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteResource(id);
        setNotice({ type: 'success', message: 'Facility deleted successfully.' });
        navigate('/facilities');
      } catch (error) {
        setNotice({ type: 'error', message: 'Failed to delete facility.' });
        setIsDeleting(false);
      }
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateResource(id, data);
      setNotice({ type: 'success', message: 'Facility updated successfully.' });
      setIsEditModalOpen(false);
      fetchResource();
    } catch (error) {
      setNotice({ type: 'error', message: 'Failed to update facility.' });
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateResourceStatus(id, newStatus);
      setNotice({ type: 'success', message: 'Status updated successfully.' });
      fetchResource();
    } catch (error) {
      setNotice({ type: 'error', message: 'Failed to update status.' });
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;
  if (!resource) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success" className="flex items-center gap-1"><Activity size={14}/> Active</Badge>;
      case 'UNDER_MAINTENANCE': return <Badge variant="warning" className="flex items-center gap-1"><Wrench size={14}/> Under Maintenance</Badge>;
      case 'OUT_OF_SERVICE': return <Badge variant="danger" className="flex items-center gap-1"><AlertTriangle size={14}/> Out of Service</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex gap-4 items-center">
        <Link to="/facilities" className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Facility Details</h1>
      </div>
      {notice.message && (
        <p className={`mb-4 text-sm ${notice.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
          {notice.message}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        {resource.imageUrl ? (
          <div className="h-64 sm:h-80 w-full relative">
            <img src={resource.imageUrl} alt={resource.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-r from-primary-50 to-primary-100 flex items-center justify-center">
            <Settings className="w-16 h-16 text-primary-200" />
          </div>
        )}
        
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{resource.name}</h2>
                {getStatusBadge(resource.status)}
              </div>
              <div className="text-lg text-primary-600 font-medium">{resource.type.replace('_', ' ')}</div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} className="flex items-center shadow-sm">
                <Edit2 size={16} className="mr-2" /> Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={isDeleting} className="flex items-center shadow-sm">
                <Trash2 size={16} className="mr-2" /> Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 border-r border-gray-100 pr-0 md:pr-8 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center"><MapPin className="mr-2 w-4 h-4" /> Location</h3>
                <p className="text-gray-900 font-medium">{resource.location}</p>
              </div>
              
              {resource.capacity && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center"><Users className="mr-2 w-4 h-4" /> Capacity</h3>
                  <p className="text-gray-900 font-medium">{resource.capacity} people</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center"><Settings className="mr-2 w-4 h-4" /> Quick Actions</h3>
                <select 
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-primary-500"
                  value={resource.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="ACTIVE">Set to Active</option>
                  <option value="UNDER_MAINTENANCE">Set to Maintenance</option>
                  <option value="OUT_OF_SERVICE">Set to Out of Service</option>
                </select>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {resource.description || "No description provided for this facility."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Calendar className="mr-2 w-5 h-5 text-primary-500" /> Availability Windows</h3>
                {resource.availabilityWindows && resource.availabilityWindows.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resource.availabilityWindows.map((window, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center justify-between">
                        <span className="font-semibold text-gray-700 w-24">{window.dayOfWeek}</span>
                        <span className="bg-white px-3 py-1 rounded text-sm text-gray-600 font-medium border border-gray-200">
                           {window.startTime} - {window.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500">
                    No availability patterns defined for this resource.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ResourceFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSubmit={handleUpdate}
        initialData={resource}
      />
    </div>
  );
};
