
import React from 'react';
import { X, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(image.photo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.prompt.substring(0, 30)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-900" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
            <img
              src={image.photo}
              alt={image.prompt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          
          <div className="w-full md:w-96 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-700 flex justify-center items-center text-white text-lg font-bold flex-shrink-0">
                {image.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{image.name}</p>
                <p className="text-sm text-gray-500">Creator</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Prompt</h3>
              <p className="text-gray-900 leading-relaxed">{image.prompt}</p>
            </div>

            <button
              onClick={handleDownload}
              className="mt-auto flex items-center justify-center gap-2 w-full bg-[#6469ff] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;