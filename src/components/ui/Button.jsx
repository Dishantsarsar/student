import React from 'react';
import { motion } from 'framer-motion';
import { useMagneticHover } from '../../utils/useMagneticHover';
import './Button.css';

/* Premium button with variants: primary (gradient), secondary (glass), ghost, danger */
function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading, 
  disabled, 
  onClick, 
  className = '', 
  type = 'button', 
  magnetic, 
  fullWidth = false,
  as: Component = 'button',
  ...props 
}) {
  const isMagnetic = magnetic !== undefined ? magnetic : (variant === 'primary');
  const { ref, x, y } = useMagneticHover(0.3);

  // Framer motion 12 approach
  const ButtonComponent = isMagnetic ? (Component === 'button' ? motion.button : motion.create(Component)) : Component;
  const magneticProps = isMagnetic ? { ref, style: { x, y } } : {};

  return (
    <ButtonComponent
      type={Component === 'button' ? type : undefined}
      className={`premium-btn btn-${variant} btn-size-${size} ${loading ? 'btn-loading' : ''} ${fullWidth ? 'btn-full-width' : ''} ${className}`}
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
