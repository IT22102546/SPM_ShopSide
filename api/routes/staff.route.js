import express from "express";
import { assignStaff, createStaff, getStaff, removeAssignedJob, removeStaff, testStaff, updateStaff } from "../controllers/staff.controller.js";

const router = express.Router();

router.get("/test", testStaff);
router.post("/create", createStaff);
router.get("/getAllStaff/:brnumber", getStaff);
router.put("/assign-staff/:staffPhone/:brnumber", assignStaff);
router.put("/remove-assigned-job/:staffPhone/:brnumber", removeAssignedJob);
router.put("/update-staff/:staffPhone/:brnumber", updateStaff);
router.delete("/delete-staff/:staffPhone/:brnumber", removeStaff );


export default router;