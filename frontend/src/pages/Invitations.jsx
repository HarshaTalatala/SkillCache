import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Eye, 
  Edit, 
  Crown,
  AlertCircle,
  Send,
  UserPlus,
  Search,
  Filter
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';

const Invitations = () => {
  const { currentUser } = useAuth();
  const { 
    invitations, 
    vaults,
    loading, 
    error,
    fetchInvitations, 
    fetchVaults,
    acceptInvitation, 
    rejectInvitation,
    inviteUserToVault
  } = useVault();
  
  const [actionLoading, setActionLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('view');

  useEffect(() => {
    fetchInvitations();
    fetchVaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptInvitation = async (invitationId) => {
    setActionLoading(prev => ({ ...prev, [invitationId]: 'accepting' }));
    try {
      await acceptInvitation(invitationId);
    } catch (error) {
      console.error("Error accepting invitation:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: null }));
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    setActionLoading(prev => ({ ...prev, [invitationId]: 'rejecting' }));
    try {
      await rejectInvitation(invitationId);
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: null }));
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!selectedVault || !inviteEmail) return;

    setActionLoading(prev => ({ ...prev, 'sending': true }));
    try {
      await inviteUserToVault(selectedVault, inviteEmail, inviteRole);
      setInviteEmail('');
      setInviteRole('view');
      setSelectedVault('');
      setIsInviteModalOpen(false);
    } catch (error) {
      console.error("Error sending invitation:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, 'sending': false }));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'edit':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'view':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'edit':
        return 'Can view and edit vault content';
      case 'view':
        return 'Can only view vault content';
      default:
        return 'Unknown permissions';
    }
  };

  const filteredInvitations = invitations?.filter(invitation => {
    const matchesSearch = invitation.vaultName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invitation.invitedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invitation.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  // Get vaults where user can invite others
  const invitableVaults = vaults?.filter(vault => {
    const userMember = vault.members?.find(m => m.userId === currentUser?.uid);
    return userMember && ['owner', 'edit'].includes(userMember.role);
  }) || [];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vault Invitations</h1>
            <p className="text-muted-foreground">Manage vault invitations and collaborate with your team</p>
          </div>
          
          {invitableVaults.length > 0 && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="nothing-btn-primary flex items-center gap-2 max-w-max"
            >
              <Send className="w-4 h-4" />
              Send Invitation
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invitations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nothing-input pl-10"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="nothing-input pl-10 pr-8"
            >
              <option value="all">All Invitations</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Error loading invitations</h3>
              <p className="text-destructive/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Invitations List */}
        {filteredInvitations.length > 0 ? (
          <div className="space-y-4">
            {filteredInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="nothing-card p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-2">
                        Invitation to "{invitation.vaultName}"
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(invitation.role)}
                          <span className="capitalize">{invitation.role} access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(invitation.invitedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>From: {invitation.invitedBy}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {getRoleDescription(invitation.role)}
                      </p>
                      
                      {/* Status Badge */}
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invitation.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : invitation.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {invitation.status === 'pending' && (
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        disabled={actionLoading[invitation.id]}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading[invitation.id] === 'accepting' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRejectInvitation(invitation.id)}
                        disabled={actionLoading[invitation.id]}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading[invitation.id] === 'rejecting' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📬</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No matching invitations' : 'No invitations'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Vault invitations will appear here when you receive them'
              }
            </p>
            {invitableVaults.length > 0 && !searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="nothing-btn-primary flex items-center gap-2 mx-auto"
              >
                <Send className="w-4 h-4" />
                Send First Invitation
              </button>
            )}
          </div>
        )}
      </div>

      {/* Send Invitation Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Send Vault Invitation</h3>
              
              <form onSubmit={handleSendInvitation} className="space-y-4">
                <div>
                  <label htmlFor="vaultSelect" className="block text-sm font-medium text-foreground mb-1">
                    Select Vault
                  </label>
                  <select
                    id="vaultSelect"
                    value={selectedVault}
                    onChange={(e) => setSelectedVault(e.target.value)}
                    className="nothing-input"
                    required
                  >
                    <option value="">Choose a vault...</option>
                    {invitableVaults.map(vault => (
                      <option key={vault.id} value={vault.id}>
                        {vault.name} ({vault.isPrivate ? 'Private' : 'Shared'})
                      </option>
                    ))}
                  </select>
                </div>
                
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
                    disabled={actionLoading.sending}
                    className="nothing-btn-primary flex items-center gap-2"
                  >
                    {actionLoading.sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitations;
