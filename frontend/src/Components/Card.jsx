import React, { useState } from 'react';
import { Download, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../constant/AuthContext';
import toast from 'react-hot-toast';

const Card = ({ _id, name, prompt, photo, onDelete, onView }) => {
  const { currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prompt.substring(0, 30)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/post/${_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Image deleted successfully!');
        onDelete(_id);
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      toast.error('Error deleting image');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover overflow-hidden h-full">
      {/* Image Container that fills parent */}
      <div className="relative w-full h-full bg-gray-100">
        <img
          className="w-full h-full object-cover cursor-pointer"
          src={photo}
          alt={prompt}
          onClick={() => onView({ _id, name, prompt, photo })}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10131f] via-[#10131f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm line-clamp-2 mb-3">{prompt}</p>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-full bg-green-700 flex justify-center items-center text-white text-xs font-bold flex-shrink-0">
                {name[0]}
              </div>
              <p className="text-white text-sm truncate">{name}</p>
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => onView({ _id, name, prompt, photo })}
                className="outline-none bg-white/10 hover:bg-white/20 border-none p-2 rounded-full transition-colors"
                title="View image"
              >
                <Eye className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="outline-none bg-white/10 hover:bg-white/20 border-none p-2 rounded-full transition-colors"
                title="Download image"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
              {currentUser && currentUser.displayName === name && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="outline-none bg-white/10 hover:bg-red-500/30 border-none p-2 rounded-full transition-colors disabled:opacity-50"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;