import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, ArrowUpRight, Send, MessageCircle, MessageSquare, 
  Mail, Phone, MapPin, Link as LinkIcon, ExternalLink, User, Video
} from 'lucide-react';
import Card from '../components/common/Card';
import QRGenerator from '../components/qr/QRGenerator';
import { getUserDataByGeneratedID } from '../services/firestore';

/**
 * Detect platform from URL and return icon component
 * Uses only universally available lucide-react icons
 */
const getPlatformIcon = (url) => {
  if (!url) return LinkIcon;
  
  const lowerUrl = url.toLowerCase();
  
  // Social media - use Globe for most
  if (lowerUrl.includes('facebook') || lowerUrl.includes('fb.com') || 
      lowerUrl.includes('instagram') || lowerUrl.includes('ig.me') ||
      lowerUrl.includes('tiktok') || lowerUrl.includes('linkedin')) {
    return Globe;
  }
  
  // Twitter/X
  if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) {
    return ArrowUpRight;
  }
  
  // YouTube/Video
  if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) {
    return Video;
  }
  
  // GitHub
  if (lowerUrl.includes('github')) {
    return Globe;
  }
  
  // Telegram
  if (lowerUrl.includes('telegram') || lowerUrl.includes('t.me')) {
    return Send;
  }
  
  // WhatsApp
  if (lowerUrl.includes('whatsapp') || lowerUrl.includes('wa.me')) {
    return MessageCircle;
  }
  
  // Discord
  if (lowerUrl.includes('discord')) {
    return MessageSquare;
  }
  
  // Email
  if (lowerUrl.includes('email') || lowerUrl.includes('gmail') || lowerUrl.includes('mail.google')) {
    return Mail;
  }
  
  // Phone
  if (lowerUrl.includes('phone') || lowerUrl.includes('call')) {
    return Phone;
  }
  
  // Location
  if (lowerUrl.includes('location') || lowerUrl.includes('maps')) {
    return MapPin;
  }
  
  return LinkIcon;
};

/**
 * ProfileView Page - Public profile when someone scans QR
 */
const ProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError('Invalid profile ID');
        setLoading(false);
        return;
      }

      // Use generatedID to find user
      const result = await getUserDataByGeneratedID(id);
      
      if (result.success) {
        setProfile(result);
      } else {
        setError('Profile not found');
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#00ffaa] text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const validLinks = profile?.socialLinks?.filter(link => link.name && link.url) || [];

  return (
    <div className="min-h-screen py-8 px-4 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm mx-auto space-y-6"
      >
        {/* Profile Header - Glassmorphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffaa]/20 to-[#00aaff]/20 rounded-3xl blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">
              {profile.fullName || 'User'}
            </h1>
            <p className="text-[#00ffaa] font-mono text-lg mb-4 neon-text">
              {profile.generatedID}
            </p>
            
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-xl">
                <QRGenerator value={window.location.href} size={120} />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {validLinks.length > 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            <h2 className="text-white/70 text-sm mb-4 text-center">Links ({validLinks.length})</h2>
            <div className="space-y-2">
              {validLinks.map((link, index) => {
                const Icon = getPlatformIcon(link.url);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-[#00ffaa]/20 hover:to-[#00aaff]/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00ffaa]/20 flex items-center justify-center text-[#00ffaa]">
                      <Icon size={16} />
                    </div>
                    <span className="text-white font-medium text-sm flex-1">{link.name}</span>
                    <ExternalLink size={14} className="text-white/30 group-hover:text-[#00ffaa]" />
                  </a>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
            <p className="text-white/50">No links yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileView;