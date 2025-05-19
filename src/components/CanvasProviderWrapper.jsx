// components/CanvasProviderWrapper.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { CanvasProvider } from '../context/CanvasContext';
import useProducts from '../hooks/useProducts';

const CanvasProviderWrapper = ({ children }) => {
  const { id } = useParams();
    const { products } = useProducts();
  
  const product = products.find(item => item.id === parseInt(id)) || products[0];

  return <CanvasProvider product={product}>{children}</CanvasProvider>;
};

export default CanvasProviderWrapper;
