import React, { useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader-container">
      <img 
        src="https://ik.imagekit.io/qak2yjza1/canvas-crafter-logo.png?updatedAt=1747985519933" 
        alt="Loading..."
        className="loader-logo"
      />
    </div>
  );
};

export default Loader;
