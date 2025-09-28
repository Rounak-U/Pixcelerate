import React from "react";

const Gallery = ({ images = [], setImages }) => {
  const validImages = images.filter((img) => img && img.url);

  const handleRemove = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-black border-b pb-2 border-gray-200">
        Image Gallery
      </h2>

      {validImages.length === 0 ? (
        <p className="text-gray-500 text-lg">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {validImages.map((img, idx) => (
            <div key={idx} className="relative w-full aspect-square group">
              <img
                src={img.url}
                alt={img.file?.name || "uploaded image"}
                className="w-full h-full object-cover rounded-lg border"
              />
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
