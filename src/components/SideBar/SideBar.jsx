import React, { useState } from 'react'
import { useCanvas } from '../../context/CanvasContext';

const SideBar = () => {
  const {
    elements,
    setElements,
    selectedElement,
    imageFitMode,
    addTextElement,
    setSelectedElement,
    deleteElement,
    moveElementZIndex,
    updateElement,
    stageRef,
    product
  } = useCanvas();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = imageURL;
      img.onload = () => {
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
          zIndex: elements.length + 1
        };

        setElements([...elements, newImage]);
        setSelectedElement(elements.length);
      };
    }
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  };



  return (
    <div className={`flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-92' : 'w-16'} p-5`}>
      {/* Show Elements/Background when no element selected */}
      <div className="flex justify-end w-[100%]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            )}
          </svg>
        </button>
      </div>
      {sidebarOpen && (
        <>

          {selectedElement === null && (
            <>
              <div className="space-y-3 mb-5">
                <h3 className="text-lg font-semibold text-gray-300">Elements</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={addTextElement}
                    className="w-full flex items-center gap-3 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v18m3-6h6M3 17h12" />
                    </svg>
                    <span>Add Text</span>
                  </button>
                  <button
                    onClick={handleAddImage}
                    className="w-full flex items-center gap-3 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Add Image</span>
                  </button>
                </div>
              </div>

              {/* <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Background</h3>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600">Image Fit Mode</label>
              <select
                value={imageFitMode}
                onChange={(e) => setImageFitMode(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
              >
                <option value="contain">Contain</option>
                <option value="cover">Cover</option>
                <option value="center">Center</option>
              </select>
            </div>
          </div> */}
            </>
          )}

          {/* Properties Panel */}
          {selectedElement !== null && elements[selectedElement] && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">Element Properties</h3>
              {/* Text Element Options */}
              {elements[selectedElement].type === 'text' && (
                <>
                  <div>
                    <label className="block mb-1 text-gray-400">Text</label>
                    <input
                      type="text"
                      value={elements[selectedElement].text}
                      onChange={(e) => updateElement('text', e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-400">Font Size</label>
                    <input
                      type="number"
                      min="8"
                      max="72"
                      value={elements[selectedElement].fontSize}
                      onChange={(e) => updateElement('fontSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-400">Font Family</label>
                    <select
                      value={elements[selectedElement].fontFamily}
                      onChange={(e) => updateElement('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border rounded text-white"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-400">Font Style</label>
                    <select
                      value={elements[selectedElement].fontStyle}
                      onChange={(e) => updateElement('fontStyle', e.target.value)}
                      className="w-full px-3 py-2 border rounded text-white"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="italic">Italic</option>
                      <option value="bold italic">Bold Italic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-400">Color</label>
                    <input
                      type="color"
                      value={elements[selectedElement].color}
                      onChange={(e) => updateElement('color', e.target.value)}
                      className="w-full h-10 "
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => deleteElement()}
                      className='bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition'>Delete</button>
                  </div>
                </>
              )}

              {/* Image Element Options */}
              {elements[selectedElement].type === 'image' && (
                <>
                  <div>
                    <label className="block mb-1 text-gray-400">Opacity</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={elements[selectedElement].opacity}
                      onChange={(e) => updateElement('opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{Math.round(elements[selectedElement].opacity * 100)}%</span>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-400">Width</label>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].width)}
                      onChange={(e) => updateElement('width', parseInt(e.target.value) || 5)}
                      className="w-full px-2 py-1 border rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-400">Height</label>
                    <input
                      type="number"
                      value={Math.round(elements[selectedElement].height)}
                      onChange={(e) => updateElement('height', parseInt(e.target.value) || 5)}
                      className="w-full px-2 py-1 border rounded text-white"
                    />
                  </div>
                </>
              )}
              {/* Z-Index Controls */}
              <div className="space-y-2">
                <label className="block text-gray-400">Z-Index</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveElementZIndex('up')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded transition"
                  >
                    <i className="fas fa-arrow-up">+</i>
                  </button>
                  <span className="text-sm text-white">Current: {elements[selectedElement].zIndex || 0}</span>

                  <button
                    onClick={() => moveElementZIndex('down')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded transition"
                  >
                    <i className="fas fa-arrow-down">-</i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>

  )
}

export default SideBar