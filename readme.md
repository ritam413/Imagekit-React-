# how to design my Application

# --> /aiTransformtaion :-> for endpoints
    (
        const aiTransformations = 
        {
            BackgroundRemove: "e-removedotbg",
            ChangeBackground: "e-changebg",
            EditImage: "e-edit",
            GenerativeFill: "bg-genfill",
            DropShadow: "e-dropshadow",
            Retouch: "e-retouch",
            Upscale: "e-upscale",
            GenerateImageViaText: "text-prompt",
            GenerateVariations: "e-variation",
            ObjectAwareCropping: "e-objectcrop",
            FaceCrop: "e-facecrop",
            SmartCrop: "e-smartcrop"
        };
    
    ) 

# --> /resize_crop :->  endpoints for 
(
    const resize&crop = {
        width: "w",
        height: "h",
        aspectRatio: "ar",
        crop: "Crop modes & Focus",
        padResizeCropStrategy: "cm-pad_resize",
        forcedCropStrategy: "c-force",
        maxSizeCroppingStrategy: "c-at_max",
        maxSizeEnlargeCroppingStrategy: "c-at_max_enlarge",
        minSizeCroppingStrategy: "c-at_least",
        maintainRatioCropStrategy: "c-maintain_ratio",
        extractCropStrategy: "cm-extract",
        padExtractCropStrategy: "cm-pad_extract",
        focus: "fo",
        autoSmartCropping: "fo-auto",
        faceCropping: "fo-face",
        objectAwareCropping: "fo-object_name",
        "zoom": "z",
        "dpr": "dpr"
    };

)

# --> /effect_enhancements :->  endpoints for 
(
    {
        ON THIS PAGE
        "Contrast stretch": "(e-contrast)"
        "Sharpen" :        "(e-sharpen)"
        "Unsharp mask" :   "(e-usm)"
        "Shadow" :          "(e-shadow)"
        "Gradient" :        "(e-gradient)"
        "Grayscale" :       "(e-grayscale)"
        "Blur" :            "(bl)"
        "Trim edges" :      "(t)"
        "Border" :          "(b)"
        "Rotate" :          "(rt)"
        "Flip" :            "(fl)"
        "Radius" :          "(r)"
        "Background":       "(bg)"
        "Opacity" :         "(o)"
    }
)





# Made  the protected routes 
# Configured Multiple file Upload 
# make getImgae route 
# make getSingleImage , configure
        -> edit , delete , create 
# adding reset password options 
    first createa a context 
    send the user-name/email via request in backend  
    backend returns a user save it in the context then  
    send that fetch the user in reset password page and change it  

    