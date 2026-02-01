import {create} from 'zustand'

export const useEditStore = create((set)=>({
    visiblePanel : "ai",
    crop:{
        h:0,
        w:0,
        x:0,
        y:0
    },

    setCrop : (crop) => set({crop}),

    setVisiblePanel : (panel) => set({visiblePanel : panel})
}))
