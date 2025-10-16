// ---- Hooks Imports ------
import { useState } from 'react';
import { useEffect } from 'react';
// -------------------------

//--- Edit Page Imports ----
import BottomGallery from '../components/EditPage/BottomGallery.jsx';
import LeftToolbar from '../components/EditPage/LeftToolbar.jsx';
import RightPanel from '../components/EditPage/RightPanel.jsx';
import { TransformationThumbnails } from '../components/EditPage/TransformationThumbnails.jsx';
import Canvas from "../components/EditPage/Canvas.jsx"
import Header from '../components/Navbar.jsx';
// --------------------------


// ---- Stores Imports ------
import { useImageStore } from '../zustand/image.store.js';
import useUserStore from '../zustand/user.store.js';
// --------------------------

// ---- React Router Imports ----
import { useNavigate, useParams } from 'react-router-dom';
// ------------------------------

export const EditPage = () => {
  const navigate = useNavigate(); // intialize the useNavigate hook
  const user = useUserStore((state) => state.user); // getting the user from the zustand store


  // ---- UrL Params ----
  const {url} = useParams()  
  const decodeURl = decodeURIComponent(url);
  console.log("URL i got from params is: ",decodeURl,"or : ",url)
  // ---------------------


  // Gettig the active image function from the zustand store 
  const setActiveImage = useImageStore((state) => state.setActiveImage);
  if(decodeURl){
    setActiveImage(decodeURl) //Updating the Active Image with the URl 
  }

  // ✅ Redirect user to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-base-300 text-base-content font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <LeftToolbar/>
          <main className="flex-1 flex flex-col p-4 gap-4">
            <Canvas/> 
            <TransformationThumbnails/>
            <BottomGallery   />
          </main>
          <RightPanel/>
        </div>
      </div>
    </>
  );
}
