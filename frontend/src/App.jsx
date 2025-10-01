import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './constant/AuthContext';
import { logo } from './assets';
import { Home, CreatePost } from './pages';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ProtectedRoute from './Components/ProtectedRoute';
import toast from 'react-hot-toast';

// Header component with authentication
const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
      <Link to="/">
        <div className="group relative w-48 rounded-2xl p-[2px] hover:p-[3px] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 via-green-500 to-blue-500 via-indigo-500 to-purple-500 rounded-4xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <img 
            src={logo} 
            alt="logo" 
            className="relative z-10 w-full h-full object-contain rounded-4xl bg-white" 
          />
        </div>
      </Link>
      
      <div className="flex items-center gap-4">
        {currentUser ? (
          // User is logged in
          <>
            <span className="text-gray-700 font-medium hidden sm:block">
              Welcome, {currentUser.displayName || currentUser.email}
            </span>
            <Link 
              to="/create-post" 
              className="font-inter font-medium bg-[#6469ff] hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors"
            >
              Create
            </Link>
            <button
              onClick={handleLogout}
              className="font-inter font-medium bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          // User is not logged in
          <>
            <Link 
              to="/login" 
              className="font-inter font-medium text-gray-700 hover:text-gray-900 px-4 py-3 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="font-inter font-medium bg-[#6469ff] hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Header />
          <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/create-post" 
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;