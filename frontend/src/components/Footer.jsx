import React from 'react';

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-12">
      <div className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </div> 
      <div>
        <div className="grid grid-flow-col gap-4">
          {/* Social media icons can go here from react-icons */}
        </div>
      </div>
      <div>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by Loonos Inc</p>
      </div>
    </footer>
  );
};

export default Footer;