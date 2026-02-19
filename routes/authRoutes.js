import express from "express";
import { registerStudent,loginStudent,refreshAccessToken,logoutStudent } from "../controllers/authControl.js";


const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutStudent);

export default router;