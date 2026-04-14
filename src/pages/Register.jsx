import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { registerUser } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

/**
 * Register Page - User registration with auto ID generation
 */
const Register = () => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedID, setGeneratedID] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (fullName.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    setLoading(true);
    setShowWarning(true);

    // Show warning for 2 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await registerUser(fullName.trim());
    
    if (result.success) {
      setGeneratedID(result.generatedID);
      login(result);
      
      // Redirect to index after showing generated ID
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <h1 className="text-3xl font-bold text-center mb-2 text-[#00ffaa] neon-text">
            SmartQR
          </h1>
          <p className="text-white/50 text-center mb-8">
            Create your QR profile
          </p>

          {!generatedID ? (
            <form onSubmit={handleRegister}>
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="text-lg"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Get Your ID'}
              </Button>

              <p className="text-white/50 text-sm text-center mt-6">
                Already have an ID?{' '}
                <span
                  onClick={() => navigate('/login')}
                  className="text-[#00ffaa] cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-4 p-4 bg-[#00ffaa]/10 rounded-lg border border-[#00ffaa]/30">
                <p className="text-white/70 text-sm mb-2">Your unique ID:</p>
                <p className="text-2xl font-mono text-[#00ffaa] neon-text">
                  {generatedID}
                </p>
              </div>
              <p className="text-white/50 text-sm mb-4">
                Redirecting to your QR page...
              </p>
            </motion.div>
          )}
        </Card>

        {/* Warning Message */}
        {showWarning && !generatedID && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
          >
            <p className="text-yellow-400 text-center text-sm">
              ⚠️ မည်သူမျှ မပြပါနှင့်<br/>
              Your ID is generated - remember it!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;