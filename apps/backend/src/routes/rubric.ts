import { Router } from 'express';

import { authenticate } from '../middleware/authMiddleware';
import { getAllRubrics, postNewRubric } from '../controllers/rubricController';

const router = Router();

router.get('/', authenticate, getAllRubrics);
router.post('/', authenticate, postNewRubric);

export default router;