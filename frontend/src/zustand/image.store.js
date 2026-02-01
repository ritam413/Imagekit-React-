import { create } from 'zustand'

export const useImageStore = create((set, get) => ({

    //* All Uploaded Images
    uploadedImages: [],

    //* The Currently active (displayed) image
    activeImage: "",

    //* Rotation States
    rotation: 0,
    //* Crop States
    crop: { width: 100, height: 100, x: 0, y: 0 },

    //* Transformation for each image(dictionary)
    transformations: {},


    //* ====== Actions ====== //

    setRotation: (rotation) => set({ rotation }),
    setCrop: (crop) => set({ crop }),
    
    setUploadedImages: (images) => set({ uploadedImages: images }),

    setActiveImage: (imageUrl) => set({ activeImage: imageUrl }),

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

