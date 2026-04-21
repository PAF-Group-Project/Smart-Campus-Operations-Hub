import api from '../api/axios';

const RESOURCE_PATH = '/resources';

export const getAllResources = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.location) params.append('location', filters.location);
  if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);

  const queryString = params.toString();
  const response = await api.get(
    queryString ? `${RESOURCE_PATH}?${queryString}` : RESOURCE_PATH
  );
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`${RESOURCE_PATH}/${id}`);
  return response.data;
};

export const createResource = async (data) => {
  const response = await api.post(RESOURCE_PATH, data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`${RESOURCE_PATH}/${id}`, data);
  return response.data;
};

export const updateResourceStatus = async (id, status) => {
  const response = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status });
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`${RESOURCE_PATH}/${id}`);
  return response.data;
};
