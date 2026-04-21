import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllResources, createResource } from '../../services/resourceService';
import { ResourceCard } from '../../components/facilities/ResourceCard';
import { ResourceFormModal } from '../../components/facilities/ResourceFormModal';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';

export const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    location: '',
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Create a clean filter object with only defined values
      const activeFilters = {};
      if (filters.type) activeFilters.type = filters.type;
      if (filters.location) activeFilters.location = filters.location;
      
      const response = await getAllResources(activeFilters);
      setResources(response.data || []);
    } catch (error) {
      toast.error('Failed to load facilities');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateResource = async (data) => {
    try {
      await createResource(data);
      toast.success('Facility created successfully!');
      setIsModalOpen(false);
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create facility');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facilities & Assets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor campus spaces and equipment</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center shadow-lg hover:shadow-xl transition-all">
          <Plus size={18} className="mr-2" /> Add Facility
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center text-gray-500 font-medium px-2 shrink-0">
          <Filter size={18} className="mr-2"/> Filters
        </div>
        
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
          <select 
            name="type" 
            value={filters.type} 
            onChange={handleFilterChange}
            className="w-full sm:w-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>

          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search by location..." 
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block pl-10 p-2.5"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><LoadingSpinner size="lg" /></div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No facilities found" 
          description="We couldn't find any resources matching your current filters."
          action={
            <Button variant="secondary" onClick={() => setFilters({ type: '', location: '' })}>
              Clear Filters
            </Button>
          }
        />
      )}

      <ResourceFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateResource}
      />
    </div>
  );
};
