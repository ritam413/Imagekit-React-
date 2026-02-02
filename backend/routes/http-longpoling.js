import { Router } from "express";

import {longpolling} from '../controllers/longpolling.js'

const router = Router();

router.get('/poll',longpolling)

export default router
