import React, { useRef } from "react";
import { AiOutlineUpload } from "react-icons/ai";

const Upload = ({ images = [], setImages }) => {
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const fileArray = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages([...images, ...fileArray]);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = null; // allow selecting same file again
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-black border-b pb-2 border-gray-200">
        Image Upload
      </h2>

      <div
        className="p-10 border-4 border-dashed rounded-xl text-center border-gray-400 bg-gray-50/50 transition-all hover:border-black/70 cursor-pointer"
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <AiOutlineUpload size={48} className="mx-auto mb-4 text-black" />
        <p className="mb-6 text-lg font-medium text-gray-700">
          Drag and drop your image file here (PNG or JPG), or click below.
        </p>
        <button
          className="mt-4 px-8 py-3 bg-black text-white font-bold text-base rounded-xl shadow-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02]"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current.click();
          }}
        >
          Select File
        </button>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Supported formats: JPG, PNG. Maximum file size: 10MB.
      </p>
    </div>
  );
};

export default Upload;

// I can also make it more interactive, e.g., live CPU/Memory updates or animated speedup bars, to look like a real-time dashboard similar to your Process page.