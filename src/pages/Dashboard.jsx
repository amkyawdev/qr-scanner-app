import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { updateUserSocialLinks, updateUserProfile, normalizeUrl } from '../services/firestore';

// Quick link templates
const QUICK_LINKS = [
  { name: 'Facebook', placeholder: 'https://www.facebook.com/yourname' },
  { name: 'Messenger', placeholder: 'https://m.me/yourname' },
  { name: 'TikTok', placeholder: 'https://www.tiktok.com/@yourname' },
  { name: 'Telegram', placeholder: 'https://t.me/yourname' },
  { name: 'YouTube', placeholder: 'https://www.youtube.com/@yourchannel' },
  { name: 'GitHub', placeholder: 'https://github.com/yourname' },
  { name: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/yourname' },
  { name: 'WhatsApp', placeholder: 'https://wa.me/959xxxxxxxxx' },
];

// Show saved links separately - only after saving
const SavedLinks = ({ links, onEdit, onDelete, visible }) => {
  const savedLinks = links.filter(l => l.name && l.url);
  
  if (!visible || savedLinks.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-white/70 text-sm mb-3">Saved Links</h3>
      <div className="space-y-2">
        {links.map((link, index) => {
          if (!link.name && !link.url) return null;
          return (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{link.name}</p>
                <p className="text-white/50 text-xs truncate">{link.url}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onEdit(index)}
                  className="p-1.5 text-white/50 hover:text-[#00ffaa] transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="p-1.5 text-white/50 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Dashboard Page - Link Management
 * Users can add/edit up to 10 social links
 */
const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [socialLink, setSocialLink] = useState({ name: '', url: '' });
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasLinks, setHasLinks] = useState(false);

  // Initialize data from user
  useEffect(() => {
    if (user?.socialLinks && user.socialLinks.length > 0) {
      // Get first saved link
      const savedLink = user.socialLinks.find(l => l.name && l.url);
      if (savedLink) {
        setSocialLink(savedLink);
        setHasLinks(true);
      }
    }
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleLinkChange = (field, value) => {
    setSocialLink({ ...socialLink, [field]: value });
    setSaved(false);
  };

  const handleSaveLinks = async () => {
    if (!socialLink.name || !socialLink.url) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Normalize URL - add https:// if missing
    const normalizedLink = {
      ...socialLink,
      url: normalizeUrl(socialLink.url)
    };
    
    const result = await updateUserSocialLinks(user.uid, [normalizedLink]);
    
    if (result.success) {
      updateUser({ socialLinks: [normalizedLink] });
      setSaved(true);
      setHasLinks(true);
      setTimeout(() => setSaved(false), 2000);
    }
    
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (!fullName.trim()) return;
    
    setLoading(true);
    
    const result = await updateUserProfile(user.uid, { fullName: fullName.trim() });
    
    if (result.success) {
      updateUser({ fullName: fullName.trim() });
    }
    
    setLoading(false);
  };

  const handleClear = () => {
    setSocialLink({ name: '', url: '' });
    setHasLinks(false);
    setSaved(false);
  };

  const addQuickLink = (platform) => {
    const platformData = QUICK_LINKS[platform];
    setSocialLink({ name: platformData.name, url: platformData.placeholder });
    setSaved(false);
  };

  // Edit saved link - load it back to form
  const handleEditLink = () => {
    setSaved(false);
  };

  // Delete saved link
  const handleDeleteLink = () => {
    setSocialLink({ name: '', url: '' });
    setHasLinks(false);
    setSaved(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex flex-col items-center justify-center bg-black">
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
        {/* Header Card */}
        <Card className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            Dashboard
          </h1>
          <p className="text-white/50 text-sm">
            Manage your profile
          </p>
        </Card>

        {/* Name Card */}
        <Card>
          <label className="text-white/70 text-sm mb-2 block">Display Name</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Your Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveName} variant="secondary" disabled={loading}>
              Save
            </Button>
          </div>
        </Card>

        {/* Link Card */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Your Social Link</h2>

          {/* Show input when no link saved */}
          {!hasLinks && (
            <>
              <div className="space-y-3 mb-4">
                <Input
                  type="text"
                  placeholder="Platform Name"
                  value={socialLink.name}
                  onChange={(e) => handleLinkChange('name', e.target.value)}
                  className="w-full"
                />
                <Input
                  type="url"
                  placeholder="URL"
                  value={socialLink.url}
                  onChange={(e) => handleLinkChange('url', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_LINKS.map((platform, pIndex) => (
                  <button
                    key={pIndex}
                    type="button"
                    onClick={() => addQuickLink(pIndex)}
                    className="text-xs px-2 py-1 rounded bg-white/10 text-white/70 hover:bg-[#00ffaa]/20 hover:text-[#00ffaa] transition-colors"
                  >
                    + {platform.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Saved Link */}
          {hasLinks && (
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{socialLink.name}</p>
                <p className="text-white/50 text-xs truncate">{socialLink.url}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={handleEditLink}
                  className="p-1.5 text-white/50 hover:text-[#00ffaa] transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={handleDeleteLink}
                  className="p-1.5 text-white/50 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={handleSaveLinks}
            disabled={loading || !socialLink.name || !socialLink.url}
            className="w-full"
          >
            {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Link'}
          </Button>
        </Card>

        {/* Account Info */}
        <Card>
          <h3 className="text-white/70 text-sm mb-2">Account</h3>
          <p className="text-white/50 text-xs">ID: {user?.generatedID || 'N/A'}</p>
          <p className="text-white/50 text-xs">Email: {user?.email}</p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;