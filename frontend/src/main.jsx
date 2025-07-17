import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { ThemeProvider } from './context/ThemeContext';
import { VaultProvider } from './context/VaultContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { NoteProvider } from './context/NoteContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <VaultProvider>
            <NoteProvider>
              <SearchProvider>
                <PreferencesProvider>
                  <App />
                </PreferencesProvider>
              </SearchProvider>
            </NoteProvider>
          </VaultProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
