import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit, 
  MoreVertical, 
  AlertCircle, 
  Users, 
  Mail, 
  UserPlus, 
  Crown, 
  Eye, 
  EditIcon,
  CheckCircle,
  XCircle,
  Shield,
  UserMinus,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';

const Vaults = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    vaults, 
    loading, 
    error, 
    invitations,
    fetchVaults, 
    createVault, 
    deleteVault,
    inviteUserToVault,
    acceptInvitation,
    rejectInvitation,
    removeUserFromVault,
    updateUserRole,
    getVaultMembers,
    fetchInvitations,
    hasPermission
  } = useVault();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('view');
  const [newVaultData, setNewVaultData] = useState({
    name: '',
    description: '',
    isPrivate: true,
    ownerId: currentUser?.uid,
    ownerEmail: currentUser?.email
  });
  
  // Use only real vaults from backend
  const displayVaults = vaults || [];
  
  useEffect(() => {
    fetchVaults();
    fetchInvitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVaultData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCreateVault = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to create a vault.');
      return;
    }
    if (!newVaultData.name) {
      alert('Vault name is required.');
      return;
    }
    try {
      // Optionally show a loading spinner here
      await createVault({
        ...newVaultData,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email
      });
      setNewVaultData({
        name: '',
        description: '',
        isPrivate: true,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      alert(error.message || "Error creating vault");
      console.error("Error creating vault:", error);
    }
  };
  
  const handleDeleteVault = async (id) => {
    if (window.confirm("Are you sure you want to delete this vault? This action cannot be undone.")) {
      try {
        await deleteVault(id);
      } catch (error) {
        console.error("Error deleting vault:", error);
      }
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!selectedVault) return;
    
    try {
      await inviteUserToVault(selectedVault.id, inviteEmail, inviteRole);
      setInviteEmail('');
      setInviteRole('view');
      setIsInviteModalOpen(false);
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await acceptInvitation(invitationId);
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    try {
      await rejectInvitation(invitationId);
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    }
  };

  const handleRemoveUser = async (vaultId, userId) => {
    if (window.confirm("Are you sure you want to remove this user from the vault?")) {
      try {
        await removeUserFromVault(vaultId, userId);
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  };

  const handleRoleChange = async (vaultId, userId, newRole) => {
    try {
      await updateUserRole(vaultId, userId, newRole);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const openInviteModal = (vault) => {
    setSelectedVault(vault);
    setIsInviteModalOpen(true);
  };

  const openMembersModal = (vault) => {
    setSelectedVault(vault);
    setIsMembersModalOpen(true);
  };

  const handleVaultClick = (vault) => {
    // Navigate to vault detail page
    navigate(`/vaults/${vault.id}`);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'edit':
        return <EditIcon className="w-4 h-4 text-blue-500" />;
      case 'view':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'edit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'view':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-8 text-primary" />
              Knowledge Vaults
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Organize and protect your specialized knowledge collections</p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="nothing-btn-primary flex items-center gap-2 w-full sm:w-auto justify-center px-3 py-1.5 text-xs sm:text-sm"
            disabled={!currentUser || loading}
          >
            <Plus className="w-4 h-4" />
            New Vault
          </button>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Error loading vaults</h3>
              <p className="text-destructive/80 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Pending Invitations */}
        {invitations && invitations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              <div>
                <h2 className="text-base sm:text-lg font-medium text-foreground">Pending Invitations</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {invitations.length} invitation{invitations.length !== 1 ? 's' : ''} waiting for response
                </p>
              </div>
            </div>
            
            <div className="grid gap-3 sm:gap-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="nothing-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-base sm:text-lg mb-1">
                          {invitation.vaultName}
                        </h4>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                          <span>by {invitation.invitedBy}</span>
                          <span>•</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                            invitation.role === 'edit' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {getRoleIcon(invitation.role)}
                            <span className="capitalize">{invitation.role}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        title="Accept invitation"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      
                      <button
                        onClick={() => handleRejectInvitation(invitation.id)}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        title="Reject invitation"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Vaults Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 sm:gap-6">
            {displayVaults.map((vault) => (
              <div
                key={vault.id}
                className="nothing-card p-3 sm:p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group cursor-pointer"
                onClick={() => handleVaultClick(vault)}
              >
                {/* Header: icon, name, menu */}
                <div className="flex flex-row items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {vault.isPrivate ? (
                      <div className="w-7 h-7 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center border-2 border-primary/30 group-hover:scale-110 transition-transform duration-300">
                        <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center border-2 border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                        <Unlock className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-medium text-base sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">{vault.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                        Created {new Date(vault.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    className="p-1 sm:p-2 rounded-xl hover:bg-muted transition-all duration-300 group-hover:bg-primary/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4">
                  {vault.description || "No description provided."}
                </p>

                {/* Members and Role: horizontal on all, smaller icons on mobile */}
                <div className="flex flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-muted/50 rounded-lg">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{vault.members?.length || 0} member{vault.members?.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-muted/50 rounded-lg">
                    <span className="flex items-center gap-1">
                      {/* Make role icon smaller on mobile */}
                      <span className="inline-flex items-center">
                        {React.cloneElement(getRoleIcon(vault.members?.find(m => m.userId === currentUser?.uid)?.role || 'view'), { className: 'w-3.5 h-3.5 sm:w-4 sm:h-4' })}
                      </span>
                      <span className="capitalize text-muted-foreground">
                        {vault.members?.find(m => m.userId === currentUser?.uid)?.role || 'view'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Footer: Vault type and actions, horizontal, icons smaller on mobile */}
                <div className="pt-2 sm:pt-4 border-t border-border/30 flex flex-row items-center justify-between gap-2 sm:gap-0">
                  <div className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-lg ${
                    vault.isPrivate 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {vault.isPrivate ? <span className="inline-flex items-center gap-1"><Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" />Private vault</span> : <span className="inline-flex items-center gap-1"><Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" />Shared vault</span>}
                  </div>
                  <div className="flex flex-row flex-wrap gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
                    {hasPermission(vault.id, currentUser?.uid, 'invite') && (
                      <button
                        onClick={() => openInviteModal(vault)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-all duration-300"
                        title="Invite users"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openMembersModal(vault)}
                      className="p-1.5 sm:p-2 rounded-xl hover:bg-green-500/10 hover:text-green-500 transition-all duration-300"
                      title="View members"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 sm:p-2 rounded-xl hover:bg-muted transition-all duration-300"
                      title="Edit vault"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {hasPermission(vault.id, currentUser?.uid, 'delete_vault') && (
                      <button
                        onClick={() => handleDeleteVault(vault.id)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                        title="Delete vault"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {displayVaults.length === 0 && (
              <div className="col-span-full text-center py-8 sm:py-12">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto border-2 border-primary/30 shadow-lg">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl -z-10 mx-auto w-12 h-12 sm:w-16 sm:h-16"></div>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  No vaults yet
                </h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed text-xs sm:text-sm">
                  Create your first knowledge vault to organize specialized content and collaborate with your team
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="nothing-btn-primary flex items-center gap-2 mx-auto text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Vault
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create Vault Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-[95vw] max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-3 sm:p-6">
              <h3 className="text-xl font-medium text-foreground mb-4">Create New Vault</h3>
              
              <form onSubmit={handleCreateVault} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Vault Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newVaultData.name}
                    onChange={handleInputChange}
                    className="nothing-input text-base px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
                    placeholder="Enter vault name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newVaultData.description}
                    onChange={handleInputChange}
                    className="nothing-input min-h-[100px] text-base px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
                    placeholder="Enter a brief description"
                  />
                </div>
                <div className="flex items-center mt-2 mb-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    name="isPrivate"
                    checked={newVaultData.isPrivate}
                    onChange={handleInputChange}
                    className="mr-2 h-5 w-5 accent-primary focus:ring-2 focus:ring-primary/60"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-medium text-foreground">
                    Private Vault
                  </label>
                </div>
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="nothing-btn-ghost text-base px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="nothing-btn-primary text-base px-4 py-2 rounded-lg"
                    disabled={!currentUser || loading}
                  >
                    Create Vault
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Invite User Modal */}
      {isInviteModalOpen && selectedVault && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md">
            <div className="p-4 sm:p-6">
              <h3 className="text-xl font-medium text-foreground mb-4">
                Invite User to "{selectedVault.name}"
              </h3>
              
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label htmlFor="inviteEmail" className="block text-sm font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="inviteEmail"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="nothing-input"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="inviteRole" className="block text-sm font-medium text-foreground mb-1">
                    Role
                  </label>
                  <select
                    id="inviteRole"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="nothing-input"
                  >
                    <option value="view">View Only</option>
                    <option value="edit">Edit Access</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    View: Can see vault contents | Edit: Can add and modify content
                  </p>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="nothing-btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="nothing-btn-primary"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {isMembersModalOpen && selectedVault && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-2xl">
            <div className="p-4 sm:p-6">
              <h3 className="text-xl font-medium text-foreground mb-4">
                Members of "{selectedVault.name}"
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getVaultMembers(selectedVault.id).map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getRoleColor(member.role)}`}>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          <span className="capitalize">{member.role}</span>
                        </div>
                      </div>
                      
                      {hasPermission(selectedVault.id, currentUser?.uid, 'remove_member') && 
                       member.role !== 'owner' && member.userId !== currentUser?.uid && (
                        <>
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(selectedVault.id, member.userId, e.target.value)}
                            className="text-xs border border-border/50 rounded px-2 py-1 bg-background"
                          >
                            <option value="view">View</option>
                            <option value="edit">Edit</option>
                          </select>
                          
                          <button
                            onClick={() => handleRemoveUser(selectedVault.id, member.userId)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remove user"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30 mt-4">
                <button
                  onClick={() => setIsMembersModalOpen(false)}
                  className="nothing-btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaults;
