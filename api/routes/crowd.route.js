import express from "express";
import {
    createRecord,
  getCountfromDB,
  getCrowdCountMicroservice,
  updateCrowdCount,
} from "../controllers/crowd.controller.js";

const router = express.Router();

router.post("/create", createRecord );
router.get("/getCountMicroservice", getCrowdCountMicroservice);
router.get("/getCountfromDB/:brnumber", getCountfromDB)
router.put("/update/:brnumber", updateCrowdCount);
//router.delete("/delete/:brnumber", deleteUser);

//User routes for crowd
//router.get("/getCrowdCountUser/:shopID");

export default router;
