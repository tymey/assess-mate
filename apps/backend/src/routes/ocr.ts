import express from 'express';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('pdf'), async (req, res) => {
    const filePath = req.file?.path;
    if (!filePath) {
        return res.status(400).json({ message: 'PDF not provided' });
    }

    try {
        // Reads the uploaded file from disk as a buffer
        const buffer = fs.readFileSync(filePath);
        // Tries to extract raw text directly from the PDF
        // Not always reliable for scans - but good fallback or comparison
        const data = await pdfParse(buffer);

        const worker = await createWorker('eng');
        // Scans the PDF and extract visual text (like handwriting or scans)
        const result = await worker.recognize(buffer);
        await worker.terminate();

        // Deletes the temp PDF file from /uploads
        fs.unlinkSync(filePath); // Clean up

        // Extracts the string of recognized text from the result
        const text = result.data.text;

        // Simple question split: "1.", "2.", etc.
        // Regex - Looks for a newline followed by a number and a dot
        const questionChunks = text.split(/\n(?=\d+\.)/g).map((chunk, i) => ({
            questionNum: i + 1,
            text: chunk.trim()
        }));

        res.json({ questions: questionChunks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'OCR failed' });
    }
});

export default router;
