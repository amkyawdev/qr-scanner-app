import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
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

/**
 * Dashboard Page - Link Management
 * Users can add/edit up to 8 social links
 */
const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [socialLinks, setSocialLinks] = useState(Array(8).fill({ name: '', url: '' }));
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasLinks, setHasLinks] = useState(false);
  
  // Initialize data from user
  useEffect(() => {
    if (user?.socialLinks && user.socialLinks.length > 0) {
      const links = Array(8).fill({ name: '', url: '' });
      user.socialLinks.slice(0, 8).forEach((link, i) => {
        if (link.name && link.url) links[i] = link;
      });
      setSocialLinks(links);
      const hasAny = links.some(l => l.name && l.url);
      setHasLinks(hasAny);
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
    if (!user) return;
    setLoading(true);
    
    const normalizedLinks = socialLinks.map(link => ({
      ...link,
      url: link.url ? normalizeUrl(link.url) : ''
    }));
    
    const result = await updateUserSocialLinks(user.uid, normalizedLinks);
    
    if (result.success) {
      updateUser({ socialLinks: normalizedLinks });
      setSaved(true);
      const hasAny = normalizedLinks.some(l => l.name && l.url);
      setHasLinks(hasAny);
      setTimeout(() => setSaved(false), 2000);
    }
    
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (!fullName.trim() || !user) return;
    setLoading(true);
    const result = await updateUserProfile(user.uid, { fullName: fullName.trim() });
    if (result.success) {
      updateUser({ fullName: fullName.trim() });
    }
    setLoading(false);
  };

  const handleEditLink = (index) => {
    setSaved(false);
  };

  const handleDeleteLink = (index) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { name: '', url: '' };
    setSocialLinks(newLinks);
    setSaved(false);
  };

  const addQuickLink = (index, platform) => {
    const platformData = QUICK_LINKS[platform];
    const newLinks = [...socialLinks];
    newLinks[index] = { name: platformData.name, url: platformData.placeholder };
    setSocialLinks(newLinks);
    setSaved(false);
  };

  // Count saved links
  const savedCount = socialLinks.filter(l => l.name && l.url).length;
  const maxLinks = 8;
  const allFull = savedCount >= maxLinks;

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
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-white/50 text-sm">{savedCount}/{maxLinks} Links</p>
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
            <Button onClick={handleSaveName} variant="secondary" disabled={loading}>Save</Button>
          </div>
        </Card>

        {/* Links Card */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Your Social Links</h2>
          
          {/* Link Inputs */}
          <div className="space-y-3 mb-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-white/30 text-sm w-6">{index + 1}.</span>
                <Input
                  type="text"
                  placeholder="Platform"
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
                {(link.name || link.url) && (
                  <button
                    onClick={() => handleDeleteLink(index)}
                    className="p-2 text-white/50 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Add - only show when not all filled */}
          {!allFull && (
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_LINKS.map((platform, pIndex) => (
                <button
                  key={pIndex}
                  type="button"
                  onClick={() => {
                    const emptyIndex = socialLinks.findIndex(l => !l.name && !l.url);
                    if (emptyIndex !== -1) addQuickLink(emptyIndex, pIndex);
                  }}
                  className="text-xs px-2 py-1 rounded bg-white/10 text-white/70 hover:bg-[#00ffaa]/20 hover:text-[#00ffaa]"
                >
                  + {platform.name}
                </button>
              ))}
            </div>
          )}

          <Button
            onClick={handleSaveLinks}
            disabled={loading || savedCount === 0}
            className="w-full"
          >
            {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Links'}
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