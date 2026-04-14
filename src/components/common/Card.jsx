import { motion } from 'framer-motion';

/**
 * Glassmorphism Card component
 */
const Card = ({ children, className = '', neon = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-xl p-6 ${neon ? 'neon-border' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;