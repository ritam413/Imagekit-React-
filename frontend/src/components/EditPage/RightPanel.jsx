// src/components/RightPanel.jsx
import { useTransition, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';
import AITools from './AITools.jsx';
import {CropTools} from './CropTools.jsx';
import { useEditStore } from '../../zustand/editpage.store.js';
import {EnhancementTools} from './EnhancementTools.jsx';

export default function RightPanel({ activePanel }) {
 
  const visiblePanel = useEditStore((state) => state.visiblePanel);
  console.log("Currently SElectes is Panel is: ",visiblePanel)

  // Create transitions for panel switching
  const transitions = useTransition(visiblePanel, {
    from: { opacity: 0, transform: 'translateX(30px)' },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: { opacity: 0, transform: 'translateX(-30px)' },
    config: { tension: 220, friction: 20 },
  });

  return (
    <aside className="w-80 bg-base-200 p-4 overflow-y-auto relative">
        {/* {visiblePanel === 'ai' && <AITools/>}
        {visiblePanel === 'crop' && <CropTools />}
        {visiblePanel === 'enhance' && <EnhancementTools />} */}

          {transitions((style, item) => (
        <animated.div
          key={item}
          style={{
            ...style,
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
          }}
        >
          {item === 'ai' && <AITools />}
          {item === 'crop' && <CropTools />}
          {item === 'enhance' && <EnhancementTools />}
        </animated.div>
      ))}

    </aside>
  );
}
