import { Request, Response } from "express";

import prisma from "../db/prisma";
import { createGradingChain, gradingSchema } from "../lib/langchain/gradingChain";

export const gradeQuestionAi = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { questionNum, boxedAnswer, text, rubric } = req.body;

    if (!questionNum || !boxedAnswer || !text || !rubric) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const aiTone = await prisma.teacherAi.findUnique({
            where: { userId }
        });

        const toneContext = aiTone?.toneContext ?? "Use clear, encouraging feedback for students."

        console.log("Tone Context:", toneContext)

        const gradedExamples = await prisma.gradedQuestion.findMany({
            where: {
                gradingSession: {
                    assessment: {
                        student: { userId },
                    },
                },
                teacherFeedback: { not: null },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { rubric: true },
        });

        const examples = gradedExamples.map((gq) => ({
            rubric: JSON.stringify(gq.rubric.criteria).replaceAll("{", ``).replaceAll("}", ``),
            boxedAnswer: gq.boxedAnswer,
            text: gq.studentWork,
            score: `${gq.teacherScore}/5`,
            feedback: gq.teacherFeedback!,
        }));

        const gradingChain = createGradingChain({ toneContext, examples });

        const output = await gradingChain.invoke({
            toneContext,
            questionNum: questionNum.toString(),
            boxedAnswer,
            text,
            rubric: typeof rubric === "object" ? JSON.stringify(rubric) : rubric,
        });

        const result = gradingSchema.parse(output);

        res.status(200).json(result);
    } catch (error) {
        console.error("Grading error:", error);
        res.status(500).json({ error: "AI grading failed" });
    }
};