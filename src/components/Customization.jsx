import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text, Image, Transformer, Group } from 'react-konva';

import './Customization.css';
import { useCanvas } from '../Context/CanvasContext';
import SideBar from './SideBar/SideBar';
import Toolbar from './SideBar/Toolbar';

const Customization = () => {
  const {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    backgroundImage,
    stageRef,
    transformerRef,
  } = useCanvas();

  const canvasContainerRef = useRef(null);
  const toolbarRef = useRef(null);
  const textareaRef = useRef(null);

  // State for text editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textProps, setTextProps] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideCanvas = canvasContainerRef.current &&
        canvasContainerRef.current.contains(event.target);
      const isClickInsideToolbar = toolbarRef.current &&
        toolbarRef.current.contains(event.target);
      const isClickInsideTextarea = textareaRef.current &&
        textareaRef.current.contains(event.target);

      if (!isClickInsideCanvas && !isClickInsideToolbar && !isClickInsideTextarea) {
        setSelectedElement(null);
        if (isEditing) {
          completeTextEditing();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSelectedElement, isEditing]);

  // Handle stage click
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedElement(null);
      if (isEditing) {
        completeTextEditing();
      }
    }
  };

  const startTextEditing = (element) => {
    if (element.type !== 'text') return;

    const stage = stageRef.current;
    const stageBox = stage.container().getBoundingClientRect();

    const absPos = stage.findOne(`#${element.id}`).absolutePosition();

    const textPositionX = stageBox.left + absPos.x;
    const textPositionY = stageBox.top + absPos.y;

    setTextPosition({
      x: textPositionX,
      y: textPositionY
    });

    setTextProps({
      width: element.width,
      height: element.height,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      fontStyle: element.fontStyle,
      fill: element.color,
      rotation: element.rotation,
      textDecoration: element.textDecoration
    });

    setEditingText(element.text);
    setIsEditing(true);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    }, 10);
  };

  const completeTextEditing = () => {
    if (!isEditing || selectedElement === null) return;

    const newElements = [...elements];
    const elementIndex = selectedElement;

    if (elementIndex !== -1 && newElements[elementIndex]) {
      newElements[elementIndex] = {
        ...newElements[elementIndex],
        text: editingText
      };
      setElements(newElements);
    }

    setIsEditing(false);
  };

  // Function to handle keyboard events in the textarea
  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      completeTextEditing();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
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
    const currentElement = newElements[selectedElement];

    // For images, maintain aspect ratio
    if (currentElement.type === 'image') {
      const originalAspectRatio = currentElement.width / currentElement.height;
      let newWidth = Math.max(5, node.width() * scaleX);
      let newHeight = Math.max(5, node.height() * scaleY);

      // Calculate new dimensions while maintaining aspect ratio
      // Use the larger scale to maintain the aspect ratio
      const effectiveScale = Math.max(scaleX, scaleY);
      newWidth = Math.max(5, node.width() * effectiveScale);
      newHeight = newWidth / originalAspectRatio;

      newElements[selectedElement] = {
        ...currentElement,
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: newWidth,
        height: newHeight
      };
    } else {
      // For text elements, allow free transformation
      newElements[selectedElement] = {
        ...currentElement,
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY)
      };
    }

    setElements(newElements);
  };

  // Custom bound box function to maintain aspect ratio for images
  const boundBoxFunc = (oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }

    // Check if the selected element is an image
    if (selectedElement !== null && elements[selectedElement] && elements[selectedElement].type === 'image') {
      const originalAspectRatio = elements[selectedElement].width / elements[selectedElement].height;
      
      // Calculate new dimensions maintaining aspect ratio
      const widthScale = newBox.width / oldBox.width;
      const heightScale = newBox.height / oldBox.height;
      const scale = Math.max(widthScale, heightScale);
      
      return {
        ...newBox,
        width: oldBox.width * scale,
        height: (oldBox.width * scale) / originalAspectRatio
      };
    }

    return newBox;
  };

  useEffect(() => {
    if (transformerRef.current) {
      if (selectedElement !== null && elements[selectedElement] && !isEditing) {
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
  }, [selectedElement, elements, transformerRef, stageRef, isEditing]);

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
  const bgImageProps = getBackgroundImageProps();

  const sortedElements = [...elements].sort((a, b) => {
    const zIndexA = a.zIndex || 0;
    const zIndexB = b.zIndex || 0;
    return zIndexA - zIndexB;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden w-screen">
      <SideBar />
      {/* Design canvas area */}
      <div className="flex flex-col w-full overflow-auto bg-gradient-to-br from-gray-100 to-gray-200">
        <div ref={toolbarRef}>
          <Toolbar />
        </div>

        <div className="max-w-4xl mx-auto flex items-center h-full justify-center">
          <div className="w-fit rounded-lg shadow-xl p-2 border border-gray-200 h-fit" ref={canvasContainerRef}>
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
                      {element.type === 'text' && !isEditing && (
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
                          textDecoration={element.textDecoration}
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
                            if (selectedElement === originalIndex) {
                              startTextEditing(element);
                            } else {
                              setSelectedElement(originalIndex);
                            }
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
                {selectedElement !== null && elements.length > 0 && elements[selectedElement] && !isEditing && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={boundBoxFunc}
                    onTransformEnd={handleTransformEnd}
                    rotateEnabled={true}
                    enabledAnchors={
                      elements[selectedElement].type === 'image' 
                        ? ['top-left', 'top-right', 'bottom-left', 'bottom-right'] // Only corner anchors for images
                        : ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
                    }
                    keepRatio={elements[selectedElement].type === 'image'} // Keep ratio for images only
                  />
                )}
              </Layer>
            </Stage>

            {/* Text editor overlay */}
            {isEditing && selectedElement !== null && elements[selectedElement] && elements[selectedElement].type === 'text' && (
              <textarea
                ref={textareaRef}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                onBlur={completeTextEditing}
                style={{
                  position: 'absolute',
                  top: `${textPosition.y}px`,
                  left: `${textPosition.x}px`,
                  width: `${textProps.width}px`,
                  height: `${textProps.height}px`,
                  fontSize: `${textProps.fontSize}px`,
                  fontFamily: textProps.fontFamily,
                  fontStyle: textProps.fontStyle,
                  color: textProps.fill,
                  textDecoration: textProps.textDecoration,
                  transform: `rotate(${textProps.rotation}deg)`,
                  transformOrigin: 'top left',
                  border: '1px dashed #00A3FF',
                  outline: 'none',
                  background: 'transparent',
                  resize: 'none',
                  zIndex: 1000,
                  boxShadow: '0 0 0 1px #00A3FF',
                  lineHeight:"0.8"
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;