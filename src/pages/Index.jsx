import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Video, Send, Phone, Mail, Globe, ExternalLink, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import QRGenerator from '../components/qr/QRGenerator';
import { useAuth } from '../context/AuthContext';

// Icon mapping for social platforms
const getSocialIcon = (name) => {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('facebook') || lowerName.includes('fb')) return User;
  if (lowerName.includes('messenger') || lowerName.includes('m.me')) return MessageCircle;
  if (lowerName.includes('tiktok')) return Video;
  if (lowerName.includes('telegram') || lowerName.includes('t.me')) return Send;
  if (lowerName.includes('youtube')) return Video;
  if (lowerName.includes('github')) return Globe;
  if (lowerName.includes('linkedin')) return Globe;
  if (lowerName.includes('whatsapp') || lowerName.includes('wa.me')) return Phone;
  if (lowerName.includes('gmail') || lowerName.includes('email')) return Mail;
  return Globe;
};

/**
 * Index Page - QR Code Display (Home)
 * Shows clickable social link buttons - clicking shows QR for that platform
 */
const Index = () => {
  const { user } = useAuth();
  const [profileUrl, setProfileUrl] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    if (user?.generatedID) {
      const baseUrl = window.location.origin;
      setProfileUrl(`${baseUrl}/profile/${user.generatedID}`);
    }
  }, [user]);

  const socialLinks = user?.socialLinks?.filter(link => link.name && link.url) || [];

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  const handleBack = () => {
    setSelectedLink(null);
  };

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
        {/* Header - User Info */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffaa]/20 to-[#00aaff]/20 rounded-3xl blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">
              {user.fullName || 'User'}
            </h1>
            <p className="text-[#00ffaa] font-mono text-lg mb-2 neon-text">
              {user.generatedID}
            </p>
            <p className="text-white/50 text-xs">Click a link to get its QR</p>
          </div>
        </div>

        {/* Social Links - Clickable Buttons */}
        {selectedLink ? (
          // Show QR for selected link
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffaa]/20 to-[#00aaff]/20 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-center">
              <button
                onClick={handleBack}
                className="absolute top-3 left-3 text-white/50 hover:text-white"
              >
                ← Back
              </button>
              
              <div className="w-10 h-10 rounded-xl bg-[#00ffaa]/20 flex items-center justify-center text-[#00ffaa] mx-auto mb-3">
                {(() => {
                  const Icon = getSocialIcon(selectedLink.name);
                  return <Icon size={20} />;
                })()}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-4">{selectedLink.name}</h2>
              
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white rounded-xl">
                  <QRGenerator value={selectedLink.url} size={140} />
                </div>
              </div>
              
              <p className="text-white/50 text-xs mb-2">Scan to open {selectedLink.name}</p>
              
              <a
                href={selectedLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#00ffaa] text-sm hover:underline"
              >
                Open {selectedLink.name} →
              </a>
            </div>
          </motion.div>
        ) : (
          // Show link buttons
          socialLinks.length > 0 && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
              <h2 className="text-white/70 text-xs mb-3 text-center">My Links</h2>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((link, index) => {
                  const Icon = getSocialIcon(link.name);
                  return (
                    <button
                      key={index}
                      onClick={() => handleLinkClick(link)}
                      className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-[#00ffaa]/20 hover:to-[#00aaff]/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#00ffaa]/20 flex items-center justify-center text-[#00ffaa]">
                        <Icon size={16} />
                      </div>
                      <span className="text-white font-medium text-sm flex-1">{link.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
};

export default Index;