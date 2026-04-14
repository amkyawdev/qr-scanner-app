import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import QRGenerator from '../components/qr/QRGenerator';
import { getUserData } from '../services/firestore';

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

  const validLinks = profile?.links?.filter(link => link.url) || [];

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

        {/* Links */}
        {validLinks.length > 0 && (
          <Card className="mt-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Links ({validLinks.length}/10)
            </h2>
            <div className="space-y-3">
              {validLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-[#00ffaa]/30"
                >
                  <span className="text-white font-medium">
                    {link.name || link.url}
                  </span>
                  <span className="block text-white/50 text-sm truncate">
                    {link.url}
                  </span>
                </a>
              ))}
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