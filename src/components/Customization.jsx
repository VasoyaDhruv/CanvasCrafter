import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Image, Transformer, Group } from 'react-konva';

import html2canvas from 'html2canvas';
import sampleData from '../data/sampleData';
import { useParams } from 'react-router-dom';
import './Customization.css';

const Customization = () => {
  const { id } = useParams();
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [imageFitMode, setImageFitMode] = useState('contain');
  
  // References
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  
  // Find product based on ID
  const product = sampleData.find((item) => item.id === parseInt(id)) || sampleData[0];

  // Load background product image
  useEffect(() => {
    if (product?.productImage) {
      const img = new window.Image();
      img.crossOrigin = "anonymous"; 
      img.src = product.productImage;
      img.onload = () => {
        setBackgroundImage(img);
      };
    }
  }, [id, product]);

  // Handle stage click to deselect elements when clicking on empty areas
  const handleStageClick = (e) => {
    // Clicked on an empty area of the stage
    if (e.target === e.target.getStage()) {
      setSelectedElement(null);
    }
  };

  // Add new text element
  const handleAddText = () => {
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
      zIndex: elements.length + 1 // Add z-index property
    };
    setElements([...elements, newText]);
    setSelectedElement(elements.length);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = imageURL;
      img.onload = () => {
        // Calculate appropriate size to fit in canvas
        const maxWidth = 300;
        const maxHeight = 300;
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (newWidth > maxWidth) {
          const ratio = maxWidth / newWidth;
          newWidth = maxWidth;
          newHeight = newHeight * ratio;
        }
        
        if (newHeight > maxHeight) {
          const ratio = maxHeight / newHeight;
          newHeight = maxHeight;
          newWidth = newWidth * ratio;
        }
        
        const newImage = {
          id: `image-${Date.now()}`,
          type: 'image',
          src: imageURL,
          x: 100,
          y: 100,
          width: newWidth,
          height: newHeight,
          draggable: true,
          rotation: 0,
          opacity: 1,
          imageElement: img,
          zIndex: elements.length + 1 // Add z-index property
        };
        
        setElements([...elements, newImage]);
        setSelectedElement(elements.length);
      };
    }
  };

  // Trigger file upload dialog
  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  };

  // Save the design
  const handleSave = () => {
    const customizationData = {
      product: product,
      elements: elements,
      backgroundSettings: {
        imageFitMode: imageFitMode
      },
      customizationDate: new Date().toISOString(),
    };
    
    console.log("Saved design:", customizationData);
    alert('Design saved successfully!');
  };

  // Export the design as an image
  const handleExport = () => {
    if (stageRef.current) {
      // Remove transformer temporarily for clean export
      const prevSelectedElement = selectedElement;
      setSelectedElement(null);
      
      setTimeout(() => {
        const dataURL = stageRef.current.toDataURL({
          pixelRatio: 2, // Higher quality export
          mimeType: 'image/png'
        });
        
        const link = document.createElement('a');
        link.download = `${product?.name || 'customized'}-design.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Restore selection if there was one
        if (prevSelectedElement !== null) {
          setSelectedElement(prevSelectedElement);
        }
      }, 100);
    }
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (selectedElement !== null) {
      const newElements = elements.filter((_, index) => index !== selectedElement);
      setElements(newElements);
      setSelectedElement(null);
      
      // Make sure transformer is cleared
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  };

  // Update properties of the selected element
  const updateSelectedElement = (property, value) => {
    if (selectedElement !== null) {
      const newElements = [...elements];
      newElements[selectedElement] = {
        ...newElements[selectedElement],
        [property]: value
      };
      setElements(newElements);
    }
  };

  // Update element after transform (resize/rotate)
  const handleTransformEnd = (e) => {
    if (selectedElement === null) return;
    
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale and apply width/height instead
    node.scaleX(1);
    node.scaleY(1);
    
    const newElements = [...elements];
    newElements[selectedElement] = {
      ...newElements[selectedElement],
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY)
    };
    
    setElements(newElements);
  };

  // Effect to attach transformer to selected element
  useEffect(() => {
    if (transformerRef.current) {
      if (selectedElement !== null && elements[selectedElement]) {
        const stage = stageRef.current;
        const node = stage.findOne(`#${elements[selectedElement].id}`);
        
        if (node) {
          transformerRef.current.nodes([node]);
          transformerRef.current.getLayer().batchDraw();
        }
      } else {
        // Clear transformer when no element is selected
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedElement, elements]);

  // Move element up in z-index order
  const moveElementUp = () => {
    if (selectedElement !== null) {
      const newElements = [...elements];
      newElements[selectedElement] = {
        ...newElements[selectedElement],
        zIndex: (newElements[selectedElement].zIndex || 0) + 1
      };
      setElements(newElements);
    }
  };

  // Move element down in z-index order
  const moveElementDown = () => {
    if (selectedElement !== null) {
      const newElements = [...elements];
      const currentZIndex = newElements[selectedElement].zIndex || 0;
      if (currentZIndex > 0) {
        newElements[selectedElement] = {
          ...newElements[selectedElement],
          zIndex: currentZIndex - 1
        };
        setElements(newElements);
      }
    }
  };

  // Calculate background image dimensions based on fit mode
  const getBackgroundImageProps = () => {
    if (!backgroundImage) return {};
    
    const stageWidth = 800;
    const stageHeight = 600;
    const imgRatio = backgroundImage.width / backgroundImage.height;
    const stageRatio = stageWidth / stageHeight;
    
    switch (imageFitMode) {
      case 'contain':
        if (imgRatio > stageRatio) {
          // Image is wider than stage proportionally
          const newHeight = stageWidth / imgRatio;
          return {
            width: stageWidth,
            height: newHeight,
            x: 0,
            y: (stageHeight - newHeight) / 2
          };
        } else {
          // Image is taller than stage proportionally
          const newWidth = stageHeight * imgRatio;
          return {
            width: newWidth,
            height: stageHeight,
            x: (stageWidth - newWidth) / 2,
            y: 0
          };
        }
      case 'cover':
        if (imgRatio > stageRatio) {
          // Image is wider than stage proportionally
          const newHeight = stageWidth / imgRatio;
          return {
            width: stageWidth,
            height: newHeight,
            x: 0,
            y: (stageHeight - newHeight) / 2
          };
        } else {
          // Image is taller than stage proportionally
          const newWidth = stageHeight * imgRatio;
          return {
            width: newWidth,
            height: stageHeight,
            x: (stageWidth - newWidth) / 2,
            y: 0
          };
        }
      case 'center':
        const width = Math.min(backgroundImage.width, stageWidth);
        const height = Math.min(backgroundImage.height, stageHeight);
        return {
          width,
          height,
          x: (stageWidth - width) / 2,
          y: (stageHeight - height) / 2
        };
      default:
        return {
          width: stageWidth,
          height: stageHeight,
          x: 0,
          y: 0
        };
    }
  };

  // Get background image props based on current fit mode
  const bgImageProps = getBackgroundImageProps();

  // Sort elements by z-index for proper display
  const sortedElements = [...elements].sort((a, b) => {
    const zIndexA = a.zIndex || 0;
    const zIndexB = b.zIndex || 0;
    return zIndexA - zIndexB;
  });

  return (
    <div className="customization">
      <div className="product-info">
        <h2>{product?.name || 'Product'}</h2>
        <p>{product?.description || 'No description available'}</p>
        <p className="price">${product?.price || '0.00'}</p>
      </div>

      <div className="main-content">
        {/* Sidebar for all options and properties */}
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Elements</h3>
            <div className="sidebar-buttons">
              <button onClick={handleAddText} className="sidebar-button">
                <i className="fas fa-font"></i> Add Text
              </button>
              <button onClick={handleAddImage} className="sidebar-button">
                <i className="fas fa-image"></i> Add Image
              </button>
              {selectedElement !== null && (
                <button onClick={handleDeleteElement} className="sidebar-button delete">
                  <i className="fas fa-trash"></i> Delete
                </button>
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Background</h3>
            <div className="sidebar-item">
              <label>Image Fit Mode</label>
              <select 
                value={imageFitMode} 
                onChange={(e) => setImageFitMode(e.target.value)}
                className="sidebar-select"
              >
                <option value="contain">Contain</option>
                <option value="cover">Cover</option>
                <option value="center">Center</option>
              </select>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Actions</h3>
            <div className="sidebar-buttons">
              <button onClick={handleSave} className="sidebar-button">
                <i className="fas fa-save"></i> Save Design
              </button>
              <button onClick={handleExport} className="sidebar-button">
                <i className="fas fa-download"></i> Export
              </button>
            </div>
          </div>

          {/* Properties panel for selected element */}
          {selectedElement !== null && elements[selectedElement] && (
            <div className="sidebar-section properties-panel">
              <h3>Element Properties</h3>
              
              {/* Z-Index controls */}
              <div className="property-group">
                <label>Layer Position (Z-Index)</label>
                <div className="z-index-controls">
                  <button onClick={moveElementUp} className="sidebar-button small">
                    <i className="fas fa-arrow-up"></i> Move Up
                  </button>
                  <button onClick={moveElementDown} className="sidebar-button small">
                    <i className="fas fa-arrow-down"></i> Move Down
                  </button>
                  <span>Current: {elements[selectedElement].zIndex || 0}</span>
                </div>
              </div>
              
              {elements[selectedElement].type === 'text' && (
                <>
                  <div className="property-group">
                    <label>Text</label>
                    <input
                      type="text"
                      value={elements[selectedElement].text}
                      onChange={(e) => updateSelectedElement('text', e.target.value)}
                    />
                  </div>
                  
                  <div className="property-group">
                    <label>Font Size</label>
                    <input
                      type="number"
                      min="8"
                      max="72"
                      value={elements[selectedElement].fontSize}
                      onChange={(e) => updateSelectedElement('fontSize', parseInt(e.target.value))}
                    />
                    <span>{elements[selectedElement].fontSize}px</span>
                  </div>
                  
                  <div className="property-group">
                    <label>Font Family</label>
                    <select
                      value={elements[selectedElement].fontFamily}
                      onChange={(e) => updateSelectedElement('fontFamily', e.target.value)}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>
                  
                  <div className="property-group">
                    <label>Font Style</label>
                    <select
                      value={elements[selectedElement].fontStyle}
                      onChange={(e) => updateSelectedElement('fontStyle', e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="italic">Italic</option>
                      <option value="bold italic">Bold Italic</option>
                    </select>
                  </div>
                  
                  <div className="property-group">
                    <label>Color</label>
                    <input
                      type="color"
                      value={elements[selectedElement].color}
                      onChange={(e) => updateSelectedElement('color', e.target.value)}
                    />
                  </div>
                </>
              )}
              
              {elements[selectedElement].type === 'image' && (
                <>
                  <div className="property-group">
                    <label>Opacity</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={elements[selectedElement].opacity}
                      onChange={(e) => updateSelectedElement('opacity', parseFloat(e.target.value))}
                    />
                    <span>{Math.round(elements[selectedElement].opacity * 100)}%</span>
                  </div>
                  
                  <div className="property-group">
                    <label>Width</label>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].width)}
                      onChange={(e) => updateSelectedElement('width', parseInt(e.target.value) || 5)}
                    />
                    <span>px</span>
                  </div>
                  
                  <div className="property-group">
                    <label>Height</label>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].height)}
                      onChange={(e) => updateSelectedElement('height', parseInt(e.target.value) || 5)}
                    />
                    <span>px</span>
                  </div>
                </>
              )}
              
              <div className="property-group">
                <label>Rotation</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={elements[selectedElement].rotation}
                  onChange={(e) => updateSelectedElement('rotation', parseInt(e.target.value))}
                />
                <span>{elements[selectedElement].rotation}°</span>
              </div>
              
              <div className="property-group">
                <label>Position</label>
                <div className="position-inputs">
                  <div>
                    <span>X:</span>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].x)}
                      onChange={(e) => updateSelectedElement('x', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <span>Y:</span>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].y)}
                      onChange={(e) => updateSelectedElement('y', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Design canvas area */}
        <div className="design-area">
            <Stage 
              width={800} 
              height={600} 
              ref={stageRef}
              onClick={handleStageClick}
              style={{ 
                margin: '0 auto'
              }}
            >
              <Layer>
                {backgroundImage && (
                  <Image
                    image={backgroundImage}
                    width={bgImageProps.width}
                    height={bgImageProps.height}
                    x={bgImageProps.x}
                    y={bgImageProps.y}
                    opacity={0.7}
                  />
                )}
                
                {sortedElements.map((element, index) => {
                  const originalIndex = elements.findIndex(e => e.id === element.id);
                  return (
                    <Group key={element.id}>
                      {element.type === 'text' && (
                        <Text
                          id={element.id}
                          text={element.text}
                          x={element.x}
                          y={element.y}
                          fontSize={element.fontSize}
                          fontFamily={element.fontFamily}
                          fontStyle={element.fontStyle}
                          fill={element.color}
                          width={element.width}
                          height={element.height}
                          rotation={element.rotation}
                          draggable={true}
                          onDragEnd={(e) => {
                            const newElements = [...elements];
                            const elementIndex = newElements.findIndex(el => el.id === element.id);
                            if (elementIndex !== -1) {
                              newElements[elementIndex] = {
                                ...element,
                                x: e.target.x(),
                                y: e.target.y()
                              };
                              setElements(newElements);
                            }
                          }}
                          onClick={() => {
                            setSelectedElement(originalIndex);
                          }}
                          onDblClick={() => {
                            setSelectedElement(originalIndex);
                          }}
                        />
                      )}
                      
                      {element.type === 'image' && (
                        <Image
                          id={element.id}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          image={element.imageElement}
                          rotation={element.rotation}
                          opacity={element.opacity}
                          draggable={true}
                          onDragEnd={(e) => {
                            const newElements = [...elements];
                            const elementIndex = newElements.findIndex(el => el.id === element.id);
                            if (elementIndex !== -1) {
                              newElements[elementIndex] = {
                                ...element,
                                x: e.target.x(),
                                y: e.target.y()
                              };
                              setElements(newElements);
                            }
                          }}
                          onClick={() => setSelectedElement(originalIndex)}
                        />
                      )}
                    </Group>
                  );
                })}
                
                {/* Transformer for resizing/rotating elements */}
                {selectedElement !== null && elements.length > 0 && elements[selectedElement] && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Minimum size constraints
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                    onTransformEnd={handleTransformEnd}
                    rotateEnabled={true}
                    enabledAnchors={[
                      'top-left', 'top-center', 'top-right',
                      'middle-right', 'middle-left',
                      'bottom-left', 'bottom-center', 'bottom-right'
                    ]}
                    keepRatio={false}
                  />
                )}
              </Layer>
            </Stage>
        </div>
      </div>

    </div>
  );
};

export default Customization;