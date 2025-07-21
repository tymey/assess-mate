import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getAllRubrics = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    try {
        const rubrics = await prisma.rubric.findMany({ where: { userId } });
        res.status(200).json(rubrics)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const postNewRubric = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { questionNum, sharedName, criteria } = req.body;

    if (!Array.isArray(criteria)) {
        return res.status(400).json({ message: 'Invalid criteria format' });
    }

    try {
        const rubric = await prisma.rubric.create({
            data: {
                userId,
                questionNum,
                sharedName,
                criteria,
            },
        });

        res.status(201).json(rubric);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};