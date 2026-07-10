import express from "express";

import { login, singup, logout } from "../controllers/auth.controller.js";

const router = express.Router()


router.post('/login', login)
router.post('/singup', logout)
router.post('/logout', singup)

export default router