import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, Plus, Tag, Settings, LogOut, Zap, Hash, BookOpen, Search, Filter, Sun, Moon, ChevronDown, Archive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Add Note', href: '/add-note', icon: Plus },
    { name: 'Categories', href: '/categories', icon: Hash },
    { name: 'Archive', href: '/archive', icon: Archive },
  ];

  const isActive = (path) => location.pathname === path;
  
  // Show search bar on all main pages except auth pages
  const showSearchBar = location.pathname === '/' || 
                       location.pathname === '/dashboard' ||
                       location.pathname === '/categories' ||
                       location.pathname === '/archive' ||
                       location.pathname === '/add-note';

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex-shrink-0 mb-4">
            <div 
              className="keep-logo-area"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarCollapsed(!sidebarCollapsed);
              }}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <div className="logo-icon">
                <Zap size={28} />
              </div>
              <span className="keep-logo-text">
                Skill<span className="text-primary">Cache</span>
              </span>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1">
            <nav>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`keep-nav-item ${isActive(item.href) ? 'active' : ''}`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className="keep-nav-icon" />
                    <span className="keep-nav-text">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/30">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn-ghost p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Skill<span className="text-primary">Cache</span>
              </span>
            </div>
            
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="py-4">
          {/* Top Bar with Search and User Controls */}
          <div className="content-top-bar">
            {/* Search Bar - only show on dashboard */}
            {showSearchBar && (
              <div className="search-bar">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
                <Filter className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </div>
            )}
            
            {/* User Controls */}
            <div className="user-controls ml-auto">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="user-control-btn hover:bg-muted border border-transparent hover:border-border/30 rounded-full"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Avatar */}
              <div 
                className="user-control-btn bg-primary/20 border border-border/30 rounded-full"
                title={currentUser?.displayName || currentUser?.email || 'User'}
              >
                <span className="text-sm font-medium text-primary">
                  {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                </span>
              </div>

              {/* User Info with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/30"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <div className="hidden sm:flex flex-col items-start">
                    <p className="text-sm font-medium text-foreground">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.email}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-1">
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        role="menuitem"
                        onClick={() => {
                          setDropdownOpen(false);
                          setSidebarOpen(false);
                        }}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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
