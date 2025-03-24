
import React, { useState, useRef, useEffect } from 'react';

const ImageUpload = ({ onImageSelected, existingImage, className = '' }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Set initial preview if existing image is available
  useEffect(() => {
    if (existingImage) {
      if (typeof existingImage === 'string') {
        setPreviewUrl(existingImage);
      } else {
        setPreviewUrl(URL.createObjectURL(existingImage));
      }
    }
  }, [existingImage]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  // Common function to handle the image file
  const handleImageFile = (file) => {
    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    
    // Call the callback with the file
    onImageSelected(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Remove image
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-all ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      } ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      {previewUrl ? (
        <div className="relative w-full h-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setPreviewUrl(null)}
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full shadow-md hover:bg-destructive/90 transition-colors"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6 h-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-muted-foreground mb-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm text-muted-foreground mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, GIF (max 10MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
