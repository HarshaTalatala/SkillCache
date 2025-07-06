import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Zap, Brain, Star, TrendingUp } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const Dashboard = () => {
  const { searchQuery } = useSearch();
  
  // Fetch user's notes - this would connect to your backend
  const allNotes = []; // Empty array - ready for real data integration
  
  // Filter out archived notes (notes with isArchived: true property)
  const activeNotes = allNotes.filter(note => !note.isArchived);

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

  return (
    <div className="space-y-6">
      {/* Notes Masonry Grid */}
      {filteredNotes.length > 0 ? (
        <div className="masonry-grid">
          {filteredNotes.map((note) => {
            const TypeIcon = typeIcons[note.type] || BookOpen;
            return (
              <div
                key={note.id}
                className="masonry-item"
              >
                <div className="note-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {note.createdAt}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 whitespace-pre-line line-clamp-3">
                    {note.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill"
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
          <div className="text-center space-y-6">
            <div className="text-6xl">📝</div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Your vault is empty
              </h3>
              <p className="text-muted-foreground mb-6">
                Start building your knowledge collection by creating your first note
              </p>
              <Link
                to="/add-note"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Note
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
