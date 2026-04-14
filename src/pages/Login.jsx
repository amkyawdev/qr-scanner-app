import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { loginUser } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page - User login with fullName and generatedID
 */
const Login = () => {
  const [fullName, setFullName] = useState('');
  const [generatedID, setGeneratedID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fullName.trim() || !generatedID.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const result = await loginUser(fullName.trim(), generatedID.trim());
    
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
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="text-lg"
              />
            </div>

            <div className="mb-6">
              <Input
                type="text"
                placeholder="Your ID (e.g., aug123@gg)"
                value={generatedID}
                onChange={(e) => setGeneratedID(e.target.value)}
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-white/50 text-sm text-center mt-6">
              Don't have an ID?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-[#00ffaa] cursor-pointer hover:underline"
              >
                Register here
              </span>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;