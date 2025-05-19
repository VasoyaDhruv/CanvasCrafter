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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">

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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">${product.price}</span>
                  <div className="flex items-center text-yellow-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="ml-1 text-sm">{product.rating?.rate}</span>
                  </div>
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
