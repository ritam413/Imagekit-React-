import { create } from 'zustand'

const useImageStore = create((set, get) => ({

    //All Uploaded Images
    uploadedImages: [],

    //The Currently active (displayed) image
    activeImage: "",

    //Transformation for each image(dictionary)
    transformations: {},

    // ====== Actions ====== //
    setUploadedImages: (images) => set({ uploadedImages: images }),

    setAtiveImage: (imageUrl) => set({ activeImage: imageUrl }),

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

export default useImageStore