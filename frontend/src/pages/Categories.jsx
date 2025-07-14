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

const Categories = () => {
  const { searchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [noteToPreview, setNoteToPreview] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: 'programming',
      name: 'Programming',
      icon: Terminal,
      color: 'blue',
      description: 'Code snippets, tutorials, and development notes',
      noteCount: 24,
      notes: [
        {
          id: 1,
          title: 'React Hooks Best Practices',
          summary: 'Essential patterns and tips for using React hooks effectively',
          createdAt: '2024-12-15',
          priority: 'high'
        },
        {
          id: 2,
          title: 'JavaScript ES6 Features',
          summary: 'Modern JavaScript features and their practical applications',
          createdAt: '2024-12-10',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      color: 'purple',
      description: 'UI/UX designs, inspiration, and creative resources',
      noteCount: 18,
      notes: [
        {
          id: 3,
          title: 'Design System Guidelines',
          summary: 'Comprehensive guide for building consistent design systems',
          createdAt: '2024-12-12',
          priority: 'high'
        }
      ]
    },
    {
      id: 'learning',
      name: 'Learning',
      icon: BookOpen,
      color: 'green',
      description: 'Educational content, courses, and study materials',
      noteCount: 32,
      notes: [
        {
          id: 4,
          title: 'Machine Learning Basics',
          summary: 'Introduction to ML concepts and algorithms',
          createdAt: '2024-12-08',
          priority: 'medium'
        },
        {
          id: 5,
          title: 'Data Structures Overview',
          summary: 'Common data structures and their use cases',
          createdAt: '2024-12-05',
          priority: 'low'
        }
      ]
    },
    {
      id: 'ideas',
      name: 'Ideas',
      icon: Lightbulb,
      color: 'yellow',
      description: 'Creative ideas, brainstorming, and inspiration',
      noteCount: 15,
      notes: [
        {
          id: 6,
          title: 'App Concept: Personal Finance Tracker',
          summary: 'Mobile app idea for tracking expenses and budgeting',
          createdAt: '2024-12-14',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'work',
      name: 'Work',
      icon: Briefcase,
      color: 'red',
      description: 'Professional projects, meetings, and work-related notes',
      noteCount: 28,
      notes: [
        {
          id: 7,
          title: 'Q4 Project Planning',
          summary: 'Strategic planning for upcoming quarter deliverables',
          createdAt: '2024-12-13',
          priority: 'high'
        },
        {
          id: 8,
          title: 'Team Meeting Notes',
          summary: 'Weekly standup discussions and action items',
          createdAt: '2024-12-11',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'personal',
      name: 'Personal',
      icon: User,
      color: 'indigo',
      description: 'Personal thoughts, diary entries, and life notes',
      noteCount: 12,
      notes: [
        {
          id: 9,
          title: 'Travel Planning: Japan Trip',
          summary: 'Itinerary and research for upcoming vacation',
          createdAt: '2024-12-09',
          priority: 'low'
        }
      ]
    }
  ]);

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
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === selectedCategory.id 
          ? {
              ...category,
              notes: category.notes.filter(n => n.id !== noteToDelete.id),
              noteCount: category.notes.filter(n => n.id !== noteToDelete.id).length
            }
          : category
      )
    );
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

  // If a category is selected, show its notes
  if (selectedCategory) {
    const CategoryIcon = selectedCategory.icon;
    
    // Filter notes in selected category based on search query
    const filteredNotes = selectedCategory.notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Header with Back Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <button
              onClick={handleBackToCategories}
              className="p-2 rounded-lg border border-border/50 hover:bg-muted hover:border-border/80 transition-colors mb-2 sm:mb-0"
              title="Back to categories"
            >
              <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${getIconColorClass(selectedCategory.color)}`} />
            </button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <CategoryIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${getIconColorClass(selectedCategory.color)}`} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{selectedCategory.name}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{selectedCategory.description}</p>
              </div>
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
                    className="p-4 sm:p-6 bg-card border border-border/50 rounded-lg hover:border-border/80 transition-all"
                  >
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground line-clamp-2 text-base">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button 
                            className="p-1 sm:p-2 hover:bg-muted rounded" 
                            onClick={() => handlePreviewNote(note)} 
                            title="Preview Note"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button 
                            className="p-1 sm:p-2 hover:bg-muted rounded" 
                            onClick={() => setNoteToDelete(note)} 
                            title="Delete Note"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <span className={`text-xs sm:text-sm font-medium ${getPriorityColor(note.priority)} ml-1`}>
                            {note.priority}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                        {note.summary}
                      </p>
                      
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-medium text-foreground">Preview Note</h3>
                  <button 
                    onClick={() => setNoteToPreview(null)} 
                    className="p-1 hover:bg-muted rounded"
                  >
                    <span className="sr-only">Close</span>
                    <span className="text-xl sm:text-2xl">&times;</span>
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground text-base sm:text-lg mb-1 sm:mb-2">{noteToPreview.title}</h4>
                    <p className="text-xs sm:text-base text-muted-foreground">{noteToPreview.summary}</p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(noteToPreview.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Priority:</span>
                    <span className={`text-xs sm:text-sm font-medium ${getPriorityColor(noteToPreview.priority)}`}>{noteToPreview.priority}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Category:</span>
                    <span className="text-xs sm:text-sm text-foreground">{selectedCategory.name}</span>
                  </div>
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
    category.notes.some(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase())
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
                        {category.noteCount} notes
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
