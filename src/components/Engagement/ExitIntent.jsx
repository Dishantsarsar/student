import { useEffect } from 'react';

function ExitIntent({ onTrigger }) {
  useEffect(() => {
    if (sessionStorage.getItem('exit_intent_triggered') === 'true') return;
    
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        onTrigger();
        sessionStorage.setItem('exit_intent_triggered', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onTrigger]);

  return null;
}

export default ExitIntent;
