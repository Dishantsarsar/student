import React, { useState } from 'react';
import './Tooltip.css';

/* Hover tooltip with smooth fade */
function Tooltip({ children, text, position = 'top' }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`tooltip-box tooltip-${position}`}>
          {text}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
