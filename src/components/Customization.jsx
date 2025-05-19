import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Text, Image, Transformer, Group } from 'react-konva';

import './Customization.css';
import { useCanvas } from '../Context/CanvasContext';
import SideBar from './SideBar/SideBar';

const Customization = () => {
  const {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    backgroundImage,
    imageFitMode,
    stageRef,
    transformerRef,
    product
  } = useCanvas();

  const canvasContainerRef = useRef(null);
  const sideBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only unselect if the click is outside both the canvas and the sidebar
      const isClickInsideCanvas = canvasContainerRef.current &&
        canvasContainerRef.current.contains(event.target);
      const isClickInsideSidebar = sideBarRef.current &&
        sideBarRef.current.contains(event.target);

      if (!isClickInsideCanvas && !isClickInsideSidebar) {
        setSelectedElement(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSelectedElement]);


  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedElement(null);
    }
  };


  const handleTransformEnd = (e) => {
    if (selectedElement === null) return;

    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

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
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedElement, elements, transformerRef, stageRef]);

  const getBackgroundImageProps = () => {
    if (!backgroundImage) return {};

    const stageWidth = 800;
    const stageHeight = 600;
    const imgRatio = backgroundImage.width / backgroundImage.height;
    const stageRatio = stageWidth / stageHeight;
    if (imgRatio > stageRatio) {
      const newHeight = stageWidth / imgRatio;
      return {
        width: stageWidth,
        height: newHeight,
        x: 0,
        y: (stageHeight - newHeight) / 2
      };
    } else {
      const newWidth = stageHeight * imgRatio;
      return {
        width: newWidth,
        height: stageHeight,
        x: (stageWidth - newWidth) / 2,
        y: 0
      };
    }
  };
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

  const handleExport = () => {
    if (stageRef.current) {
      const prevSelectedElement = selectedElement;
      setSelectedElement(null);

      setTimeout(() => {
        const dataURL = stageRef.current.toDataURL({
          pixelRatio: 2,
          mimeType: 'image/png'
        });

        const link = document.createElement('a');
        link.download = `${product?.name || 'customized'}-design.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (prevSelectedElement !== null) {
          setSelectedElement(prevSelectedElement);
        }
      }, 100);
    }
  };
  const bgImageProps = getBackgroundImageProps();

  const sortedElements = [...elements].sort((a, b) => {
    const zIndexA = a.zIndex || 0;
    const zIndexB = b.zIndex || 0;
    return zIndexA - zIndexB;
  });
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden w-screen">
      <div ref={sideBarRef}>
        <SideBar />
      </div>
      {/* Design canvas area */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Product Customization</h1>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleExport}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                Export
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4 flex justify-center border border-gray-200" ref={canvasContainerRef}>

            <Stage
              width={bgImageProps.width}
              height={bgImageProps.height}
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

    </div>

  );
};

export default Customization;