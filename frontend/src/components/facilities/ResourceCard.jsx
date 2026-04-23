import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Settings, Activity, Wrench } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ResourceCard = ({ resource }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success" className="flex items-center gap-1"><Activity size={12}/> Active</Badge>;
      case 'UNDER_MAINTENANCE':
        return <Badge variant="warning" className="flex items-center gap-1"><Wrench size={12}/> Maintenance</Badge>;
      case 'OUT_OF_SERVICE':
        return <Badge variant="danger" className="flex items-center gap-1"><Settings size={12}/> Out of Service</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'LECTURE_HALL': return <Badge variant="primary">Lecture Hall</Badge>;
      case 'LAB': return <Badge variant="info">Laboratory</Badge>;
      case 'MEETING_ROOM': return <Badge variant="default">Meeting Room</Badge>;
      case 'EQUIPMENT': return <Badge variant="default">Equipment</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
      {resource.imageUrl ? (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={resource.imageUrl} 
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
             {getStatusBadge(resource.status)}
          </div>
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border-b border-gray-100 relative">
          <Settings className="w-12 h-12 text-primary-200" />
           <div className="absolute top-3 right-3">
             {getStatusBadge(resource.status)}
          </div>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{resource.name}</h3>
        </div>
        
        <div className="mb-4">
           {getTypeBadge(resource.type)}
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={16} className="mr-2 text-gray-400" />
            <span className="truncate">{resource.location}</span>
          </div>
          {resource.capacity !== null && resource.capacity !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-2 text-gray-400" />
              <span>{resource.capacity} Capacity</span>
            </div>
          )}
        </div>

        <Link 
          to={`/facilities/${resource.id}`}
          className="block w-full text-center py-2 px-4 bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white rounded-lg font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
