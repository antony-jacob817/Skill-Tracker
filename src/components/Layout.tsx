import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Home, BarChart3, Code, Settings } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { preferences, updatePreferences } = useSkillContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const toggleDarkMode = () => {
    updatePreferences({
      ...preferences,
      darkMode: !preferences.darkMode,
    });
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Skills', href: '/skills', icon: Code },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <Code className="text-primary-500" size={28} />
                <span className="text-xl font-bold text-gray-900 dark:text-white">SkillPulse</span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex ml-8 space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-500 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {preferences.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-500 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`}
                onClick={closeMobileMenu}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 py-8 px-4 md:px-8 overflow-y-auto">
          <div className="container mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;