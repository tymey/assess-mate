import { Request, Response } from "express";

import { gradingChain, gradingSchema } from "../lib/langchain/gradingChain";

export const gradeQuestionAi = async (req: Request, res: Response) => {
    const { questionNum, boxedAnswer, text, rubric } = req.body;

    if (!questionNum || !boxedAnswer || !text || !rubric) {
        return res.status(400).json({ message: "Missing required fields." });
    }


    console.log(questionNum.toString());

    try {
        const output = await gradingChain.invoke({
            questionNum: questionNum.toString(),
            boxedAnswer,
            text,
            rubric: typeof rubric === "object" ? JSON.stringify(rubric) : rubric,
        });

        console.log(output);

        const result = gradingSchema.parse(output);

        res.status(200).json(result);
    } catch (error) {
        console.error("Grading error:", error);
        res.status(500).json({ error: "AI grading failed" });
    }
};