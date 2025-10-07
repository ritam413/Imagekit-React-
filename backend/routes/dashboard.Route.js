import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

import { getUserMedia } from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { uploadMedia } from "../controllers/dashboard.controller.js";

router.get("/getMedia/:id",protectRoute,getUserMedia)


router.post("/uploadMedia",protectRoute,upload.array('file'),uploadMedia)
export default router