// Create a new file: src/components/Canvas.jsx

import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

export default function Canvas({ activeImage ,setActive }) {
  console.log("Canvas: ", activeImage)
  const [transformation,setAiTransformations] = useState('');

  return (
    <div className="flex-1 bg-base-100 rounded-lg flex items-center justify-center shadow-inner overflow-auto relative">
      {!activeImage ?
        <p className="text-base-content/50">Your Image Will Appear Here</p>
        :
        <>
          <RxCross2 
          size={30}
          className="absolute top-3 right-3 text-xl text-base-content/70 cursor-pointer hover:text-base-content transition hover:scale-105" onClick={() => { setActive('') }} />
          <img src={activeImage} alt="Editing canvas" className="max-w-full max-h-full" />
        </>
      }

      {/* Example of where the image would go */}


    </div>
  );
}