import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Temporarily disable for troubleshooting
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    baseURL: request.baseURL
  });
  return request;
});

// Add response interceptor with better error handling
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status);
    return response;
  },
  async error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timed out. Please check your connection.'
      });
    }

    if (!error.response) {
      return Promise.reject({
        message: 'Cannot connect to server. Please check if the server is running.'
      });
    }

    // Add retry logic for 5xx errors only
    if (error.response.status >= 500 && error.config && !error.config._retry) {
      error.config._retry = true;
      return new Promise(resolve => 
        setTimeout(() => resolve(api(error.config)), 2000)
      );
    }

    return Promise.reject(error.response?.data || error);
  }
);

// Add health check function
api.checkHealth = async () => {
  try {
    const response = await api.get('/api/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default api;
