import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { authenticate } from '../middleware/authMiddleware';
import prisma from '../db/prisma';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

router.post('/', authenticate, upload.single('pdf'), async (req: Request, res: Response) => {
    const { studentId } = req.body;
    const { userId } = (req as any).user;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    try {
        const assessment = await prisma.assessment.create({
            data: {
                studentId,
                pdfUrl,
            },
        });

        res.status(201).json({ message: 'Upload successful', assessment });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;