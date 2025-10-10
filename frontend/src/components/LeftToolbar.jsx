// Create a new file: src/components/LeftToolbar.jsx
import { VscWand } from 'react-icons/vsc';
import { FaCropSimple } from "react-icons/fa6";

import { IoSparklesOutline } from "react-icons/io5";
import IconButton from './IconButton.jsx';

export default function LeftToolbar({ activePanel, setActivePanel }) {
  return (
    <aside className="bg-base-200 p-2 flex flex-col items-center gap-4">
      <IconButton
        icon={<VscWand size={24} />}
        label="AI Tools"
        isActive={activePanel === 'ai'}
        onClick={() => setActivePanel('ai')}
      />
      <IconButton
        icon={<FaCropSimple size={24} />}
        label="Crop & Resize"
        isActive={activePanel === 'crop'}
        onClick={() => setActivePanel('crop')}
      />
      <IconButton
        icon={<IoSparklesOutline size={24} />}
        label="Enhancements"
        isActive={activePanel === 'enhance'}
        onClick={() => setActivePanel('enhance')}
      />
    </aside>
  );
}