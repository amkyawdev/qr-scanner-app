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

// Show saved links separately
const SavedLinks = ({ links, onEdit, onDelete }) => {
  const savedLinks = links.filter(l => l.name && l.url);
  
  if (savedLinks.length === 0) {
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
  const [socialLinks, setSocialLinks] = useState(Array(10).fill({ name: '', url: '' }));
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSavedList, setShowSavedList] = useState(true);

  // Initialize data from user
  useEffect(() => {
    if (user?.socialLinks) {
      setSocialLinks([...user.socialLinks]);
    }
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
    setSaved(false);
  };

  const handleSaveLinks = async () => {
    setLoading(true);
    
    // Normalize URLs - add https:// if missing
    const normalizedLinks = socialLinks.map(link => ({
      ...link,
      url: normalizeUrl(link.url)
    }));
    
    const result = await updateUserSocialLinks(user.uid, normalizedLinks);
    
    if (result.success) {
      updateUser({ socialLinks: normalizedLinks });
      setSaved(true);
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
    setSocialLinks(Array(10).fill({ name: '', url: '' }));
    setSaved(false);
  };

  const addQuickLink = (index, platform) => {
    const platformData = QUICK_LINKS[platform];
    const newLinks = [...socialLinks];
    newLinks[index] = { name: platformData.name, url: platformData.placeholder };
    setSocialLinks(newLinks);
    setSaved(false);
  };

  // Edit saved link - load it back to form
  const handleEditLink = (index) => {
    const link = socialLinks[index];
    // Keep the link in place but allow editing
    setSaved(false);
  };

  // Delete saved link
  const handleDeleteLink = (index) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { name: '', url: '' };
    setSocialLinks(newLinks);
    setSaved(false);
  };

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
        className="max-w-2xl mx-auto"
      >
        <Card>
          <h1 className="text-2xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/50 mb-6">
            Manage your profile
          </p>

          {/* Profile Name */}
          <div className="mb-6">
            <label className="text-white/70 text-sm mb-2 block">Display Name</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Your Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSaveName}
                variant="secondary"
                disabled={loading}
              >
                Save
              </Button>
            </div>
          </div>

          <hr className="border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-4">Your Social Links (max 10)</h2>

          <div className="space-y-3 mb-6">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-white/30 text-sm w-6">{index + 1}.</span>
                <Input
                  type="text"
                  placeholder="Platform Name"
                  value={link.name}
                  onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>

          {/* Quick Add Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {QUICK_LINKS.map((platform, pIndex) => (
              <button
                key={pIndex}
                type="button"
                onClick={() => {
                  const emptyIndex = socialLinks.findIndex(link => !link.name && !link.url);
                  if (emptyIndex !== -1) {
                    addQuickLink(emptyIndex, pIndex);
                  }
                }}
                className="text-xs px-3 py-1.5 rounded bg-white/10 text-white/70 hover:bg-[#00ffaa]/20 hover:text-[#00ffaa] transition-colors"
              >
                + {platform.name}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSaveLinks}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
            <Button
              onClick={handleClear}
              variant="secondary"
              disabled={loading}
            >
              Clear All
            </Button>
          </div>

          {/* Saved Links with Edit/Delete Buttons */}
          <SavedLinks 
            links={socialLinks} 
            onEdit={handleEditLink}
            onDelete={handleDeleteLink}
          />
        </Card>

        {/* User Info Card */}
        <Card className="mt-4">
          <h2 className="text-lg font-semibold text-white mb-2">Account Info</h2>
          <p className="text-white/70">
            <span className="text-white/50">Email:</span> {user.email}
          </p>
          <p className="text-[#00ffaa] font-mono">
            <span className="text-white/50">ID:</span> {user.generatedID}
          </p>
          <p className="text-white/50 text-sm mt-2">
            UID: {user.uid}
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;