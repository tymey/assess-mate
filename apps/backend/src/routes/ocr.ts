import express from 'express';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('pdf'), async (req, res) => {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ message: 'PDF not provided' });

    try {
        const imageBuffer = fs.readFileSync(filePath);

        const worker = await createWorker('eng');
        const {
            data: { text },
        } = await worker.recognize(imageBuffer); // no options passed
        await worker.terminate();

        fs.unlinkSync(filePath); // Clean up uploaded file

        // --- Step 1: Split Questions ---
        const questionRegex = /(?=(Q\d+|Question\s\d+|\d+\)|\d+\.)\s)/gi;
        const rawChunks = text.split(questionRegex);

        const questions: { questionNum: number; text: string; boxedAnswer: string | null }[] = [];

        for (let i = 0; i < rawChunks.length; i += 2) {
            const title = rawChunks[i];
            const body = rawChunks[i + 1] || '';
            const fullText = (title + ' ' + body).trim();
            const boxed = extractBoxedAnswerFromText(fullText);

            questions.push({
                questionNum: questions.length + 1,
                text: fullText,
                boxedAnswer: boxed,
            });
        }

        res.json({ questions });

    } catch (err) {
        console.error('OCR error:', err);
        res.status(500).json({ message: 'OCR failed' });
    }
});

function extractBoxedAnswerFromText(questionText: string): string | null {
    const lines = questionText.split('\n').map(l => l.trim()).filter(Boolean);

    // Look at last few lines for potential boxed answers
    const lastLines = lines.slice(-3).reverse();

    for (const line of lastLines) {
        const match = line.match(/\[([^\]]+)\]|\(([^\)]+)\)|\{([^\}]+)\}/);
        if (match) {
            return match[1] || match[2] || match[3];
        }
    }

    return null;
}

export default router;
