import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { updateUserSocialLinks, updateUserProfile, normalizeUrl } from '../services/firestore';

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
          <p className="text-white/50 text-sm mb-4">Auto-adds https:// if missing</p>

          <div className="space-y-4 mb-6">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-white/30 text-sm w-6">{index + 1}.</span>
                <Input
                  type="text"
                  placeholder="Name (e.g., Facebook)"
                  value={link.name}
                  onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="url"
                  placeholder="URL (e.g., facebook.com/yourpage)"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="flex-1"
                />
              </div>
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