import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { 
  Save, 
  ArrowLeft, 
  Hash, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Image,
  Paperclip,
  Eye,
  Edit3,
  Clock,
  Star,
  AlertCircle,
  Check,
  X,
  Terminal,
  Palette,
  BookOpen,
  Lightbulb,
  Briefcase,
  User
} from 'lucide-react';

const AddNote = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium',
    attachments: []
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formData.title.trim() || !unsavedChanges) return;
    
    setIsSaving(true);
    try {
      // Simulate auto-save
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData.title, unsavedChanges]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Update word and character count
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(formData.content.length);
  }, [formData.content]);

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setUnsavedChanges(true);
  };

  // Format text functions
  const formatText = (format) => {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText = formData.content;
    let formatSymbol = '';
    
    switch (format) {
      case 'bold':
        formatSymbol = '**';
        break;
      case 'italic':
        formatSymbol = '*';
        break;
      case 'code':
        formatSymbol = '`';
        break;
      case 'quote':
        newText = formData.content.substring(0, start) + 
                 '> ' + selectedText + 
                 formData.content.substring(end);
        break;
      case 'list':
        newText = formData.content.substring(0, start) + 
                 '- ' + selectedText + 
                 formData.content.substring(end);
        break;
      case 'numberedList':
        newText = formData.content.substring(0, start) + 
                 '1. ' + selectedText + 
                 formData.content.substring(end);
        break;
      default:
        return;
    }
    
    if (formatSymbol) {
      newText = formData.content.substring(0, start) + 
               formatSymbol + selectedText + formatSymbol + 
               formData.content.substring(end);
    }
    
    handleChange('content', newText);
  };

  // Handle file attachments
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    handleChange('attachments', [...formData.attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    handleChange('attachments', formData.attachments.filter(att => att.id !== id));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const noteData = {
        ...formData,
        userId: currentUser?.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount,
        characterCount
      };
      
      // Save note - this would connect to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/');
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto mobile-content mobile-section">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 lg:space-y-6">
          {/* Title */}
          {!isPreview && (
            <div className="space-y-2 mt-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter your note title..."
                className="w-full text-xl sm:text-2xl lg:text-3xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground focus:ring-0"
                style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', lineHeight: 'clamp(1.75rem, 5vw, 2.5rem)' }}
              />
              <div className="h-px bg-border"></div>
            </div>
          )}
          {/* Toolbar */}
          {!isPreview && (
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-card rounded-lg border-2 border-border/80 overflow-x-auto">
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => formatText('bold')}
                  className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors mobile-touch-target"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => formatText('italic')}
                  className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors mobile-touch-target"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => formatText('code')}
                  className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors mobile-touch-target"
                  title="Code"
                >
                  <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              
              <div className="w-px h-4 sm:h-6 bg-border flex-shrink-0"></div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => formatText('list')}
                  className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors mobile-touch-target"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => formatText('numberedList')}
                  className="p-2 rounded hover:bg-muted transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('quote')}
                  className="p-2 rounded hover:bg-muted transition-colors"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-px h-6 bg-border"></div>
              
              <label className="p-2 rounded hover:bg-muted transition-colors cursor-pointer" title="Add Image">
                <Image className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              
              <label className="p-2 rounded hover:bg-muted transition-colors cursor-pointer" title="Attach File">
                <Paperclip className="w-4 h-4" />
                <input type="file" className="hidden" onChange={handleFileUpload} multiple />
              </label>
              
              <div className="ml-auto text-xs text-muted-foreground">
                {wordCount} words • {characterCount} characters
              </div>
            </div>
          )}
          {/* Content */}
          <div className="space-y-2">
            {isPreview ? (
              <div className="p-6 bg-card rounded-lg border-2 border-border/80">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {/* Preview Title */}
                  {formData.title && (
                    <div className="mb-6 pb-4 border-b border-border/30">
                      <h1 className="text-3xl font-bold text-foreground mb-0">
                        {formData.title}
                      </h1>
                    </div>
                  )}
                  
                  {/* Preview Content */}
                  {formData.content ? (
                    <pre className="whitespace-pre-wrap font-sans text-foreground">
                      {formData.content}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground italic">No content to preview</p>
                  )}
                  
                  {/* Preview Metadata */}
                  <div className="mt-6 pt-4 border-t border-border/30">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {formData.category && (
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {formData.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className={`w-3 h-3 ${
                          formData.priority === 'high' ? 'text-red-500' : 
                          formData.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                        {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                      </span>
                      <span>{wordCount} words • {characterCount} characters</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Start writing your note..."
                className="w-full min-h-[400px] sm:min-h-[500px] p-3 sm:p-6 bg-card rounded-lg border-2 border-border/60 resize-none focus:ring-1 focus:ring-border/20 focus:border-border/60 dark:focus:border-border/80 transition-all text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                style={{ fontFamily: 'inherit', lineHeight: '1.6' }}
              />
            )}
          </div>
          {/* Sidebar Sections (Mobile Only) */}
          <div className="space-y-4 lg:hidden">
            {/* Priority */}
            <div className="mobile-card space-y-4 border-2 border-border/80 rounded-lg bg-card p-4">
              <h3 className="font-semibold text-foreground">Priority</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleChange('priority', 'low')}
                    className={`p-2 rounded-lg border transition-all text-center ${
                      formData.priority === 'low'
                        ? 'bg-green-500/10 border-green-500/30 text-green-500'
                        : 'bg-card border-border/50 text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Low</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleChange('priority', 'medium')}
                    className={`p-2 rounded-lg border transition-all text-center ${
                      formData.priority === 'medium'
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                        : 'bg-card border-border/50 text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span className="text-xs font-medium">Medium</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleChange('priority', 'high')}
                    className={`p-2 rounded-lg border transition-all text-center ${
                      formData.priority === 'high'
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : 'bg-card border-border/50 text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">High</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/* Category */}
            <div className="nothing-card p-4 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Category
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleChange('category', 'Programming')}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.category === 'Programming'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                        : 'bg-card border-border/50 hover:border-blue-500/30 hover:bg-blue-500/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Terminal className={`w-4 h-4 ${
                        formData.category === 'Programming' ? 'text-blue-500' : 'text-blue-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.category === 'Programming' ? 'text-blue-500' : 'text-muted-foreground'
                      }`}>Programming</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleChange('category', 'Design')}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.category === 'Design'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-500'
                        : 'bg-card border-border/50 hover:border-purple-500/30 hover:bg-purple-500/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Palette className={`w-4 h-4 ${
                        formData.category === 'Design' ? 'text-purple-500' : 'text-purple-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.category === 'Design' ? 'text-purple-500' : 'text-muted-foreground'
                      }`}>Design</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleChange('category', 'Learning')}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.category === 'Learning'
                        ? 'bg-green-500/10 border-green-500/30 text-green-500'
                        : 'bg-card border-border/50 hover:border-green-500/30 hover:bg-green-500/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <BookOpen className={`w-4 h-4 ${
                        formData.category === 'Learning' ? 'text-green-500' : 'text-green-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.category === 'Learning' ? 'text-green-500' : 'text-muted-foreground'
                      }`}>Learning</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleChange('category', 'Ideas')}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.category === 'Ideas'
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                        : 'bg-card border-border/50 hover:border-yellow-500/30 hover:bg-yellow-500/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Lightbulb className={`w-4 h-4 ${
                        formData.category === 'Ideas' ? 'text-yellow-500' : 'text-yellow-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.category === 'Ideas' ? 'text-yellow-500' : 'text-muted-foreground'
                      }`}>Ideas</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleChange('category', 'Work')}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.category === 'Work'
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : 'bg-card border-border/50 hover:border-red-500/30 hover:bg-red-500/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Briefcase className={`w-4 h-4 ${
                        formData.category === 'Work' ? 'text-red-500' : 'text-red-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.category === 'Work' ? 'text-red-500' : 'text-muted-foreground'
                      }`}>Work</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleChange('category', 'Personal')}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.category === 'Personal'
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
                        : 'bg-card border-border/50 hover:border-indigo-500/30 hover:bg-indigo-500/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <User className={`w-4 h-4 ${
                        formData.category === 'Personal' ? 'text-indigo-500' : 'text-indigo-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.category === 'Personal' ? 'text-indigo-500' : 'text-muted-foreground'
                      }`}>Personal</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/* Last Edited */}
            <div className="nothing-card p-4 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Edited
              </h3>
              <div className="text-sm text-muted-foreground">
                {lastSaved ? (
                  <div className="flex flex-col gap-1">
                    <span>{lastSaved.toLocaleDateString()}</span>
                    <span>{lastSaved.toLocaleTimeString()}</span>
                  </div>
                ) : (
                  <span>Not saved yet</span>
                )}
              </div>
            </div>
          </div>
          {/* Attachments (keep after note input) */}
          {formData.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments ({formData.attachments.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {formData.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border-2 border-border/80">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Action Buttons (Mobile Only, now at bottom) */}
          <div className="flex flex-row gap-2 lg:hidden mt-4">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="w-1/2 flex items-center justify-center gap-2 text-sm py-3 px-3 mobile-btn border border-border text-foreground hover:bg-muted dark:hover:bg-muted/30 transition-colors rounded-2xl"
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isPreview ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.title.trim()}
              className="nothing-btn-primary w-1/2 flex items-center justify-center gap-2 text-sm py-3 px-3 mobile-btn whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              <span className="font-semibold">{isLoading ? 'Saving...' : 'Save Note'}</span>
            </button>
          </div>
        </div>
        {/* Sidebar (Desktop Only) */}
        <div className="lg:col-span-1 space-y-4 lg:space-y-6 order-first lg:order-last hidden lg:block">
          {/* Action Buttons (Desktop Only) */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex-1 min-w-0 flex items-center justify-center gap-2 text-sm py-2 px-2 mobile-btn border border-border text-foreground hover:bg-muted dark:hover:bg-muted/30 transition-colors rounded-2xl"
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isPreview ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.title.trim()}
              className="nothing-btn-primary flex-1 min-w-0 flex items-center justify-center gap-2 text-sm py-2 px-3 mobile-btn whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              <span className="font-semibold">{isLoading ? 'Saving...' : 'Save Note'}</span>
            </button>
          </div>
          {/* Priority */}
          <div className="mobile-card space-y-4 border-2 border-border/80 rounded-lg bg-card p-4">
            <h3 className="font-semibold text-foreground">Priority</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleChange('priority', 'low')}
                  className={`p-2 rounded-lg border transition-all text-center ${
                    formData.priority === 'low'
                      ? 'bg-green-500/10 border-green-500/30 text-green-500'
                      : 'bg-card border-border/50 text-muted-foreground hover:border-border/80'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Low</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('priority', 'medium')}
                  className={`p-2 rounded-lg border transition-all text-center ${
                    formData.priority === 'medium'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                      : 'bg-card border-border/50 text-muted-foreground hover:border-border/80'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span className="text-xs font-medium">Medium</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('priority', 'high')}
                  className={`p-2 rounded-lg border transition-all text-center ${
                    formData.priority === 'high'
                      ? 'bg-red-500/10 border-red-500/30 text-red-500'
                      : 'bg-card border-border/50 text-muted-foreground hover:border-border/80'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">High</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* Category */}
          <div className="nothing-card p-4 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Category
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChange('category', 'Programming')}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    formData.category === 'Programming'
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                      : 'bg-card border-border/50 hover:border-blue-500/30 hover:bg-blue-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Terminal className={`w-4 h-4 ${
                      formData.category === 'Programming' ? 'text-blue-500' : 'text-blue-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.category === 'Programming' ? 'text-blue-500' : 'text-muted-foreground'
                    }`}>Programming</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('category', 'Design')}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    formData.category === 'Design'
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-500'
                      : 'bg-card border-border/50 hover:border-purple-500/30 hover:bg-purple-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Palette className={`w-4 h-4 ${
                      formData.category === 'Design' ? 'text-purple-500' : 'text-purple-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.category === 'Design' ? 'text-purple-500' : 'text-muted-foreground'
                    }`}>Design</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('category', 'Learning')}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    formData.category === 'Learning'
                      ? 'bg-green-500/10 border-green-500/30 text-green-500'
                      : 'bg-card border-border/50 hover:border-green-500/30 hover:bg-green-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <BookOpen className={`w-4 h-4 ${
                      formData.category === 'Learning' ? 'text-green-500' : 'text-green-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.category === 'Learning' ? 'text-green-500' : 'text-muted-foreground'
                    }`}>Learning</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('category', 'Ideas')}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    formData.category === 'Ideas'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                      : 'bg-card border-border/50 hover:border-yellow-500/30 hover:bg-yellow-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Lightbulb className={`w-4 h-4 ${
                      formData.category === 'Ideas' ? 'text-yellow-500' : 'text-yellow-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.category === 'Ideas' ? 'text-yellow-500' : 'text-muted-foreground'
                    }`}>Ideas</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('category', 'Work')}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    formData.category === 'Work'
                      ? 'bg-red-500/10 border-red-500/30 text-red-500'
                      : 'bg-card border-border/50 hover:border-red-500/30 hover:bg-red-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Briefcase className={`w-4 h-4 ${
                      formData.category === 'Work' ? 'text-red-500' : 'text-red-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.category === 'Work' ? 'text-red-500' : 'text-muted-foreground'
                    }`}>Work</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('category', 'Personal')}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    formData.category === 'Personal'
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
                      : 'bg-card border-border/50 hover:border-indigo-500/30 hover:bg-indigo-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <User className={`w-4 h-4 ${
                      formData.category === 'Personal' ? 'text-indigo-500' : 'text-indigo-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.category === 'Personal' ? 'text-indigo-500' : 'text-muted-foreground'
                    }`}>Personal</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* Last Edited */}
          <div className="nothing-card p-4 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Edited
            </h3>
            <div className="text-sm text-muted-foreground">
              {lastSaved ? (
                <div className="flex flex-col gap-1">
                  <span>{lastSaved.toLocaleDateString()}</span>
                  <span>{lastSaved.toLocaleTimeString()}</span>
                </div>
              ) : (
                <span>Not saved yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;
