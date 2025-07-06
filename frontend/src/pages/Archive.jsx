import React, { useState } from 'react';
import { Archive as ArchiveIcon, BookOpen, Zap, Brain, Star, TrendingUp, Search, Filter, RotateCcw, Trash2 } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const Archive = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedNotes, setSelectedNotes] = useState([]);
  
  // Fetch archived notes - ready for backend integration
  const archivedNotes = []; // Empty array - will be populated from backend

  const typeIcons = {
    article: BookOpen,
    snippet: Zap,
    reference: Brain,
    collection: Star,
    planning: TrendingUp
  };

  const filteredNotes = archivedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleNoteSelect = (noteId) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleRestore = async () => {
    // Implement restore functionality when backend is connected
    setSelectedNotes([]);
  };

  const handlePermanentDelete = async () => {
    // Implement permanent delete functionality when backend is connected
    setSelectedNotes([]);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Programming': 'text-blue-400',
      'Design': 'text-purple-400',
      'Learning': 'text-green-400',
      'Ideas': 'text-yellow-400',
      'Work': 'text-red-400',
      'Personal': 'text-indigo-400'
    };
    return colors[category] || 'text-muted-foreground';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArchiveIcon className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Archive</h1>
                <p className="text-muted-foreground">Manage your archived notes</p>
              </div>
            </div>
            
            
            {/* Archive Stats - back to original position */}
            <div className="flex items-center gap-3">
              {/* Action buttons when notes are selected - before stats */}
              {selectedNotes.length > 0 && (
                <>
                  <button
                    onClick={handleRestore}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore ({selectedNotes.length})
                  </button>
                  <button
                    onClick={handlePermanentDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
              
              <div className="p-3 bg-card border border-border/50 rounded-lg w-36">
                <div className="flex items-center gap-3">
                  <ArchiveIcon className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Archived</p>
                    <p className="text-lg font-bold text-foreground">{archivedNotes.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-card border border-border/50 rounded-lg w-36">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Selected</p>
                    <p className="text-lg font-bold text-foreground">{selectedNotes.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Archived Notes */}
        {filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => {
                const TypeIcon = typeIcons[note.type] || BookOpen;
                const isSelected = selectedNotes.includes(note.id);
                
                return (
                  <div
                    key={note.id}
                    className={`p-4 bg-card border rounded-lg transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-border/50 hover:border-border/80'
                    }`}
                    onClick={() => handleNoteSelect(note.id)}
                  >
                    <div className="space-y-3">
                      {/* Note Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleNoteSelect(note.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
                          />
                          <TypeIcon className="h-4 w-4 text-primary" />
                          <span className={`text-xs font-medium ${getCategoryColor(note.category)}`}>
                            {note.category}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {note.archivedAt}
                        </span>
                      </div>
                      
                      {/* Note Content */}
                      <div>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {note.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {note.summary}
                        </p>
                      </div>
                      
                      {/* Note Tags */}
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                            +{note.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Archive Info */}
                      <div className="pt-2 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">
                          Created: {note.createdAt} • Archived: {note.archivedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/70 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-muted/30">
              <ArchiveIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No archived notes found' : 'No archived notes'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try adjusting your search terms or clear the search to see all archived notes.'
                : 'Archived notes will appear here when you archive them from your dashboard.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
