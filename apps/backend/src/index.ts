import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authenticate } from './middleware/authMiddleware';
import authRoutes from './routes/auth';
import rubricRoutes from './routes/rubric';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Router
app.use('/api/auth', authRoutes);
app.use('/api/rubrics',rubricRoutes);

// Authenticate test route
app.get('/me', authenticate, (req, res) => {
    res.json({ message: `You're authenticated!` });
});

app.get('/', (_, res) => res.send('AssessMate API is running!'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});