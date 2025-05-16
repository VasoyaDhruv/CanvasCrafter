import React from 'react';
import { useNavigate } from 'react-router-dom';
import sampleData from '../data/sampleData';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    navigate(`/customize/${image.id}`, { state: { image } });
  };

  return (
    <div className="dashboard">
      <h1>Image Customization</h1>
      <div className="image-grid">
        {sampleData.map((image) => (
          <div 
            key={image.id}
            className="image-card"
            onClick={() => handleImageClick(image)}
            style={{ backgroundImage: `url(${image.productImage})` }}
          >
            <div className="overlay">
              <h3>{image.name}</h3>
              <p>{image.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
