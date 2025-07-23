import { Request, Response } from "express";

import prisma from "../db/prisma";

interface GradedQuestion {
    questionNum: number;
    rubric: { id: string };
    boxedAnswer: string;
    text: string;
    aiScore: string;
    aiFeedback: string;
    teacherScore: string;
    teacherFeedback: string;
    alignment: string;
}

export const saveGradingSession = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { assessmentId, questions } = req.body;

    if (!userId || !assessmentId || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Invalid submission" });
    }

    try {
        const session = await prisma.gradingSession.create({
            data: {
                assessmentId,
                questions: {
                    create: questions
                        .filter((q: GradedQuestion) => !!q.questionNum)
                        .map((q: GradedQuestion) => ({
                            questionNum: q.questionNum,
                            rubricId: q.rubric.id,
                            boxedAnswer: q.boxedAnswer,
                            studentWork: q.text,
                            aiScore: parseInt(q.aiScore),
                            aiFeedback: q.aiFeedback,
                            teacherScore: parseInt(q.teacherScore),
                            teacherFeedback: q.teacherFeedback,
                            alignmentScore: parseInt(q.alignment),
                        }))
                }
            }
        });

        console.log("Session:", session);
        
        res.status(201).json({ id: session.id });
    } catch (error) {
        console.error("Failed to save grading session:", error);
        res.status(500).json({ error: "Internal server error: Could not save session" });
    }
};