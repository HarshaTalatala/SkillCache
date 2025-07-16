import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, Plus, Settings, LogOut, Zap, Hash, Search, Filter, Sun, Moon, Archive, Lock, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';
import AIAssistantChat from './AIAssistantChat';

const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const [placeholderText, setPlaceholderText] = useState('SkillCache');
  const [textOpacity, setTextOpacity] = useState(1);

  useEffect(() => {
    // On mount, animate from SkillCache to "Search your notes..."
    const timeout1 = setTimeout(() => {
      setTextOpacity(0);
      setTimeout(() => {
        setPlaceholderText('Search your notes...');
        setTextOpacity(1);
      }, 300);
    }, 2000); // Show SkillCache for 2s

    return () => {
      clearTimeout(timeout1);
    };
  }, []);

  // Prevent page scroll on AI Assistant page
  useEffect(() => {
    if (location.pathname === '/ai-assistant') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [location.pathname]);

  // Set --app-vh CSS variable for mobile viewport height fix
  useEffect(() => {
    function setAppVh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}px`);
    }
    setAppVh();
    window.addEventListener('resize', setAppVh);
    return () => window.removeEventListener('resize', setAppVh);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Add Note', href: '/add-note', icon: Plus },
    { name: 'Categories', href: '/categories', icon: Hash },
    { name: 'My Vaults', href: '/vaults', icon: Lock },
    { name: 'Archive', href: '/archive', icon: Archive },
  ];

  const isActive = (path) => location.pathname === path;
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setSidebarOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-row">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar fixed top-0 bottom-0 left-0 z-40 bg-card border-r border-border/30 transition-all duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarCollapsed ? 'w-20' : 'w-64'} ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 mb-4">
            <div 
              className="keep-logo-area"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <div className="logo-icon"><Zap size={28} /></div>
              <span className="keep-logo-text">Skill<span className="text-primary">Cache</span></span>
            </div>
          </div>
          <nav className="flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    // Only close sidebar on mobile if not AI Assistant
                    if (item.href !== '/ai-assistant') setSidebarOpen(false);
                  }}
                  className={`keep-nav-item ${isActive(item.href) ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className="keep-nav-icon" />
                  <span className="keep-nav-text">{item.name}</span>
                </Link>
              );
            })}
            {/* AI Assistant Button */}
            <Link
              to="/ai-assistant"
              onClick={() => setSidebarOpen(false)}
              className={`keep-nav-item ${isActive('/ai-assistant') ? 'active' : ''}`}
              title="AI Assistant"
            >
              <Bot className="keep-nav-icon" />
              <span className="keep-nav-text">AI Assistant</span>
            </Link>
          </nav>
          <div className="flex-shrink-0 mt-4 pt-4 border-t border-border/30">
            {/* User avatar for mobile: show only on mobile (flex sm:hidden) and styled as a sidebar item */}
            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className={`keep-nav-item sm:hidden flex items-center py-3 overflow-hidden ${sidebarCollapsed ? 'justify-center !px-0 !mb-0 !rounded-none' : 'gap-3 px-3 mb-2 rounded-lg'}`}
              style={sidebarCollapsed ? { minHeight: '48px', width: '100%' } : { minHeight: '48px' }}
            >
              <div
                className={`w-10 h-10 bg-primary/20 border border-border/30 rounded-full flex items-center justify-center flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`}
                title={currentUser?.displayName || currentUser?.email || 'User'}
              >
                <span
                  className="text-base font-medium text-primary"
                  style={sidebarCollapsed ? { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 'normal', width: '100%', height: '100%' } : {}}
                >
                  {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                </span>
              </div>
              {/* Only show name/email if sidebar is not collapsed */}
              {!sidebarCollapsed && (
                <div className="flex flex-col items-start ml-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{currentUser?.displayName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                </div>
              )}
            </Link>
            {/* Add spacing below avatar on mobile */}
            <div className="sm:hidden" style={{ marginBottom: 16 }} />
            <Link to="/settings" onClick={() => setSidebarOpen(false)} className={`keep-nav-item ${isActive('/settings') ? 'active' : ''}`} title={sidebarCollapsed ? 'Settings' : ''}>
              <Settings className="keep-nav-icon" />
              <span className="keep-nav-text">Settings</span>
            </Link>
            <button onClick={handleLogout} className="keep-nav-item w-full text-left" title={sidebarCollapsed ? 'Sign out' : ''}>
              <LogOut className="keep-nav-icon" />
              <span className="keep-nav-text">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className={`main-content flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ml-0 ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ flex: 1, minWidth: 0 }}>
        {location.pathname !== '/ai-assistant' ? (
          <header className="w-full bg-background/95 backdrop-blur-sm border-b-2 border-border/60 min-h-[80px]">
            <div className="flex items-center h-20 px-2 sm:px-6">
              <div className="flex-shrink-0">
                <button onClick={() => setSidebarOpen(true)} className="p-2 sm:hidden" aria-label="Open navigation menu">
                  <Menu className="h-6 w-6 text-primary transition-opacity hover:opacity-80" />
                </button>
              </div>
              <div className="flex-1 flex items-center px-2 sm:px-4">
                {/* Mobile Search Input */}
                <div className="relative flex items-center w-full sm:hidden gap-3 px-3 py-2 text-muted-foreground bg-white/90 dark:bg-black rounded-full min-h-[40px] border-2 border-primary/40 shadow-sm ml-4">
                  <div className="relative flex items-center w-full">
                    <Search size={24} className="z-10 mr-4" />
                    <input
                      type="text"
                      className="bg-transparent outline-none border-0 flex-1 text-base truncate transition-opacity duration-300 z-10 focus:border-0 focus:outline-none focus:ring-0"
                      style={{ opacity: textOpacity }}
                      placeholder={
                        placeholderText === 'SkillCache'
                          ? ''
                          : placeholderText
                      }
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      aria-label="Search notes"
                    />
                    {placeholderText === 'SkillCache' && !searchQuery && (
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold select-none pointer-events-none flex items-center justify-center w-full z-20"
                        style={{ opacity: textOpacity }}
                      >
                        <span className="text-white">Skill</span><span className="text-primary" style={{ color: '#ef4444' }}>Cache</span>
                      </span>
                    )}
                  </div>
                </div>
                {/* Desktop Search Input */}
                <div className="hidden sm:flex items-center w-full gap-3 px-3 py-2 text-muted-foreground bg-white/90 dark:bg-black rounded-full min-h-[40px] transition-all duration-300 border-2 border-primary/40 shadow-sm max-w-md ml-4">
                  <div className="relative flex items-center w-full">
                    <Search size={24} className="z-10 mr-4" />
                    <input
                      type="text"
                      className="bg-transparent outline-none border-0 flex-1 text-base truncate transition-opacity duration-300 z-10 focus:border-0 focus:outline-none focus:ring-0"
                      style={{ opacity: textOpacity }}
                      placeholder={
                        placeholderText === 'SkillCache'
                          ? ''
                          : placeholderText
                      }
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      aria-label="Search notes"
                    />
                    {placeholderText === 'SkillCache' && !searchQuery && (
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold select-none pointer-events-none flex items-center justify-center w-full z-20"
                        style={{ opacity: textOpacity }}
                      >
                        <span className="text-white">Skill</span><span className="text-primary" style={{ color: '#ef4444' }}>Cache</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 sm:gap-2 min-h-[56px] pr-2 sm:pr-4">
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full border-2 border-primary/40"
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {/* User avatar and info: only show on desktop (sm+) */}
                <div className="hidden sm:flex items-center gap-3 sm:gap-3 min-h-[56px]">
                  <div 
                    className="w-10 h-10 bg-primary/20 border border-border/30 rounded-full flex items-center justify-center flex-shrink-0"
                    title={currentUser?.displayName || currentUser?.email || 'User'}
                  >
                    <span className="text-base font-medium text-primary">
                      {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <p className="text-sm font-medium text-foreground">{currentUser?.displayName || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
        ) : (
          <header className="w-full bg-background/95 backdrop-blur-sm border-b-2 border-border/60 min-h-[80px] lg:hidden">
            <div className="flex items-center h-20 px-2 sm:px-6">
              <div className="flex-shrink-0">
                <button onClick={() => setSidebarOpen(true)} className="p-2 lg:hidden" aria-label="Open navigation menu">
                  <Menu className="h-6 w-6 text-primary transition-opacity hover:opacity-80" />
                </button>
              </div>
              <div className="flex-1 flex items-center px-2 sm:px-4">
                {/* Mobile Search Input */}
                <div className="relative flex items-center w-full lg:hidden gap-3 px-3 py-2 text-muted-foreground bg-white/90 dark:bg-black rounded-full min-h-[40px] border-2 border-primary/40 shadow-sm ml-4">
                  <div className="relative flex items-center w-full">
                    <Search size={24} className="z-10 mr-4" />
                    <input
                      type="text"
                      className="bg-transparent outline-none border-0 flex-1 text-base truncate transition-opacity duration-300 z-10 focus:border-0 focus:outline-none focus:ring-0"
                      style={{ opacity: textOpacity }}
                      placeholder={
                        placeholderText === 'SkillCache'
                          ? ''
                          : placeholderText
                      }
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      aria-label="Search notes"
                    />
                    {placeholderText === 'SkillCache' && !searchQuery && (
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold select-none pointer-events-none flex items-center justify-center w-full z-20"
                        style={{ opacity: textOpacity }}
                      >
                        <span className="text-white">Skill</span><span className="text-primary" style={{ color: '#ef4444' }}>Cache</span>
                      </span>
                    )}
                  </div>
                </div>
                {/* Desktop Search Input */}
                <div className="hidden lg:flex items-center w-full gap-3 px-3 py-2 text-muted-foreground bg-white/90 dark:bg-black rounded-full min-h-[40px] transition-all duration-300 border-2 border-primary/40 shadow-sm max-w-md ml-4">
                  <div className="relative flex items-center w-full">
                    <Search size={24} className="z-10 mr-4" />
                    <input
                      type="text"
                      className="bg-transparent outline-none border-0 flex-1 text-base truncate transition-opacity duration-300 z-10 focus:border-0 focus:outline-none focus:ring-0"
                      style={{ opacity: textOpacity }}
                      placeholder={
                        placeholderText === 'SkillCache'
                          ? ''
                          : placeholderText
                      }
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      aria-label="Search notes"
                    />
                    {placeholderText === 'SkillCache' && !searchQuery && (
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold select-none pointer-events-none flex items-center justify-center w-full z-20"
                        style={{ opacity: textOpacity }}
                      >
                        <span className="text-white">Skill</span><span className="text-primary" style={{ color: '#ef4444' }}>Cache</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 sm:gap-2 min-h-[56px] pr-2 sm:pr-4">
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full border-2 border-primary/40"
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {/* User avatar and info: only show on desktop (sm+) */}
                <div className="hidden lg:flex items-center gap-3 sm:gap-3 min-h-[56px]">
                  <div 
                    className="w-10 h-10 bg-primary/20 border border-border/30 rounded-full flex items-center justify-center flex-shrink-0"
                    title={currentUser?.displayName || currentUser?.email || 'User'}
                  >
                    <span className="text-base font-medium text-primary">
                      {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <p className="text-sm font-medium text-foreground">{currentUser?.displayName || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}

        <main
          className={`main-content-area ${location.pathname === '/ai-assistant' ? 'ai-assistant-active' : ''}`}
          style={
            location.pathname === '/ai-assistant'
              ? {
                  height: 'calc(var(--app-vh, 1vh) * 100)',
                  minHeight: 0,
                  maxHeight: 'calc(var(--app-vh, 1vh) * 100)',
                  overflow: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  padding: 0,
                }
              : {}
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;