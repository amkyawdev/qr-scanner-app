import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { loginUser } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page - User login with email and password
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const result = await loginUser(email.trim(), password);
    
    if (result.success) {
      login(result);
      navigate('/');
    } else {
      setError(result.error || 'Invalid credentials');
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
            Welcome back! Login to continue
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="pl-10"
              />
            </div>

            <div className="mb-6 relative">
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