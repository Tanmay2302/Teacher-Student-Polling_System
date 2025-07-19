import express from "express";
import {
  createPoll,
  getActivePoll,
  getPollHistory,
  getPollResults,
} from "../controllers/pollController.js";
import { validatePollPayload } from "../middlewares/validatePollPayload.js";

const router = express.Router();

router.post("/", validatePollPayload, createPoll);
router.get("/active", getActivePoll);
router.get("/history", getPollHistory);
router.get("/results", getPollResults);

export default router;
