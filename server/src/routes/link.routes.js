import { Router } from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import {
  addLinkToDB,
  deleteGroupFromDB,
  deleteLinkFromDB,
  fetchGrpFromDB,
  fetchLinksFromDB,
} from "../controllers/link.controller.js";

const router = Router();

router.post("/addLink", validateToken, addLinkToDB);
router.get("/fetchLinks", validateToken, fetchLinksFromDB);
router.get("/fetchGrp", validateToken, fetchGrpFromDB);
router.delete("/deleteLink", validateToken, deleteLinkFromDB);
router.delete("/deleteLinksByGroup",validateToken,deleteGroupFromDB);
// router.post("/checkGroupName", validateToken, checkDuplicateGroup);

export default router;