// Create a new file: src/components/Canvas.jsx

import { RxCross2 } from "react-icons/rx";

export default function Canvas({ active ,setActive }) {
  return (
    <div className="flex-1 bg-base-100 rounded-lg flex items-center justify-center shadow-inner overflow-auto relative">
      {!active ?
        <p className="text-base-content/50">Your Image Will Appear Here</p>
        :
        <>
          <RxCross2 
          size={30}
          className="absolute top-3 right-3 text-xl text-base-content/70 cursor-pointer hover:text-base-content transition hover:scale-105" onClick={() => { setActive('') }} />
          <img src={active} alt="Editing canvas" className="max-w-full max-h-full" />
        </>
      }

      {/* Example of where the image would go */}


    </div>
  );
}