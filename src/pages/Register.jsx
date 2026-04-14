import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { registerUser } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

/**
 * Register Page - User registration with email/phone
 */
const Register = () => {
  const [credential, setCredential] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!credential.trim() || !password || !fullName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    // Determine if credential is phone or email
    const isPhoneNumber = credential.replace(/[\s\-+()]/g, '').match(/^\d{8,15}$/);
    const identifier = isPhoneNumber ? credential.trim() : credential.trim();
    
    const result = await registerUser(identifier, password, fullName.trim());
    
    if (result.success) {
      login(result);
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  // Toggle between email and phone
  const handleToggleType = (type) => {
    setIsPhone(type === 'phone');
    setCredential('');
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
            Create your account
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

          <form onSubmit={handleRegister}>
            <div className="mb-4 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="pl-10"
              />
            </div>

            <div className="mb-4 relative">
              {isPhone ? (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              )}
              <Input
                type={isPhone ? "tel" : "email"}
                placeholder={isPhone ? "Mobile Number (e.g., 09677740154)" : "Email Address"}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                disabled={loading}
                className="pl-10"
              />
            </div>

            <div className="mb-4 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-10"
              />
            </div>

            <div className="mb-6 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating Account...' : 'Register'}
            </Button>

            <p className="text-white/50 text-sm text-center mt-6">
              Already have an account?{' '}
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

export default Register;