import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
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
    <div className="min-h-screen pt-20 pb-8 px-4 bg-black">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto space-y-4"
      >
        {/* QR Card - Centered */}
        <Card neon className="text-center py-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            {user.fullName || 'User'}
          </h1>
          <p className="text-[#00ffaa] font-mono text-lg mb-6 neon-text">
            {user.generatedID}
          </p>
          
          <div className="flex justify-center mb-4">
            <QRGenerator value={profileUrl || user.generatedID} size={180} />
          </div>
          
          <p className="text-white/50 text-sm">
            Scan to view my profile
          </p>
        </Card>

        {/* Social Links Preview */}
        {socialLinks.length > 0 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">My Links ({socialLinks.length})</h2>
            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[#00ffaa] text-center font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Index;