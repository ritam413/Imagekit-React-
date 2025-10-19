import { MdWebAsset } from "react-icons/md";
import { FaFolder } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import useUserStore from '../zustand/user.store';
import toast from 'react-hot-toast';
import { api } from "../utils/axiosInstance";

export const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await api.post(`api/auth/logout`)
      const data =  res.data

      if (!data.error) {
        useUserStore.getState().setUser(null);
        toast.success("Logout Success");
        navigate("/login");
      } else {
        toast.error("Logout Failed");
      }
    } catch (error) {
      toast.error("Logout Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="bg-slate-900 h-full p-4 flex flex-col">
      {/* Logo Section */}
      <div 
      onClick={() => navigate("/app")}
      className="flex items-center gap-2 mb-8 cursor-pointer">
        <FaImage className="text-primary text-3xl" />
        <span className="text-2xl font-bold text-primary">PicxY</span>
      </div>

      {/* Menu */}
      <ul className="flex-grow p-0 space-y-2">
        <li>
          <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-500 cursor-pointer">
            <MdWebAsset size={20} /> All Assets
          </button>
        </li>
        <li>
          <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-500 cursor-pointer">
            <FaFolder size={20} /> Folders
          </button>
        </li>
      </ul>

      {/* Footer Section */}
      <div className="mt-auto">
        <ul className="p-0 mb-4 space-y-2">
          <li>
            <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-500 cursor-pointer">
              <FaGear size={20} /> Settings
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-500 cursor-pointer">
              <IoIosLogOut size={20} /> Logout
            </button>
          </li>
        </ul>

        {/* Footer Logo */}
        <div className="flex items-center gap-2 justify-center">
          <button 
          onClick={() => navigate("/app")}
          className="flex flex-row gap-2 cursor-pointer"><FaImage size={30} className="text-primary text-2xl" />
            <span className="font-bold text-primary">PicxY</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
