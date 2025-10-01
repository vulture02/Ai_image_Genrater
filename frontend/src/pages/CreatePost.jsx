import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../Components';
import { useAuth } from '../constant/AuthContext';
import toast from 'react-hot-toast';
import { Sparkles, Share2, Wand2 } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://ai-image-genrater-dfy5.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
        toast.success('Image generated successfully!');
      } catch (err) {
        toast.error('Failed to generate image. Please try again.');
      } finally {
        setGeneratingImg(false);
      }
    } else {
      toast.error('Please provide a prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://ai-image-genrater-dfy5.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        toast.success('Image shared with the community!');
        navigate('/');
      } catch (err) {
        toast.error('Failed to share image. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please generate an image with a prompt');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-extrabold text-[#222328] text-[40px] mb-3">
          Create Your Masterpiece
        </h1>
        <p className="text-[#666e75] text-[18px] max-w-[600px] mx-auto">
          Transform your ideas into stunning visuals with the power of AI. Describe your vision and watch it come to life.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#6469ff] focus:border-[#6469ff] outline-none block w-full p-4 transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="prompt" className="block text-sm font-semibold text-gray-900">
                    Describe Your Image
                  </label>
                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <Wand2 className="w-3 h-3" />
                    Surprise Me
                  </button>
                </div>
                <textarea
                  id="prompt"
                  name="prompt"
                  value={form.prompt}
                  onChange={handleChange}
                  placeholder="An astronaut riding a horse in space, photorealistic, 4k..."
                  rows="5"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#6469ff] focus:border-[#6469ff] outline-none block w-full p-4 transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Be specific and detailed for best results
                </p>
              </div>

              <button
                type="button"
                onClick={generateImage}
                disabled={generatingImg}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generatingImg ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>

              {form.photo && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Love what you see? Share it with the community!
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-[#6469ff] hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5" />
                        Share with Community
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Preview</h3>
              <p className="text-sm text-gray-600">Your generated image will appear here</p>
            </div>
            
            <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-xl overflow-hidden aspect-square flex items-center justify-center group">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-48 h-48 mx-auto object-contain opacity-30 mb-4"
                  />
                  <p className="text-gray-400 text-sm">
                    Your AI-generated image will appear here
                  </p>
                </div>
              )}

              {generatingImg && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-white font-medium mt-6 animate-pulse">
                    Creating your masterpiece...
                  </p>
                </div>
              )}
            </div>

            {form.photo && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-900 mb-1">Image Ready!</h4>
                    <p className="text-xs text-green-700">
                      Your image has been generated successfully. You can now share it with the community or generate a new one.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Pro Tips for Better Results
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-2">Be Descriptive</h4>
              <p className="text-sm text-gray-600">
                Include details about style, colors, mood, and composition for more accurate results.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="text-3xl mb-2">✨</div>
              <h4 className="font-semibold text-gray-900 mb-2">Add Style Keywords</h4>
              <p className="text-sm text-gray-600">
                Try words like "photorealistic", "oil painting", "digital art", or "watercolor".
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">Experiment</h4>
              <p className="text-sm text-gray-600">
                Don't be afraid to try different prompts. Use the "Surprise Me" button for inspiration!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePost;