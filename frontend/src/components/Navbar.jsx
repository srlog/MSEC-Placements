import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Users,
  MessageCircle,
  BookOpen,
  BarChart3,
  Wrench
} from 'lucide-react';
import { logout } from '../services/authService';

const Navbar = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Force a page reload to reset the app state
    window.location.href = '/login';
  };

 

  const studentNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/drives', label: 'Drives', icon: Calendar },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/drives', label: 'Manage Drives', icon: Calendar },
    { path: '/admin/queries', label: 'Queries', icon: MessageCircle },
    { path: '/admin/students', label: 'Students', icon: Users },
    { path: '/admin/skills', label: 'Skills', icon: Wrench },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/admin/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Don't show navbar on login/register pages or if user is not authenticated
  // if (!user || !user.role) return null;

  return (
    <div className="p-2">
      <nav className="bg-primary-900 shadow-xl border border-gray-800 rounded-2xl">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2.5 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MSEC Portal</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                      isActive(item.path)
                        ? 'bg-white text-primary-900 shadow-lg'
                        : 'text-white hover:text-primary-900 hover:bg-white hover:bg-opacity-90'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-blue-200 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 text-white hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-white hover:text-primary-900 hover:bg-white hover:bg-opacity-90"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-800">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                        isActive(item.path)
                          ? 'bg-white text-primary-900'
                          : 'text-white hover:text-primary-900 hover:bg-white hover:bg-opacity-90'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-blue-800 pt-4 mt-4">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-blue-200 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-white hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;