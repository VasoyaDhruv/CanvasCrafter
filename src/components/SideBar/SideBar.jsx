import React, { use, useEffect, useState } from 'react'
import { useCanvas } from '../../Context/CanvasContext';
import { useNavigate } from 'react-router-dom';
import CommonModal from '../modal/CommonModal';


const SideBar = () => {
  const {
    elements,
    setElements,
    addTextElement,
    setSelectedElement,
  } = useCanvas();

  const [isModalOpen, setModalOpen] = useState(false);
  const [Images, setImages] = useState(true);
  const [searchInput, setSearchInput] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("photo");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();


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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
        const res = await fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=20&query=${searchInput ?? "all"}&client_id=${UNSPLASH_KEY}`);
        if (!res.ok) throw new Error("Failed to fetch images");
        const data = await res.json();
        setImages(data.results);
      } catch (err) {
        console.error("Error fetching Unsplash images:", err);
      }
    };

    fetchImages();
  }, [searchQuery, page]);

  // ADD IMAGE FUNCTION
  const AddImage = (img) => {
    const imgObj = new window.Image();
    imgObj.crossOrigin = "anonymous";
    imgObj.src = img.urls.regular;

    imgObj.onload = () => {
      const aspectRatio = imgObj.width / imgObj.height;
      const fixedHeight = 200;
      const calculatedWidth = fixedHeight * aspectRatio;

      const newImage = {
        id: `image-${Date.now()}`,
        type: 'image',
        src: img.urls.regular,
        x: 153,
        y: 190,
        width: calculatedWidth,
        height: fixedHeight,
        draggable: true,
        rotation: 0,
        opacity: 1,
        imageElement: imgObj,
        zIndex: elements.length + 1
      };
      setElements((prev) => [...prev, newImage]);
      setSelectedElement(elements.length);
    };
  };

  const handleConfirm = () => {
    navigate("/")
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className={`flex h-screen bg-gray-900 text-white transition-all duration-300 ${selectedTab ? "w-92" : "w-20"} p-0`}>
      <div className="space-y-3 mb-5 h-screen border-r-1 border-gray-700">
        <div className="flex flex-col">
          <div>
            <img
              onClick={() => setModalOpen(true)}
              src="https://ik.imagekit.io/qak2yjza1/CanvasCrafter%20(2).png?updatedAt=1748239752290" alt="Logo" className="w-16 h-16 mx-auto p-2 my-2 cursor-pointer" />
          </div>
          <button
            className={`"w-full h-20 flex items-center flex-col gap-1 justify-center py-2 px-4 hover:bg-gray-700 transition-colors cursor-pointer
                      ${selectedTab === "text" ? "bg-gray-700" : "bg-gray-800"}`}
            onClick={() => setSelectedTab((prev) => prev === "text" ? null : "text")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v18m3-6h6M3 17h12" />
            </svg>
            <span className='text-[14px]' >Text</span>
          </button>
          <button
            className={`"w-full h-20 flex items-center flex-col gap-1 justify-center py-2 px-4 hover:bg-gray-700 transition-colors cursor-pointer
                      ${selectedTab === "photo" ? "bg-gray-700" : "bg-gray-800"}`}
            onClick={() => setSelectedTab((prev) => prev === "photo" ? null : "photo")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className='text-[14px]'>Photo</span>
          </button>
        </div>
      </div>
      {
        selectedTab === "photo" && (
          <div className={`overflow-y-auto flex flex-col p-2 ${selectedTab === "photo" ? "w-92" : "w-0"}`}>
            <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-2 text-[14px] cursor-pointer'
              onClick={handleAddImage}
            >Select From Device</button>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search images..."
                className="w-full p-2 rounded text-white bg-gray-700 text-[14px]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSearchQuery(searchInput);
                }}
              />
            </div>
            <div className="columns-2 gap-2">
              {Array.isArray(Images) &&
                Images.map((img) => (
                  <img
                    key={img.id}
                    src={img.urls.thumb}
                    alt={img.alt_description || "Unsplash image"}
                    className="mb-2 rounded cursor-pointer w-full"
                    onClick={() => AddImage(img)}
                  />
                ))}
            </div>
            <div className="fixed bottom-0 w-[16.8rem] bg-gray-900 z-10 p-2">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50 text-[14px]"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-300 text-[14px]">Page {page}</span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 text-[14px]"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        )}
      {
        selectedTab === "text" && (
          <div className={`overflow-y-auto flex flex-col p-2 ${selectedTab === "text" ? "w-92" : "w-90"}`}>
            <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-2 text-[14px] cursor-pointer'
              onClick={() => addTextElement()}
            >Add New Text</button>
          </div>
        )
      }

      <CommonModal
        isOpen={isModalOpen}
        title="Go to Home"
        message="Do you want to go back to the home page?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="Yes"
        cancelText="No"
      />
    </div>

  )
}

export default SideBar