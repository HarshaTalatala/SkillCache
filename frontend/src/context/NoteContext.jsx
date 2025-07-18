import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const NoteContext = createContext();

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:7071/api/notes'
  : (import.meta.env.VITE_NOTES_API_URL || 'https://<YOUR_AZURE_BACKEND_URL>/api/notes');

export const useNote = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNote must be used within a NoteProvider');
  }
  return context;
};

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Helper to get ID token
  const getIdToken = async () => {
    if (!currentUser) throw new Error('Not authenticated');
    return await currentUser.getIdToken();
  };

  // Fetch all notes for the current user
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch notes');
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      setError(error.message);
      setNotes([]); // Always set notes to an array on error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a new note
  const addNote = async (noteData) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add note');
      const newNote = await res.json();
      setNotes(prev => [...prev, newNote]);
      return newNote;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a note
  const updateNote = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update note');
      const updatedNote = await res.json();
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      return updatedNote;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete note');
      setNotes(prev => prev.filter(note => note.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a note by ID
  const getNoteById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch note');
      const note = await res.json();
      return note;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoteContext.Provider value={{
      notes,
      loading,
      error,
      fetchNotes,
      addNote,
      updateNote,
      deleteNote,
      getNoteById
    }}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteContext; 