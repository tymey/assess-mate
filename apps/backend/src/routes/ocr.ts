import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fromPath } from 'pdf2pic';
import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';

import { authenticate } from '../middleware/authMiddleware';
import prisma from '../db/prisma';
import { matchRubricsToQuestions } from '../utils/matchRubrics';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', authenticate, upload.single('pdf'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });

    const pdfPath = req.file.path;
    const baseName = path.parse(pdfPath).name;
    const outputDir = path.join('uploads', `${baseName}-images`);
    const { userId } = (req as any).user;

    try {
        // Clean up output folder if it already exists
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
        fs.mkdirSync(outputDir, { recursive: true });

        // 🔍 Detect total number of pages using pdf-parse
        const fileBuffer = fs.readFileSync(pdfPath);
        const { numpages } = await pdf(fileBuffer);

        const convert = fromPath(pdfPath, {
            density: 200,
            saveFilename: 'page',
            savePath: outputDir,
            format: 'png',
            width: 1200,
            height: 1600,
        });

        const imagePaths: string[] = [];

        for (let i = 1; i <= numpages; i++) {
            const result = await convert(i);
            if (result?.name) {
                imagePaths.push(path.join(outputDir, result.name));
            }
        }

        const worker = await createWorker('eng');
        const questions: any[] = [];

        for (const imagePath of imagePaths) {
            const { data } = await worker.recognize(imagePath);
            const fullText = data.text;

            // Split full text into separate questions using regex:
            const parts = fullText
                .split(/\n(?=\s*\d+[\.\)])/) // splits on newlines followed by "1." or "2)"
                .map(p => p.trim())
                .filter(Boolean);

            for (const part of parts) {
                const match = part.match(/^\s*(\d+)[\.\)]/);
                const questionNum = match ? parseInt(match[1], 10) : null;

                const boxed = part.match(/\[(.*?)\]/);
                const boxedAnswer = boxed?.[1] || null;

                questions.push({
                    questionNum,
                    text: part,
                    boxedAnswer
                });
            }
        }

        await worker.terminate();
        fs.unlinkSync(pdfPath); // cleanup original upload

        const rubrics = await prisma.rubric.findMany({ where: { userId } });

        const matched = matchRubricsToQuestions(questions, rubrics);

        res.json({ questions: matched });
    } catch (err) {
        console.error("OCR error:", err);
        // fallback cleanup
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        res.status(500).json({ message: "OCR failed", error: String(err) });
    }
});

export default router;
