import React, { useState } from 'react';
import { 
  Hash,
  Terminal,
  Palette,
  BookOpen,
  Lightbulb,
  Briefcase,
  User,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Trash2
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useNote } from '../context/NoteContext';

const Categories = () => {
  const { searchQuery } = useSearch();
  const { notes, loading, error, fetchNotes } = useNote();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [noteToPreview, setNoteToPreview] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const categories = [
    {
      id: 'programming',
      name: 'Programming',
      icon: Terminal,
      color: 'blue',
      description: 'Code snippets, tutorials, and development notes',
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      color: 'purple',
      description: 'UI/UX designs, inspiration, and creative resources',
    },
    {
      id: 'learning',
      name: 'Learning',
      icon: BookOpen,
      color: 'green',
      description: 'Educational content, courses, and study materials',
    },
    {
      id: 'ideas',
      name: 'Ideas',
      icon: Lightbulb,
      color: 'yellow',
      description: 'Creative ideas, brainstorming, and inspiration',
    },
    {
      id: 'work',
      name: 'Work',
      icon: Briefcase,
      color: 'red',
      description: 'Professional projects, meetings, and work-related notes',
    },
    {
      id: 'personal',
      name: 'Personal',
      icon: User,
      color: 'indigo',
      description: 'Personal thoughts, diary entries, and life notes',
    }
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handlePreviewNote = (note) => {
    setNoteToPreview(note);
  };

  const handleDeleteNote = () => {
    // Remove the note from the selected category
    // This logic needs to be updated to remove from the global notes list
    // For now, we'll just set it to null
    setNoteToDelete(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-card border-border/50 hover:border-blue-500/30 hover:bg-blue-500/5',
      purple: 'bg-card border-border/50 hover:border-purple-500/30 hover:bg-purple-500/5',
      green: 'bg-card border-border/50 hover:border-green-500/30 hover:bg-green-500/5',
      yellow: 'bg-card border-border/50 hover:border-yellow-500/30 hover:bg-yellow-500/5',
      red: 'bg-card border-border/50 hover:border-red-500/30 hover:bg-red-500/5',
      indigo: 'bg-card border-border/50 hover:border-indigo-500/30 hover:bg-indigo-500/5'
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClass = (color) => {
    const colors = {
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      red: 'text-red-400',
      indigo: 'text-indigo-400'
    };
    return colors[color] || colors.blue;
  };

  const getBorderColorClass = (color) => {
    const colors = {
      blue: 'border-blue-400',
      purple: 'border-purple-400',
      green: 'border-green-400',
      yellow: 'border-yellow-400',
      red: 'border-red-400',
      indigo: 'border-indigo-400'
    };
    return colors[color] || 'border-blue-400';
  };

  // If a category is selected, show its notes
  if (selectedCategory) {
    const CategoryIcon = selectedCategory.icon;
    
    // Filter notes in selected category based on search query
    const filteredNotes = notes.filter(note =>
      note.category === selectedCategory.name &&
      (
        (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Header with Back Button */}
          <div className="flex flex-row items-center gap-2 sm:gap-4">
            <button
              onClick={handleBackToCategories}
              className={`p-2 rounded-lg border-2 bg-background hover:bg-muted transition-colors ${getBorderColorClass(selectedCategory.color)}`}
              title="Back to categories"
            >
              <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${getIconColorClass(selectedCategory.color)}`} />
            </button>
            <CategoryIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${getIconColorClass(selectedCategory.color)}`} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{selectedCategory.name}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">{selectedCategory.description}</p>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Notes ({filteredNotes.length})
              </h2>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="note-card bg-card border border-border/40 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-2 sm:gap-3 cursor-pointer"
                    onClick={e => {
                      // Prevent preview if delete button is clicked
                      if (e.target.closest('.note-delete-btn')) return;
                      handlePreviewNote(note);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                        <h3 className="font-semibold text-foreground text-base sm:text-lg line-clamp-2 truncate min-w-0 mb-1">{note.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-base mb-1 whitespace-pre-line line-clamp-3">{note.summary || note.content || ''}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          className="note-delete-btn p-1 sm:p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0"
                          onClick={e => {
                            e.stopPropagation();
                            setNoteToDelete(note);
                          }}
                          title="Delete Note"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-base mb-1 whitespace-pre-line line-clamp-3">{note.summary}</p>
                    <div className="flex items-center justify-between gap-2 mt-auto text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`font-medium ${getPriorityColor(note.priority)}`}>{note.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">📝</div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-xs sm:text-base text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms to find notes in this category.'
                    : 'Create your first note in this category to get started'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

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
                </div>
                {/* Summary */}
                <div className="text-sm sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                  {noteToPreview.summary || noteToPreview.content || ''}
                </div>
                {/* Divider */}
                <div className="border-t border-border/20" />
                {/* Metadata */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mt-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(noteToPreview.priority)} bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800`}>{noteToPreview.priority}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize">{selectedCategory.name}</span>
                    {(noteToPreview.tags || []).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span>Created: {new Date(noteToPreview.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Note Modal */}
        {noteToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm">
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2 sm:mb-4">Delete Note?</h3>
                <p className="text-xs sm:text-base text-muted-foreground mb-4 sm:mb-6">Are you sure you want to delete "{noteToDelete.title}"? This action cannot be undone.</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <button onClick={() => setNoteToDelete(null)} className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleDeleteNote} className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notes.some(note =>
      note.category === category.name &&
      ((note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.summary || '').toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2 sm:space-y-4">
          <div className="flex flex-row items-center gap-2 sm:gap-3">
            <Hash className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Categories</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Organize your notes by categories</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`p-4 sm:p-6 rounded-lg border transition-all cursor-pointer ${getColorClasses(category.color)}`}
                >
                  {/* Category Icon */}
                  <div className="mb-3 sm:mb-4">
                    <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${getIconColorClass(category.color)}`} />
                  </div>

                  {/* Category Info */}
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                      <span className="text-xs text-muted-foreground">
                        {notes.filter(note => note.category === category.name).length} notes
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        Click to view notes
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🔍</div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
              No categories found
            </h3>
            <p className="text-xs sm:text-base text-muted-foreground">
              Try adjusting your search terms to find categories or notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
