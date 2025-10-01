
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
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card overflow-hidden">
      <img
        className="w-full h-auto object-cover rounded-xl cursor-pointer"
        src={photo}
        alt={prompt}
        onClick={() => onView({ _id, name, prompt, photo })}
      />
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        <p className="text-white text-sm overflow-y-auto prompt mb-2">{prompt}</p>
        <div className="mt-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold flex-shrink-0">
                {name[0]}
              </div>
              <p className="text-white text-sm truncate">{name}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => onView({ _id, name, prompt, photo })}
                className="outline-none bg-transparent border-none p-1 hover:bg-white/10 rounded-full transition-colors"
                title="View image"
              >
                <Eye className="w-5 h-5 text-white" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="outline-none bg-transparent border-none p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Download image"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              {currentUser && currentUser.displayName === name && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="outline-none bg-transparent border-none p-1 hover:bg-red-500/20 rounded-full transition-colors disabled:opacity-50"
                  title="Delete image"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
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