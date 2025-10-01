
import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Fixed typo from CLOUDINARY_API_SCECRET
});

// Test Cloudinary configuration
console.log('Cloudinary configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***set***' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***set***' : 'NOT SET',
});

// GET all posts
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch posts', 
      error: error.message 
    });
  }
});

// POST new post
router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    
    // Validate required fields
    if (!name || !prompt || !photo) {
      console.error('Missing required fields:', { name: !!name, prompt: !!prompt, photo: !!photo });
      return res.status(400).json({ 
        success: false, 
        message: 'Name, prompt, and photo are required' 
      });
    }

    console.log('Attempting to upload image for:', name);
    console.log('Prompt:', prompt.substring(0, 50) + '...');
    console.log('Photo data length:', photo.length);

    // Upload to Cloudinary with proper options
    const photoUrl = await cloudinary.uploader.upload(photo, {
      folder: 'ai_images',
      resource_type: 'auto',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    console.log('Image uploaded successfully to Cloudinary');
    console.log('URL:', photoUrl.url);
    
    // Create post in database
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });
    
    console.log('Post created successfully with ID:', newPost._id);
    
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error(' Error creating post:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Send detailed error response
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create post', 
      error: error.message,
      details: error.http_code ? `Cloudinary error code: ${error.http_code}` : 'Database or server error'
    });
  }
});

// DELETE post by ID
router.route('/:id').delete(async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Attempting to delete post:', id);
    
    // Find the post first to get the image URL
    const post = await Post.findById(id);
    
    if (!post) {
      console.error('Post not found:', id);
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    console.log('Post found, deleting image from Cloudinary...');

    // Extract public_id from Cloudinary URL
    const urlParts = post.photo.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = 'ai_images/' + publicIdWithExtension.split('.')[0]; // Include folder in public_id
    
    console.log('Public ID:', publicId);
    
    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary');
    
    // Delete post from database
    await Post.findByIdAndDelete(id);
    console.log('Post deleted from database');
    
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error(' Error deleting post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete post', 
      error: error.message 
    });
  }
});

export default router;