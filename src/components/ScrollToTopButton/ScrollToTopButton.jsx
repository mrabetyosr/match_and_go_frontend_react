import React, { useEffect, useState } from 'react';
import './ScrollToTopButton.css'; // Assuming you have a CSS file for styling

const ScrollToTopButton = ({ disabled }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (!disabled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return isVisible ? (
    <button
      className="scroll-to-top-btn"
      onClick={scrollToTop}
      style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.4 : 1 }}
    >
      ⬆
    </button>
  ) : null;
};

export default ScrollToTopButton;