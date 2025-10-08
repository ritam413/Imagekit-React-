import React, { useState } from 'react';
import { IoSearchOutline, IoPersonCircleOutline } from 'react-icons/io5'; // Using react-icons
import { IoIosLogOut } from "react-icons/io";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../zustand/user.store';
import useFilterStore from '../zustand/heroFilter.store';
const Navbar = () => {
  const [loading , setLoading]= useState()
  const navigate = useNavigate()
  const {filter,setFilter} = useFilterStore() 


  const handleLogout = async () => {

    try {
      setLoading(true)
      const res = await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
      })
      const data = await res.json()

      if(!data.error){
        useUserStore.getState().setUser(null)
        console.log("Logout Success")
        toast.success("Logout Success")
        navigate("/login")
      }
    } catch (error) {
      toast.error("Logout Failed")
    }finally{
      setLoading(false)
    }
  };  

  const handleDashBoard = async () =>{
    navigate("/user")
  }
  return (
   
      <nav className="navbar bg-transparent text-white px-4 md:px-8 py-4 z-50 relative">
        <div className="navbar-start ">
          {/* Your Brand/Logo */}
          <a className="text-2xl font-extrabold  bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">PicxY</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          {/* Navigation Links */}
          <ul className="menu menu-horizontal p-0">
            <li><button 
            onClick={()=>setFilter("all")}
            className="text-lg hover:text-purple-400">All</button></li>
            <li><button 
            onClick={()=>setFilter("image")}
            className="text-lg hover:text-purple-400">Images</button></li>
            <li><button
            onClick={()=>setFilter("video")}
            className="text-lg hover:text-purple-400">Videos</button></li>
          </ul>
        </div>
        <div className="navbar-end">
          {/* Search and Profile Icons */}
          <button className="btn btn-ghost btn-circle">
            <IoSearchOutline className="text-3xl text-purple-400 hover:text-pink-400 transition-colors duration-200" />
          </button>
          <button 
          onClick={handleDashBoard}
          className="btn btn-ghost btn-circle ml-2">
            <IoPersonCircleOutline className="text-3xl text-purple-400 hover:text-pink-400 transition-colors duration-200" />
          </button>
          <button className="btn btn-ghost btn-circle ml-2">
            <IoIosLogOut 
            onClick={handleLogout}
            className="text-3xl text-purple-400 hover:text-pink-400 transition-colors duration-200" />
          </button>
        </div>
      </nav>

  );
};

export default Navbar;