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
// --------------------------


// ---- Stores Imports ------
import { useImageStore } from '../zustand/image.store.js';
import useUserStore from '../zustand/user.store.js';
// --------------------------

import Header from '../components/Navbar.jsx';
import { useNavigate, useParams } from 'react-router-dom';

export const EditPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const {url} = useParams()
  const decodeURl = decodeURIComponent(url);
  console.log("URL i got from params is: ",decodeURl,"or : ",url)
  const setActiveImage = useImageStore((state) => state.setActiveImage);
  // ✅ Redirect user to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if(decodeURl){
    setActiveImage(decodeURl)
  }
  

  // State to manage the active tool panel ('ai', 'crop', 'enhance')
  const [activePanel, setActivePanel] = useState('ai');
  const [active , setActive] = useState("");

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-base-300 text-base-content font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <LeftToolbar 
          activePanel={activePanel} 
          setActivePanel={setActivePanel} />
          <main className="flex-1 flex flex-col p-4 gap-4">
            <Canvas/> 
            <TransformationThumbnails/>
            <BottomGallery setActive = {setActive}  />
          </main>
          <RightPanel 
          activePanel={activePanel}  
          setActivePanel={setActivePanel}
           />
        </div>
      </div>
    </>


  );
}
