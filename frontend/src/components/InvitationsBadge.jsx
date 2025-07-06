import React from 'react';
import { useVault } from '../context/VaultContext';

const InvitationsBadge = ({ className = "" }) => {
  const { invitations } = useVault();
  
  const pendingCount = invitations?.filter(inv => inv.status === 'pending').length || 0;
  
  if (pendingCount === 0) return null;
  
  return (
    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${className}`}>
      {pendingCount > 99 ? '99+' : pendingCount}
    </span>
  );
};

export default InvitationsBadge;
