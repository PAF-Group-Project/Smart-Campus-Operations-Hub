import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Beaker, Monitor, LayoutDashboard, Wrench, Activity, Settings, AlertTriangle } from 'lucide-react';

const TYPE_CONFIG = {
  LAB:          { label: 'Laboratory',    color: 'bg-blue-100 text-blue-800',    icon: Beaker },
  LECTURE_HALL: { label: 'Lecture Hall',  color: 'bg-purple-100 text-purple-800', icon: Monitor },
  MEETING_ROOM: { label: 'Meeting Room',  color: 'bg-orange-100 text-orange-800', icon: LayoutDashboard },
  EQUIPMENT:    { label: 'Equipment',     color: 'bg-gray-100 text-gray-700',     icon: Settings },
};

const STATUS_CONFIG = {
  ACTIVE:            { label: 'Active',            color: 'bg-green-100 text-green-700',  icon: Activity },
  UNDER_MAINTENANCE: { label: 'Maintenance',       color: 'bg-yellow-100 text-yellow-700', icon: Wrench },
  OUT_OF_SERVICE:    { label: 'Out of Service',    color: 'bg-red-100 text-red-700',      icon: AlertTriangle },
};

const RESOURCE_IMAGE_FALLBACKS = {
  LAB: '/images/resources/laboratory.jpg',
  LECTURE_HALL: '/images/resources/campus-building.jpg',
  MEETING_ROOM: '/images/resources/campus-building.jpg',
  EQUIPMENT: '/images/resources/fitness-center.jpg',
  SPORTS: '/images/resources/sports-hall.jpg',
};

const getResourceImage = (resource) => {
  if (resource.imageUrl) return resource.imageUrl;

  const searchText = [
    resource.name,
    resource.type,
    resource.description,
    resource.building,
    resource.location,
  ].filter(Boolean).join(' ').toLowerCase();

  if (/(lab|laboratory|microscope|science|medical|research)/.test(searchText)) {
    return RESOURCE_IMAGE_FALLBACKS.LAB;
  }

  if (/(gym|fitness|treadmill|workout|exercise|equipment)/.test(searchText)) {
    return RESOURCE_IMAGE_FALLBACKS.EQUIPMENT;
  }

  if (/(sport|arena|court|stadium|indoor)/.test(searchText)) {
    return RESOURCE_IMAGE_FALLBACKS.SPORTS;
  }

  return RESOURCE_IMAGE_FALLBACKS[resource.type] || RESOURCE_IMAGE_FALLBACKS.MEETING_ROOM;
};

export const TypeBadge = ({ type }) => {
  const cfg = TYPE_CONFIG[type] || { label: type, color: 'bg-gray-100 text-gray-700', icon: Settings };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: Settings };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

export const ResourceCard = ({ resource }) => {
  const typeIcon = TYPE_CONFIG[resource.type]?.icon || Settings;
  const TypeIcon = typeIcon;
  const amenities = resource.amenities || [];
  const visibleAmenities = amenities.slice(0, 3);
  const extraCount = amenities.length - 3;
  const resourceImage = getResourceImage(resource);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex flex-col">
      {resourceImage ? (
        <div className="h-44 overflow-hidden relative flex-shrink-0">
          <img
            src={resourceImage}
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={resource.status} />
          </div>
        </div>
      ) : (
        <div className="h-36 flex-shrink-0 relative flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%)' }}>
          <TypeIcon className="w-12 h-12 text-indigo-300" strokeWidth={1.5} />
          <div className="absolute top-3 right-3">
            <StatusBadge status={resource.status} />
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <TypeBadge type={resource.type} />
        </div>
        <h3 className="font-bold text-base text-gray-900 mb-3 line-clamp-1">{resource.name}</h3>

        <div className="space-y-1.5 mb-4 flex-1">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{resource.location}</span>
          </div>
          {resource.building && (
            <div className="flex items-center text-sm text-gray-500">
              <LayoutDashboard size={14} className="mr-1.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{resource.building}{resource.floor !== null && resource.floor !== undefined ? `, Floor ${resource.floor}` : ''}</span>
            </div>
          )}
          {resource.type !== 'EQUIPMENT' && resource.capacity != null && (
            <div className="flex items-center text-sm text-gray-500">
              <Users size={14} className="mr-1.5 text-gray-400 flex-shrink-0" />
              <span>Capacity: {resource.capacity}</span>
            </div>
          )}
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {visibleAmenities.map((a) => (
              <span key={a} className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                {a}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        <Link
          to={`/resources/${resource.id}`}
          className="block w-full text-center py-2 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-semibold transition-all duration-200 mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
