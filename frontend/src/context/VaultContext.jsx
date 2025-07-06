import React, { createContext, useContext, useState } from 'react';

const VaultContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

export const VaultProvider = ({ children }) => {
  const [vaults, setVaults] = useState([]);
  const [currentVault, setCurrentVault] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new vault
  const createVault = async (vaultData) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to create vault
      
      // Mock implementation for now
      const newVault = {
        id: Date.now().toString(),
        ...vaultData,
        createdAt: new Date().toISOString()
      };
      
      setVaults(prevVaults => [...prevVaults, newVault]);
      return newVault;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all vaults
  const fetchVaults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to fetch vaults
      
      // Mock implementation for now
      const mockVaults = [
        {
          id: '1',
          name: 'Personal Vault',
          description: 'Personal notes and documents',
          isPrivate: true,
          createdAt: '2024-11-10T00:00:00Z'
        },
        {
          id: '2',
          name: 'Work Vault',
          description: 'Work-related documents and projects',
          isPrivate: false,
          createdAt: '2024-11-15T00:00:00Z'
        }
      ];
      
      setVaults(mockVaults);
      return mockVaults;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a vault
  const updateVault = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to update vault
      
      // Mock implementation for now
      setVaults(prevVaults => 
        prevVaults.map(vault => 
          vault.id === id ? { ...vault, ...updates } : vault
        )
      );
      
      if (currentVault?.id === id) {
        setCurrentVault(prev => ({ ...prev, ...updates }));
      }
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a vault
  const deleteVault = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to delete vault
      
      // Mock implementation for now
      setVaults(prevVaults => prevVaults.filter(vault => vault.id !== id));
      
      if (currentVault?.id === id) {
        setCurrentVault(null);
      }
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    vaults,
    currentVault,
    loading,
    error,
    setCurrentVault,
    createVault,
    fetchVaults,
    updateVault,
    deleteVault
  };

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
};

export default VaultContext;
