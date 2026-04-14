import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { loginUser } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page - User login with email or phone
 */
const Login = () => {
  const [credential, setCredential] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credential.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const identifier = credential.trim();
    const result = await loginUser(identifier, password);
    
    if (result.success) {
      login(result);
      navigate('/');
    } else {
      setError(result.error || 'Invalid credentials');
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
            Welcome back! Login to continue
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

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input
                type={isPhone ? "tel" : "email"}
                placeholder={isPhone ? "Mobile Number" : "Email Address"}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                disabled={loading}
                className="pl-12"
              />
            </div>

            <div className="mb-6">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-12"
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-white/50 text-sm hover:text-[#00ffaa] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <p className="text-white/50 text-sm text-center mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#00ffaa] cursor-pointer hover:underline"
              >
                Register here
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;