import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { QrCode, Settings, BookOpen, LogOut, Menu, X } from 'lucide-react';

/**
 * Navbar component with hamburger menu
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'QR Code', icon: QrCode },
    { path: '/dashboard', label: 'Dashboard', icon: Settings },
    { path: '/docs', label: 'Docs', icon: BookOpen },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-[#00ffaa] font-bold text-xl neon-text flex items-center gap-2">
          <QrCode size={24} />
          SmartQR
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {user && navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-[#00ffaa]/20 text-[#00ffaa]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 p-4"
          >
            <div className="glass-card rounded-xl overflow-hidden">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                      isActive(link.path)
                        ? 'bg-[#00ffaa]/20 text-[#00ffaa]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;