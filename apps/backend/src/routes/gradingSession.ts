import { Router } from "express";

import { authenticate } from "../middleware/authMiddleware";
import { saveGradingSession } from "../controllers/gradingSessionController";

const router = Router();

router.post("/", authenticate, saveGradingSession);

export default router;