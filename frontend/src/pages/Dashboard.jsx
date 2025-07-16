import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Zap, Brain, Star, TrendingUp, Trash2, Eye, Pencil } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const Dashboard = () => {
  const { searchQuery } = useSearch();
  // Add state for notes and delete modal
  const [notes, setNotes] = useState([
    {
      id: 'test1',
      title: 'Test Dashboard Note',
      summary: 'This is a test note for the dashboard.',
      tags: ['dashboard', 'test'],
      type: 'article',
      createdAt: '2024-06-01',
      isArchived: false
    }
  ]);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToPreview, setNoteToPreview] = useState(null);
  
  // Filter out archived notes (notes with isArchived: true property)
  const activeNotes = notes.filter(note => !note.isArchived);

  const typeIcons = {
    article: BookOpen,
    snippet: Zap,
    reference: Brain,
    collection: Star,
    planning: TrendingUp
  };

  const filteredNotes = activeNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteNote = () => {
    setNotes(notes => notes.filter(n => n.id !== noteToDelete.id));
    setNoteToDelete(null);
  };

  const handlePreviewNote = (note) => {
    setNoteToPreview(note);
  };

  return (
    <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
      {/* Notes Masonry Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-2 sm:gap-4 px-0 sm:px-4">
          {filteredNotes.map((note) => {
            const TypeIcon = typeIcons[note.type] || BookOpen;
            return (
              <div
                key={note.id}
                className="flex justify-center"
              >
                <div
                  className="note-card w-full max-w-xl bg-card border border-border/40 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 cursor-pointer"
                  onClick={e => {
                    // Prevent preview if delete button is clicked
                    if (e.target.closest('.note-delete-btn')) return;
                    handlePreviewNote(note);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base sm:text-lg line-clamp-2 truncate min-w-0">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        className="p-1 sm:p-1.5 hover:bg-muted rounded transition-colors note-delete-btn flex-shrink-0"
                        onClick={e => {
                          e.stopPropagation();
                          setNoteToDelete(note);
                        }}
                        title="Delete Note"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </button>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {note.createdAt}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-base mb-1 whitespace-pre-line line-clamp-3">
                    {note.summary}
                  </p>
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-full">
          <div className="text-center space-y-2 lg:space-y-3 px-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl">📝</div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                Your vault is empty
              </h3>
              <p className="text-muted-foreground mb-2 lg:mb-3 text-xs sm:text-sm">
                Start building your knowledge collection by creating your first note
              </p>
              <Link
                to="/add-note"
                className="btn-primary inline-flex items-center gap-1 mobile-btn"
              >
                <Plus className="h-4 w-4 text-black dark:text-white" />
                <span>Create First Note</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Preview Note Modal */}
      {noteToPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-4">
          <div
            className="bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-[98vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col"
            style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
          >
            <div className="p-4 sm:p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-medium text-foreground">Preview Note</h3>
                <button
                  onClick={() => setNoteToPreview(null)}
                  className="p-2 sm:p-2.5 hover:bg-muted rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ minWidth: 36, minHeight: 36 }}
                >
                  <span className="sr-only">Close</span>
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h4 className="font-semibold text-foreground text-base sm:text-lg mb-1">{noteToPreview.title}</h4>
                  <p className="text-xs sm:text-base text-muted-foreground whitespace-pre-line">{noteToPreview.summary}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {noteToPreview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs sm:text-sm bg-muted text-muted-foreground rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mt-2">
                  <div>
                    <p>Created: {noteToPreview.createdAt}</p>
                    <p>Type: {noteToPreview.type}</p>
                  </div>
                  <Link
                    to={`/edit-note/${noteToPreview.id}`}
                    className="btn-primary p-2 sm:p-2.5 flex items-center justify-center ml-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    title="Edit Note"
                    style={{ minWidth: 36, minHeight: 36 }}
                  >
                    <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Note Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm">
            <div className="p-3 sm:p-4 text-center">
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">Delete Note?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setNoteToDelete(null)} className="nothing-btn-ghost text-xs px-2 py-1">Cancel</button>
                <button onClick={handleDeleteNote} className="nothing-btn-primary bg-destructive text-white text-xs px-2 py-1">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
