import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { updateUserLinks } from '../services/firestore';

/**
 * Dashboard Page - Link Management
 * Users can add/edit up to 10 links
 */
const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [links, setLinks] = useState(Array(10).fill({ name: '', url: '' }));
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize links from user data
  useEffect(() => {
    if (user?.links) {
      setLinks([...user.links]);
    }
  }, [user]);

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    
    const result = await updateUserLinks(user.generatedID, links);
    
    if (result.success) {
      updateUser({ links });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    
    setLoading(false);
  };

  const handleClear = () => {
    setLinks(Array(10).fill({ name: '', url: '' }));
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
            Manage your profile links (max 10)
          </p>

          <div className="space-y-4 mb-6">
            {links.map((link, index) => (
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
                  placeholder="URL (e.g., https://facebook.com)"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSave}
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
          <h2 className="text-lg font-semibold text-white mb-2">Your Info</h2>
          <p className="text-white/70">
            <span className="text-white/50">Name:</span> {user.fullName}
          </p>
          <p className="text-[#00ffaa] font-mono">
            <span className="text-white/50">ID:</span> {user.generatedID}
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;