import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import ImageVideoGridSection from '../components/ImageVideoGridSection.jsx';
import Footer from '../components/Footer.jsx';
import useUserStore from '../zustand/user.store';
import { useNavigate } from 'react-router-dom';
const HeroPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);



  const isLoggedIn = async(req,res) => {
    if(useUserStore.getState().user == null){
      navigate("/login")
    }
  }

return (
  // Apply DaisyUI's dark theme class and default background/text colors
  <div className="min-h-screen bg-base-300 text-base-content font-sans flex flex-col">
    <Navbar/>
    <HeroSection  />
    <ImageVideoGridSection />
    {/* Optional: Add a simple footer */}
    <Footer />
  </div>
);
}

export default HeroPage