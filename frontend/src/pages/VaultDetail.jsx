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

  // Find the current vault
  const vault = vaults.find(v => v.id === vaultId);
  const userRole = vault?.members?.find(m => m.userId === currentUser?.uid)?.role || 'view';
  const canEdit = hasPermission(vaultId, currentUser?.uid, 'edit_content');

  useEffect(() => {
    if (!vault && !loading) {
      // Vault not found or no access
      navigate('/vaults');
    }
  }, [vault, loading, navigate]);

  useEffect(() => {
    // Fetch vault notes - this would connect to your backend
    // For now, vault starts empty
    setVaultNotes([]);
  }, [vaultId]);

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/vaults')}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              title="Back to vaults"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <div className="flex items-center gap-3">
              {vault.isPrivate ? (
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center border-2 border-primary/30">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center border-2 border-green-500/30">
                  <Unlock className="w-6 h-6 text-green-500" />
                </div>
              )}
              
              <div>
                <h1 className="text-3xl font-medium text-foreground">{vault.name}</h1>
                <p className="text-muted-foreground">{vault.description || 'No description'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {getVaultMembers(vaultId).length} member{getVaultMembers(vaultId).length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              userRole === 'owner' ? 'bg-yellow-100 text-yellow-800' :
              userRole === 'edit' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {userRole === 'owner' ? 'Owner' : userRole === 'edit' ? 'Editor' : 'Viewer'}
            </div>

            {canEdit && (
              <button
                onClick={() => navigate(`/add-note?vault=${vaultId}`)}
                className="nothing-btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nothing-input pl-10"
            />
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="nothing-input min-w-[160px]"
          >
            <option value="">All tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Notes Grid */}
        <div className="space-y-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">
                {vaultNotes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {vaultNotes.length === 0 
                  ? canEdit 
                    ? 'Start building your knowledge vault by adding your first note.'
                    : 'This vault doesn\'t have any notes yet.'
                  : 'Try adjusting your search or tag filters.'
                }
              </p>
              {canEdit && vaultNotes.length === 0 && (
                <button
                  onClick={() => navigate(`/add-note?vault=${vaultId}`)}
                  className="nothing-btn-primary flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add First Note
                </button>
              )}
            </div>
          ) : (
            <div className="masonry-grid">
              {filteredNotes.map((note) => (
                <div key={note.id} className="masonry-item">
                  <div className="nothing-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-lg text-foreground line-clamp-2">
                        {note.title}
                      </h3>
                      {canEdit && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-muted rounded">
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {note.content}
                    </p>
                    
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
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
      </div>
    </div>
  );
};

export default VaultDetail;
