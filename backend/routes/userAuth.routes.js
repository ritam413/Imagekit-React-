import express from 'express'

const router  = express.Router();


import {login , signup , logout , resetPassword} from '../controllers/user.auth.controller.js'
import { protectRoute } from "../middleware/protectRoute.js";
import {authlimiter} from '../middleware/rateLimiter.js';


router.post('/login',authlimiter,login)
router.post('/signup',authlimiter,signup)
router.post('/logout',logout)

router.put('/reset-password',authlimiter,resetPassword)

export default router