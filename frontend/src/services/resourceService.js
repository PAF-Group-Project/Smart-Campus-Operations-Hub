import api from '../api/axios';

const BASE = '/resources';

const buildParams = (obj) => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) params.append(k, v);
  });
  return params.toString();
};

export const getAllResources = async (filters = {}) => {
  const qs = buildParams(filters);
  const response = await api.get(qs ? `${BASE}?${qs}` : BASE);
  return response?.data ?? response;
};

export const getResourceById = async (id) => {
  const response = await api.get(`${BASE}/${id}`);
  return response?.data ?? response;
};

export const searchResources = async (keyword) => {
  const response = await api.get(`${BASE}/search?q=${encodeURIComponent(keyword)}`);
  return response?.data ?? response;
};

export const getResourcesByType = async (type) => {
  const response = await api.get(`${BASE}/type/${type}`);
  return response?.data ?? response;
};

export const getAvailableResources = async () => {
  const response = await api.get(`${BASE}/available`);
  return response?.data ?? response;
};

export const getResourceStats = async () => {
  const response = await api.get(`${BASE}/stats`);
  return response?.data ?? response;
};

export const createResource = async (data) => {
  const response = await api.post(BASE, data);
  return response?.data ?? response;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`${BASE}/${id}`, data);
  return response?.data ?? response;
};

export const updateStatus = async (id, status) => {
  const response = await api.patch(`${BASE}/${id}/status`, { status });
  return response?.data ?? response;
};

export const updateResourceStatus = updateStatus;

export const updateAmenities = async (id, amenities) => {
  const response = await api.patch(`${BASE}/${id}/amenities`, { amenities });
  return response?.data ?? response;
};

export const deleteResource = async (id) => {
  await api.delete(`${BASE}/${id}`);
};
