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
    // Generate profile URL based on generatedID
    if (user?.generatedID) {
      const baseUrl = window.location.origin;
      setProfileUrl(`${baseUrl}/profile/${user.generatedID}`);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto flex items-center justify-center min-h-[calc(100vh-160px)]"
      >
        <Card neon>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {user.fullName || 'User'}
            </h1>
            <p className="text-[#00ffaa] font-mono text-lg mb-6 neon-text">
              {user.generatedID}
            </p>
            
            <div className="flex justify-center mb-6">
              <QRGenerator value={profileUrl || user.generatedID} size={200} />
            </div>
            
            <p className="text-white/50 text-sm">
              Scan this QR to view my profile
            </p>
          </div>
        </Card>

        {/* User Social Links Preview */}
        {user.socialLinks && user.socialLinks.some(link => link.url) && (
          <Card className="mt-4">
            <h2 className="text-lg font-semibold text-white mb-4">Your Links</h2>
            <div className="space-y-2">
              {user.socialLinks.filter(link => link.url).slice(0, 5).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[#00aaff]"
                >
                  {link.name || link.url}
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