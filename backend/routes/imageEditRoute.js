import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();    



import {transformation ,saveTransformedUrl, uploadImage, AItransformtaion , effect_enhancements,res_resize_crop ,image_overlay , test, getImages , getImage ,deleteImage} from '../controllers/image.controller.js'
import { protectRoute } from "../middleware/protectRoute.js";
import {apilimiter} from "../middleware/rateLimiter.js";

router.post('/transformation',transformation)

router.post('/upload',protectRoute,upload.array('file'),uploadImage)

router.post('/AItransformtaion',apilimiter,AItransformtaion)
router.post('/saveTransformedURl',saveTransformedUrl)
router.post('/effect_enhancements',apilimiter,effect_enhancements)
router.post('/resize_crop',apilimiter,res_resize_crop)
router.post('/image_overlay',apilimiter,image_overlay)
router.post('/test-route',protectRoute,test)


router.get("/Images",getImages)
router.get("/Image",getImage)

router.delete('/Image/:id',protectRoute,deleteImage)


export default router 