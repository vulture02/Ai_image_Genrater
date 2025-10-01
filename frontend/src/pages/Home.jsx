import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../constant/AuthContext';
import Card from '../Components/Card';
import ImageModal from '../Components/ImageModal';
import city from '../assets/city.png';
import milkygalaxy from '../assets/milkygalaxy.png';
import nature from '../assets/nature.png';
import sunset from '../assets/sunset.png';
import { Loader } from '../Components';

const RenderCards = ({ data, title, onDelete, onView }) => {
  if (data?.length > 0) {
    return data.map((post, index) => {
      // Create pattern: big, small, small, big, small, small...
      const sizeClass = index % 3 === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';
      return (
        <div key={post._id} className={sizeClass}>
          <Card {...post} onDelete={onDelete} onView={onView} />
        </div>
      );
    });
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { currentUser } = useAuth();

  const galleryImages = [city, milkygalaxy, nature, sunset];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.prompt.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleDelete = (postId) => {
    setAllPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    if (searchedResults) {
      setSearchedResults((prevResults) => prevResults.filter((post) => post._id !== postId));
    }
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
  };

  const userPosts = currentUser
    ? allPosts.filter((post) => post.name === currentUser.displayName)
    : [];

  if (currentUser) {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-extrabold text-[#222328] text-[32px] mb-4">
            Welcome back, {currentUser.displayName || currentUser.email}! 👋
          </h1>
          <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px] mx-auto">
            Ready to create some amazing AI-generated images? Let your imagination run wild!
          </p>
          <div className="mt-8">
            <Link
              to="/create-post"
              className="inline-block bg-[#6469ff] hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Creating Now
            </Link>
          </div>
        </div>

        {/* User Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Your Posts</h3>
            <p className="text-3xl font-bold text-[#6469ff]">{userPosts.length}</p>
            <p className="text-sm text-gray-600">Images created</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Community Posts</h3>
            <p className="text-3xl font-bold text-green-600">{allPosts.length}</p>
            <p className="text-sm text-gray-600">Total images</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Member Since</h3>
            <p className="text-sm font-medium text-gray-900">
              {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">Join date</p>
          </div>
        </div>

        {/* Your Recent Creations - Masonry Gallery */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h2 className="font-bold text-[#222328] text-[24px] mb-6">Your Recent Creations</h2>
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search your posts by prompt..."
              value={searchText}
              onChange={handleSearchChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#6469ff] focus:border-[#6469ff] outline-none block w-full p-3"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : userPosts.length > 0 ? (
            <>
              {searchText && (
                <h2 className="font-medium text-[#666e75] text-xl mb-3">
                  Showing results for <span className="text-[#222328]">{searchText}</span>
                </h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
                {searchText ? (
                  <RenderCards
                    data={searchedResults}
                    title="No search results found"
                    onDelete={handleDelete}
                    onView={handleViewImage}
                  />
                ) : (
                  <RenderCards
                    data={userPosts}
                    title="No Posts Yet"
                    onDelete={handleDelete}
                    onView={handleViewImage}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">You haven't created any images yet.</p>
              <Link
                to="/create-post"
                className="bg-[#6469ff] hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Create Your First Image
              </Link>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </section>
    );
  }

  // Guest user view
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="font-extrabold text-[#222328] text-[40px] mb-6">
          Create Stunning AI Images
        </h1>
        <p className="mt-2 text-[#666e75] text-[18px] max-w-[600px] mx-auto leading-relaxed">
          Transform your imagination into beautiful images using the power of artificial intelligence.
          Join our community of creators and share your masterpieces with the world.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-[#6469ff] hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-gray-50 text-[#6469ff] border-2 border-[#6469ff] font-medium px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Sample Gallery */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
        <h2 className="font-bold text-[#222328] text-[28px] text-center mb-8">
          See What Others Are Creating
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {galleryImages.map((image, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Sample creation ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-[#666e75] text-[16px] mb-6">
            Join thousands of creators who are already making amazing art with AI
          </p>
          <Link
            to="/signup"
            className="bg-[#6469ff] hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Creating Today
          </Link>
        </div>
      </div>

      {/* Community Posts Gallery for Guests - Masonry Layout */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="font-bold text-[#222328] text-[28px] mb-6 text-center">
          Community Gallery
        </h2>
        <p className="text-center text-[#666e75] mb-8">
          Browse through a collection of imaginative and visually stunning images generated by our community
        </p>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader/>
          </div>
        ) : allPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
            <RenderCards data={allPosts} onDelete={handleDelete} onView={handleViewImage} />
          </div>
        ) : (
          <p className="text-center text-gray-600 py-12">No posts yet. Be the first to create!</p>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </section>
  );
};

export default Home;