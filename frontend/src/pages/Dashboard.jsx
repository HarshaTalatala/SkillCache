import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Zap, Brain, Star, TrendingUp, Trash2, Eye, Pencil, Terminal, Palette, Lightbulb, Briefcase, User } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useNote } from '../context/NoteContext';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

const Dashboard = () => {
  const { searchQuery } = useSearch();
  const { notes, fetchNotes, deleteNote, loading, error } = useNote();
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToPreview, setNoteToPreview] = useState(null);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  // Filter out archived notes (notes with isArchived: true property)
  const activeNotes = notes.filter(note => !note.isArchived);

  const typeIcons = {
    article: BookOpen,
    snippet: Zap,
    reference: Brain,
    collection: Star,
    planning: TrendingUp
  };

  const categoryIcons = {
    Programming: Terminal,
    Design: Palette,
    Learning: BookOpen,
    Ideas: Lightbulb,
    Work: Briefcase,
    Personal: User
  };

  const filteredNotes = activeNotes.filter(note =>
    (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags || []).some(tag => (tag || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete.id);
    setNoteToDelete(null);
  };

  const handlePreviewNote = (note) => {
    setNoteToPreview(note);
  };

  return (
    <div className="space-y-2 sm:space-y-3 px-2 sm:px-0 min-h-[60vh] flex flex-col overflow-x-hidden">
      {loading && notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full p-4 min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <div className="text-muted-foreground text-lg">Loading notes...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center w-full p-4">
          <div className="text-red-500 text-center text-base sm:text-lg break-words max-w-xs sm:max-w-md w-full mx-auto">
            {error}
          </div>
        </div>
      ) : (
        filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-2">
            {filteredNotes.map((note, idx) => {
              const CategoryIcon = categoryIcons[note.category] || BookOpen;
              const priority = note.priority || 'medium';
              let stars = 1;
              let starColor = 'text-green-500';
              if (priority === 'medium') { stars = 2; starColor = 'text-orange-400'; }
              if (priority === 'high') { stars = 3; starColor = 'text-yellow-400'; }
              return (
                <div
                  key={note.id || note._id || note.createdAt || idx}
                  className="note-card h-full bg-card border border-border/40 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer relative"
                  onClick={e => {
                    // Prevent preview if delete button is clicked
                    if (e.target.closest('.note-delete-btn')) return;
                    handlePreviewNote(note);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-primary" />
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
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-base mb-1 whitespace-pre-line line-clamp-3">
                    {note.summary || note.content || ''}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {(note.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill text-xs px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Priority hollow stars at bottom left */}
                  <span className={`absolute bottom-2 left-4 flex items-center gap-0.5 ${starColor}`} title={`Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`}> 
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4" fill="none" />
                    ))}
                  </span>
                  {/* Date at bottom right */}
                  <span className="absolute bottom-2 right-4 text-xs text-muted-foreground opacity-80">
                    {formatDate(note.createdAt)}
                  </span>
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
        )
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
                  <p className="text-xs sm:text-base text-muted-foreground whitespace-pre-line">{noteToPreview.summary || noteToPreview.content || ''}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(noteToPreview.tags || []).map((tag) => (
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
                    to={`/add-note/${noteToPreview.id}`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2 animate-fade-in">
          <div className="bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg transition-all duration-200">
            <div className="p-6 sm:p-8 text-center">
              <h3 className="text-lg sm:text-2xl font-semibold text-destructive mb-2">Delete Note?</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={() => setNoteToDelete(null)} className="px-6 py-2 rounded-lg border border-border bg-muted text-base font-semibold text-foreground hover:bg-zinc-200 transition-colors">Cancel</button>
                <button onClick={handleDeleteNote} className="px-6 py-2 rounded-lg bg-destructive text-white text-base font-semibold hover:bg-red-700 transition-colors shadow">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
