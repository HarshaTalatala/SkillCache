import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const VaultContext = createContext();

// Helper to get API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api/vaults'
  : 'https://<YOUR_AZURE_BACKEND_URL>/api/vaults');

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
  const [invitations, setInvitations] = useState([]);
  const [vaultMembers, setVaultMembers] = useState({});
  const { currentUser } = useAuth();

  // Helper to get ID token
  const getIdToken = async () => {
    if (!currentUser) throw new Error('Not authenticated');
    return await currentUser.getIdToken();
  };

  // Create a new vault
  const createVault = async (vaultData) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vaultData)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create vault');
      const newVault = await res.json();
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
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch vaults');
      const data = await res.json();
      setVaults(data);
      return data;
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
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update vault');
      const updatedVault = await res.json();
      setVaults(prevVaults => prevVaults.map(vault => vault.id === id ? updatedVault : vault));
      if (currentVault?.id === id) setCurrentVault(updatedVault);
      return updatedVault;
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
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete vault');
      setVaults(prevVaults => prevVaults.filter(vault => vault.id !== id));
      if (currentVault?.id === id) setCurrentVault(null);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Invite user to vault
  const inviteUserToVault = async (vaultId, email, role = 'view') => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/${vaultId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, role })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to send invitation');
      const invitation = await res.json();
      setInvitations(prev => [...prev, invitation]);
      return invitation;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Accept vault invitation
  const acceptInvitation = async (invitationId) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/invitations/${invitationId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to accept invitation');
      // Remove invitation from local state
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      // Optionally, refetch vaults
      await fetchVaults();
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reject vault invitation
  const rejectInvitation = async (invitationId) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/invitations/${invitationId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to reject invitation');
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove user from vault
  const removeUserFromVault = async (vaultId, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to remove user
      
      // For now, just update local state - ready for backend integration
      setVaults(prevVaults => 
        prevVaults.map(vault => 
          vault.id === vaultId 
            ? {
                ...vault,
                members: vault.members.filter(member => member.userId !== userId)
              }
            : vault
        )
      );
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user role in vault
  const updateUserRole = async (vaultId, userId, newRole) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to update user role
      
      // For now, just update local state - ready for backend integration
      setVaults(prevVaults => 
        prevVaults.map(vault => 
          vault.id === vaultId 
            ? {
                ...vault,
                members: vault.members.map(member => 
                  member.userId === userId 
                    ? { ...member, role: newRole }
                    : member
                )
              }
            : vault
        )
      );
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get vault members
  const getVaultMembers = (vaultId) => {
    const vault = vaults.find(v => v.id === vaultId);
    return vault?.members || [];
  };

  // Get pending invitations
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/invitations/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch invitations');
      const data = await res.json();
      setInvitations(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to perform action
  const hasPermission = (vaultId, userId, action) => {
    const vault = vaults.find(v => v.id === vaultId);
    if (!vault) return false;
    
    const member = vault.members.find(m => m.userId === userId);
    if (!member) return false;
    
    switch (action) {
      case 'view':
        return ['owner', 'edit', 'view'].includes(member.role);
      case 'edit':
        return ['owner', 'edit'].includes(member.role);
      case 'invite':
        return ['owner', 'edit'].includes(member.role);
      case 'remove_member':
        return member.role === 'owner';
      case 'delete_vault':
        return member.role === 'owner';
      default:
        return false;
    }
  };

  const value = {
    vaults,
    currentVault,
    loading,
    error,
    invitations,
    vaultMembers,
    setCurrentVault,
    createVault,
    fetchVaults,
    updateVault,
    deleteVault,
    inviteUserToVault,
    acceptInvitation,
    rejectInvitation,
    removeUserFromVault,
    updateUserRole,
    getVaultMembers,
    fetchInvitations,
    hasPermission
  };

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
};

export default VaultContext;
