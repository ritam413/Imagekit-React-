import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

import { getUserMedia, setImageVisiblity } from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { uploadMedia } from "../controllers/dashboard.controller.js";

router.get("/getMedia/:id",protectRoute,getUserMedia)

router.post("/uploadMedia",protectRoute,upload.array('file'),uploadMedia)

router.patch("/upateImageVisiblity",protectRoute,setImageVisiblity)

export default router