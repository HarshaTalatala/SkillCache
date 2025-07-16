import React, { useState } from 'react';
import { Archive as ArchiveIcon, BookOpen, Zap, Brain, Star, TrendingUp, Search, Filter, RotateCcw, Trash2, Eye, Edit3 } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const Archive = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [noteToPreview, setNoteToPreview] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  
  // Fetch archived notes - ready for backend integration
  const archivedNotes = [
    {
      id: 'arch1',
      title: 'Test Archived Note',
      summary: 'This is a test note for the archive.',
      tags: ['archive', 'test'],
      type: 'snippet',
      category: 'Programming',
      createdAt: '2024-05-20',
      archivedAt: '2024-06-01',
    }
  ]; // Test content for archive

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

  const handlePreviewNote = (note) => {
    setNoteToPreview(note);
  };

  const handleEditNote = (note) => {
    setNoteToEdit(note);
  };

  const handleSaveEdit = () => {
    // Implement save functionality when backend is connected
    setNoteToEdit(null);
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
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-2 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 w-full">
              <div className="flex flex-row items-center gap-2 sm:gap-3">
                <ArchiveIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Archive</h1>
                  <p className="text-xs sm:text-base text-muted-foreground whitespace-nowrap">Manage your archived notes</p>
                </div>
              </div>
              {/* Action buttons when notes are selected - right end on mobile, hidden on desktop */}
              {selectedNotes.length > 0 && (
                <div className="flex flex-row gap-2 sm:hidden">
                  <button
                    onClick={handleRestore}
                    className="flex items-center gap-2 px-3 py-2 text-xs bg-green-500/10 border border-green-500/30 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Restore ({selectedNotes.length})</span>
                  </button>
                  <button
                    onClick={handlePermanentDelete}
                    className="flex items-center gap-2 px-3 py-2 text-xs bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </div>
            {/* Archive Stats & Actions - horizontally scrollable on mobile */}
            <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted/30 scrollbar-track-transparent py-2 sm:py-0 w-full">
              {/* Action buttons when notes are selected - right side on desktop only */}
              {selectedNotes.length > 0 && (
                <div className="hidden sm:flex flex-row gap-2">
                  <button
                    onClick={handleRestore}
                    className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm bg-green-500/10 border border-green-500/30 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Restore ({selectedNotes.length})</span>
                  </button>
                  <button
                    onClick={handlePermanentDelete}
                    className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
              {/* Stats - right aligned on desktop */}
              <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:ml-auto">
                <div className="p-2 sm:p-3 bg-card border border-border/50 rounded-lg w-[48%] min-w-[7rem] sm:w-36 sm:min-w-[9rem]">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ArchiveIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Archived</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">{archivedNotes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-card border border-border/50 rounded-lg w-[48%] min-w-[7rem] sm:w-36 sm:min-w-[9rem]">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Selected</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">{selectedNotes.length}</p>
                    </div>
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 sm:gap-6">
              {filteredNotes.map((note) => {
                const TypeIcon = typeIcons[note.type] || BookOpen;
                const isSelected = selectedNotes.includes(note.id);
                
                return (
                  <div
                    key={note.id}
                    className={`note-card bg-card border border-border/40 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 cursor-pointer ${isSelected ? 'border-primary/50 bg-primary/5' : 'hover:border-border/80'}`}
                    onClick={e => {
                      // Prevent preview if checkbox or edit button is clicked
                      if (e.target.closest('.note-checkbox') || e.target.closest('.note-edit-btn')) return;
                      handlePreviewNote(note);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleNoteSelect(note.id)}
                            className="note-checkbox w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary/20 mr-1"
                            onClick={e => e.stopPropagation()}
                          />
                          <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                          <span className={`text-xs sm:text-sm font-medium ${getCategoryColor(note.category)}`}>{note.category}</span>
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base sm:text-lg line-clamp-2 truncate min-w-0 mt-1">{note.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          className="note-edit-btn p-1 sm:p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditNote(note);
                          }}
                          title="Edit Note"
                        >
                          <Edit3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </button>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{note.archivedAt}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-base mb-1 whitespace-pre-line line-clamp-3">{note.summary}</p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="tag-pill text-xs px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 px-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-muted/50 to-muted/70 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 border-2 border-muted/30">
              <ArchiveIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
              {searchQuery ? 'No archived notes found' : 'No archived notes'}
            </h3>
            <p className="text-xs sm:text-base text-muted-foreground">
              {searchQuery 
                ? 'Try adjusting your search terms or clear the search to see all archived notes.'
                : 'Archived notes will appear here when you archive them from your dashboard.'
              }
            </p>
          </div>
        )}

        {/* Preview Note Modal */}
        {noteToPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-full sm:max-w-2xl max-h-[95vh] flex flex-col relative overflow-hidden">
              {/* Sticky Close Button for mobile, floating for desktop */}
              <button
                onClick={() => setNoteToPreview(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-3 sm:p-3.5 bg-white/80 dark:bg-card/80 rounded-full shadow hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close preview"
                style={{ minWidth: 40, minHeight: 40 }}
              >
                <span className="text-2xl sm:text-3xl text-muted-foreground">&times;</span>
              </button>
              <div className="p-4 sm:p-8 flex-1 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
                {/* Title & Badges */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl sm:text-3xl font-extrabold text-foreground leading-tight break-words">{noteToPreview.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(noteToPreview.category)} bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800`}>{noteToPreview.category}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize">{noteToPreview.type}</span>
                  </div>
                </div>
                {/* Summary */}
                <div className="text-sm sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                  {noteToPreview.summary}
                </div>
                {/* Tags */}
                {noteToPreview.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {noteToPreview.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-muted text-muted-foreground border border-border/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Divider */}
                <div className="border-t border-border/20" />
                {/* Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex flex-col"><span className="font-semibold">Created</span><span>{noteToPreview.createdAt}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Archived</span><span>{noteToPreview.archivedAt}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Category</span><span>{noteToPreview.category}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Type</span><span className="capitalize">{noteToPreview.type}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Note Modal */}
        {noteToEdit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium text-foreground">Edit Note</h3>
                  <button 
                    onClick={() => setNoteToEdit(null)} 
                    className="p-1 hover:bg-muted rounded"
                  >
                    <span className="sr-only">Close</span>
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-border/50 rounded-lg bg-background text-foreground" 
                      value={noteToEdit.title} 
                      onChange={(e) => setNoteToEdit({...noteToEdit, title: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Summary</label>
                    <textarea 
                      className="w-full p-2 border border-border/50 rounded-lg bg-background text-foreground min-h-[100px]" 
                      value={noteToEdit.summary} 
                      onChange={(e) => setNoteToEdit({...noteToEdit, summary: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-border/50 rounded-lg bg-background text-foreground" 
                      value={noteToEdit.tags.join(', ')} 
                      onChange={(e) => setNoteToEdit({...noteToEdit, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
                    <button onClick={() => setNoteToEdit(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
