import React, { createContext, useContext, useState } from 'react';
import { imageService } from '../services/api';

// Create the context
const ApiContext = createContext();

// Custom hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Provider component
export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState({
    message: 'Loading...',
    showProgress: false,
    variant: 'spinner'
  });

  // Start loading with optional configuration
  const startLoading = (config = {}) => {
    setLoadingConfig({
      ...loadingConfig,
      ...config
    });
    setLoading(true);
  };

  // Stop loading
  const stopLoading = () => {
    setLoading(false);
  };

  // API request wrapper with loading state
  const apiRequest = async (url, options = {}) => {
    try {
      startLoading(options.loadingConfig);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    } finally {
      stopLoading();
    }
  };

  // Value object to be provided to consumers
  const value = {
    loading,
    loadingConfig,
    startLoading,
    stopLoading,
    apiRequest,
    imageService
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
      {loading && (
        <div className="global-loading">
          <div className="loading-overlay"></div>
          <div className="loading-content">
            {loadingConfig.variant === 'spinner' ? (
              <div className="loading-spinner"></div>
            ) : (
              <div className="loading-bar">
                <div className="loading-bar-progress"></div>
              </div>
            )}
            {loadingConfig.message && (
              <p className="loading-message">{loadingConfig.message}</p>
            )}
          </div>
        </div>
      )}
    </ApiContext.Provider>
  );
};

export default ApiContext;
