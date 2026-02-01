import { set } from "mongoose";

const RotateLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

const RotateRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
);

const FlipHorizontalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18 M12 21l-7-7 7-7 M12 3l7 7-7 7" transform="rotate(90 12 12)"/>
    </svg>
);

const FlipVerticalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M21 12H3 M12 21l-7-7 7-7 M12 3l7 7-7 7" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const UnlockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-unlock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
);

/**
 * A reusable button component for the tool panel.
 * It standardizes the look and feel of the transform tools.
 */
const ToolButton = ({ icon, label , setActiveValue, activeValue, value}) => (
    <button 
        onClick={()=>setActiveValue(value)} 
        className={`flex flex-col items-center justify-center gap-2 p-3   rounded-lg transition-colors text-sm w-full ${activeValue === value ? 'bg-purple-600 text-white' : 'bg-slate-700/40 hover:bg-slate-600/60 text-slate-300'}`}
    >
        <div className="w-6 h-6 text-slate-300">{icon}</div>
        <span className="text-slate-300">{label}</span>
    </button>
);

/**
 * A reusable button for selecting aspect ratios.
 * It highlights the currently active ratio.
 */
const AspectRatioButton = ({ label, value, activeValue, setActive }) => (
    <button 
        onClick={() => setActive(value)} 
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeValue === value ? 'bg-purple-600 text-white' : 'bg-slate-700/40 hover:bg-slate-600/60 text-slate-300'}`}
    >
        {label}
    </button>
);

export { RotateLeftIcon, RotateRightIcon, FlipHorizontalIcon, FlipVerticalIcon, LockIcon, UnlockIcon, ToolButton, AspectRatioButton };