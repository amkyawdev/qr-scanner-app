import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Video, Send, Phone, Mail, Globe, ExternalLink, User, Camera, X } from 'lucide-react';
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
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (user?.generatedID) {
      const baseUrl = window.location.origin;
      setProfileUrl(`${baseUrl}/profile/${user.generatedID}`);
    }
  }, [user]);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowScanner(false);
  };

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
                  <QRGenerator value={selectedLink.url} size={140} bwMode={true} />
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

      {/* QR Scanner Button */}
      <div className="max-w-sm mx-auto mt-4">
        <button
          onClick={startScanner}
          className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#00ffaa]/20 to-[#00aaff]/20 rounded-2xl border border-white/10 hover:from-[#00ffaa]/30 hover:to-[#00aaff]/30 transition-all"
        >
          <Camera size={24} className="text-[#00ffaa]" />
          <span className="text-white font-medium">Scan QR Code</span>
        </button>
      </div>

      {/* QR Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-white text-lg font-semibold">Scan QR Code</h2>
            <button
              onClick={stopScanner}
              className="p-2 bg-white/10 rounded-full"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Scanner Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-72 h-72">
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#00ffaa] rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#00ffaa] rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#00ffaa] rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#00ffaa] rounded-br-xl" />
              
              {/* Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-xl"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 text-center">
            <p className="text-white/70">Point camera at QR code</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;