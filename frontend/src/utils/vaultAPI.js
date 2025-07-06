// API functions for Vault & Team Collaboration
// These would integrate with Firebase Firestore in a real implementation

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const VAULTS_COLLECTION = 'vaults';
const INVITATIONS_COLLECTION = 'vault_invitations';

// Vault Management
export const createVault = async (vaultData) => {
  try {
    const docRef = await addDoc(collection(db, VAULTS_COLLECTION), {
      ...vaultData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      members: [{
        userId: vaultData.ownerId,
        email: vaultData.ownerEmail,
        role: 'owner',
        status: 'active',
        joinedAt: serverTimestamp()
      }]
    });
    
    return { id: docRef.id, ...vaultData };
  } catch (error) {
    console.error('Error creating vault:', error);
    throw error;
  }
};

export const fetchUserVaults = async (userId) => {
  try {
    const q = query(
      collection(db, VAULTS_COLLECTION),
      where('members', 'array-contains-any', [
        { userId, status: 'active' }
      ]),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching vaults:', error);
    throw error;
  }
};

export const updateVault = async (vaultId, updates) => {
  try {
    const vaultRef = doc(db, VAULTS_COLLECTION, vaultId);
    await updateDoc(vaultRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating vault:', error);
    throw error;
  }
};

export const deleteVault = async (vaultId) => {
  try {
    await deleteDoc(doc(db, VAULTS_COLLECTION, vaultId));
    
    // Also delete any pending invitations for this vault
    const invitationsQuery = query(
      collection(db, INVITATIONS_COLLECTION),
      where('vaultId', '==', vaultId),
      where('status', '==', 'pending')
    );
    const invitationsSnapshot = await getDocs(invitationsQuery);
    
    const deletePromises = invitationsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error deleting vault:', error);
    throw error;
  }
};

// Team Collaboration
export const inviteUserToVault = async (vaultId, email, role, invitedBy) => {
  try {
    // Check if vault exists and user has permission to invite
    const vaultRef = doc(db, VAULTS_COLLECTION, vaultId);
    const vaultDoc = await getDoc(vaultRef);
    
    if (!vaultDoc.exists()) {
      throw new Error('Vault not found');
    }
    
    const vaultData = vaultDoc.data();
    
    // Check if user already exists in vault
    const existingMember = vaultData.members?.find(member => member.email === email);
    if (existingMember) {
      throw new Error('User is already a member of this vault');
    }
    
    // Check for pending invitation
    const existingInvitationQuery = query(
      collection(db, INVITATIONS_COLLECTION),
      where('vaultId', '==', vaultId),
      where('email', '==', email),
      where('status', '==', 'pending')
    );
    const existingInvitationSnapshot = await getDocs(existingInvitationQuery);
    
    if (!existingInvitationSnapshot.empty) {
      throw new Error('Invitation already sent to this email');
    }
    
    // Create invitation
    const invitationData = {
      vaultId,
      vaultName: vaultData.name,
      email,
      role,
      status: 'pending',
      invitedAt: serverTimestamp(),
      invitedBy,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    
    const docRef = await addDoc(collection(db, INVITATIONS_COLLECTION), invitationData);
    
    return { id: docRef.id, ...invitationData };
  } catch (error) {
    console.error('Error inviting user:', error);
    throw error;
  }
};

export const fetchUserInvitations = async (userEmail) => {
  try {
    const q = query(
      collection(db, INVITATIONS_COLLECTION),
      where('email', '==', userEmail),
      where('status', '==', 'pending'),
      orderBy('invitedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching invitations:', error);
    throw error;
  }
};

export const acceptInvitation = async (invitationId, userId) => {
  try {
    const invitationRef = doc(db, INVITATIONS_COLLECTION, invitationId);
    const invitationDoc = await getDoc(invitationRef);
    
    if (!invitationDoc.exists()) {
      throw new Error('Invitation not found');
    }
    
    const invitationData = invitationDoc.data();
    
    // Add user to vault members
    const vaultRef = doc(db, VAULTS_COLLECTION, invitationData.vaultId);
    await updateDoc(vaultRef, {
      members: arrayUnion({
        userId,
        email: invitationData.email,
        role: invitationData.role,
        status: 'active',
        joinedAt: serverTimestamp()
      }),
      updatedAt: serverTimestamp()
    });
    
    // Update invitation status
    await updateDoc(invitationRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

export const rejectInvitation = async (invitationId) => {
  try {
    const invitationRef = doc(db, INVITATIONS_COLLECTION, invitationId);
    await updateDoc(invitationRef, {
      status: 'rejected',
      rejectedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error rejecting invitation:', error);
    throw error;
  }
};

export const removeUserFromVault = async (vaultId, userId, userEmail) => {
  try {
    const vaultRef = doc(db, VAULTS_COLLECTION, vaultId);
    const vaultDoc = await getDoc(vaultRef);
    
    if (!vaultDoc.exists()) {
      throw new Error('Vault not found');
    }
    
    const vaultData = vaultDoc.data();
    const memberToRemove = vaultData.members?.find(member => member.userId === userId);
    
    if (!memberToRemove) {
      throw new Error('User is not a member of this vault');
    }
    
    if (memberToRemove.role === 'owner') {
      throw new Error('Cannot remove vault owner');
    }
    
    // Remove user from vault members
    await updateDoc(vaultRef, {
      members: arrayRemove(memberToRemove),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error removing user from vault:', error);
    throw error;
  }
};

export const updateUserRole = async (vaultId, userId, newRole) => {
  try {
    const vaultRef = doc(db, VAULTS_COLLECTION, vaultId);
    const vaultDoc = await getDoc(vaultRef);
    
    if (!vaultDoc.exists()) {
      throw new Error('Vault not found');
    }
    
    const vaultData = vaultDoc.data();
    const members = vaultData.members || [];
    
    const updatedMembers = members.map(member => 
      member.userId === userId 
        ? { ...member, role: newRole }
        : member
    );
    
    await updateDoc(vaultRef, {
      members: updatedMembers,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Utility functions
export const hasVaultPermission = (vault, userId, action) => {
  if (!vault || !vault.members) return false;
  
  const member = vault.members.find(m => m.userId === userId);
  if (!member || member.status !== 'active') return false;
  
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

export const getVaultRole = (vault, userId) => {
  if (!vault || !vault.members) return null;
  
  const member = vault.members.find(m => m.userId === userId);
  return member?.status === 'active' ? member.role : null;
};
