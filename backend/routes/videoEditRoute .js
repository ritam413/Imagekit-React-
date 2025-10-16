import { Router } from "express";
import multer from "multer";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();    



import { protectRoute } from "../middleware/protectRoute.js";
import { 
    adaptive_bitrate, 
    audio_Transformation, 
    common_Transformation, 
    getVideo, 
    getVideos, 
    overlay_video, 
    resize_crop, 
    thumbnail, 
    trim_Vidoes,
    deleteVideo
} from "../controllers/video.controller.js";


// router.post('/upload',protectRoute,upload.single('video'),uploadImage)
router.post('/resize_crop',resize_crop)
router.post('/overlay',overlay_video)
router.post('/transformation',common_Transformation)
router.post('/audio',audio_Transformation)
router.post('/thumbnail',thumbnail)
router.post('/trim',trim_Vidoes)
router.post('/bitrate',adaptive_bitrate)
// router.post('/test-route',protectRoute,test)


router.get("/vidoes",getVideos)
router.get("/video",getVideo)

router.delete('/video/:id',protectRoute,deleteVideo)


export default router 