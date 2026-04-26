import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllResources } from '../services/resourceService';

export const useResources = (initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const debounceRef = useRef(null);

  const refetch = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = {};
      Object.entries(currentFilters || filters).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) activeFilters[k] = v;
      });
      const response = await getAllResources(activeFilters);
      const resources = Array.isArray(response) ? response : (response?.data || []);
      setData(resources);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load resources');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      refetch(filters);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [filters]);

  return { data, loading, error, filters, setFilters, refetch: () => refetch(filters) };
};
