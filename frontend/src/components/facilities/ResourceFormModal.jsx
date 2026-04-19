import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ResourceFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    description: '',
    imageUrl: '',
    availabilityWindows: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        capacity: initialData.capacity || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        status: 'ACTIVE',
        description: '',
        imageUrl: '',
        availabilityWindows: []
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddWindow = () => {
    setFormData(prev => ({
      ...prev,
      availabilityWindows: [
        ...prev.availabilityWindows, 
        { dayOfWeek: 'MONDAY', startTime: '08:00', endTime: '18:00' }
      ]
    }));
  };

  const handleRemoveWindow = (index) => {
    setFormData(prev => ({
      ...prev,
      availabilityWindows: prev.availabilityWindows.filter((_, i) => i !== index)
    }));
  };

  const handleWindowChange = (index, field, value) => {
    const updatedWindows = [...formData.availabilityWindows];
    updatedWindows[index][field] = value;
    setFormData(prev => ({
      ...prev,
      availabilityWindows: updatedWindows
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : null
    };
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Facility" : "Add Facility"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Laboratory</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. 50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="ACTIVE">Active</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="https://" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"></textarea>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Availability Windows</label>
            <Button type="button" variant="ghost" size="sm" onClick={handleAddWindow} className="text-primary-600 hover:text-primary-700 font-semibold p-0 h-auto">
              <Plus size={16} className="mr-1"/> Add Window
            </Button>
          </div>
          
          {formData.availabilityWindows.length === 0 ? (
            <div className="text-sm text-gray-500 italic p-3bg-gray-50 rounded-md border border-dashed border-gray-200 text-center">No availability windows defined.</div>
          ) : (
            <div className="space-y-3">
              {formData.availabilityWindows.map((window, index) => (
               <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <select 
                    value={window.dayOfWeek}
                    onChange={(e) => handleWindowChange(index, 'dayOfWeek', e.target.value)}
                    className="flex-1 rounded border-gray-300 text-sm p-1.5 outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input 
                    type="time" 
                    value={window.startTime}
                    onChange={(e) => handleWindowChange(index, 'startTime', e.target.value)}
                    className="rounded border-gray-300 text-sm p-1.5 outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <span className="text-gray-400">to</span>
                  <input 
                    type="time" 
                    value={window.endTime}
                    onChange={(e) => handleWindowChange(index, 'endTime', e.target.value)}
                    className="rounded border-gray-300 text-sm p-1.5 outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button type="button" onClick={() => handleRemoveWindow(index)} className="text-red-500 hover:text-red-700 p-1">
                    <X size={16} />
                  </button>
               </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Facility</Button>
        </div>
      </form>
    </Modal>
  );
};
