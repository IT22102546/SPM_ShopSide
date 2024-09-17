import express from "express";
import { updateUser } from "../controllers/shop.controller.js";

const router = express.Router();

router.put("/update/:brnumber" , updateUser);  


export default router;