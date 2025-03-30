import { useNavigate as useRouterNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigator = () => {
  const routerNavigate = useRouterNavigate();
  
  const navigate = useCallback((location, options = {}) => {
    const defaultOptions = {
      replace: false,
      state: {},
      preserveQuery: false
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Handle the navigation via React Router without triggering a full page reload
    // This ensures the socket connection remains alive
    routerNavigate(location, {
      replace: mergedOptions.replace,
      state: mergedOptions.state
    });
  }, [routerNavigate]);
  
  return navigate;
};

export const createUrl = (path, params = {}, query = {}) => {
  let url = path;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });
  
  // Add query parameters if any
  const queryParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  if (queryString) {
    url = `${url}?${queryString}`;
  }
  
  return url;
};

export default {
  useNavigator,
  createUrl
}; 