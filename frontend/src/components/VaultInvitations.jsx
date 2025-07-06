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
  AlertCircle 
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

const VaultInvitations = ({ className = "" }) => {
  const { 
    invitations, 
    loading, 
    error,
    fetchInvitations, 
    acceptInvitation, 
    rejectInvitation 
  } = useVault();
  
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchInvitations();
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

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Vault Invitations</h3>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Vault Invitations</h3>
        </div>
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-destructive">Error loading invitations</h4>
            <p className="text-destructive/80 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Vault Invitations</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📬</div>
          <p className="text-muted-foreground">No pending invitations</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Vault Invitations ({invitations.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="nothing-card p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground mb-1">
                    Invitation to "{invitation.vaultName}"
                  </h4>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      {getRoleIcon(invitation.role)}
                      <span className="capitalize">{invitation.role} access</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(invitation.invitedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {getRoleDescription(invitation.role)}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Invited by: {invitation.invitedBy}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleAcceptInvitation(invitation.id)}
                  disabled={actionLoading[invitation.id]}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultInvitations;
