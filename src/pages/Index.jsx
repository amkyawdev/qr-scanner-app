import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import QRGenerator from '../components/qr/QRGenerator';
import { useAuth } from '../context/AuthContext';

/**
 * Index Page - QR Code Display (Home)
 * Shows user info and their unique QR code
 */
const Index = () => {
  const { user } = useAuth();
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    if (user?.generatedID) {
      const baseUrl = window.location.origin;
      setProfileUrl(`${baseUrl}/profile/${user.generatedID}`);
    }
  }, [user]);

  const socialLinks = user?.socialLinks?.filter(link => link.name && link.url) || [];

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center bg-black">
        <Navbar />
        <p className="text-white/50">Please login first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-8 px-4 bg-black">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm mx-auto space-y-6"
      >
        {/* QR Card - Beautiful Glassmorphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffaa]/20 to-[#00aaff]/20 rounded-3xl blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">
              {user.fullName || 'User'}
            </h1>
            <p className="text-[#00ffaa] font-mono text-lg mb-6 neon-text">
              {user.generatedID}
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-2xl">
                <QRGenerator value={profileUrl || user.generatedID} size={160} />
              </div>
            </div>
            
            <p className="text-white/50 text-sm">
              Scan to view my profile
            </p>
          </div>
        </div>

        {/* Social Links Card */}
        {socialLinks.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            <h2 className="text-white/70 text-sm mb-4 text-center">My Links</h2>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-[#00ffaa]/20 hover:to-[#00aaff]/20 transition-all text-white text-center font-medium text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;