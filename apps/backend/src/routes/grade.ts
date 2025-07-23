import { Router } from "express";

import { authenticate } from "../middleware/authMiddleware";
import { gradeQuestionAi } from "../controllers/gradeController";

const router = Router();

router.post("/", authenticate, gradeQuestionAi);

export default router;