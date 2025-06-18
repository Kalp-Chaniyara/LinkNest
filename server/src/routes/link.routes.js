import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import {
  addLinkToDB,
  deleteGroupFromDB,
  deleteLinkFromDB,
  fetchGrpFromDB,
  fetchLinksFromDB,
  // updateLinkInDB,
  updateReminder,
  // syncCalendarEventInDB,
} from "../controllers/link.controller.js";

const router = express.Router();

router.post("/addLink", validateToken, addLinkToDB);
router.get("/fetchLinks", validateToken, fetchLinksFromDB);
router.get("/fetchGrp", validateToken, fetchGrpFromDB);
router.delete("/deleteLink", validateToken, deleteLinkFromDB);
router.delete("/deleteLinksByGroup", validateToken, deleteGroupFromDB);
// router.put("/update/:id", validateToken, updateLinkInDB);
router.put("/reminder/:linkId", validateToken, updateReminder);
// router.post("/syncCalendarEvent/:linkId", validateToken, syncCalendarEventInDB);
// router.post("/checkGroupName", validateToken, checkDuplicateGroup);

export default router;