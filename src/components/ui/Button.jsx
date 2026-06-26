import React from 'react';
import { motion } from 'framer-motion';
import { useMagneticHover } from '../../utils/useMagneticHover';
import './Button.css';

/* Premium button with variants: primary (gradient), secondary (glass), ghost, danger */
function Button({ children, variant = 'primary', size = 'md', icon, loading, disabled, onClick, className = '', type = 'button', magnetic, ...props }) {
  const isMagnetic = magnetic !== undefined ? magnetic : (variant === 'primary');
  const { ref, x, y } = useMagneticHover(0.3);

  const ButtonComponent = isMagnetic ? motion.button : 'button';
  const magneticProps = isMagnetic ? { ref, style: { x, y } } : {};

  return (
    <ButtonComponent
      type={type}
      className={`premium-btn btn-${variant} btn-size-${size} ${loading ? 'btn-loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...magneticProps}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </ButtonComponent>
  );
}

export default Button;
