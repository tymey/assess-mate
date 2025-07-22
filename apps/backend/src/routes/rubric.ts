import { Router } from 'express';

import { authenticate } from '../middleware/authMiddleware';
import {
    getAllRubrics,
    getRubricByID,
    postNewRubric,
    deleteRubric,
    updateRubric,
} from '../controllers/rubricController';

const router = Router();

router.get('/', authenticate, getAllRubrics);
router.get('/:id', authenticate, getRubricByID);
router.post('/', authenticate, postNewRubric);
router.delete('/:id', authenticate, deleteRubric);
router.put('/:id', authenticate, updateRubric);

export default router;