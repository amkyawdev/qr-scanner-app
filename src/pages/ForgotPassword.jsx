import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { resetPassword } from '../services/firestore';

/**
 * Forgot Password Page - Reset with email or phone
 */
const ForgotPassword = () => {
  const [credential, setCredential] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!credential.trim()) {
      setError('Please enter your ' + (isPhone ? 'phone number' : 'email address'));
      return;
    }

    setLoading(true);

    const result = await resetPassword(credential.trim());

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to send reset email');
    }

    setLoading(false);
  };

  // Toggle between email and phone
  const handleToggleType = (type) => {
    setIsPhone(type === 'phone');
    setCredential('');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00ffaa]/20 flex items-center justify-center">
                <Mail className="text-[#00ffaa]" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Check Your {isPhone ? 'Phone' : 'Email'}
              </h1>
              <p className="text-white/50 mb-6">
                We've sent a password reset link to <br />
                <span className="text-[#00ffaa]">{credential}</span>
              </p>
              <Link
                to="/login"
                className="text-[#00ffaa] hover:underline inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

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
            Reset your password
          </p>

          {/* Toggle Email/Phone */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleToggleType('email')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                !isPhone 
                  ? 'bg-[#00ffaa]/20 text-[#00ffaa] border border-[#00ffaa]/50' 
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => handleToggleType('phone')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                isPhone 
                  ? 'bg-[#00ffaa]/20 text-[#00ffaa] border border-[#00ffaa]/50' 
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}
            >
              Mobile No
            </button>
          </div>

          <form onSubmit={handleReset}>
            <div className="mb-6 relative">
              {isPhone ? (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              )}
              <Input
                type={isPhone ? "tel" : "email"}
                placeholder={isPhone ? "Mobile Number" : "Email Address"}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                disabled={loading}
                className="pl-10"
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
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <p className="text-white/50 text-sm text-center mt-6">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-[#00ffaa] cursor-pointer hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;