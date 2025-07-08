import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Zap, Brain, Star, TrendingUp, Trash2, Eye } from 'lucide-react';
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
    <div className="space-y-4 lg:space-y-6">
      {/* Notes Masonry Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 px-2 md:px-8">
          {filteredNotes.map((note) => {
            const TypeIcon = typeIcons[note.type] || BookOpen;
            return (
              <div
                key={note.id}
                className="flex justify-center"
              >
                <div className="note-card w-full max-w-xl bg-card border border-border/40 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl p-8 flex flex-col gap-4 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="h-6 w-6 text-primary flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded transition-colors" onClick={() => handlePreviewNote(note)} title="Preview Note">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded transition-colors" onClick={() => setNoteToDelete(note)} title="Delete Note">
                        <Trash2 className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {note.createdAt}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-lg line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-muted-foreground text-base mb-2 whitespace-pre-line line-clamp-3">
                    {note.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill text-xs px-3 py-1"
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
          <div className="text-center space-y-4 lg:space-y-6 px-4">
            <div className="text-4xl sm:text-5xl lg:text-6xl">📝</div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                Your vault is empty
              </h3>
              <p className="text-muted-foreground mb-4 lg:mb-6 text-sm sm:text-base">
                Start building your knowledge collection by creating your first note
              </p>
              <Link
                to="/add-note"
                className="btn-primary inline-flex items-center gap-2 mobile-btn"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium text-foreground">Preview Note</h3>
                <button 
                  onClick={() => setNoteToPreview(null)} 
                  className="p-1 hover:bg-muted rounded"
                >
                  <span className="sr-only">Close</span>
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-2">{noteToPreview.title}</h4>
                  <p className="text-muted-foreground">{noteToPreview.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {noteToPreview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Created: {noteToPreview.createdAt}</p>
                  <p>Type: {noteToPreview.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Note Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-sm">
            <div className="p-6 text-center">
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
    </div>
  );
};

export default Dashboard;
