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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <VaultProvider>
          <AuthProvider>
            <SearchProvider>
              <PreferencesProvider>
                <App />
              </PreferencesProvider>
            </SearchProvider>
          </AuthProvider>
        </VaultProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
