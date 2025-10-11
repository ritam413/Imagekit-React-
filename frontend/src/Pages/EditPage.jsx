import { useState } from 'react';
import Header from '../components/Navbar.jsx';
import LeftToolbar from '../components/LeftToolbar.jsx';
import Canvas from '../components/Canvas.jsx';
import RightPanel from '../components/RightPanel.jsx';
import BottomGallery from '../components/BottomGallery.jsx';
import useUserStore from '../zustand/user.store.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { TransformationThumbnails } from '../components/TransformationThumbnails.jsx';

export const EditPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [Transformation,setTransformations] = useState({});

  // ✅ Redirect user to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);


  // State to manage the active tool panel ('ai', 'crop', 'enhance')
  const [activePanel, setActivePanel] = useState('ai');
  const [active , setActive] = useState("");

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-base-300 text-base-content font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <LeftToolbar activePanel={activePanel} setActivePanel={setActivePanel} />
          <main className="flex-1 flex flex-col p-4 gap-4">
            <Canvas activeImage = {active} setActive = {setActive}  />
            <BottomGallery setActive = {setActive}  />
          </main>
          <RightPanel 
          activePanel={activePanel}  
          active = {active} 
          setActive = {setActive} 
          setTransformation={setTransformations} />
        </div>
      </div>
    </>


  );
}
