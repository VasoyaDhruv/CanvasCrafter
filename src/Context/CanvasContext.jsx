import { createContext, useContext, useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProductContext } from './ProductContext_Temp';

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [imageFitMode, setImageFitMode] = useState('contain');
    const { id } = useParams();
     const { products} = useProductContext();
  
  const product = products.find(item => item.id === parseInt(id)) || products[0];

  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (product?.image) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = product?.image;
      img.onload = () => setBackgroundImage(img);
    }
  }, [product]);

  const addTextElement = () => {
    const newText = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'New Text',
      x: 100,
      y: 100,
      fontSize: 24,
      draggable: true,
      rotation: 0,
      width: 200,
      height: 50,
      color: 'black',
      fontFamily: 'Arial',
      fontStyle: 'normal',
      zIndex: elements.length + 1,
    };
    setElements(prev => [...prev, newText]);
    setSelectedElement(elements.length);
  };

  const deleteElement = () => {
    if (selectedElement !== null) {
      const newElements = elements.filter((_, index) => index !== selectedElement);
      setElements(newElements);
      setSelectedElement(null);
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  };

  const updateElement = (property, value) => {
    if (selectedElement !== null) {
      const newElements = [...elements];
      newElements[selectedElement] = {
        ...newElements[selectedElement],
        [property]: value,
      };
      setElements(newElements);
    }
  };

  const moveElementZIndex = (direction) => {
    if (selectedElement === null) return;
    const newElements = [...elements];
    const currentZIndex = newElements[selectedElement].zIndex || 0;
    newElements[selectedElement].zIndex = direction === "up"
      ? currentZIndex + 1
      : Math.max(0, currentZIndex - 1);
    setElements(newElements);
  };

  const contextValue = useMemo(() => ({
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    backgroundImage,
    imageFitMode,
    setImageFitMode,
    addTextElement,
    deleteElement,
    updateElement,
    moveElementZIndex,
    stageRef,
    transformerRef,
    products,
    product
  }), [
    elements,
    selectedElement,
    backgroundImage,
    imageFitMode,
    setImageFitMode,
    addTextElement,
    deleteElement,
    updateElement,
    moveElementZIndex,
    stageRef,
    transformerRef,
    setElements,
    setSelectedElement,
    products,
    product
  ]);

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
