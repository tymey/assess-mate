import { Router } from 'express';

import { authenticate } from '../middleware/authMiddleware';
import { getAllStudents, postNewStudent } from '../controllers/studentController';

const router = Router();

router.get('/', authenticate, getAllStudents);
router.post('/', authenticate, postNewStudent);

export default router;