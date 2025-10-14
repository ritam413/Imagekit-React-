// src/components/RightPanel.jsx
import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';
import AITools from './AITools.jsx';
import {CropTools} from './CropTools.jsx';
import { useEditStore } from '../../zustand/editpage.store.js';
// import EnhancementTools from './EnhancementTools';

export default function RightPanel({ activePanel }) {
  const visiblePanel = useEditStore((state) => state.visiblePanel);
  const setVisiblePanel = useEditStore((state) => state.setVisiblePanel);
  console.log("Currently SElectes is Panel is: ",visiblePanel)
  // Animate whenever activePanel changes
  // const [spring, api] = useSpring(() => ({
  //   x: '100%',
  //   opacity: 0,
  //   config: { tension: 250, friction: 30 },
  // }));

  // useEffect(() => {
  //   // Slide out the old panel first
  //   api.start({
  //     x: '100%',
  //     opacity: 0,
  //     onRest: () => {
  //       // Once hidden, update the panel and slide in
  //       setVisiblePanel(activePanel);
  //       api.start({ x: 0, opacity: 1 });
  //     },
  //   });
  // }, [activePanel, api]);

  return (
    <aside className="w-80 bg-base-200 p-4 overflow-y-auto">
      {/* <animated.div style={{ ...spring, width: '100%' }}> */}
        {visiblePanel === 'ai' && <AITools/>}
        {visiblePanel === 'crop' && <CropTools />}
        {/* {visiblePanel === 'enhance' && <EnhancementTools />} */}
      {/* </animated.div> */}
    </aside>
  );
}
