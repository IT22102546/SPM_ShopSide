import express from "express";
import { assignStaff, createStaff, getStaff, removeAssignedJob, testStaff, updateStaff } from "../controllers/staff.controller.js";

const router = express.Router();

router.get("/test", testStaff);
router.post("/create", createStaff);
router.get("/getAllStaff/:brnumber", getStaff);
router.put("/assign-staff/:staffPhone/:brnumber", assignStaff);
router.put("/remove-assigned-job/:staffPhone/:brnumber", removeAssignedJob);
router.put("/update-staff/:staffPhone/:brnumber", updateStaff);


export default router;