import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();    



import {transformation , uploadImage, AItransformtaion , effect_enhancements,resize_crop ,image_overlay , test, getImages , getImage ,deleteImage} from '../controllers/image.controller.js'
import { protectRoute } from "../middleware/protectRoute.js";


router.post('/transformation',transformation)

router.post('/upload',protectRoute,upload.array('file'),uploadImage)

router.post('/AItransformtaion',AItransformtaion)
router.post('/effect_enhancements',effect_enhancements)
router.post('/resize_crop',resize_crop)
router.post('/image_overlay',image_overlay)
router.post('/test-route',protectRoute,test)


router.get("/Images",getImages)
router.get("/Image",getImage)

router.delete('/Image/:id',protectRoute,deleteImage)


export default router 