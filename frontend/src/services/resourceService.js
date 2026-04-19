import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/resources';

export const getAllResources = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.location) params.append('location', filters.location);
  if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createResource = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const updateResourceStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
