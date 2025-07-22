import { Request, Response } from 'express';
import prisma from "../db/prisma";

export const getAllStudents = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    try {
        const students = await prisma.student.findMany({ where: { userId } });
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const postNewStudent = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Student name is required" });
    }

    try {
        const student = await prisma.student.create({
            data: {
                name,
                userId,
            },
        });

        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const { userId } = (req as any).user;

    try {
        const student = await prisma.student.findFirst({
            where: { id, userId }
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const updated = await prisma.student.update({
            where: { id },
            data: { name },
        });

        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = (req as any).user;

    try {
        const student = await prisma.student.findFirst({
            where: { id, userId }
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await prisma.student.delete({ where: { id } });
        res.status(200).json({ message: "Student deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};