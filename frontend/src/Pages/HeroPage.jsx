// ----- Component Pages Imports -----
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import { ImageVideoGridSection } from '../components/ImageVideoGridSection2.jsx';
import Footer from '../components/Footer.jsx';
// ---------------------------------

const HeroPage = () => {
return (
  <div className="min-h-screen bg-base-300 text-base-content font-sans flex flex-col">
    <Navbar/>
    <HeroSection  />
    <ImageVideoGridSection />
    <Footer />
  </div>
);
}

export default HeroPage