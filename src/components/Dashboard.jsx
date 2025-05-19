import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../Context/ProductContext';

const Dashboard = () => {
  const navigate = useNavigate();
   const { products, loading, error } = useProductContext();

  const handleImageClick = (image) => {
    navigate(`/customize/${image.id}`, { state: { image } });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Image Customization</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">Error loading products</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-101"
            onClick={() => handleImageClick(product)}
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-56 w-full object-contain bg-gray-100 p-4"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600 mt-1 truncate">{product.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-green-600 font-bold">${product.price}</span>
                <span className="text-yellow-500 text-sm">⭐ {product.rating?.rate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
