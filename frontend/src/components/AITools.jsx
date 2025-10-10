// Create a new folder: src/components/panels
// Create a new file: src/components/panels/AITools.jsx
// src/components/panels/AITools.jsx
import {
  FaEraser ,        // Bg Remove
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

const AIToolButton = ({ icon, label }) => (
  <button className="btn btn-ghost flex flex-col h-20 p-2 items-center justify-center gap-1">
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

export default function AITools() {
  const tools = [
    { icon: <FaEraser size={24} />, label: "Bg Remove" },
    { icon: <AiOutlineSwap size={24} />, label: "Bg Change" },
    { icon: <MdOutlineFilterDrama size={24} />, label: "Drop Shadow" },
    { icon: <FaMagic size={24} />, label: "Generative Fill" },
    { icon: <FaQrcode size={24} />, label: "Retouch" },
    { icon: <AiOutlineExpand size={24} />, label: "Upscale" },
    { icon: <MdCenterFocusStrong size={24} />, label: "Face Crop" },
    { icon: <FaCropAlt size={24} />, label: "Smart Crop" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">AI Tools</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tools.map(tool => (
          <AIToolButton key={tool.label} {...tool} />
        ))}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Prompt</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Describe your changes..."
        ></textarea>
      </div>
      <button className="btn btn-primary w-full">Generate</button>
      <button className="btn btn-ghost w-full">Generate Variations</button>
    </div>
  );
}
