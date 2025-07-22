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

export const getRubricByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = (req as any).user;

    const rubric = await prisma.rubric.findUnique({ where: { id } });

    if (!rubric) {
        return res.status(404).json({ message: 'Rubric not found' });
    }
    if (rubric.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(rubric);
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

export const deleteRubric = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = (req as any).user;

    try {
        const existingRubric = await prisma.rubric.findUnique({ where: { id } });
        if (!existingRubric) {
            return res.status(404).json({ message: 'Rubric not found' });
        }
        if (existingRubric.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await prisma.rubric.delete({ where: { id } });
        res.status(200).json({ message: 'Rubric deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateRubric = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const { questionNum, sharedName, criteria } = req.body;

    try {
        const existingRubric = await prisma.rubric.findUnique({ where: { id } });
        if (!existingRubric) {
            return res.status(404).json({ message: 'Rubric not found' });
        }
        if (existingRubric.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedRubric = await prisma.rubric.update({
            where: { id },
            data: { questionNum, sharedName, criteria },
        });

        res.status(200).json(updatedRubric);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};