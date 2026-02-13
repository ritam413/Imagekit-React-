import { FaGripVertical } from "react-icons/fa";
import { memo, useEffect } from "react";
import { useState } from "react";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

import Share from "../components/Share/index.jsx";
import { IoEllipseSharp } from "react-icons/io5";

export const AssetCard = memo(({ asset, onDeleteSucess, isCommunity , onVisiblityUpdate }) => {
  const navigate = useNavigate();
  const [showShare, setShowShare] = useState(false);
  const [openShare, setOpenShare] = useState(false)


  const [isPublic,setIsPublic] = useState(asset.isPublic)

  useEffect(()=>{
    setIsPublic(asset.isPublic)
  },[asset.isPublic])

  const handleDownloadMedia = async () => {
    const response = await fetch(asset.url || asset.originalUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = asset.title || "download"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // const handleClose = () => {
  //   setShowShare(false)
  //   setOpenShare(false)
  // }

  const handleUpdateVisisblity=async()=>{
    console.log("id of image is: ",asset._id)
    console.log("id of image is: ",`${asset.isPublic?"Public":"Private"}`)

    const oldStatus = isPublic
    setIsPublic(!oldStatus)

    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/updateImageVisiblity`,{
        method:'PATCH',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({ _id: asset._id }),     
      })
      
      const data = await response.json()

      if(response.ok)
      {
        toast.success(data.message)
        if(onVisiblityUpdate)
        {
          onVisiblityUpdate(asset._id,!oldStatus)
        }
      }
      else{
        setIsPublic(oldStatus)
        toast.error(data.message)
      }
    }catch{
      setIsPublic(oldStatus)
      toast.error("Something went wrong")
    }
  }

  const handleDelete = async () => {
    // const response = await api.delete(`api/image/Image/${asset._id}`)
    console.log("ViteURlis: ", import.meta.env.VITE_BACKEND_URL)
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/image/Image/${asset._id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = response.data
    if (!data.error) {
      toast.success(data.message)
      onDeleteSucess(asset._id)
    } else {
      toast.error(data.message)
    }
    console.log(data);
  }


  return (
    <div className="card bg-base-100 shadow-xl image-full group transform-gpu transition-all duration-300 hover:scale-105">
      <img src={(asset.originalUrl) || (asset.url)} alt={asset.title} className="w-full h-full object-cover" />
      <div className="card-body p-4 justify-between">
        <div
          className="absolute top-4 left-4"
        >
          {!isCommunity &&
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white drop-shadow-2xl shadow-lg 
                ${asset.isPublic ? 'bg-green-500/50' : 'bg-red-600/50'}`}
            >P</span>
          }
          
        </div>
        <div className="card-actions justify-end">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-circle btn-ghost btn-sm text-white opacity-70 group-hover:opacity-100">
              <FaGripVertical size={20} />
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-20">
              <li><buttton
                onClick={() => navigate(`/edit/${encodeURIComponent(asset.originalUrl || asset.url)}`)}
              >Edit</buttton></li>
              <li>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2
                            text-gray-200 text-sm
                            hover:text-blue-500 hover:bg-gray-800 
                            rounded-md transition focus:outline-none focus:ring-0"
                  onClick={() => { setShowShare(true), setOpenShare(true) }}
                >
                  Share
                </button>
                {showShare && <Share
                  open={openShare}
                  onClose={() => { setOpenShare(false) }}
                  url={(asset.originalUrl) || (asset.url)} />}
              </li>
              <li>
                <button
                  onClick={handleDownloadMedia}
                >Download</button>
              </li>
              {!isCommunity && 
                <li
                onClick={handleDelete}
                className="text-error"><a>Delete</a>
                </li>
              }
              {!isCommunity && 
                <select 
                  defaultValue={asset.isPublic?"Public":"Private"}
                  className="select"
                  onChange={handleUpdateVisisblity}
                >
                  <option>{asset.isPublic?"Public":"Private"}</option>
                  <option>{asset.isPublic?"Private":"Public"}</option>
                </select>
              }

            </ul>
          </div>
        </div>
        <div>
          <h2 className="card-title text-white text-lg font-bold drop-shadow-md">{asset.title}</h2>
        </div>
      </div>
    </div>
  );
})