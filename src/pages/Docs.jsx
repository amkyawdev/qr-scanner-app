import { motion } from 'framer-motion';
import { GitBranch, Mail, Phone, User, Globe, ExternalLink } from 'lucide-react';
import Card from '../components/common/Card';
import Navbar from '../components/layout/Navbar';

/**
 * Docs Page - Contact Developer Info
 */
const Docs = () => {
  const developerInfo = {
    name: 'Aung Myo Kyaw',
    github: 'amkyawdev',
    gmail: 'aung.thuyrain.at449@gmail.com',
    phone: '09677740154'
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card>
          <h1 className="text-2xl font-bold text-white mb-2">
            Developer Info
          </h1>
          <p className="text-white/50 mb-6">
            Contact information
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
              <User className="text-[#00ffaa]" size={24} />
              <div>
                <p className="text-white/50 text-sm">Developer</p>
                <p className="text-white font-semibold">{developerInfo.name}</p>
              </div>
            </div>

            <a
              href={`https://github.com/${developerInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <GitBranch className="text-white" size={24} />
              <div>
                <p className="text-white/50 text-sm">GitHub</p>
                <p className="text-[#00aaff] flex items-center gap-2">
                  {developerInfo.github}
                  <ExternalLink size={14} />
                </p>
              </div>
            </a>

            <a
              href={`mailto:${developerInfo.gmail}`}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Mail className="text-[#00ffaa]" size={24} />
              <div>
                <p className="text-white/50 text-sm">Gmail</p>
                <p className="text-white">{developerInfo.gmail}</p>
              </div>
            </a>

            <a
              href={`tel:${developerInfo.phone}`}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Phone className="text-[#00ffaa]" size={24} />
              <div>
                <p className="text-white/50 text-sm">Phone</p>
                <p className="text-white">{developerInfo.phone}</p>
              </div>
            </a>
          </div>
        </Card>

        <Card className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="text-[#00ffaa]" size={20} />
            <h2 className="text-lg font-semibold text-white">About SmartQR</h2>
          </div>
          <p className="text-white/70 text-sm">
            SmartQR is a mobile-responsive web app that allows users to create 
            personalized QR codes for their profiles. Users can add up to 10 
            links to their profile, making it easy to share all their social 
            media and contact information in one place.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Docs;