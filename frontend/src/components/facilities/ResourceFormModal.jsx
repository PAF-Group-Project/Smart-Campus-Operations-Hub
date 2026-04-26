import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const emptyForm = {
  name: '', type: 'LECTURE_HALL', capacity: '', location: '', building: '',
  floor: '', status: 'ACTIVE', description: '', imageUrl: '',
  amenities: [], availabilityWindows: [],
};

export const ResourceFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [amenityInput, setAmenityInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...emptyForm,
        ...initialData,
        capacity: initialData.capacity ?? '',
        floor: initialData.floor ?? '',
        amenities: initialData.amenities || [],
        availabilityWindows: initialData.availabilityWindows || [],
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    setAmenityInput('');
    setLoading(false);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const addAmenity = (raw) => {
    const val = raw.trim().replace(/,$/, '').trim();
    if (val && !formData.amenities.includes(val)) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, val] }));
    }
    setAmenityInput('');
  };

  const handleAmenityKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addAmenity(amenityInput);
    }
  };

  const removeAmenity = (a) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== a) }));
  };

  const handleAddWindow = () => {
    setFormData(prev => ({
      ...prev,
      availabilityWindows: [...prev.availabilityWindows, { dayOfWeek: 'MONDAY', startTime: '08:00', endTime: '18:00' }],
    }));
  };

  const handleRemoveWindow = (i) => {
    setFormData(prev => ({ ...prev, availabilityWindows: prev.availabilityWindows.filter((_, idx) => idx !== i) }));
  };

  const handleWindowChange = (i, field, value) => {
    const updated = [...formData.availabilityWindows];
    updated[i] = { ...updated[i], [field]: value };
    setFormData(prev => ({ ...prev, availabilityWindows: updated }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.type) errs.type = 'Type is required';
    if (formData.type !== 'EQUIPMENT' && formData.capacity !== '' && Number(formData.capacity) < 1) {
      errs.capacity = 'Capacity must be at least 1';
    }
    if (formData.description && formData.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        capacity: formData.type === 'EQUIPMENT' ? null : (formData.capacity !== '' ? parseInt(formData.capacity, 10) : null),
        floor: formData.floor !== '' ? parseInt(formData.floor, 10) : null,
      };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) =>
    `w-full rounded-lg border ${errors[field] ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200'} p-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition bg-gray-50 focus:bg-white`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Resource' : 'Add New Resource'}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        {/* Name & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={fieldClass('name')} placeholder="e.g. Computer Lab A" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
            <select name="type" value={formData.type} onChange={handleChange} className={fieldClass('type')}>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Laboratory</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
        </div>

        {/* Location & Building */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className={fieldClass('location')} placeholder="e.g. Block A, Room 101" />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
            <input type="text" name="building" value={formData.building} onChange={handleChange} className={fieldClass('building')} placeholder="e.g. Block A" />
          </div>
        </div>

        {/* Floor, Capacity, Status */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
            <input type="number" name="floor" value={formData.floor} onChange={handleChange} className={fieldClass('floor')} placeholder="e.g. 2" />
          </div>
          {formData.type !== 'EQUIPMENT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" min="1" name="capacity" value={formData.capacity} onChange={handleChange} className={fieldClass('capacity')} placeholder="e.g. 50" />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>
          )}
          <div className={formData.type === 'EQUIPMENT' ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={fieldClass('status')}>
              <option value="ACTIVE">Active</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
            <span className="text-gray-400 font-normal ml-1">({(formData.description || '').length}/500)</span>
          </label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
            className={`${fieldClass('description')} resize-none`} placeholder="Describe this resource..." />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={fieldClass('imageUrl')} placeholder="https://..." />
        </div>

        {/* Amenities tag input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
          <div className={`min-h-[44px] flex flex-wrap gap-1.5 items-center p-2 rounded-lg border ${errors.amenities ? 'border-red-400' : 'border-gray-200'} bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 focus-within:bg-white transition`}>
            {formData.amenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {a}
                <button type="button" onClick={() => removeAmenity(a)} className="hover:text-indigo-900 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={handleAmenityKeyDown}
              onBlur={() => amenityInput.trim() && addAmenity(amenityInput)}
              placeholder={formData.amenities.length === 0 ? "Type and press Enter or comma..." : "Add more..."}
              className="outline-none bg-transparent text-sm flex-1 min-w-[120px]"
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">Press Enter or comma to add each amenity</p>
        </div>

        {/* Availability Windows */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Availability Windows</label>
            <button type="button" onClick={handleAddWindow}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
              <Plus size={14} /> Add Window
            </button>
          </div>
          {formData.availabilityWindows.length === 0 ? (
            <div className="text-sm text-gray-400 italic p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
              No availability windows defined.
            </div>
          ) : (
            <div className="space-y-2">
              {formData.availabilityWindows.map((w, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <select value={w.dayOfWeek} onChange={(e) => handleWindowChange(i, 'dayOfWeek', e.target.value)}
                    className="flex-1 rounded-md border border-gray-200 text-xs p-1.5 bg-white outline-none focus:ring-1 focus:ring-indigo-400">
                    {DAYS.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                  </select>
                  <input type="time" value={w.startTime} onChange={(e) => handleWindowChange(i, 'startTime', e.target.value)}
                    className="rounded-md border border-gray-200 text-xs p-1.5 bg-white outline-none focus:ring-1 focus:ring-indigo-400" />
                  <span className="text-gray-400 text-xs">to</span>
                  <input type="time" value={w.endTime} onChange={(e) => handleWindowChange(i, 'endTime', e.target.value)}
                    className="rounded-md border border-gray-200 text-xs p-1.5 bg-white outline-none focus:ring-1 focus:ring-indigo-400" />
                  <button type="button" onClick={() => handleRemoveWindow(i)}
                    className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-60">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {initialData ? 'Save Changes' : 'Add Resource'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
