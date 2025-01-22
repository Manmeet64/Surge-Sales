// config.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://surge-2kig.onrender.com';

// Helper function for API calls
export const apiUrl = (path) => `${API_BASE_URL}${path}`;
