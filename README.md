# VisageForge - AI Image Generator

A full-stack AI image generation application that allows users to create stunning images using AI, share them with the community, and manage their creations.

## Features

- 🎨 **AI Image Generation** - Create images from text prompts using GEMINI-API
- 👥 **User Authentication** - Email/Password and Google OAuth sign-in
- 🖼️ **Community Gallery** - Browse and share AI-generated images
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔐 **Protected Routes** - Secure user-specific content
- 💾 **Image Management** - Download and delete your creations
- 🎭 **Masonry Layout** - Beautiful Pinterest-style image grid

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling
- **Firebase Authentication** - User authentication
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **OpenAI API** - GEMINI-API image generation
- **Cloudinary** - Image storage
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB account
- Firebase account
- OpenAI API key
- Cloudinary account

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-image-generator.git
cd ai-image-generator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGODB_URL=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm start
```
Server runs on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

Start the frontend development server:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Email/Password**
   - Enable **Google**
4. Add **Authorized Domains**:
   - Go to Authentication → Settings → Authorized domains
   - Add `localhost` (for development)
   - Add your production domain (e.g., `your-app.vercel.app`)

## Deployment

### Backend (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables from your `.env` file
6. Deploy

Your backend URL will be: `https://your-app-name.onrender.com`

### Frontend (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Framework Preset: **Vite**
4. Root Directory: `frontend`
5. Add environment variables:
   - All `VITE_FIREBASE_*` variables
6. Deploy

### Update Frontend API URLs

After deploying backend, update the API URLs in frontend files:
- `Home.jsx`
- `CreatePost.jsx`
- `Card.jsx`

Replace `http://localhost:8080` with your Render backend URL.

### Add Production Domain to Firebase

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to Authorized domains
3. Redeploy your Vercel app

## Project Structure

```
ai-image-generator/
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Card.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── ImageModal.jsx
│   │   │   └── Loader.jsx
│   │   ├── constant/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── assets/
│   │   ├── firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── mongodb/
│   │   ├── connect.js
│   │   └── models/
│   │       └── post.js
│   ├── routes/
│   │   ├── postRoutes.js
│   │   └── dalleRoutes.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

## API Endpoints

### Posts
- `GET /api/v1/post` - Get all posts
- `POST /api/v1/post` - Create a new post
- `DELETE /api/v1/post/:id` - Delete a post

### DALL-E
- `POST /api/v1/dalle` - Generate image from prompt

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGODB_URL` | MongoDB connection string |
| `OPENAI_API_KEY` | OpenAI API key for DALL-E |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID |

## Usage

1. **Sign Up/Login** - Create an account or sign in with Google
2. **Create Image** - Go to "Create" page, enter a prompt, and generate an image
3. **Share** - Share your generated image with the community
4. **Browse** - View community gallery on the home page
5. **Manage** - Download or delete your own images

## Troubleshooting

### Authentication Issues
- Verify Firebase authorized domains include your deployment URL
- Check that Email/Password and Google sign-in are enabled in Firebase
- Ensure environment variables are correctly set in Vercel

### Image Generation Issues
- Verify GEMINI-API key is valid and has credits
- Check backend logs for errors
- Ensure Cloudinary credentials are correct

### CORS Issues
- Backend CORS is configured to allow all origins
- For production, update CORS settings to specific domains

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenAI for GEMINI-API
- Firebase for authentication
- Cloudinary for image storage
- Tailwind CSS for styling
- React and Vite communities

## Contact

Your Name - amithp0210@gamil.com


---

Made with by Amith
