import React, { useState } from 'react';
import {RotateLeftIcon, RotateRightIcon, FlipHorizontalIcon, FlipVerticalIcon, LockIcon, UnlockIcon, ToolButton, AspectRatioButton} from './CropToolsIcon.jsx';
// To keep the main component clean and readable, we can define the SVG icons as separate functional components.
// These icons are styled to match the theme.



export const CropTools = () => {
    // State to manage the user's selections within the crop panel
    const [aspectRatio, setAspectRatio] = useState('free');
    const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
    const [isLocked, setIsLocked] = useState(true);

    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        const newDim = parseInt(value, 10) || 0;
        
        // In a real application, you would add logic here to maintain the aspect ratio if `isLocked` is true.
        setDimensions(prev => ({ ...prev, [name]: newDim }));
    };

    return (
        <div className="flex flex-col gap-6 text-white h-full font-sans">
            <h2 className="text-xl font-semibold text-slate-200 items-center text-center mt-2">Crop & Resize</h2>

            {/* Transform Section for rotation and flipping */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-slate-400">TRANSFORM</h3>
                <div className="grid grid-cols-2 gap-3">
                   <ToolButton icon={<RotateLeftIcon />} label="Rotate Left" />
                   <ToolButton icon={<RotateRightIcon />} label="Rotate Right" />
                   <ToolButton icon={<FlipHorizontalIcon />} label="Flip H" />
                   <ToolButton icon={<FlipVerticalIcon />} label="Flip V" />
                </div>
            </div>

            {/* Aspect Ratio Section for presets */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-slate-400">ASPECT RATIO</h3>
                <div className="grid grid-cols-3 gap-2">
                    <AspectRatioButton label="Free" value="free" activeValue={aspectRatio} setActive={setAspectRatio} />
                    <AspectRatioButton label="Original" value="original" activeValue={aspectRatio} setActive={setAspectRatio} />
                    <AspectRatioButton label="1:1" value="1:1" activeValue={aspectRatio} setActive={setAspectRatio} />
                    <AspectRatioButton label="4:3" value="4:3" activeValue={aspectRatio} setActive={setAspectRatio} />
                    <AspectRatioButton label="16:9" value="16:9" activeValue={aspectRatio} setActive={setAspectRatio} />
                </div>
            </div>

            {/* Dimensions Section for manual resizing */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-slate-400">DIMENSIONS (PX)</h3>
                <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        name="width"
                        value={dimensions.width}
                        onChange={handleDimensionChange}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Width"
                    />
                    <button onClick={() => setIsLocked(!isLocked)} className="p-2 text-slate-400 hover:text-white transition-colors">
                        {isLocked ? <LockIcon /> : <UnlockIcon />}
                    </button>
                    <input 
                        type="number"
                        name="height"
                        value={dimensions.height}
                        onChange={handleDimensionChange}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Height"
                    />
                </div>
            </div>

            {/* Action Buttons are pushed to the bottom of the panel */}
            <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-slate-700">
                 <button className="w-full py-2.5 text-center bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors font-semibold">
                    Reset
                </button>
                <button className="w-full py-2.5 text-center bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-semibold">
                    Apply Changes
                </button>
            </div>
        </div>
    );
};


