import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import {logo} from './assets'
import {Home,CreatePost} from './pages'
const App = () => {
  return (
   <BrowserRouter>
   <header className=' w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]'>
<Link to="/">
  <div className="group relative w-48 rounded-2xl p-[2px] hover:p-[3px] transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 via-green-500 to-blue-500 via-indigo-500 to-purple-500 rounded-4xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
    <img 
      src={logo} 
      alt="logo" 
      className='relative z-10 w-full h-full object-contain rounded-4xl bg-white' 
    />
  </div>
</Link>
      <Link to="/create-post" className='font-inter font-medium bg-black hover:bg-gray-500 text-white px-4 py-3 rounded-md'>Create</Link>
    </header>
    <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create-post' element={<CreatePost/>}/>
      </Routes>

    </main>
    </BrowserRouter>
  )
}

export default App