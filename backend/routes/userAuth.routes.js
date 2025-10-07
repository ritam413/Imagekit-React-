import express from 'express'

const router  = express.Router();


import {login , signup , logout , resetPassword} from '../controllers/user.auth.controller.js'
import { protectRoute } from "../middleware/protectRoute.js";


router.post('/login',login)
router.post('/signup',signup)
router.post('/logout',logout)

router.put('/reset-password',resetPassword)

export default router