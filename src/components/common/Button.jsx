import { motion } from 'framer-motion';

/**
 * Neon styled button component
 */
const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary'
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#00ffaa] to-[#00aaff] text-black hover:shadow-[0_0_20px_rgba(0,255,170,0.5)] hover:-translate-y-0.5',
    secondary: 'bg-transparent border border-[#00ffaa] text-[#00ffaa] hover:bg-[#00ffaa]/10',
    danger: 'bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;