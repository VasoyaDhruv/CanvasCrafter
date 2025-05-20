import React, { useState } from 'react'
import { useCanvas } from '../../Context/CanvasContext';

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
    <div className={`flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 w-20 p-0`}>

      {sidebarOpen && (
        <>
          <div className="space-y-3 mb-5">
            <div className="flex flex-col">
              <button
                onClick={addTextElement}
                className="w-full h-20 flex flex-col items-center gap-1 justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v18m3-6h6M3 17h12" />
                </svg>
                <span>Text</span>
              </button>
              <button
                onClick={handleAddImage}
                className="w-full h-20 flex items-center flex-col gap-1 justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Photo</span>
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
    </div>

  )
}

export default SideBar