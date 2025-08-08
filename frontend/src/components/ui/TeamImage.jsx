import React, { useState } from "react";

const TeamImage = ({
  src,
  fallback,
  alt,
  className = "",
  gradientFrom = "from-red-500",
  gradientTo = "to-yellow-400",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="aspect-square bg-gray-800 flex items-center justify-center relative">
        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        )}

        {/* Error placeholder */}
        {imageError && (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-6xl text-gray-600">👤</span>
          </div>
        )}

        {/* Main image */}
        {!imageError && (
          <picture className="w-full h-full">
            <source srcSet={src} type="image/webp" />
            <img
              src={fallback || src.replace(".webp", ".jpg")}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </picture>
        )}

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} ${gradientTo} opacity-10 group-hover:opacity-30 transition-opacity duration-300`}
        />
      </div>
    </div>
  );
};

export default TeamImage;
