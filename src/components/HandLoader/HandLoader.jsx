import React from 'react';
import './HandLoader.css';

const HandLoader = ({ size = 80 }) => {
  return (
    <div className="hand-loader" style={{ '--size': `${size}px` }}>
      <div className="hand">
        <div className="finger finger-1"></div>
        <div className="finger finger-2"></div>
        <div className="finger finger-3"></div>
        <div className="finger finger-4"></div>
        <div className="palm"></div>
        <div className="thumb"></div>
      </div>
    </div>
  );
};

export default HandLoader;