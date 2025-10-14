import {create} from 'zustand'

export const useEditStore = create((set)=>({
    visiblePanel : "ai",
    setVisiblePanel : (panel) => set({visiblePanel : panel})
}))