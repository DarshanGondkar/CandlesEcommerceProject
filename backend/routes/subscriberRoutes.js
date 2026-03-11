import express from "express";
import { subscribeUser, verifyDiscount } from "../controllers/subscriberController.js";

const router = express.Router();

router.post("/subscribe", subscribeUser);
router.post("/verify-discount", verifyDiscount);

export default router;
