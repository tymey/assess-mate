import { Request, Response } from "express";

import prisma from "../db/prisma";
import { toneRefinementChain, toneSchema } from "../lib/langchain/toneRefinementChain";

export const refineTone = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const graded = await prisma.gradedQuestion.findMany({
            where: {
                gradingSession: { assessment: { student: { userId } } },
                teacherFeedback: { not: null },
                alignmentScore: { not: null },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                gradingSession: { include: { assessment: { include: { student: true } } } }
            }
        });

        if (graded.length === 0) {
            return res.status(400).json({ message: "Not enough feedback samples to refine tone." });
        }

        const examples = graded.map((g, i) => {
            return `Example ${i + 1}:
AI Feedback: ${g.aiFeedback}
Teacher Feedback: ${g.teacherFeedback}
Alignment Score: ${g.alignmentScore}/10`;
        }).join("\n\n");

        const output = await toneRefinementChain.invoke({ examples });

        const result = toneSchema.parse(output);

        await prisma.teacherAi.upsert({
            where: { userId },
            update: { toneContext: result.toneContext },
            create: { userId, toneContext: result.toneContext }
        });

        res.status(200).json({ toneContext: result.toneContext });
    } catch(error) {
        console.error("Tone refinement failed:", error);
        res.status(500).json({ error: "Internal server error: Tone refinement failed" });
    }
};