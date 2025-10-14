// Create a new file: src/components/LeftToolbar.jsx
import { VscWand } from 'react-icons/vsc';
import { FaCropSimple } from "react-icons/fa6";

import { IoSparklesOutline } from "react-icons/io5";
import IconButton from '../IconButton.jsx';
import { useEditStore } from '../../zustand/editpage.store.js';

export default function LeftToolbar({ activePanel, setActivePanel }) {
  const visiblePanel = useEditStore().visiblePanel
  const setVisiblePanel = useEditStore((state) => state.setVisiblePanel)

  return (
    <aside className="bg-base-200 p-2 flex flex-col items-center gap-4">
      <IconButton
        icon={<VscWand size={24} />}
        label="AI Tools"
        isActive={visiblePanel === 'ai'}
        onClick={() => setVisiblePanel('ai')}
      />
      <IconButton
        icon={<FaCropSimple size={24} />}
        label="Crop & Resize"
        isActive={visiblePanel === 'crop'}
        onClick={() => setVisiblePanel('crop')}
      />
      <IconButton
        icon={<IoSparklesOutline size={24} />}
        label="Enhancements"
        isActive={visiblePanel === 'enhance'}
        onClick={() => setVisiblePanel('enhance')}
      />
    </aside>
  );
}