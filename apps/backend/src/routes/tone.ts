import { Router } from "express";

import { authenticate } from "../middleware/authMiddleware";
import { refineTone } from "../controllers/toneController";

const router = Router();

router.post("/refine", authenticate, refineTone);

export default router;