import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, ArrowUpRight, Send, MessageCircle, MessageSquare, 
  Mail, Phone, MapPin, Link as LinkIcon, ExternalLink, User, Video
} from 'lucide-react';
import Card from '../components/common/Card';
import QRGenerator from '../components/qr/QRGenerator';
import { getUserData } from '../services/firestore';

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

      const result = await getUserData(id);
      
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
        <Card>
          <p className="text-red-400 text-xl">{error}</p>
        </Card>
      </div>
    );
  }

  const validLinks = profile?.socialLinks?.filter(link => link.url) || [];

  return (
    <div className="min-h-screen py-8 px-4 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        {/* Profile Header */}
        <Card neon>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {profile.fullName}
            </h1>
            <p className="text-[#00ffaa] font-mono text-lg mb-4 neon-text">
              {profile.generatedID}
            </p>
            
            <div className="flex justify-center mb-4">
              <QRGenerator value={window.location.href} size={150} />
            </div>
          </div>
        </Card>

        {/* Social Links */}
        {validLinks.length > 0 && (
          <Card className="mt-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Links ({validLinks.length}/10)
            </h2>
            <div className="space-y-3">
              {validLinks.map((link, index) => {
                const Icon = getPlatformIcon(link.url);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-[#00ffaa]/30 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#00ffaa]/20 flex items-center justify-center text-[#00ffaa]">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium">
                        {link.name || 'Link'}
                      </span>
                      <span className="block text-white/50 text-xs truncate">
                        {link.url.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                    <ExternalLink size={16} className="text-white/30 group-hover:text-[#00ffaa]" />
                  </a>
                );
              })}
            </div>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-white/30 text-sm mt-6">
          Powered by SmartQR
        </p>
      </motion.div>
    </div>
  );
};

export default ProfileView;