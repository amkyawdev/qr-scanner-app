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
 * Shows user info and their unique QR code with clickable social links
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
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">
              {user.fullName || 'User'}
            </h1>
            <p className="text-[#00ffaa] font-mono text-lg mb-4 neon-text">
              {user.generatedID}
            </p>
            
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-white rounded-xl">
                <QRGenerator value={profileUrl || user.generatedID} size={140} />
              </div>
            </div>
            
            <p className="text-white/50 text-xs">Scan to view my profile</p>
          </div>
        </div>

        {/* Social Links - Clickable Buttons */}
        {socialLinks.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            <h2 className="text-white/70 text-xs mb-3 text-center">Quick Links</h2>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.name);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-[#00ffaa]/20 hover:to-[#00aaff]/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00ffaa]/20 flex items-center justify-center text-[#00ffaa]">
                      <Icon size={16} />
                    </div>
                    <span className="text-white font-medium text-sm flex-1">{link.name}</span>
                    <ExternalLink size={12} className="text-white/30" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;