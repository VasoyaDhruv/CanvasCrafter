import React, { useState } from 'react'
import { useCanvas } from '../../Context/CanvasContext';
import { FaItalic, FaBold, FaUnderline } from 'react-icons/fa';
import { MdFormatItalic, MdFormatBold, MdDeleteOutline } from 'react-icons/md';

const styleOptions = [
  {
    key: 'fontStyle-bold',
    prop: 'fontStyle',
    value: 'bold',
    icon: <FaBold />,
  },
  {
    key: 'fontStyle-italic',
    prop: 'fontStyle',
    value: 'italic',
    icon: <FaItalic />,
  },
  {
    key: 'textDecoration-underline',
    prop: 'textDecoration',
    value: 'underline',
    icon: <FaUnderline />,
  },
];

const Toolbar = () => {
  const {
    elements,
    selectedElement,
    setSelectedElement,
    deleteElement,
    moveElementZIndex,
    updateElement,
    stageRef,
    product,
    imageFitMode,
    setBackground
  } = useCanvas();
  const [selectedColor, setSelectedColor] = useState(product?.custom_options?.colors[0]);

  const handleSave = () => {
    const customizationData = {
      product: product,
      elements: elements,
      backgroundSettings: {
        imageFitMode: imageFitMode
      },
      customizationDate: new Date().toISOString(),
    };
    localStorage.setItem('customizationData', JSON.stringify(customizationData));
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


  // Determine if we should justify-between:
  const hasCustomColors = product?.custom_options?.colors?.length > 0;
  const showColorPanel = selectedElement === null && hasCustomColors;

  return (
    <div
      className={`flex w-full bg-gray-900 text-white transition-all duration-300 h-20 p-1 px-3 items-center ${(showColorPanel || (selectedElement !== null && elements[selectedElement]))
          ? 'justify-between'
          : 'justify-end'
        }`}
    >
      {/* Properties Panel */}
      {showColorPanel && (
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm text-gray-300 mr-2">T-Shirt Color:</span>
          {product.custom_options.colors.map((color) => (
            <button
              key={color}
              style={{
                backgroundColor: color,
                border: selectedColor=== color
                  ? '2px solid #4f46e5'
                  : '2px solid transparent',
              }}
              className="w-7 h-7 rounded-full border-2 transition-all cursor-pointer shadow-2xl"
              onClick={() => {
                if (product?.custom_options?.color_images[color]) {
                  setBackground(product?.custom_options?.color_images[color]);
                  setSelectedColor(color);
                }
              }}
              title={color}
            >
              {product.image?.includes(product?.custom_options?.color_images[color]) && (
                <span className="text-white text-xs font-bold">&#10003;</span>
              )}
            </button>
          ))}
        </div>
      )}
      {selectedElement !== null && elements[selectedElement] && (
        <div className="flex items-center">
          {/* Text Element Options */}
          {elements[selectedElement].type === 'text' && (
            <div className='flex gap-2 items-center'>
              <div>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={elements[selectedElement].fontSize}
                  onChange={(e) => updateElement('fontSize', parseInt(e.target.value))}
                  className="w-full px-3 py-1 rounded text-white bg-gray-700"
                />
              </div>

              <div>
                <select
                  value={elements[selectedElement].fontFamily}
                  onChange={(e) => updateElement('fontFamily', e.target.value)}
                  className="w-full px-3 py-1 rounded text-white bg-gray-700"
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>

              <div>
                <input
                  type="color"
                  value={elements[selectedElement].color}
                  onChange={(e) => updateElement('color', e.target.value)}
                  className="w-8 h-9 p-0 border-0 bg-transparent flex items-center"
                  title="Text Color"
                />
              </div>

              <div className="flex gap-2">
                {styleOptions.map(({ key, prop, value, icon }) => {
                  const isActive = elements[selectedElement]?.[prop] === value;
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        updateElement(
                          prop,
                          isActive ? (prop === 'textDecoration' ? 'none' : 'normal') : value
                        )
                      }
                      className={`p-2 rounded border transition 
                        ${isActive
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'}`}
                    >
                      {icon}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Image Element Options */}
          {elements[selectedElement].type === 'image' && (
            <div className='flex  items-center gap-2'>
              <div className='flex gap-1 items-center '>
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
                <input
                  type="number"
                  value={Math.round(elements[selectedElement].width)}
                  onChange={(e) => updateElement('width', parseInt(e.target.value) || 5)}
                  className="w-full px-2 py-1 rounded text-white bg-gray-700"
                />
              </div>

              <div>
                <input
                  type="number"
                  value={Math.round(elements[selectedElement].height)}
                  onChange={(e) => updateElement('height', parseInt(e.target.value) || 5)}
                  className="w-full px-2 py-1 rounded text-white bg-gray-700"
                />
              </div>
            </div>
          )}
          <div className='pl-2'>
            <button
              onClick={() => deleteElement()}
              className='bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition'><MdDeleteOutline />
            </button>
          </div>
          {/* Z-Index Controls */}
          <div>
            <input
              type="color"
              value={elements[selectedElement].color}
              onChange={(e) => updateElement('color', e.target.value)}
              className="w-full h-10 px-1"
            />
          </div>
          <div className=" flex items-center">
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
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-[14px]"
        >
          Save
        </button>
        <button
          onClick={handleExport}
          className="py-2 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-[14px]"
        >
          Export
        </button>
      </div>
    </div>
  )
}

export default Toolbar