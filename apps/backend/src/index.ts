import express from 'express';
import cors from 'cors';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import { authenticate } from './middleware/authMiddleware';
import authRoutes from './routes/auth';
import rubricRoutes from './routes/rubric';
import uploadRoutes from './routes/upload';
import studentRoutes from './routes/student';
import ocrRoutes from './routes/ocr';
import gradeRoutes from './routes/grade';
import toneRoutes from './routes/tone';
import gradingSessionRoutes from './routes/gradingSession';

const app = express();
app.use(cors());
app.use(express.json());

// Router
app.use('/api/auth', authRoutes);
app.use('/api/rubrics',rubricRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploads
app.use('/api/students', studentRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/grade', gradeRoutes);
app.use('/api/tone', toneRoutes);
app.use('/api/grading-session', gradingSessionRoutes);

// Authenticate test route
app.get('/me', authenticate, (req, res) => {
    res.json({ message: `You're authenticated!` });
});

app.get('/', (_, res) => res.send('AssessMate API is running!'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});