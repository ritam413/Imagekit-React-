import { create } from 'zustand'

export const useImageStore = create((set, get) => ({

    uploadedImages: [],
    setUploadedImages: (images) => set({ uploadedImages: images }),

    activeImage: "",
    setActiveImage: (imageUrl) => set({ activeImage: imageUrl }),


    imageStates: {},
    updateActiveImageState: (newStates) => {
        const activeId = get().activeImage;
        if (!activeId) return;
        set((state) => {
            const defaultStates = {
                rotation: 0, 
                crop: { x: 0, y: 0 },
                presetFilter:null,
                vignette: {
                    enabled: false,
                    centerX: 0,
                    centerY: 0,
                    innerRadius: 0,
                    featherRadius: 0,
                    outerRadius: 0,
                    intensity: 0.6,
                    continueFading: false,
                    initialized: false
                }
            };
            return{

                imageStates: {
                    ...state.imageStates,
                    [activeId]: {
                        ...defaultStates,
                        ...(state.imageStates[activeId] || {}),
                        ...newStates
                    }
                }
            }
        })
    },

    transformations: {},
    addTransformation: (originalUrl, transformedUrl, type) => {
        const prev = get().transformations
        set({
            transformations: {
                ...prev,
                [originalUrl]: [
                    ...(prev[originalUrl] || []),
                    { url: transformedUrl, type: type }
                ]
            },
            activeImage: transformedUrl
        });
    }

}))

