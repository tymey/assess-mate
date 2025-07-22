import { Router } from 'express';

import { authenticate } from '../middleware/authMiddleware';
import {
    getAllStudents,
    postNewStudent,
    updateStudent,
    deleteStudent,
} from '../controllers/studentController';

const router = Router();

router.get('/', authenticate, getAllStudents);
router.post('/', authenticate, postNewStudent);
router.patch('/:id', authenticate, updateStudent);
router.delete('/:id', authenticate, deleteStudent);

export default router;