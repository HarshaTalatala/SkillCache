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
  const [invitations, setInvitations] = useState([]);
  const [vaultMembers, setVaultMembers] = useState({});

  // Create a new vault
  const createVault = async (vaultData) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to create vault
      
      // For now, just add to local state - ready for backend integration
      const newVault = {
        id: Date.now().toString(),
        ...vaultData,
        createdAt: new Date().toISOString(),
        ownerId: vaultData.ownerId,
        members: [{
          userId: vaultData.ownerId,
          email: vaultData.ownerEmail,
          role: 'owner',
          status: 'active',
          joinedAt: new Date().toISOString()
        }]
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
      
      // For now, return empty array - ready for backend integration
      setVaults([]);
      return [];
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
      
      // For now, just update local state - ready for backend integration
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
      
      // For now, just remove from local state - ready for backend integration
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

  // Invite user to vault
  const inviteUserToVault = async (vaultId, email, role = 'view') => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement API call to send invitation
      
      // For now, just simulate success - ready for backend integration
      const invitation = {
        id: Date.now().toString(),
        vaultId,
        email,
        role,
        status: 'pending',
        invitedAt: new Date().toISOString(),
        invitedBy: 'current-user-id'
      };
      
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
      
      // TODO: Implement API call to accept invitation
      
      // For now, just remove from invitations - ready for backend integration
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) throw new Error('Invitation not found');
      
      // Add user to vault members
      setVaults(prevVaults => 
        prevVaults.map(vault => 
          vault.id === invitation.vaultId 
            ? {
                ...vault,
                members: [...vault.members, {
                  userId: 'current-user-id',
                  email: invitation.email,
                  role: invitation.role,
                  status: 'active',
                  joinedAt: new Date().toISOString()
                }]
              }
            : vault
        )
      );
      
      // Remove invitation
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
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
      
      // TODO: Implement API call to reject invitation
      
      // For now, just remove from invitations - ready for backend integration
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
      
      // TODO: Implement API call to fetch invitations
      
      // For now, return empty array - ready for backend integration
      setInvitations([]);
      return [];
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
