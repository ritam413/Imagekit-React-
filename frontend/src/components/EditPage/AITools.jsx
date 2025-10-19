// src/components/panels/AITools.jsx
import {
  FaEraser,        // Bg Remove
  FaMagic,         // Generative Fill
  FaQrcode,        // Retouch
  FaCropAlt        // Smart Crop
} from "react-icons/fa";
import {
  AiOutlineSwap,   // Bg Change
  AiOutlineExpand  // Upscale
} from "react-icons/ai";
import {
  MdOutlineFilterDrama, // Drop Shadow
  MdCenterFocusStrong   // Face Crop
} from "react-icons/md";
import { useState } from "react";
import { useImageStore } from "../../zustand/image.store.js";
import { api } from "../../utils/axiosInstance.js";
const AIToolButton = ({ icon, label, onClick, isSelected }) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-ghost flex flex-col h-20 p-2 items-center justify-center gap-1 ${isSelected
        ? 'border-2 border-blue-500  shadow-md scale-105'
        : 'border border-transparent '
        }`}
    >
      {icon}
      {/* <span className="text-xs  hover:visible">{label}</span> */}
      <span className="text-xs">{label}</span>

    </button>
  );
};

export default function AITools({ active }) {
  const [promptText, setPromptText] = useState('');
  const [aiTransformations, setAiTransformations] = useState('');
  const [loading , setLoading ]= useState(false)
  const tools = [
    { icon: <FaEraser size={24} />, label: "Bg Remove", value: "e-bgremove" },
    { icon: <AiOutlineSwap size={24} />, label: "Bg Change", value: "e-bgchange" },
    { icon: <MdOutlineFilterDrama size={24} />, label: "Drop Shadow", value: "e-shadow" },
    { icon: <FaMagic size={24} />, label: "Generative Fill", value: "e-genfill" },
    { icon: <FaQrcode size={24} />, label: "Retouch", value: "e-retouch" },
    { icon: <AiOutlineExpand size={24} />, label: "Upscale", value: "e-upscale" },
    { icon: <MdCenterFocusStrong size={24} />, label: "Face Crop", value: "e-fo-face" },
    { icon: <FaCropAlt size={24} />, label: "Smart Crop", value: "e-fo" },
  ];
  
  const addTransformation = useImageStore((state)=>state.addTransformation)
  const activeImage = useImageStore((state)=>state.activeImage)
  const setActiveImage = useImageStore((state)=>state.setActiveImage)
  console.log("Transformation to be applied on : ",activeImage)


    const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!aiTransformations) {
      console.log("Please select an AI tool");
      return;
    }
    const url = activeImage;
    console.log("Transformation to be applied on : ",url)
    console.log(url)
    const body = {
      aiTransformation: aiTransformations,
      prompt: promptText || null,
      format: "png",
      originalUrl: activeImage || null,
    };

    try {
      const response = await api.post(`api/image/AItransformtaion`,body);

      const data =  response.data
      const transformedUrl = data.transformedURL
      console.log(`TransformedURL is: ${ data.transformedURL}`);
      addTransformation(activeImage,transformedUrl,aiTransformations)
      setActiveImage(transformedUrl)//setting Active image in the Canvas
      setLoading(false)
    } catch (error) {
      console.error("Error during AI transformation:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold items-center text-center mt-2" >AI Tools</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4  lg:grid=cols-4 gap-2">
        {tools.map((tool) => (
          <AIToolButton
            key={tool.label}
            icon={tool.icon}
            label={tool.label}
            isSelected={aiTransformations === tool.value}
            onClick={() => setAiTransformations(prev =>
              prev === tool.value ? '' : tool.value
            )
            }
          />
        ))}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Prompt</span>
        </label>
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="textarea textarea-bordered h-24"
          placeholder="Describe your changes..."
        />
      </div>

      <button onClick={handleGenerate} className="btn btn-primary w-full">
        Generate
      </button>

      <button className="btn btn-ghost w-full">
        Generate Variations
      </button>
    </div>
  );
}
