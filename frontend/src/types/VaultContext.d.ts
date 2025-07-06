// Type definitions for Vault and Team Collaboration features

export interface VaultMember {
  userId: string;
  email: string;
  role: 'owner' | 'edit' | 'view';
  status: 'active' | 'pending' | 'removed';
  joinedAt: string;
}

export interface Vault {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
  members: VaultMember[];
}

export interface VaultInvitation {
  id: string;
  vaultId: string;
  vaultName: string;
  email: string;
  role: 'edit' | 'view';
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: string;
  invitedBy: string;
  expiresAt?: string;
}

export interface VaultContextType {
  vaults: Vault[];
  currentVault: Vault | null;
  loading: boolean;
  error: string | null;
  invitations: VaultInvitation[];
  vaultMembers: Record<string, VaultMember[]>;
  
  // Vault management
  setCurrentVault: (vault: Vault | null) => void;
  createVault: (vaultData: Partial<Vault>) => Promise<Vault>;
  fetchVaults: () => Promise<Vault[]>;
  updateVault: (id: string, updates: Partial<Vault>) => Promise<boolean>;
  deleteVault: (id: string) => Promise<boolean>;
  
  // Collaboration
  inviteUserToVault: (vaultId: string, email: string, role: 'edit' | 'view') => Promise<VaultInvitation>;
  acceptInvitation: (invitationId: string) => Promise<boolean>;
  rejectInvitation: (invitationId: string) => Promise<boolean>;
  removeUserFromVault: (vaultId: string, userId: string) => Promise<boolean>;
  updateUserRole: (vaultId: string, userId: string, newRole: 'edit' | 'view') => Promise<boolean>;
  getVaultMembers: (vaultId: string) => VaultMember[];
  fetchInvitations: () => Promise<VaultInvitation[]>;
  hasPermission: (vaultId: string, userId: string, action: string) => boolean;
}

export type VaultPermission = 'view' | 'edit' | 'invite' | 'remove_member' | 'delete_vault';
