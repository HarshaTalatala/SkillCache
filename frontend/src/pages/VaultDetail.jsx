import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Lock,
  Unlock,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';

const VaultDetail = () => {
  const { vaultId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    vaults,
    loading,
    error,
    hasPermission,
    getVaultMembers
  } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [vaultNotes, setVaultNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);

  // Find the current vault
  const vault = vaults.find(v => v.id === vaultId);

  useEffect(() => {
    if (!vault && !loading) {
      // Vault not found or no access
      navigate('/vaults');
    }
  }, [vault, loading, navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      setNotesLoading(true);
      setNotesError(null);
      try {
        const token = currentUser && (await currentUser.getIdToken());
        const res = await fetch(`/api/vaults/${vaultId}/notes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch notes');
        const data = await res.json();
        setVaultNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        setNotesError(err.message);
        setVaultNotes([]);
      } finally {
        setNotesLoading(false);
      }
    };
    if (vaultId && currentUser) fetchNotes();
  }, [vaultId, currentUser]);

  // --- MOCK DATA & STATE ---
  const MOCK_NOTES = [
    {
      id: 'note1',
      title: 'Welcome to the Vault!',
      content: 'This is your first note. You can edit or delete it, or add more notes to this vault.',
      tags: ['welcome', 'demo'],
      createdBy: vault?.members?.[0]?.email || 'owner@example.com',
      updatedAt: new Date(),
    },
    {
      id: 'note2',
      title: 'Collaboration Tips',
      content: 'Invite your team to this vault and start collaborating securely.',
      tags: ['collaboration'],
      createdBy: vault?.members?.[0]?.email || 'owner@example.com',
      updatedAt: new Date(),
    },
  ];
  const MOCK_MEMBERS = vault?.members?.map(m => ({
    ...m,
    email: m.email || (m.userId === currentUser?.uid ? currentUser?.email : `user${m.userId}@example.com`),
    joinedAt: m.joinedAt || new Date().toISOString(),
  })) || [];

  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isEditNote, setIsEditNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ id: '', title: '', content: '', tags: '' });
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('view');
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isEditVaultModalOpen, setIsEditVaultModalOpen] = useState(false);
  const [vaultForm, setVaultForm] = useState({ name: vault?.name || '', description: vault?.description || '', isPrivate: vault?.isPrivate || true });
  const [isDeleteVaultModalOpen, setIsDeleteVaultModalOpen] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  // Replace userRole and canEdit logic with context-based permission checks:
  const userRole = (() => {
    const vault = vaults.find(v => v.id === vaultId);
    const member = vault?.members?.find(m => m.userId === currentUser?.uid);
    return member?.role || 'view';
  })();
  const canEdit = hasPermission(vaultId, currentUser?.uid, 'edit');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vault) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-medium text-foreground mb-2">Vault not found</h2>
        <p className="text-muted-foreground mb-6">
          The vault you're looking for doesn't exist or you don't have access to it.
        </p>
        <button
          onClick={() => navigate('/vaults')}
          className="nothing-btn-primary flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vaults
        </button>
      </div>
    );
  }

  const filteredNotes = vaultNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(vaultNotes.flatMap(note => note.tags))];

  // --- NOTES CRUD HANDLERS ---
  const handleOpenNoteModal = (note = null) => {
    if (note) {
      setIsEditNote(true);
      setNoteForm({ ...note, tags: note.tags.join(', ') });
    } else {
      setIsEditNote(false);
      setNoteForm({ id: '', title: '', content: '', tags: '' });
    }
    setIsNoteModalOpen(true);
  };
  const handleSaveNote = async (e) => {
    e.preventDefault();
    const tagsArr = noteForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    setNotesLoading(true);
    setNotesError(null);
    try {
      const token = currentUser && (await currentUser.getIdToken());
      const res = await fetch(`/api/vaults/${vaultId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: noteForm.title, content: noteForm.content, tags: tagsArr })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add note');
      const newNote = await res.json();
      setVaultNotes(notes => [newNote, ...notes]);
      setIsNoteModalOpen(false);
    } catch (err) {
      setNotesError(err.message);
    } finally {
      setNotesLoading(false);
    }
  };
  const handleDeleteNote = () => {
    setVaultNotes(notes => notes.filter(n => n.id !== noteToDelete.id));
    setNoteToDelete(null);
  };

  // --- MEMBER MANAGEMENT HANDLERS ---
  const handleInviteMember = (e) => {
    e.preventDefault();
    setMembers(members => [
      ...members,
      {
        userId: `user${Date.now()}`,
        email: inviteEmail,
        role: inviteRole,
        joinedAt: new Date().toISOString(),
      },
    ]);
    setInviteEmail('');
    setInviteRole('view');
    setIsInviteModalOpen(false);
  };
  const handleChangeRole = (userId, newRole) => {
    setMembers(members => members.map(m => m.userId === userId ? { ...m, role: newRole } : m));
  };
  const handleRemoveMember = () => {
    setMembers(members => members.filter(m => m.userId !== memberToRemove.userId));
    setMemberToRemove(null);
  };

  // --- VAULT SETTINGS HANDLERS ---
  const handleEditVault = (e) => {
    e.preventDefault();
    // Just update local state for now
    setVaultForm({ ...vaultForm });
    setIsEditVaultModalOpen(false);
  };
  const handleDeleteVault = () => {
    // For mock, just navigate away
    navigate('/vaults');
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/vaults')}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              title="Back to vaults"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              {vault.isPrivate ? (
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center border-2 border-primary/30">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center border-2 border-green-500/30">
                  <Unlock className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground">{vault.name}</h1>
                <p className="text-xs sm:text-base text-muted-foreground">{vault.description || 'No description'}</p>
              </div>
            </div>
          </div>
          {/* Minimalist Action Buttons Row */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 ml-auto mt-3 sm:mt-0">
            {canEdit && (
              <button
                onClick={() => handleOpenNoteModal()}
                className="p-2 rounded-lg hover:bg-muted transition-colors flex flex-row items-center gap-x-1"
                title="Add Note"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Note</span>
              </button>
            )}
            {(userRole === 'owner' || userRole === 'edit') && (
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors flex flex-row items-center gap-x-1"
                title="Invite"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Invite</span>
              </button>
            )}
            <button
              onClick={() => setShowMembersModal(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors flex flex-row items-center gap-x-1"
              title="Members"
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline">Members</span>
            </button>
            {userRole === 'owner' && (
              <button
                onClick={() => setIsEditVaultModalOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors flex flex-row items-center gap-x-1"
                title="Edit Vault"
              >
                <Edit className="w-5 h-5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
            {userRole === 'owner' && (
              <button
                onClick={() => setIsDeleteVaultModalOpen(true)}
                className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors flex flex-row items-center gap-x-1"
                title="Delete Vault"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nothing-input pl-10 text-xs sm:text-base"
            />
          </div>
        </div>

        {/* Notes Grid */}
        <div className="space-y-4 sm:space-y-6">
          {notesLoading ? (
            <div className="text-center py-8 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2 sm:mb-4"></div>
              <p className="text-muted-foreground">Loading notes...</p>
            </div>
          ) : notesError ? (
            <div className="text-center py-8 sm:py-16 text-red-500">
              <AlertCircle className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4" />
              <p>{notesError}</p>
              <button
                onClick={() => setNotesError(null)}
                className="nothing-btn-primary mt-4"
              >
                Retry
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <FileText className="w-10 h-10 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-2 sm:mb-4" />
              <h3 className="text-base sm:text-xl font-medium text-foreground mb-1 sm:mb-2">
                {vaultNotes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
              </h3>
              <p className="text-xs sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {vaultNotes.length === 0 
                  ? canEdit 
                    ? 'Start building your knowledge vault by adding your first note.'
                    : 'This vault doesn\'t have any notes yet.'
                  : 'Try adjusting your search or tag filters.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              {filteredNotes.map((note) => (
                <div key={note.id} className="">
                  <div className="nothing-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h3 className="font-medium text-base sm:text-lg text-foreground line-clamp-2">
                        {note.title}
                      </h3>
                      {canEdit && (
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-muted rounded" onClick={e => { e.stopPropagation(); handleOpenNoteModal(note); }} title="Edit Note">
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded" onClick={e => { e.stopPropagation(); setNoteToDelete(note); }} title="Delete Note">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-4 line-clamp-3">
                      {note.content}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2 sm:mb-4">
                        {note.tags.map(tag => (
                          <span key={tag} className="tag-pill">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {note.createdBy}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {note.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes Modals */}
        {isNoteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-medium text-foreground mb-4">{isEditNote ? 'Edit Note' : 'Add Note'}</h3>
                <form onSubmit={handleSaveNote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                    <input type="text" className="nothing-input" value={noteForm.title} onChange={e => setNoteForm(f => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Content</label>
                    <textarea className="nothing-input min-h-[100px]" value={noteForm.content} onChange={e => setNoteForm(f => ({ ...f, content: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Tags (comma separated)</label>
                    <input type="text" className="nothing-input" value={noteForm.tags} onChange={e => setNoteForm(f => ({ ...f, tags: e.target.value }))} />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
                    <button type="button" onClick={() => setIsNoteModalOpen(false)} className="nothing-btn-ghost">Cancel</button>
                    <button type="submit" className="nothing-btn-primary">{isEditNote ? 'Save Changes' : 'Add Note'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {noteToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm">
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-xl font-medium text-foreground mb-4">Delete Note?</h3>
                <p className="text-muted-foreground mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setNoteToDelete(null)} className="nothing-btn-ghost">Cancel</button>
                  <button onClick={handleDeleteNote} className="nothing-btn-primary bg-destructive text-white">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Member Modals */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-medium text-foreground mb-4">Invite Member</h3>
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input type="email" className="nothing-input" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                    <select className="nothing-input" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                      <option value="view">View</option>
                      <option value="edit">Edit</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
                    <button type="button" onClick={() => setIsInviteModalOpen(false)} className="nothing-btn-ghost">Cancel</button>
                    <button type="submit" className="nothing-btn-primary">Send Invite</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {memberToRemove && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm">
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-xl font-medium text-foreground mb-4">Remove Member?</h3>
                <p className="text-muted-foreground mb-6">Are you sure you want to remove this member?</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setMemberToRemove(null)} className="nothing-btn-ghost">Cancel</button>
                  <button onClick={handleRemoveMember} className="nothing-btn-primary bg-destructive text-white">Remove</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Vault Edit/Delete Modals */}
        {isEditVaultModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-medium text-foreground mb-4">Edit Vault</h3>
                <form onSubmit={handleEditVault} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <input type="text" className="nothing-input" value={vaultForm.name} onChange={e => setVaultForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                    <textarea className="nothing-input min-h-[80px]" value={vaultForm.description} onChange={e => setVaultForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2 h-4 w-4" checked={vaultForm.isPrivate} onChange={e => setVaultForm(f => ({ ...f, isPrivate: e.target.checked }))} />
                    <label className="text-sm font-medium text-foreground">Private Vault</label>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
                    <button type="button" onClick={() => setIsEditVaultModalOpen(false)} className="nothing-btn-ghost">Cancel</button>
                    <button type="submit" className="nothing-btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {isDeleteVaultModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm">
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-xl font-medium text-foreground mb-4">Delete Vault?</h3>
                <p className="text-muted-foreground mb-6">Are you sure you want to delete this vault? This action cannot be undone.</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setIsDeleteVaultModalOpen(false)} className="nothing-btn-ghost">Cancel</button>
                  <button onClick={handleDeleteVault} className="nothing-btn-primary bg-destructive text-white">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showMembersModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-2xl">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-medium text-foreground mb-4">Members</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className={`w-5 h-5 ${member.role === 'owner' ? 'text-yellow-500' : 'text-primary'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.email}</p>
                          <p className="text-sm text-muted-foreground">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-md border text-xs font-medium ${member.role === 'owner' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : member.role === 'edit' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          <span className="capitalize">{member.role}</span>
                        </div>
                        {userRole === 'owner' && member.role !== 'owner' && member.userId !== currentUser?.uid && (
                          <>
                            <select
                              value={member.role}
                              onChange={e => handleChangeRole(member.userId, e.target.value)}
                              className="text-xs border border-border/50 rounded px-2 py-1 bg-background"
                            >
                              <option value="view">View</option>
                              <option value="edit">Edit</option>
                            </select>
                            <button
                              onClick={() => setMemberToRemove(member)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30 mt-4">
                  <button onClick={() => setShowMembersModal(false)} className="nothing-btn-primary">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultDetail;
